import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Preview,
  Section,
  Hr,
} from "@react-email/components";

const bodyStyle = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: "40px 0",
};

const containerStyle = {
  maxWidth: "560px",
  margin: "0 auto",
};

const sectionStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  padding: "40px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
};

const headingStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1a1a1a",
  textAlign: "center",
  margin: "0 0 24px",
};

const textStyle = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#4a4a4a",
  margin: "0 0 16px",
};

const otpContainerStyle = {
  textAlign: "center",
  margin: "24px 0",
};

const otpStyle = {
  fontSize: "36px",
  fontWeight: "bold",
  letterSpacing: "8px",
  color: "#4f46e5",
  backgroundColor: "#f0f0ff",
  padding: "16px 32px",
  borderRadius: "8px",
  display: "inline-block",
};

const hrStyle = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const footerTextStyle = {
  fontSize: "13px",
  lineHeight: "20px",
  color: "#9ca3af",
  margin: "0 0 8px",
};

export default function ForgotPasswordEmail({ userName, otp, expiryTime }) {
  return React.createElement(
    Html,
    { lang: "en", dir: "ltr" },
    React.createElement(Head, null, React.createElement("title", null, "Password Reset OTP")),
    React.createElement(Preview, null, "Your password reset OTP for Ticket AI"),
    React.createElement(
      Body,
      { style: bodyStyle },
      React.createElement(
        Container,
        { style: containerStyle },
        React.createElement(
          Section,
          { style: sectionStyle },
          React.createElement(Text, { style: headingStyle }, "Password Reset OTP"),
          React.createElement(Text, { style: textStyle }, "Hi " + (userName || "there") + ","),
          React.createElement(
            Text,
            { style: textStyle },
            "We received a request to reset the password for your Ticket AI account. Use the OTP below to proceed:"
          ),
          React.createElement(
            Section,
            { style: otpContainerStyle },
            React.createElement(Text, { style: otpStyle }, otp)
          ),
          React.createElement(
            Text,
            { style: textStyle },
            "Enter this OTP on the password reset page to verify your identity."
          ),
          React.createElement(Hr, { style: hrStyle }),
          React.createElement(
            Text,
            { style: footerTextStyle },
            "This OTP will expire in " + (expiryTime || "10 minutes") + ". If you did not request a password reset, please ignore this email — your password will remain unchanged."
          ),
          React.createElement(Text, { style: footerTextStyle }, "— The Ticket AI Team")
        )
      )
    )
  );
}
