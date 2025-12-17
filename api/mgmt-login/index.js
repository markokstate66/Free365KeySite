module.exports = async function (context, req) {
  context.log("Admin login request");

  if (req.method !== "POST") {
    context.res = {
      status: 405,
      body: { error: "Method not allowed" }
    };
    return;
  }

  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    context.log.error("ADMIN_PASSWORD not configured");
    context.res = {
      status: 500,
      body: { error: "Server configuration error" }
    };
    return;
  }

  if (password === adminPassword) {
    context.res = {
      status: 200,
      body: { success: true, message: "Login successful" }
    };
  } else {
    context.res = {
      status: 401,
      body: { error: "Invalid password" }
    };
  }
};
