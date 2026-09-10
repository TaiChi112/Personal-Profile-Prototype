import { auth } from "@/auth";

export class AuthService {
  /**
   * Validates if the current request is from an admin user.
   * Returns an explicit object instead of throwing errors to allow for graceful handling.
   */
  static async requireAdmin() {
    try {
      const session = await auth();
      
      if (!session || !session.user) {
        return { authorized: false, reason: "Not logged in" };
      }

      if (session.user.role !== "admin") {
        return { authorized: false, reason: "Insufficient permissions" };
      }

      return { authorized: true, user: session.user };
    } catch (error) {
      console.error("[AuthService] Error in requireAdmin:", error);
      return { authorized: false, reason: "Authentication error" };
    }
  }
}
