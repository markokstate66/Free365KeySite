const { getTableClient } = require("../shared/tableClient");
const { sendNewsletter } = require("../shared/emailService");

// This function checks for and processes scheduled newsletters
// Called automatically when admin views newsletters or manually via API
module.exports = async function (context, req) {
  context.log("Newsletter scheduler triggered at:", new Date().toISOString());

  const results = { processed: 0, sent: [], errors: [] };

  try {
    const draftsClient = await getTableClient("newsletterDrafts");
    const subscribersClient = await getTableClient("newsletters");

    // Get all scheduled newsletters
    const scheduledNewsletters = [];
    const now = new Date();

    const entities = draftsClient.listEntities({
      queryOptions: { filter: "status eq 'scheduled'" }
    });

    for await (const entity of entities) {
      if (entity.scheduledAt) {
        const scheduledTime = new Date(entity.scheduledAt);
        if (scheduledTime <= now) {
          scheduledNewsletters.push(entity);
        }
      }
    }

    context.log(`Found ${scheduledNewsletters.length} newsletters ready to send`);

    // Process each scheduled newsletter
    for (const newsletter of scheduledNewsletters) {
      context.log(`Sending newsletter: ${newsletter.subject}`);

      try {
        // Get all active subscribers
        const subscribers = [];
        const subEntities = subscribersClient.listEntities({
          queryOptions: { filter: "isActive eq true" }
        });

        for await (const sub of subEntities) {
          subscribers.push({ email: sub.email });
        }

        if (subscribers.length === 0) {
          context.log("No subscribers to send to, marking as sent anyway");
          newsletter.status = "sent";
          newsletter.sentAt = now.toISOString();
          newsletter.recipientCount = 0;
          newsletter.updatedAt = now.toISOString();
          await draftsClient.updateEntity(newsletter, "Replace");
          continue;
        }

        // Add unsubscribe footer
        const htmlWithUnsubscribe = addUnsubscribeLink(newsletter.htmlContent);

        // Send the newsletter (with tracking pixel)
        const sendResults = await sendNewsletter(
          newsletter.subject,
          htmlWithUnsubscribe,
          subscribers,
          newsletter.id // Pass newsletter ID for open tracking
        );

        // Update newsletter status
        newsletter.status = "sent";
        newsletter.sentAt = now.toISOString();
        newsletter.recipientCount = sendResults.success;
        newsletter.updatedAt = now.toISOString();

        await draftsClient.updateEntity(newsletter, "Replace");

        context.log(`Newsletter sent: ${sendResults.success} successful, ${sendResults.failed} failed`);

        results.sent.push({
          id: newsletter.id,
          subject: newsletter.subject,
          recipients: sendResults.success
        });
        results.processed++;

      } catch (error) {
        context.log.error(`Failed to send newsletter ${newsletter.id}:`, error);

        // Mark as failed but keep scheduled so it can be retried
        newsletter.lastError = error.message;
        newsletter.updatedAt = now.toISOString();
        await draftsClient.updateEntity(newsletter, "Replace");

        results.errors.push({
          id: newsletter.id,
          subject: newsletter.subject,
          error: error.message
        });
      }
    }

    context.log("Newsletter scheduler completed");

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: results
    };

  } catch (error) {
    context.log.error("Newsletter scheduler error:", error);
    context.res = {
      status: 500,
      body: { error: error.message }
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

  if (html.toLowerCase().includes('</body>')) {
    return html.replace(/<\/body>/i, unsubscribeFooter + '</body>');
  }

  return html + unsubscribeFooter;
}
