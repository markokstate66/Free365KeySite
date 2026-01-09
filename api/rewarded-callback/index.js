const { getTableClient } = require("../shared/tableClient");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

// Cache for Google's public keys
let cachedKeys = null;
let keysCachedAt = 0;
const KEY_CACHE_DURATION = 3600000; // 1 hour

// Fetch Google's public keys for SSV verification
async function getGooglePublicKeys() {
  const now = Date.now();
  if (cachedKeys && (now - keysCachedAt) < KEY_CACHE_DURATION) {
    return cachedKeys;
  }

  const response = await fetch("https://www.gstatic.com/admob/reward/verifier-keys.json");
  if (!response.ok) {
    throw new Error("Failed to fetch Google public keys");
  }

  cachedKeys = await response.json();
  keysCachedAt = now;
  return cachedKeys;
}

// Verify Google's SSV signature
async function verifySignature(queryParams) {
  const { signature, key_id } = queryParams;

  if (!signature || !key_id) {
    return { valid: false, error: "Missing signature or key_id" };
  }

  try {
    const keys = await getGooglePublicKeys();
    const keyData = keys.keys.find(k => k.keyId.toString() === key_id.toString());

    if (!keyData) {
      return { valid: false, error: "Unknown key_id" };
    }

    // Build the message to verify (all params except signature, in order)
    const paramsToVerify = { ...queryParams };
    delete paramsToVerify.signature;

    // Sort params and build query string
    const sortedParams = Object.keys(paramsToVerify).sort();
    const message = sortedParams.map(k => `${k}=${paramsToVerify[k]}`).join("&");

    // Decode base64url signature
    const signatureBuffer = Buffer.from(
      signature.replace(/-/g, "+").replace(/_/g, "/"),
      "base64"
    );

    // Create public key from Google's PEM
    const publicKey = crypto.createPublicKey({
      key: keyData.pem,
      format: "pem"
    });

    // Verify ECDSA signature
    const verifier = crypto.createVerify("SHA256");
    verifier.update(message);
    const isValid = verifier.verify(publicKey, signatureBuffer);

    return { valid: isValid, error: isValid ? null : "Invalid signature" };
  } catch (err) {
    return { valid: false, error: `Verification error: ${err.message}` };
  }
}

module.exports = async function (context, req) {
  context.log("Rewarded ad callback received");

  try {
    const query = req.query;

    // Log callback for debugging (remove in production if too verbose)
    context.log("Callback params:", JSON.stringify(query));

    // Verify Google's signature
    const verification = await verifySignature(query);
    if (!verification.valid) {
      context.log.warn("Signature verification failed:", verification.error);
      context.res = {
        status: 400,
        body: { error: verification.error }
      };
      return;
    }

    // Extract custom_data which contains our registrationId
    const customData = query.custom_data;
    if (!customData) {
      context.log.warn("No custom_data in callback");
      context.res = {
        status: 400,
        body: { error: "Missing custom_data" }
      };
      return;
    }

    // Parse custom_data (format: registrationId or JSON)
    let registrationId;
    try {
      const parsed = JSON.parse(decodeURIComponent(customData));
      registrationId = parsed.registrationId;
    } catch {
      // If not JSON, treat as plain registrationId
      registrationId = decodeURIComponent(customData);
    }

    if (!registrationId) {
      context.res = {
        status: 400,
        body: { error: "Invalid custom_data" }
      };
      return;
    }

    // Prevent replay attacks using transaction_id
    const transactionId = query.transaction_id;
    if (!transactionId) {
      context.res = {
        status: 400,
        body: { error: "Missing transaction_id" }
      };
      return;
    }

    const tableClient = await getTableClient();

    // Verify registration exists
    let registration;
    try {
      registration = await tableClient.getEntity("registration", registrationId);
    } catch (err) {
      context.log.warn("Registration not found:", registrationId);
      context.res = {
        status: 404,
        body: { error: "Registration not found" }
      };
      return;
    }

    // Get bonus entries table
    const bonusClient = await getTableClient("bonusentries");

    // Check for replay attack using transaction_id
    const existingTx = bonusClient.listEntities({
      queryOptions: { filter: `transactionId eq '${transactionId}'` }
    });

    for await (const entity of existingTx) {
      context.log.warn("Duplicate transaction_id:", transactionId);
      // Return 200 anyway - Google may retry and we don't want errors
      context.res = {
        status: 200,
        body: { success: true, message: "Already processed" }
      };
      return;
    }

    // Calculate validUntilDrawing (valid for next 3 drawings)
    const now = new Date();
    const validUntil = new Date(now.getFullYear(), now.getMonth() + 3, 1);
    const validUntilDrawing = `${validUntil.getFullYear()}-${String(validUntil.getMonth() + 1).padStart(2, '0')}`;

    // Create bonus entry
    const bonusId = uuidv4();
    const bonusEntity = {
      partitionKey: "bonus",
      rowKey: bonusId,
      id: bonusId,
      registrationId: registrationId,
      email: registration.email,
      transactionId: transactionId,
      source: "rewarded_video",
      adUnit: query.ad_unit || "unknown",
      rewardAmount: query.reward_amount || "1",
      rewardItem: query.reward_item || "entry",
      earnedAt: now.toISOString(),
      validUntilDrawing: validUntilDrawing
    };

    await bonusClient.createEntity(bonusEntity);

    context.log("Bonus entry created for:", registrationId, "tx:", transactionId);

    // Return 200 OK to Google
    context.res = {
      status: 200,
      body: { success: true, message: "Reward granted" }
    };

  } catch (error) {
    context.log.error("Rewarded callback error:", error);
    context.res = {
      status: 500,
      body: { error: "Internal server error" }
    };
  }
};
