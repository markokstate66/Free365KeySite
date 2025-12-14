const { getTableClient } = require("../shared/tableClient");
const { sendNewsletter } = require("../shared/emailService");

// This function runs every 5 minutes to check for scheduled newsletters
module.exports = async function (context) {
  context.log("Newsletter scheduler triggered at:", new Date().toISOString());

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

        // Send the newsletter
        const results = await sendNewsletter(
          newsletter.subject,
          htmlWithUnsubscribe,
          subscribers
        );

        // Update newsletter status
        newsletter.status = "sent";
        newsletter.sentAt = now.toISOString();
        newsletter.recipientCount = results.success;
        newsletter.updatedAt = now.toISOString();

        await draftsClient.updateEntity(newsletter, "Replace");

        context.log(`Newsletter sent: ${results.success} successful, ${results.failed} failed`);

      } catch (error) {
        context.log.error(`Failed to send newsletter ${newsletter.id}:`, error);

        // Mark as failed but keep scheduled so it can be retried
        newsletter.lastError = error.message;
        newsletter.updatedAt = now.toISOString();
        await draftsClient.updateEntity(newsletter, "Replace");
      }
    }

    context.log("Newsletter scheduler completed");

  } catch (error) {
    context.log.error("Newsletter scheduler error:", error);
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
