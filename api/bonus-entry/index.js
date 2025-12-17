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

    // Check if user already claimed a bonus entry today
    const today = new Date().toISOString().split('T')[0];
    const existingBonuses = bonusClient.listEntities({
      queryOptions: {
        filter: `registrationId eq '${registrationId}' and claimedDate eq '${today}'`
      }
    });

    for await (const entity of existingBonuses) {
      context.res = {
        status: 409,
        body: { error: "You've already claimed a bonus entry today. Come back tomorrow!" }
      };
      return;
    }

    // Create bonus entry
    const bonusId = uuidv4();
    const bonusEntity = {
      partitionKey: "bonus",
      rowKey: bonusId,
      id: bonusId,
      registrationId: registrationId,
      email: registration.email,
      claimedDate: today,
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
