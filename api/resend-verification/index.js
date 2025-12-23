const { getTableClient } = require("../shared/tableClient");
const { sendEmail } = require("../shared/emailService");
const crypto = require("crypto");

const SITE_URL = process.env.SITE_URL || "https://www.free365key.com";

module.exports = async function (context, req) {
  context.log("Resend verification request received");

  if (req.method !== "POST") {
    context.res = { status: 405, body: { error: "Method not allowed" } };
    return;
  }

  try {
    const { email } = req.body;

    if (!email) {
      context.res = {
        status: 400,
        body: { error: "Email is required" }
      };
      return;
    }

    const tableClient = await getTableClient();

    // Find registration by email
    const registrations = tableClient.listEntities({
      queryOptions: { filter: `email eq '${email.toLowerCase()}'` }
    });

    let registration = null;
    for await (const entity of registrations) {
      registration = entity;
      break;
    }

    if (!registration) {
      context.res = {
        status: 404,
        body: { error: "No registration found with this email" }
      };
      return;
    }

    // Check if already verified
    if (registration.isVerified === true) {
      context.res = {
        status: 200,
        body: {
          success: true,
          alreadyVerified: true,
          message: "Your email is already verified!"
        }
      };
      return;
    }

    // Generate new verification token
    const newToken = crypto.randomBytes(32).toString("hex");

    // Update registration with new token
    await tableClient.updateEntity({
      partitionKey: "registration",
      rowKey: registration.rowKey,
      verificationToken: newToken
    }, "Merge");

    // Send verification email
    const verifyUrl = `${SITE_URL}/verify-email?token=${newToken}&id=${registration.rowKey}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Free365Key</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333;">Confirm Your Email</h2>
          <p style="color: #666; line-height: 1.6;">
            Hi ${registration.firstName},<br><br>
            You requested a new verification link. Please confirm your email address to complete your entry in the Microsoft 365 giveaway.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="display: inline-block; padding: 15px 40px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Confirm My Email
            </a>
          </div>
          <p style="color: #999; font-size: 0.9rem;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${verifyUrl}" style="color: #667eea; word-break: break-all;">${verifyUrl}</a>
          </p>
          <p style="color: #999; font-size: 0.85rem; margin-top: 30px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      </div>
    `;

    await sendEmail(email, "Confirm your Free365Key registration", emailHtml);
    context.log("Verification email resent to:", email);

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        success: true,
        message: "Verification email sent! Please check your inbox."
      }
    };

  } catch (error) {
    context.log.error("Resend verification error:", error);
    context.res = {
      status: 500,
      body: { error: "Failed to resend verification email" }
    };
  }
};
