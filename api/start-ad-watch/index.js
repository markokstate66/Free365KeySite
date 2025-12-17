const crypto = require("crypto");

// Secret key for signing tokens (in production, use environment variable)
const SECRET_KEY = process.env.AD_TOKEN_SECRET || "free365key-ad-watch-secret-2024";
const MIN_WATCH_SECONDS = 25; // Slightly less than 30 to account for network latency

function generateToken(registrationId) {
  const timestamp = Date.now();
  const data = `${registrationId}:${timestamp}`;
  const signature = crypto.createHmac("sha256", SECRET_KEY).update(data).digest("hex");
  return `${data}:${signature}`;
}

function verifyToken(token, registrationId) {
  try {
    const parts = token.split(":");
    if (parts.length !== 3) return { valid: false, error: "Invalid token format" };

    const [tokenRegId, timestampStr, signature] = parts;
    const timestamp = parseInt(timestampStr, 10);

    // Check registration ID matches
    if (tokenRegId !== registrationId) {
      return { valid: false, error: "Token mismatch" };
    }

    // Verify signature
    const data = `${tokenRegId}:${timestampStr}`;
    const expectedSignature = crypto.createHmac("sha256", SECRET_KEY).update(data).digest("hex");
    if (signature !== expectedSignature) {
      return { valid: false, error: "Invalid signature" };
    }

    // Check enough time has passed (at least 25 seconds)
    const elapsedSeconds = (Date.now() - timestamp) / 1000;
    if (elapsedSeconds < MIN_WATCH_SECONDS) {
      return { valid: false, error: `Must watch for at least ${MIN_WATCH_SECONDS} seconds` };
    }

    // Check token isn't too old (max 10 minutes)
    if (elapsedSeconds > 600) {
      return { valid: false, error: "Token expired" };
    }

    return { valid: true, timestamp, elapsedSeconds };
  } catch (err) {
    return { valid: false, error: "Token verification failed" };
  }
}

module.exports = async function (context, req) {
  context.log("Start ad watch request received");

  if (req.method !== "POST") {
    context.res = { status: 405, body: { error: "Method not allowed" } };
    return;
  }

  try {
    const { registrationId } = req.body;

    if (!registrationId) {
      context.res = { status: 400, body: { error: "Registration ID required" } };
      return;
    }

    const token = generateToken(registrationId);

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { token, expiresIn: 600 }
    };
  } catch (error) {
    context.log.error("Start ad watch error:", error);
    context.res = { status: 500, body: { error: "Internal server error" } };
  }
};

// Export verify function for use by bonus-entry API
module.exports.verifyToken = verifyToken;
module.exports.SECRET_KEY = SECRET_KEY;
module.exports.MIN_WATCH_SECONDS = MIN_WATCH_SECONDS;
