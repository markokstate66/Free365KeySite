const { getTableClient } = require("../shared/tableClient");

module.exports = async function (context, req) {
  context.log("Fetching registrations");

  if (req.method !== "GET") {
    context.res = {
      status: 405,
      body: { error: "Method not allowed" }
    };
    return;
  }

  try {
    const tableClient = await getTableClient();
    const registrations = [];

    const entities = tableClient.listEntities({
      queryOptions: { filter: "partitionKey eq 'registration'" }
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
        isWinner: entity.isWinner || false
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
};
