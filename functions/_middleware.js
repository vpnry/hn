export async function onRequest(context) {
  // Note: You can hardcode credentials here, but using env vars is safer.
  const USERNAME = context.env.BASIC_USERNAME || "admin";
  const PASSWORD = context.env.BASIC_PASSWORD || "password123";

  // 2. Check for the Authorization header
  const authHeader = context.request.headers.get("Authorization");

  if (!authHeader) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
    });
  }

  // 3. Decode the header
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = atob(base64Credentials).split(":");
  const [user, pass] = credentials;

  // 4. Validate credentials
  if (user === USERNAME && pass === PASSWORD) {
    // Correct password -> allow request to proceed
    return context.next();
  }

  // 5. Incorrect password -> Deny
  return new Response("Invalid credentials", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
  });
}