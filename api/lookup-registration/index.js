const { getTableClient } = require("../shared/tableClient");

module.exports = async function (context, req) {
  context.log("Lookup registration request received");

  if (req.method !== "POST") {
    context.res = {
      status: 405,
      body: { error: "Method not allowed" }
    };
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
    const existingEntries = tableClient.listEntities({
      queryOptions: { filter: `email eq '${email.toLowerCase()}'` }
    });

    for await (const entity of existingEntries) {
      // Calculate entry weight using drawing-based expiration:
      // Verified = 5 base entries, each valid ad = 2 entries
      const isVerified = entity.isVerified === true;
      const baseWeight = isVerified ? 5 : 0;

      // Count ads valid for upcoming drawings
      const bonusClient = await getTableClient("bonusentries");
      const now = new Date();

      // Current drawing cycle (next month's drawing)
      const nextDrawing = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const currentDrawingCycle = `${nextDrawing.getFullYear()}-${String(nextDrawing.getMonth() + 1).padStart(2, '0')}`;

      let adCount = 0;
      const bonuses = bonusClient.listEntities({
        queryOptions: { filter: `registrationId eq '${entity.rowKey}'` }
      });

      for await (const bonus of bonuses) {
        // Count ads valid for current or future drawings
        const validUntil = bonus.validUntilDrawing;
        if (validUntil && validUntil >= currentDrawingCycle) {
          adCount++;
        } else if (!validUntil) {
          // Legacy entries without validUntilDrawing - check by date (90 days)
          const earnedAt = bonus.earnedAt || bonus.claimedAt;
          const cutoff = new Date(now);
          cutoff.setDate(cutoff.getDate() - 90);
          if (earnedAt && earnedAt >= cutoff.toISOString()) {
            adCount++;
          }
        }
      }

      const adWeight = adCount * 2;

      // Count valid referrals (valid for 6 drawings)
      const referralsClient = await getTableClient("referrals");
      let validReferralCount = 0;
      let referralEntries = 0;

      try {
        const referrals = referralsClient.listEntities({
          queryOptions: { filter: `referrerId eq '${entity.rowKey}'` }
        });

        for await (const referral of referrals) {
          const validUntil = referral.validUntilDrawing;
          if (validUntil && validUntil >= currentDrawingCycle) {
            validReferralCount++;
            referralEntries += (referral.entries || 10);
          } else if (!validUntil) {
            // Legacy entries without validUntilDrawing - check by date (180 days for 6 months)
            const earnedAt = referral.earnedAt;
            const cutoff = new Date(now);
            cutoff.setDate(cutoff.getDate() - 180);
            if (earnedAt && earnedAt >= cutoff.toISOString()) {
              validReferralCount++;
              referralEntries += (referral.entries || 10);
            }
          }
        }
      } catch (referralError) {
        // If referrals table doesn't exist yet, use legacy stored value
        referralEntries = entity.referralEntries || 0;
        validReferralCount = entity.referralCount || 0;
      }

      const totalEntries = baseWeight + adWeight + referralEntries;

      context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: {
          id: entity.rowKey,
          firstName: entity.firstName,
          email: entity.email,
          isVerified: isVerified,
          adCount: adCount,
          totalEntries: totalEntries,
          referralCode: entity.referralCode || "",
          referralCount: entity.referralCount || 0,
          referralEntries: referralEntries
        }
      };
      return;
    }

    context.res = {
      status: 404,
      body: { error: "Registration not found" }
    };
  } catch (error) {
    context.log.error("Lookup error:", error);
    context.res = {
      status: 500,
      body: { error: "Internal server error" }
    };
  }
};
