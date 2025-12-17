const { getTableClient } = require("../shared/tableClient");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

// Token verification (same logic as start-ad-watch)
const SECRET_KEY = process.env.AD_TOKEN_SECRET || "free365key-ad-watch-secret-2024";
const MIN_WATCH_SECONDS = 25;

function verifyToken(token, registrationId) {
  try {
    const parts = token.split(":");
    if (parts.length !== 3) return { valid: false, error: "Invalid token format" };

    const [tokenRegId, timestampStr, signature] = parts;
    const timestamp = parseInt(timestampStr, 10);

    if (tokenRegId !== registrationId) {
      return { valid: false, error: "Token mismatch" };
    }

    const data = `${tokenRegId}:${timestampStr}`;
    const expectedSignature = crypto.createHmac("sha256", SECRET_KEY).update(data).digest("hex");
    if (signature !== expectedSignature) {
      return { valid: false, error: "Invalid signature" };
    }

    const elapsedSeconds = (Date.now() - timestamp) / 1000;
    if (elapsedSeconds < MIN_WATCH_SECONDS) {
      return { valid: false, error: `Watch the ad for at least ${MIN_WATCH_SECONDS} seconds` };
    }

    if (elapsedSeconds > 600) {
      return { valid: false, error: "Token expired - please try again" };
    }

    return { valid: true, timestamp, elapsedSeconds };
  } catch (err) {
    return { valid: false, error: "Token verification failed" };
  }
}

module.exports = async function (context, req) {
  context.log("Bonus entry request received");

  if (req.method !== "POST") {
    context.res = {
      status: 405,
      body: { error: "Method not allowed" }
    };
    return;
  }

  try {
    const { registrationId, token } = req.body;

    if (!registrationId || !token) {
      context.res = {
        status: 400,
        body: { error: "Registration ID and token are required" }
      };
      return;
    }

    // Verify the ad watch token
    const tokenResult = verifyToken(token, registrationId);
    if (!tokenResult.valid) {
      context.res = {
        status: 403,
        body: { error: tokenResult.error }
      };
      return;
    }

    const tableClient = await getTableClient();

    // Verify the registration exists
    let registration;
    try {
      registration = await tableClient.getEntity("registration", registrationId);
    } catch (err) {
      context.res = {
        status: 404,
        body: { error: "Registration not found" }
      };
      return;
    }

    // Get bonus entries table
    const bonusClient = await getTableClient("bonusentries");

    // Create token hash for replay protection
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex").substring(0, 16);

    // Check if this token was already used (replay attack prevention)
    const existingTokens = bonusClient.listEntities({
      queryOptions: { filter: `tokenHash eq '${tokenHash}'` }
    });

    for await (const entity of existingTokens) {
      context.res = {
        status: 403,
        body: { error: "This token has already been used" }
      };
      return;
    }

    // Create bonus entry with token hash to prevent replay
    const bonusId = uuidv4();
    const bonusEntity = {
      partitionKey: "bonus",
      rowKey: bonusId,
      id: bonusId,
      registrationId: registrationId,
      email: registration.email,
      tokenHash: tokenHash,
      watchDuration: Math.round(tokenResult.elapsedSeconds),
      claimedAt: new Date().toISOString()
    };

    await bonusClient.createEntity(bonusEntity);

    // Count total entries for this user
    let totalEntries = 1; // Base entry
    const allBonuses = bonusClient.listEntities({
      queryOptions: { filter: `registrationId eq '${registrationId}'` }
    });

    for await (const bonus of allBonuses) {
      totalEntries++;
    }

    context.res = {
      status: 201,
      headers: { "Content-Type": "application/json" },
      body: {
        success: true,
        message: "Bonus entry added!",
        totalEntries: totalEntries
      }
    };
  } catch (error) {
    context.log.error("Bonus entry error:", error);
    context.res = {
      status: 500,
      body: { error: "Internal server error" }
    };
  }
};
