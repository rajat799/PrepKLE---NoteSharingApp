import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";

/**
 * Verify if the request comes from an authenticated admin user.
 * It extracts the Firebase ID token from the Authorization Bearer header,
 * validates it against Firebase Auth API, and checks if the email is an admin.
 */
export async function verifyAdminToken(req: Request): Promise<boolean> {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return false;
    }

    const token = authHeader.split(" ")[1];
    if (!token) return false;

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      console.error("Firebase API Key is missing in environment variables");
      return false;
    }

    // Call the Firebase Auth REST API to lookup user account information using the ID token.
    // This validates the token's validity, signature, and expiration status.
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      }
    );

    if (!response.ok) {
      console.error("Firebase token verification failed:", await response.text());
      return false;
    }

    const data = await response.json();
    const email = data.users?.[0]?.email?.toLowerCase();
    if (!email) return false;

    // Check environment variables admin list
    const allowedEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS
      ?.split(",")
      .map((e) => e.trim().toLowerCase()) || [];

    if (allowedEmails.includes(email) || email === "rajatmalapur@gmail.com") {
      return true;
    }

    // Check database Admin collection
    await dbConnect();
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error in verifyAdminToken:", error);
    return false;
  }
}
