export interface Env {
  // Define environment variables if used (e.g., for password)
  USERNAME?: string;
  PASSWORD?: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    // Optional: Skip auth for specific paths (e.g., /public/*)
    if (request.url.endsWith('/public/')) {
      return ctx.next();
    }

    const auth = request.headers.get('Authorization');
    if (!auth) {
      return new Response('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      });
    }

    const [scheme, encoded] = auth.split(' ');
    if (!encoded || scheme !== 'Basic') {
      return new Response('Invalid authentication scheme', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      });
    }

    const decoded = atob(encoded);
    const [username, password] = decoded.split(':');

    // Hardcoded credentials (for demo; use env vars in production)
    // const expectedUsername = 'admin';
    // const expectedPassword = 'your-secure-password';  // Replace with a strong password

    // Or use environment variables: 
    const expectedUsername = env.BASIC_USERNAME;
    const expectedPassword = env.BASIC_PASSWORD;

    if (username !== expectedUsername || password !== expectedPassword) {
      return new Response('Invalid credentials', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      });
    }

    // Auth successful; proceed to the site
    return ctx.next();
  },
};