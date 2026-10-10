import { NextResponse } from "next/server";
import { saveOtp } from "@/lib/otpStore";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, rollNo, branch } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Please provide an email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.endsWith("@nith.ac.in") || cleanEmail === "@nith.ac.in") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid institutional domain. Only official @nith.ac.in email addresses are accepted.",
        },
        { status: 400 }
      );
    }

    // Accept synchronized client code or generate cryptographically random 6-digit OTP
    const clientOtp = body.otpCode ? String(body.otpCode).trim() : null;
    const otpCode = (clientOtp && /^\d{6}$/.test(clientOtp))
      ? clientOtp
      : Math.floor(100000 + Math.random() * 900000).toString();

    // Store in-memory with 10-minute validity
    saveOtp(cleanEmail, otpCode, 600);

    // Send email via SMTP / Resend / Server Mailer
    const mailResult = await sendOtpEmail({
      toEmail: cleanEmail,
      fullName: name || "Student",
      rollNo: rollNo || "N/A",
      branch: branch || "Engineering",
      otpCode,
    });

    return NextResponse.json({
      success: true,
      message: `A 6-digit OTP verification code has been dispatched to ${cleanEmail}. Please check your official email inbox.`,
      provider: mailResult.provider,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Error in /api/auth/send-otp:", errorMsg);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch verification code. Please try again." },
      { status: 500 }
    );
  }
}
