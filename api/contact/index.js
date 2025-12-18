const { getTableClient } = require("../shared/tableClient");
const { v4: uuidv4 } = require("uuid");

module.exports = async function (context, req) {
  context.log("Contact form submission received");

  if (req.method !== "POST") {
    context.res = {
      status: 405,
      body: { error: "Method not allowed" }
    };
    return;
  }

  try {
    const { name, email, company, phone, licenseCount, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      context.res = {
        status: 400,
        body: { error: "Name, email, and message are required" }
      };
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      context.res = {
        status: 400,
        body: { error: "Invalid email format" }
      };
      return;
    }

    const tableClient = await getTableClient("contacts");

    const id = uuidv4();
    const entity = {
      partitionKey: "contact",
      rowKey: id,
      id: id,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      company: company?.trim() || "",
      phone: phone?.trim() || "",
      licenseCount: licenseCount || "",
      message: message.trim(),
      status: "new", // new, contacted, closed
      submittedAt: new Date().toISOString()
    };

    await tableClient.createEntity(entity);

    context.res = {
      status: 201,
      headers: { "Content-Type": "application/json" },
      body: {
        success: true,
        message: "Thank you for your inquiry! We'll be in touch soon."
      }
    };

  } catch (error) {
    context.log.error("Contact form error:", error);
    context.res = {
      status: 500,
      body: { error: "Internal server error" }
    };
  }
};
