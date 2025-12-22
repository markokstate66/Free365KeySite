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
      context.log(`Attempting to delete registration with id: ${id}`);

      // Try to delete directly using id as rowKey (they should match)
      try {
        await tableClient.deleteEntity("registration", id);
        context.log(`Deleted registration ${id} directly`);
      } catch (directError) {
        context.log.warn(`Direct delete failed: ${directError.message}, trying search...`);

        // If direct delete fails, search for the entity
        const entities = tableClient.listEntities({
          queryOptions: { filter: `PartitionKey eq 'registration'` }
        });

        let found = false;
        for await (const entity of entities) {
          if (entity.id === id || entity.rowKey === id) {
            context.log(`Found entity with rowKey: ${entity.rowKey}`);
            await tableClient.deleteEntity("registration", entity.rowKey);
            found = true;
            break;
          }
        }

        if (!found) {
          context.res = {
            status: 404,
            body: { error: "Registration not found" }
          };
          return;
        }
      }

      // Also delete any bonus entries for this registration
      try {
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
      } catch (e) {
        context.log.warn("Error cleaning up bonus entries:", e.message);
      }

      context.log(`Deleted registration ${id}`);
      context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: { success: true, message: "Registration deleted" }
      };
    } catch (error) {
      context.log.error("Error deleting registration:", error.message);
      context.res = {
        status: 500,
        body: { error: "Failed to delete registration: " + error.message }
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
