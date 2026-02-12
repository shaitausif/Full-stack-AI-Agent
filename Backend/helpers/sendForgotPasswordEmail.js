import { resend } from "../utils/resend.js";
import { render } from "@react-email/render";
import ForgotPasswordEmail from "../emails/ForgotPasswordEmail.js";

export async function sendForgotPasswordEmail(to, userName, otp) {
  try {
    const emailHtml = await render(
      ForgotPasswordEmail({ userName, otp, expiryTime: "10 minutes" })
    );

    const { data, error } = await resend.emails.send({
      from: "Ticket AI <onboarding@resend.dev>",
      to,
      subject: "Your Password Reset OTP",
      html: emailHtml,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, message: "Failed to send OTP email" };
    }

    return { success: true, message: "OTP email sent successfully", data };
  } catch (error) {
    console.error("Email sending error:", error.message);
    return { success: false, message: "Failed to send OTP email" };
  }
}
