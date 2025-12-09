const { getTableClient } = require("../shared/tableClient");
const { v4: uuidv4 } = require("uuid");

module.exports = async function (context, req) {
  context.log("Registration request received");

  if (req.method !== "POST") {
    context.res = {
      status: 405,
      body: { error: "Method not allowed" }
    };
    return;
  }

  try {
    const body = req.body;

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.phone) {
      context.res = {
        status: 400,
        body: { error: "Missing required fields" }
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

    const tableClient = await getTableClient();

    // Check for duplicate email
    const existingEntries = tableClient.listEntities({
      queryOptions: { filter: `email eq '${body.email}'` }
    });

    for await (const entity of existingEntries) {
      context.res = {
        status: 409,
        body: { error: "This email is already registered" }
      };
      return;
    }

    // Create registration entity
    const id = uuidv4();
    const entity = {
      partitionKey: "registration",
      rowKey: id,
      id: id,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email.toLowerCase(),
      phone: body.phone,
      companyName: body.companyName || "",
      jobTitle: body.jobTitle || "",
      agreeTerms: body.agreeTerms || false,
      agreeMarketing: body.agreeMarketing || false,
      registeredAt: body.registeredAt || new Date().toISOString(),
      isWinner: false
    };

    await tableClient.createEntity(entity);

    context.res = {
      status: 201,
      headers: { "Content-Type": "application/json" },
      body: {
        id: id,
        firstName: body.firstName,
        email: body.email,
        message: "Registration successful"
      }
    };
  } catch (error) {
    context.log.error("Registration error:", error);
    context.res = {
      status: 500,
      body: { error: "Internal server error" }
    };
  }
};
