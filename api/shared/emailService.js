const { EmailClient } = require("@azure/communication-email");
const crypto = require("crypto");

const connectionString = process.env.ACS_CONNECTION_STRING;
const FROM_EMAIL = process.env.FROM_EMAIL || "DoNotReply@4470ed37-8941-43d3-b968-02be113b2dee.azurecomm.net";
const FROM_NAME = process.env.FROM_NAME || "Free365Key";
const SITE_URL = process.env.SITE_URL || "https://free365key.com";

/**
 * Create a hash of an email address for tracking (privacy-friendly)
 */
function hashEmail(email) {
  return crypto.createHash("sha256").update(email.toLowerCase()).digest("hex").substring(0, 16);
}

let emailClient = null;

function getEmailClient() {
  if (!emailClient && connectionString) {
    emailClient = new EmailClient(connectionString);
  }
  return emailClient;
}

/**
 * Send a newsletter to a list of subscribers
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content of the email
 * @param {Array} subscribers - Array of subscriber objects with email property
 * @param {string} newsletterId - Newsletter ID for open tracking
 * @returns {Promise<{success: number, failed: number, errors: Array}>}
 */
async function sendNewsletter(subject, htmlContent, subscribers, newsletterId = null) {
  const client = getEmailClient();
  if (!client) {
    throw new Error("ACS_CONNECTION_STRING environment variable not set");
  }

  const results = {
    success: 0,
    failed: 0,
    errors: []
  };

  // Azure Communication Services allows up to 100 recipients per email
  // We'll send individual emails for better deliverability and personalization
  const batchSize = 50;

  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);

    // Send emails in parallel within each batch
    const promises = batch.map(async (subscriber) => {
      let personalizedHtml = htmlContent.replace(
        /\{\{unsubscribe_url\}\}/g,
        `${SITE_URL}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`
      );

      // Add tracking pixel if newsletterId is provided
      if (newsletterId) {
        const emailHash = hashEmail(subscriber.email);
        const trackingPixel = `<img src="${SITE_URL}/api/track-open?nid=${newsletterId}&eid=${emailHash}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;" />`;

        // Insert before </body> if present, otherwise append
        if (personalizedHtml.includes("</body>")) {
          personalizedHtml = personalizedHtml.replace("</body>", `${trackingPixel}</body>`);
        } else {
          personalizedHtml += trackingPixel;
        }
      }

      const message = {
        senderAddress: FROM_EMAIL,
        content: {
          subject: subject,
          html: personalizedHtml,
        },
        recipients: {
          to: [{ address: subscriber.email }],
        },
      };

      try {
        const poller = await client.beginSend(message);
        await poller.pollUntilDone();
        return { success: true, email: subscriber.email };
      } catch (error) {
        console.error(`Failed to send to ${subscriber.email}:`, error.message);
        return { success: false, email: subscriber.email, error: error.message };
      }
    });

    const batchResults = await Promise.all(promises);

    for (const result of batchResults) {
      if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push({ email: result.email, error: result.error });
      }
    }

    // Small delay between batches to avoid rate limiting
    if (i + batchSize < subscribers.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

/**
 * Send a single email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content
 */
async function sendEmail(to, subject, htmlContent) {
  const client = getEmailClient();
  if (!client) {
    throw new Error("ACS_CONNECTION_STRING environment variable not set");
  }

  const message = {
    senderAddress: FROM_EMAIL,
    content: {
      subject: subject,
      html: htmlContent,
    },
    recipients: {
      to: [{ address: to }],
    },
  };

  const poller = await client.beginSend(message);
  return await poller.pollUntilDone();
}

module.exports = { sendNewsletter, sendEmail, SITE_URL };
