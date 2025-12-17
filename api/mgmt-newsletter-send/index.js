const { getTableClient } = require("../shared/tableClient");
const { sendNewsletter, SITE_URL } = require("../shared/emailService");

module.exports = async function (context, req) {
  context.log("Newsletter send request received");

  if (req.method !== "POST") {
    context.res = {
      status: 405,
      body: { error: "Method not allowed" }
    };
    return;
  }

  try {
    const { id } = req.body;

    if (!id) {
      context.res = {
        status: 400,
        body: { error: "Newsletter ID is required" }
      };
      return;
    }

    // Get the newsletter
    const draftsClient = await getTableClient("newsletterDrafts");
    let newsletter;

    try {
      newsletter = await draftsClient.getEntity("newsletter", id);
    } catch (error) {
      context.res = {
        status: 404,
        body: { error: "Newsletter not found" }
      };
      return;
    }

    // Check if already sent
    if (newsletter.status === "sent") {
      context.res = {
        status: 400,
        body: { error: "Newsletter has already been sent" }
      };
      return;
    }

    // Validate content
    if (!newsletter.htmlContent || newsletter.htmlContent.trim() === "") {
      context.res = {
        status: 400,
        body: { error: "Newsletter has no content" }
      };
      return;
    }

    // Get all active subscribers
    const subscribersClient = await getTableClient("newsletters");
    const subscribers = [];

    const entities = subscribersClient.listEntities({
      queryOptions: { filter: "isActive eq true" }
    });

    for await (const entity of entities) {
      subscribers.push({ email: entity.email });
    }

    if (subscribers.length === 0) {
      context.res = {
        status: 400,
        body: { error: "No subscribers to send to" }
      };
      return;
    }

    // Add unsubscribe link to the HTML content
    const htmlWithUnsubscribe = addUnsubscribeLink(newsletter.htmlContent);

    // Send the newsletter
    context.log(`Sending newsletter to ${subscribers.length} subscribers`);
    const results = await sendNewsletter(
      newsletter.subject,
      htmlWithUnsubscribe,
      subscribers
    );

    // Update newsletter status
    newsletter.status = "sent";
    newsletter.sentAt = new Date().toISOString();
    newsletter.recipientCount = results.success;
    newsletter.updatedAt = new Date().toISOString();

    await draftsClient.updateEntity(newsletter, "Replace");

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Newsletter sent successfully",
        results: {
          totalSubscribers: subscribers.length,
          successfulSends: results.success,
          failedSends: results.failed,
          errors: results.errors
        }
      }
    };

  } catch (error) {
    context.log.error("Newsletter send error:", error);
    context.res = {
      status: 500,
      body: { error: error.message || "Internal server error" }
    };
  }
};

function addUnsubscribeLink(html) {
  const unsubscribeFooter = `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #666;">
      <p>You received this email because you subscribed to our newsletter.</p>
      <p><a href="{{unsubscribe_url}}" style="color: #666;">Unsubscribe</a> from these emails.</p>
      <p>&copy; ${new Date().getFullYear()} Free365Key. All rights reserved.</p>
    </div>
  `;

  // If HTML has a closing body tag, insert before it
  if (html.toLowerCase().includes('</body>')) {
    return html.replace(/<\/body>/i, unsubscribeFooter + '</body>');
  }

  // Otherwise append to the end
  return html + unsubscribeFooter;
}
