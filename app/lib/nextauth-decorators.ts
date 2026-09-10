export function withAuth(handler: any) {
  return async (...args: any[]) => {
    // Mock session object
    const session = {
      user: {
        id: "mock-user-id",
        name: "Mock User",
        email: "mock@example.com",
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    if (!session) {
      // Mock unauthorized response if no session
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Call the original handler with the session injected
    return handler(...args, session);
  };
}
