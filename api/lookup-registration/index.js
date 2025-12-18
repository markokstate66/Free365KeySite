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
      // Calculate entry weight using new system:
      // Verified = 5 base entries, each ad (within 90 days) = 2 entries
      const isVerified = entity.isVerified === true;
      const baseWeight = isVerified ? 5 : 0;

      // Count ads watched in last 90 days
      const bonusClient = await getTableClient("bonusentries");
      const now = new Date();
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - 90);
      const cutoffISO = cutoff.toISOString();

      let adCount = 0;
      const bonuses = bonusClient.listEntities({
        queryOptions: { filter: `registrationId eq '${entity.rowKey}'` }
      });

      for await (const bonus of bonuses) {
        const earnedAt = bonus.claimedAt || bonus.earnedAt;
        if (earnedAt && earnedAt >= cutoffISO) {
          adCount++;
        }
      }

      const adWeight = adCount * 2;
      const totalEntries = baseWeight + adWeight;

      context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: {
          id: entity.rowKey,
          firstName: entity.firstName,
          email: entity.email,
          isVerified: isVerified,
          adCount: adCount,
          totalEntries: totalEntries
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
