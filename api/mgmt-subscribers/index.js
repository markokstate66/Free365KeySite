const { getTableClient } = require("../shared/tableClient");

module.exports = async function (context, req) {
  context.log("Subscribers list request received");

  if (req.method !== "GET") {
    context.res = {
      status: 405,
      body: { error: "Method not allowed" }
    };
    return;
  }

  try {
    const tableClient = await getTableClient("newsletters");
    const subscribers = [];

    const entities = tableClient.listEntities();

    for await (const entity of entities) {
      subscribers.push({
        id: entity.id || entity.rowKey,
        email: entity.email,
        subscribedAt: entity.subscribedAt,
        isActive: entity.isActive !== false
      });
    }

    // Sort by subscribed date descending
    subscribers.sort((a, b) => new Date(b.subscribedAt) - new Date(a.subscribedAt));

    const activeCount = subscribers.filter(s => s.isActive).length;

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        subscribers,
        total: subscribers.length,
        active: activeCount,
        inactive: subscribers.length - activeCount
      }
    };

  } catch (error) {
    context.log.error("Subscribers list error:", error);
    context.res = {
      status: 500,
      body: { error: "Internal server error" }
    };
  }
};
