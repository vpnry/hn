export const onRequest = async ({ request, env }) => {
  const PASSWORD = env.SITE_PASSWORD;   // Set this in Cloudflare Pages Environment Variables
  const REALM = "_";

  const authHeader = request.headers.get("Authorization");

  // If no password is set in environment variables
  if (!PASSWORD) {
    return new Response(
      "SITE_PASSWORD environment variable not set.",
      { status: 500 }
    );
  }

  // If Authorization header is provided
  if (authHeader) {
    const [type, encoded] = authHeader.split(" ");

    if (type === "Basic") {
      const decoded = atob(encoded);
      const [user, pass] = decoded.split(":");

      // Accept ANY username, only check password
      if (pass === PASSWORD) {
        return; // allow request to continue to the site
      }
    }
  }

  // If missing/wrong password → ask for login
  return new Response("Authentication Required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}"`,
    },
  });
};
