const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

const connectionString = process.env.STORAGE_CONNECTION_STRING || "UseDevelopmentStorage=true";
const tableName = "registrations";

let tableClient = null;

async function getTableClient() {
  if (!tableClient) {
    tableClient = TableClient.fromConnectionString(connectionString, tableName);

    // Create table if it doesn't exist
    try {
      await tableClient.createTable();
    } catch (error) {
      // Table already exists, ignore error
      if (error.statusCode !== 409) {
        console.error("Error creating table:", error);
      }
    }
  }
  return tableClient;
}

module.exports = { getTableClient };
