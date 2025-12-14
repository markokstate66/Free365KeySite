const { getTableClient } = require("../shared/tableClient");
const { v4: uuidv4 } = require("uuid");

module.exports = async function (context, req) {
  context.log("Newsletter management request received");

  const tableClient = await getTableClient("newsletterDrafts");
  const method = req.method;
  const id = req.query.id || (req.body && req.body.id);

  try {
    // GET - List all newsletters or get one by ID
    if (method === "GET") {
      if (id) {
        // Get single newsletter
        try {
          const entity = await tableClient.getEntity("newsletter", id);
          context.res = {
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: entityToNewsletter(entity)
          };
        } catch (error) {
          context.res = {
            status: 404,
            body: { error: "Newsletter not found" }
          };
        }
      } else {
        // List all newsletters
        const newsletters = [];
        const entities = tableClient.listEntities({
          queryOptions: { filter: "PartitionKey eq 'newsletter'" }
        });

        for await (const entity of entities) {
          newsletters.push(entityToNewsletter(entity));
        }

        // Sort by created date descending
        newsletters.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        context.res = {
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: { newsletters }
        };
      }
      return;
    }

    // POST - Create new newsletter
    if (method === "POST") {
      const body = req.body;

      if (!body.subject) {
        context.res = {
          status: 400,
          body: { error: "Subject is required" }
        };
        return;
      }

      const newId = uuidv4();
      const entity = {
        partitionKey: "newsletter",
        rowKey: newId,
        id: newId,
        subject: body.subject,
        htmlContent: body.htmlContent || "",
        status: "draft", // draft, scheduled, sent
        scheduledAt: body.scheduledAt || null,
        sentAt: null,
        recipientCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await tableClient.createEntity(entity);

      context.res = {
        status: 201,
        headers: { "Content-Type": "application/json" },
        body: entityToNewsletter(entity)
      };
      return;
    }

    // PUT - Update newsletter
    if (method === "PUT") {
      if (!id) {
        context.res = {
          status: 400,
          body: { error: "Newsletter ID is required" }
        };
        return;
      }

      try {
        const existing = await tableClient.getEntity("newsletter", id);

        // Don't allow editing sent newsletters
        if (existing.status === "sent") {
          context.res = {
            status: 400,
            body: { error: "Cannot edit a sent newsletter" }
          };
          return;
        }

        const body = req.body;
        const updatedEntity = {
          partitionKey: "newsletter",
          rowKey: id,
          id: id,
          subject: body.subject || existing.subject,
          htmlContent: body.htmlContent !== undefined ? body.htmlContent : existing.htmlContent,
          status: body.status || existing.status,
          scheduledAt: body.scheduledAt !== undefined ? body.scheduledAt : existing.scheduledAt,
          sentAt: existing.sentAt,
          recipientCount: existing.recipientCount || 0,
          createdAt: existing.createdAt,
          updatedAt: new Date().toISOString()
        };

        await tableClient.updateEntity(updatedEntity, "Replace");

        context.res = {
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: entityToNewsletter(updatedEntity)
        };
      } catch (error) {
        context.res = {
          status: 404,
          body: { error: "Newsletter not found" }
        };
      }
      return;
    }

    // DELETE - Delete newsletter
    if (method === "DELETE") {
      if (!id) {
        context.res = {
          status: 400,
          body: { error: "Newsletter ID is required" }
        };
        return;
      }

      try {
        await tableClient.deleteEntity("newsletter", id);
        context.res = {
          status: 200,
          body: { message: "Newsletter deleted" }
        };
      } catch (error) {
        context.res = {
          status: 404,
          body: { error: "Newsletter not found" }
        };
      }
      return;
    }

    context.res = {
      status: 405,
      body: { error: "Method not allowed" }
    };

  } catch (error) {
    context.log.error("Newsletter management error:", error);
    context.res = {
      status: 500,
      body: { error: "Internal server error" }
    };
  }
};

function entityToNewsletter(entity) {
  return {
    id: entity.id || entity.rowKey,
    subject: entity.subject,
    htmlContent: entity.htmlContent,
    status: entity.status,
    scheduledAt: entity.scheduledAt,
    sentAt: entity.sentAt,
    recipientCount: entity.recipientCount || 0,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt
  };
}
