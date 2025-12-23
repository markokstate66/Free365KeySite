const { getTableClient } = require("../shared/tableClient");
const { sendEmail } = require("../shared/emailService");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const SITE_URL = process.env.SITE_URL || "https://www.free365key.com";

// Generate a short, unique referral code
function generateReferralCode() {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

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

    // Create registration entity (base entry never expires)
    const id = uuidv4();
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const referralCode = generateReferralCode();
    const now = new Date();

    // Check if referred by someone
    let referredBy = null;
    if (body.referredBy) {
      // Validate the referral code exists
      const referrerEntries = tableClient.listEntities({
        queryOptions: { filter: `referralCode eq '${body.referredBy.toUpperCase()}'` }
      });
      for await (const referrer of referrerEntries) {
        referredBy = body.referredBy.toUpperCase();
        break;
      }
    }

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
      registeredAt: now.toISOString(),
      isWinner: false,
      isVerified: false,
      verificationToken: verificationToken,
      referralCode: referralCode,
      referredBy: referredBy || "",
      referralCount: 0,
      referralEntries: 0
    };

    await tableClient.createEntity(entity);

    // Send verification email
    try {
      const verifyUrl = `${SITE_URL}/verify-email?token=${verificationToken}&id=${id}`;
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Free365Key</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333;">Confirm Your Email</h2>
            <p style="color: #666; line-height: 1.6;">
              Hi ${body.firstName},<br><br>
              Thank you for registering for the Microsoft 365 giveaway! Please confirm your email address to complete your entry.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Confirm My Email
              </a>
            </div>
            <p style="color: #999; font-size: 0.9rem;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verifyUrl}" style="color: #667eea; word-break: break-all;">${verifyUrl}</a>
            </p>
            <p style="color: #999; font-size: 0.85rem; margin-top: 30px;">
              If you didn't register for this giveaway, you can safely ignore this email.
            </p>
          </div>
        </div>
      `;

      await sendEmail(body.email, "Confirm your Free365Key registration", emailHtml);
      context.log("Verification email sent to:", body.email);
    } catch (emailError) {
      // Don't fail registration if email fails, just log it
      context.log.error("Failed to send verification email:", emailError);
    }

    // If user opted into newsletter, add them to subscribers
    if (body.joinNewsletter) {
      try {
        const newsletterClient = await getTableClient("newsletters");

        // Check if already subscribed
        const existingSubs = newsletterClient.listEntities({
          queryOptions: { filter: `email eq '${body.email.toLowerCase()}'` }
        });

        let alreadySubscribed = false;
        for await (const sub of existingSubs) {
          alreadySubscribed = true;
          break;
        }

        if (!alreadySubscribed) {
          const subEntity = {
            partitionKey: "subscriber",
            rowKey: uuidv4(),
            email: body.email.toLowerCase(),
            firstName: body.firstName,
            subscribedAt: now.toISOString(),
            source: "giveaway_registration",
            isActive: true
          };
          await newsletterClient.createEntity(subEntity);
        }
      } catch (newsletterError) {
        // Don't fail registration if newsletter subscription fails
        context.log.error("Newsletter subscription error:", newsletterError);
      }
    }

    context.res = {
      status: 201,
      headers: { "Content-Type": "application/json" },
      body: {
        id: id,
        firstName: body.firstName,
        email: body.email,
        message: "Registration successful! Please check your email to confirm your entry.",
        needsVerification: true,
        totalEntries: 0,
        isVerified: false,
        referralCode: referralCode,
        referralCount: 0,
        referralEntries: 0
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
