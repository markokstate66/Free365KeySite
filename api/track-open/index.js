const { getTableClient } = require("../shared/tableClient");
const { v4: uuidv4 } = require("uuid");

// 1x1 transparent GIF (43 bytes)
const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

module.exports = async function (context, req) {
  const { nid, eid } = req.query; // newsletter ID, email hash

  // Always return the tracking pixel, even if logging fails
  context.res = {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    },
    body: TRANSPARENT_GIF,
    isRaw: true
  };

  // Log the open event asynchronously (don't block response)
  if (nid && eid) {
    try {
      const tableClient = await getTableClient("newsletteropens");

      // Check if this email already opened this newsletter (dedupe)
      const existingOpens = tableClient.listEntities({
        queryOptions: {
          filter: `PartitionKey eq '${nid}' and emailHash eq '${eid}'`
        }
      });

      let alreadyOpened = false;
      for await (const _ of existingOpens) {
        alreadyOpened = true;
        break;
      }

      if (!alreadyOpened) {
        const openEntity = {
          partitionKey: nid, // newsletter ID
          rowKey: uuidv4(),
          emailHash: eid,
          openedAt: new Date().toISOString(),
          userAgent: req.headers["user-agent"] || "unknown"
        };

        await tableClient.createEntity(openEntity);
        context.log(`Logged open for newsletter ${nid}`);
      }
    } catch (error) {
      // Don't fail the request, just log the error
      context.log.warn("Failed to log open:", error.message);
    }
  }
};
