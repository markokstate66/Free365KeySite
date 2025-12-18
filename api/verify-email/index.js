const { getTableClient } = require("../shared/tableClient");

module.exports = async function (context, req) {
  context.log("Email verification request received");

  try {
    const token = req.query.token;
    const id = req.query.id;

    if (!token || !id) {
      context.res = {
        status: 400,
        headers: { "Content-Type": "application/json" },
        body: { error: "Missing token or id parameter" }
      };
      return;
    }

    const tableClient = await getTableClient();

    // Get the registration
    let registration;
    try {
      registration = await tableClient.getEntity("registration", id);
    } catch (error) {
      context.res = {
        status: 404,
        headers: { "Content-Type": "application/json" },
        body: { error: "Registration not found" }
      };
      return;
    }

    // Check if already verified
    if (registration.isVerified === true) {
      context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: {
          success: true,
          message: "Email already verified",
          alreadyVerified: true
        }
      };
      return;
    }

    // Verify the token matches
    if (registration.verificationToken !== token) {
      context.res = {
        status: 400,
        headers: { "Content-Type": "application/json" },
        body: { error: "Invalid verification token" }
      };
      return;
    }

    // Update to verified
    await tableClient.updateEntity({
      partitionKey: "registration",
      rowKey: id,
      isVerified: true,
      verifiedAt: new Date().toISOString()
    }, "Merge");

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        success: true,
        message: "Email verified successfully! You are now entered in the giveaway.",
        firstName: registration.firstName
      }
    };

  } catch (error) {
    context.log.error("Verification error:", error);
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: { error: "Internal server error" }
    };
  }
};
