import { Email } from "@convex-dev/auth/providers/Email";
import { Resend as ResendAPI } from "resend";

export default Email({
  id: "resend-hash",
  apiKey: process.env.AUTH_RESEND_KEY!,

  async sendVerificationRequest({ identifier: email, provider, url }) {
    const resend = new ResendAPI(provider.apiKey as string);

    // Convert query params to hash fragment
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);

    // IMPORTANT: Add email to params (Convex Auth requires it for verification)
    params.set('email', email);

    const hashParams = params.toString();

    // Create URL with hash instead of query params
    const hashUrl = `${urlObj.origin}${urlObj.pathname}#${hashParams}`;

    console.log("ResendWithHash - Sending email:", {
      originalUrl: url,
      hashUrl,
      email,
      params: Object.fromEntries(params.entries()),
    });

    const result = await resend.emails.send({
      from: "onboarding@pingw.me",
      to: email,
      subject: "Sign in to Miles Tracker",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Sign in to Miles Tracker</title>
          </head>
          <body>
            <h2>Sign in to Miles Tracker</h2>
            <p>Click the link below to sign in:</p>
            <p>
              <a href="${hashUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3ecf8e; color: #0f1419; text-decoration: none; border-radius: 8px; font-weight: 600;">
                Sign In
              </a>
            </p>
            <p style="color: #666; font-size: 14px;">
              Or copy and paste this URL into your browser:<br>
              <code style="background: #f4f4f4; padding: 4px 8px; border-radius: 4px;">${hashUrl}</code>
            </p>
            <p style="color: #999; font-size: 12px;">
              This link will expire in 24 hours. If you didn't request this email, you can safely ignore it.
            </p>
          </body>
        </html>
      `,
    });

    if (result.error) {
      throw new Error(`Failed to send email: ${result.error.message}`);
    }
  },
});
