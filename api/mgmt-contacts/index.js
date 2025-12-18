const { getTableClient } = require("../shared/tableClient");

module.exports = async function (context, req) {
  context.log("Contact management request received");

  const tableClient = await getTableClient("contacts");
  const method = req.method;
  const id = req.query.id;

  try {
    // GET - List all contacts
    if (method === "GET") {
      const contacts = [];
      const entities = tableClient.listEntities({
        queryOptions: { filter: "PartitionKey eq 'contact'" }
      });

      for await (const entity of entities) {
        contacts.push({
          id: entity.id || entity.rowKey,
          name: entity.name,
          email: entity.email,
          company: entity.company || "",
          phone: entity.phone || "",
          licenseCount: entity.licenseCount || "",
          message: entity.message,
          status: entity.status || "new",
          submittedAt: entity.submittedAt,
          notes: entity.notes || ""
        });
      }

      // Sort by submitted date descending (newest first)
      contacts.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

      const newCount = contacts.filter(c => c.status === "new").length;
      const contactedCount = contacts.filter(c => c.status === "contacted").length;
      const closedCount = contacts.filter(c => c.status === "closed").length;

      context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: {
          contacts,
          total: contacts.length,
          new: newCount,
          contacted: contactedCount,
          closed: closedCount
        }
      };
      return;
    }

    // PUT - Update contact status/notes
    if (method === "PUT") {
      if (!id) {
        context.res = {
          status: 400,
          body: { error: "Contact ID is required" }
        };
        return;
      }

      try {
        const existing = await tableClient.getEntity("contact", id);
        const body = req.body;

        const updatedEntity = {
          partitionKey: "contact",
          rowKey: id,
          status: body.status || existing.status,
          notes: body.notes !== undefined ? body.notes : existing.notes
        };

        await tableClient.updateEntity(updatedEntity, "Merge");

        context.res = {
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: { message: "Contact updated" }
        };
      } catch (error) {
        context.res = {
          status: 404,
          body: { error: "Contact not found" }
        };
      }
      return;
    }

    // DELETE - Delete contact
    if (method === "DELETE") {
      if (!id) {
        context.res = {
          status: 400,
          body: { error: "Contact ID is required" }
        };
        return;
      }

      try {
        await tableClient.deleteEntity("contact", id);
        context.res = {
          status: 200,
          body: { message: "Contact deleted" }
        };
      } catch (error) {
        context.res = {
          status: 404,
          body: { error: "Contact not found" }
        };
      }
      return;
    }

    context.res = {
      status: 405,
      body: { error: "Method not allowed" }
    };

  } catch (error) {
    context.log.error("Contact management error:", error);
    context.res = {
      status: 500,
      body: { error: "Internal server error" }
    };
  }
};
