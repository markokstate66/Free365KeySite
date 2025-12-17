const { getTableClient } = require("../shared/tableClient");

module.exports = async function (context, req) {
  context.log("Unsubscribe request received");

  try {
    // Get email from query params (GET) or body (POST)
    const email = (req.query.email || (req.body && req.body.email) || "").toLowerCase().trim();

    if (!email) {
      context.res = {
        status: 400,
        headers: { "Content-Type": "application/json" },
        body: { error: "Email is required" }
      };
      return;
    }

    const tableClient = await getTableClient("newsletters");

    // Find subscriber by email
    const entities = tableClient.listEntities({
      queryOptions: { filter: `email eq '${email}'` }
    });

    let found = false;
    for await (const entity of entities) {
      // Update isActive to false
      await tableClient.updateEntity({
        partitionKey: entity.partitionKey,
        rowKey: entity.rowKey,
        isActive: false,
        unsubscribedAt: new Date().toISOString()
      }, "Merge");
      found = true;
    }

    if (!found) {
      context.res = {
        status: 404,
        headers: { "Content-Type": "application/json" },
        body: { error: "Email not found in subscriber list" }
      };
      return;
    }

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        success: true,
        message: "Successfully unsubscribed from newsletter"
      }
    };

  } catch (error) {
    context.log.error("Unsubscribe error:", error);
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: { error: "Internal server error" }
    };
  }
};
