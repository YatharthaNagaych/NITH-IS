import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otpStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: "Email address and 6-digit OTP code are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const result = verifyOtp(cleanEmail, cleanOtp);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Account email verified successfully.",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Error in /api/auth/verify-otp:", errorMsg);
    return NextResponse.json(
      { success: false, error: "Verification server error. Please try again." },
      { status: 500 }
    );
  }
}
