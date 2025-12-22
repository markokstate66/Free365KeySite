const { getTableClient } = require("../shared/tableClient");

module.exports = async function (context, req) {
  const tableClient = await getTableClient();

  // DELETE - Remove a registration
  if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id) {
      context.res = {
        status: 400,
        body: { error: "Registration ID is required" }
      };
      return;
    }

    try {
      // Delete the registration
      await tableClient.deleteEntity("registration", id);

      // Also delete any bonus entries for this registration
      const bonusTableClient = await getTableClient("bonusentries");
      const bonusEntries = bonusTableClient.listEntities({
        queryOptions: { filter: `registrationId eq '${id}'` }
      });

      for await (const entry of bonusEntries) {
        try {
          await bonusTableClient.deleteEntity(entry.partitionKey, entry.rowKey);
        } catch (e) {
          context.log.warn("Failed to delete bonus entry:", e.message);
        }
      }

      context.log(`Deleted registration ${id}`);
      context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: { success: true, message: "Registration deleted" }
      };
    } catch (error) {
      context.log.error("Error deleting registration:", error);
      context.res = {
        status: 500,
        body: { error: "Failed to delete registration" }
      };
    }
    return;
  }

  // GET - Fetch all registrations
  if (req.method === "GET") {
    context.log("Fetching registrations");

    try {
      const registrations = [];

      const entities = tableClient.listEntities({
        queryOptions: { filter: "PartitionKey eq 'registration'" }
      });

      for await (const entity of entities) {
        registrations.push({
          id: entity.id,
          firstName: entity.firstName,
          lastName: entity.lastName,
          email: entity.email,
          phone: entity.phone,
          companyName: entity.companyName,
          jobTitle: entity.jobTitle,
          agreeMarketing: entity.agreeMarketing,
          registeredAt: entity.registeredAt,
          isWinner: entity.isWinner || false,
          isVerified: entity.isVerified || false
        });
      }

      // Sort by registration date (newest first)
      registrations.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));

      context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: { registrations }
      };
    } catch (error) {
      context.log.error("Error fetching registrations:", error);
      context.res = {
        status: 500,
        body: { error: "Failed to fetch registrations" }
      };
    }
    return;
  }

  context.res = {
    status: 405,
    body: { error: "Method not allowed" }
  };
};
