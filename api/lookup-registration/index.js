const { getTableClient } = require("../shared/tableClient");

module.exports = async function (context, req) {
  context.log("Lookup registration request received");

  if (req.method !== "POST") {
    context.res = {
      status: 405,
      body: { error: "Method not allowed" }
    };
    return;
  }

  try {
    const { email } = req.body;

    if (!email) {
      context.res = {
        status: 400,
        body: { error: "Email is required" }
      };
      return;
    }

    const tableClient = await getTableClient();

    // Find registration by email
    const existingEntries = tableClient.listEntities({
      queryOptions: { filter: `email eq '${email.toLowerCase()}'` }
    });

    for await (const entity of existingEntries) {
      // Count bonus entries
      const bonusClient = await getTableClient("bonusentries");
      let bonusCount = 0;

      const bonuses = bonusClient.listEntities({
        queryOptions: { filter: `registrationId eq '${entity.rowKey}'` }
      });

      for await (const bonus of bonuses) {
        bonusCount++;
      }

      context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: {
          id: entity.rowKey,
          firstName: entity.firstName,
          email: entity.email,
          totalEntries: 1 + bonusCount
        }
      };
      return;
    }

    context.res = {
      status: 404,
      body: { error: "Registration not found" }
    };
  } catch (error) {
    context.log.error("Lookup error:", error);
    context.res = {
      status: 500,
      body: { error: "Internal server error" }
    };
  }
};
