const { getTableClient } = require("../shared/tableClient");
const { v4: uuidv4 } = require("uuid");

module.exports = async function (context, req) {
  context.log("Newsletter subscription request received");

  if (req.method !== "POST") {
    context.res = {
      status: 405,
      body: { error: "Method not allowed" }
    };
    return;
  }

  try {
    const body = req.body;

    // Validate email
    if (!body.email) {
      context.res = {
        status: 400,
        body: { error: "Email is required" }
      };
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      context.res = {
        status: 400,
        body: { error: "Invalid email format" }
      };
      return;
    }

    const tableClient = await getTableClient("newsletters");

    // Check for existing email
    const existingEntries = tableClient.listEntities({
      queryOptions: { filter: `email eq '${body.email.toLowerCase()}'` }
    });

    for await (const entity of existingEntries) {
      // If inactive, reactivate the subscription
      if (entity.isActive === false) {
        await tableClient.updateEntity({
          partitionKey: entity.partitionKey,
          rowKey: entity.rowKey,
          isActive: true,
          resubscribedAt: new Date().toISOString()
        }, "Merge");

        context.res = {
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: { message: "Successfully resubscribed to newsletter" }
        };
        return;
      }

      // Already active subscriber
      context.res = {
        status: 409,
        body: { error: "This email is already subscribed" }
      };
      return;
    }

    // Create subscription entity
    const id = uuidv4();
    const entity = {
      partitionKey: "subscriber",
      rowKey: id,
      id: id,
      email: body.email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      isActive: true
    };

    await tableClient.createEntity(entity);

    context.res = {
      status: 201,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Successfully subscribed to newsletter"
      }
    };
  } catch (error) {
    context.log.error("Newsletter subscription error:", error);
    context.res = {
      status: 500,
      body: { error: "Internal server error" }
    };
  }
};
