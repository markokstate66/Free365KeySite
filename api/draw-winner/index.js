const { getTableClient } = require("../shared/tableClient");
const { sendEmail, SITE_URL } = require("../shared/emailService");

// Secret key for authorization (set in Azure app settings)
const DRAW_SECRET = process.env.DRAW_SECRET || "free365key-draw-secret-2024";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "markokstate@gmail.com";

module.exports = async function (context, req) {
  context.log("Draw winner request received");

  if (req.method !== "POST") {
    context.res = { status: 405, body: { error: "Method not allowed" } };
    return;
  }

  try {
    // Verify authorization
    const { secret } = req.body;
    if (secret !== DRAW_SECRET) {
      context.res = { status: 401, body: { error: "Unauthorized" } };
      return;
    }

    const tableClient = await getTableClient();
    const bonusClient = await getTableClient("bonusentries");
    const now = new Date();

    // Calculate 90-day cutoff for bonus entries
    const bonusCutoff = new Date(now);
    bonusCutoff.setDate(bonusCutoff.getDate() - 90);
    const bonusCutoffISO = bonusCutoff.toISOString();

    // Get all eligible registrations (verified, not won - base entry never expires)
    const eligibleEntries = [];
    const registrations = tableClient.listEntities({
      queryOptions: { filter: `isWinner eq false and isVerified eq true` }
    });

    for await (const reg of registrations) {
      // Count bonus entries from last 90 days only
      let bonusCount = 0;
      const bonuses = bonusClient.listEntities({
        queryOptions: { filter: `registrationId eq '${reg.rowKey}'` }
      });

      for await (const bonus of bonuses) {
        // Only count bonus entries from the last 90 days
        if (bonus.earnedAt && bonus.earnedAt >= bonusCutoffISO) {
          bonusCount++;
        }
      }

      // Add to pool: 1 base entry + valid bonus entries
      const totalWeight = 1 + bonusCount;
      eligibleEntries.push({
        registration: reg,
        bonusCount,
        totalWeight
      });
    }

    if (eligibleEntries.length === 0) {
      context.res = {
        status: 200,
        body: {
          success: false,
          message: "No eligible entries found",
          stats: { total: 0 }
        }
      };
      return;
    }

    // Create weighted pool for random selection
    const weightedPool = [];
    for (const entry of eligibleEntries) {
      for (let i = 0; i < entry.totalWeight; i++) {
        weightedPool.push(entry);
      }
    }

    // Random selection
    const randomIndex = Math.floor(Math.random() * weightedPool.length);
    const winner = weightedPool[randomIndex];

    // Mark as winner in database
    const updatedEntity = {
      ...winner.registration,
      isWinner: true,
      wonAt: new Date().toISOString()
    };
    await tableClient.updateEntity(updatedEntity, "Replace");

    // Prepare winner info
    const winnerInfo = {
      id: winner.registration.rowKey,
      firstName: winner.registration.firstName,
      lastName: winner.registration.lastName,
      email: winner.registration.email,
      phone: winner.registration.phone,
      companyName: winner.registration.companyName,
      registeredAt: winner.registration.registeredAt,
      bonusEntries: winner.bonusCount,
      totalEntries: winner.totalWeight,
      wonAt: updatedEntity.wonAt
    };

    // Send notification email to admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Monthly Winner Drawing Results</h1>
        <p>A winner has been randomly selected for the Microsoft 365 Key Giveaway!</p>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #10b981; margin-top: 0;">Winner Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold;">Name:</td><td>${winnerInfo.firstName} ${winnerInfo.lastName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${winnerInfo.email}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td>${winnerInfo.phone}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Company:</td><td>${winnerInfo.companyName || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Registered:</td><td>${new Date(winnerInfo.registeredAt).toLocaleDateString()}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Bonus Entries:</td><td>${winnerInfo.bonusEntries}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Total Entries:</td><td>${winnerInfo.totalEntries}</td></tr>
          </table>
        </div>

        <div style="background: #e0e7ff; padding: 20px; border-radius: 8px;">
          <h3 style="margin-top: 0;">Drawing Statistics</h3>
          <p>Total eligible participants: ${eligibleEntries.length}</p>
          <p>Total entries in pool: ${weightedPool.length}</p>
          <p>Drawing date: ${new Date().toLocaleString()}</p>
        </div>

        <p style="margin-top: 20px; color: #666;">
          Please contact the winner to arrange delivery of their Microsoft 365 license key.
        </p>
      </div>
    `;

    try {
      await sendEmail(ADMIN_EMAIL, "Free365Key Winner Selected!", adminEmailHtml);
      context.log("Admin notification email sent successfully");
    } catch (emailError) {
      context.log.error("Failed to send admin email:", emailError);
    }

    // NOTE: Winner email is NOT sent automatically
    // Admin should verify winner and manually send notification via /api/notify-winner

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        success: true,
        winner: winnerInfo,
        stats: {
          eligibleParticipants: eligibleEntries.length,
          totalEntriesInPool: weightedPool.length
        }
      }
    };

  } catch (error) {
    context.log.error("Draw winner error:", error);
    context.res = {
      status: 500,
      body: { error: "Internal server error", details: error.message }
    };
  }
};
