export async function onRequest(context) {
  const { request, env } = context;
  const PASSWORD = env.SITE_PASSWORD;  // set this env var in Cloudflare Pages
  const REALM = "Secure Area";

  const authHeader = request.headers.get("Authorization");

  if (!PASSWORD) {
    return new Response("Environment variable not set.", { status: 500 });
  }

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      try {
        const decoded = atob(encoded);
        const [user, pass] = decoded.split(":");
        if (pass === PASSWORD) {
          return await context.next();  // allow request to continue (to static files or functions)
        }
      } catch {
        // ignore decode errors
      }
    }
  }

  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}"`,
    },
  });
}
