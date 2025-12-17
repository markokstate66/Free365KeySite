const { getTableClient } = require("../shared/tableClient");
const { sendEmail } = require("../shared/emailService");

const DRAW_SECRET = process.env.DRAW_SECRET || "free365key-draw-secret-2024";

module.exports = async function (context, req) {
  context.log("Notify winner request received");

  if (req.method !== "POST") {
    context.res = { status: 405, body: { error: "Method not allowed" } };
    return;
  }

  try {
    const { secret, winnerId, customMessage } = req.body;

    // Verify authorization
    if (secret !== DRAW_SECRET) {
      context.res = { status: 401, body: { error: "Unauthorized" } };
      return;
    }

    if (!winnerId) {
      context.res = { status: 400, body: { error: "Winner ID is required" } };
      return;
    }

    const tableClient = await getTableClient();

    // Get winner details
    let winner;
    try {
      winner = await tableClient.getEntity("registration", winnerId);
    } catch (err) {
      context.res = { status: 404, body: { error: "Winner not found" } };
      return;
    }

    if (!winner.isWinner) {
      context.res = {
        status: 400,
        body: { error: "This registration is not marked as a winner" }
      };
      return;
    }

    // Get bonus entry count for personalized message
    const bonusClient = await getTableClient("bonusentries");
    let bonusCount = 0;
    const bonuses = bonusClient.listEntities({
      queryOptions: { filter: `registrationId eq '${winnerId}'` }
    });
    for await (const bonus of bonuses) {
      bonusCount++;
    }
    const totalEntries = 1 + bonusCount;

    // Send congratulations email to winner
    const winnerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10b981;">Congratulations, ${winner.firstName}!</h1>
        <p style="font-size: 1.2em;">You've been selected as the winner of our Microsoft 365 Key Giveaway!</p>

        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; border-radius: 12px; margin: 20px 0; text-align: center;">
          <h2 style="margin: 0;">You Won!</h2>
          <p style="margin: 10px 0 0 0;">A FREE 30-day Microsoft 365 License Key</p>
        </div>

        <p>Your ${bonusCount > 0 ? totalEntries + ' entries (1 registration + ' + bonusCount + ' bonus)' : 'entry'} paid off!</p>

        ${customMessage ? `<div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;"><p style="margin: 0;">${customMessage}</p></div>` : ''}

        <h3>What's Next?</h3>
        <p>We'll be in touch shortly at this email address or by phone to provide your Microsoft 365 license key and setup instructions.</p>

        <p style="color: #666; font-size: 0.9em; margin-top: 30px;">
          *This is a 30-day Microsoft 365 license key for 1 user. Cloud Solution Provider (CSP) agreement required to redeem.
        </p>

        <p style="margin-top: 20px;">
          Thank you for participating!<br>
          <strong>The Free365Key Team</strong>
        </p>
      </div>
    `;

    await sendEmail(winner.email, "You Won the Microsoft 365 Giveaway!", winnerEmailHtml);

    // Update winner record to track notification
    const updatedWinner = {
      ...winner,
      notifiedAt: new Date().toISOString()
    };
    await tableClient.updateEntity(updatedWinner, "Replace");

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        success: true,
        message: `Winner notification sent to ${winner.email}`,
        winner: {
          id: winner.rowKey,
          firstName: winner.firstName,
          lastName: winner.lastName,
          email: winner.email,
          notifiedAt: updatedWinner.notifiedAt
        }
      }
    };

  } catch (error) {
    context.log.error("Notify winner error:", error);
    context.res = {
      status: 500,
      body: { error: "Internal server error", details: error.message }
    };
  }
};
