const { getTableClient } = require("../shared/tableClient");
const { v4: uuidv4 } = require("uuid");

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
    const { registrationId } = req.body;

    if (!registrationId) {
      context.res = {
        status: 400,
        body: { error: "Registration ID is required" }
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

    // Create bonus entry (no daily limit - users can earn as many as they want)
    const bonusId = uuidv4();
    const bonusEntity = {
      partitionKey: "bonus",
      rowKey: bonusId,
      id: bonusId,
      registrationId: registrationId,
      email: registration.email,
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
