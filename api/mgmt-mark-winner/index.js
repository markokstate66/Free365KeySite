const { getTableClient } = require("../shared/tableClient");

module.exports = async function (context, req) {
  context.log("Marking winner");

  if (req.method !== "POST") {
    context.res = {
      status: 405,
      body: { error: "Method not allowed" }
    };
    return;
  }

  const { id } = req.body;

  if (!id) {
    context.res = {
      status: 400,
      body: { error: "Winner ID is required" }
    };
    return;
  }

  try {
    const tableClient = await getTableClient();

    // Get the entity
    const entity = await tableClient.getEntity("registration", id);

    // Update to mark as winner
    entity.isWinner = true;
    entity.wonAt = new Date().toISOString();

    await tableClient.updateEntity(entity, "Merge");

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        success: true,
        message: "Winner marked successfully",
        winnerId: id
      }
    };
  } catch (error) {
    context.log.error("Error marking winner:", error);
    context.res = {
      status: 500,
      body: { error: "Failed to mark winner" }
    };
  }
};
