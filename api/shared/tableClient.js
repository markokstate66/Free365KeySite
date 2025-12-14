const { TableClient } = require("@azure/data-tables");

const connectionString = process.env.STORAGE_CONNECTION_STRING || "UseDevelopmentStorage=true";

const tableClients = {};

async function getTableClient(tableName = "registrations") {
  if (!tableClients[tableName]) {
    tableClients[tableName] = TableClient.fromConnectionString(connectionString, tableName);

    // Create table if it doesn't exist
    try {
      await tableClients[tableName].createTable();
    } catch (error) {
      // Table already exists, ignore error
      if (error.statusCode !== 409) {
        console.error("Error creating table:", error);
      }
    }
  }
  return tableClients[tableName];
}

module.exports = { getTableClient };
