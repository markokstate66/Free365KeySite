const { getTableClient } = require("../shared/tableClient");
const { sendEmail } = require("../shared/emailService");
const { v4: uuidv4 } = require("uuid");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "markokstate@gmail.com";

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
    const { name, email, company, phone, reason, licenseCount, message } = req.body;

    // Validate required fields
    if (!name || !email || !message || !reason) {
      context.res = {
        status: 400,
        body: { error: "Name, email, reason, and message are required" }
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

    const reasonLabels = {
      licensing: "Licensing Inquiry",
      giveaway: "Giveaway Question",
      legal: "Legal",
      support: "Technical Support",
      other: "Other"
    };

    const id = uuidv4();
    const entity = {
      partitionKey: "contact",
      rowKey: id,
      id: id,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      company: company?.trim() || "",
      phone: phone?.trim() || "",
      reason: reason,
      reasonLabel: reasonLabels[reason] || reason,
      licenseCount: licenseCount || "",
      message: message.trim(),
      status: "new", // new, contacted, closed
      submittedAt: new Date().toISOString()
    };

    await tableClient.createEntity(entity);

    // Send email notification to admin
    try {
      const notificationHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00a4ef;">New Contact Form Submission</h2>
          <p>You have a new inquiry from the Free365Key website:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f5f5f5;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Reason</td>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>${reasonLabels[reason] || reason}</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr style="background: #f5f5f5;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
              <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${phone || 'Not provided'}</td>
            </tr>
            <tr style="background: #f5f5f5;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Company</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${company || 'Not provided'}</td>
            </tr>
            ${reason === 'licensing' ? `<tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Licenses Needed</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${licenseCount || 'Not specified'}</td>
            </tr>` : ''}
            <tr style="background: #f5f5f5;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Message</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${message}</td>
            </tr>
          </table>
          <p style="margin-top: 20px;">
            <a href="https://www.free365key.com/admin" style="display: inline-block; padding: 10px 20px; background: #00a4ef; color: white; text-decoration: none; border-radius: 5px;">View in Admin Panel</a>
          </p>
        </div>
      `;

      await sendEmail(
        ADMIN_EMAIL,
        `[${reasonLabels[reason] || reason}] New Contact: ${name}`,
        notificationHtml
      );
      context.log("Admin notification email sent");
    } catch (emailError) {
      // Don't fail the request if email fails, just log it
      context.log.error("Failed to send admin notification:", emailError);
    }

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
