// In-memory OTP Store with TTL expiration (10 minutes)
interface OtpEntry {
  code: string;
  expiresAt: number;
  attempts: number;
}

// Global cache across API invocations in Next.js development and runtime
declare global {
  // eslint-disable-next-line no-var
  var __NITH_OTP_CACHE__: Map<string, OtpEntry> | undefined;
}

const otpCache: Map<string, OtpEntry> = global.__NITH_OTP_CACHE__ || new Map();
if (process.env.NODE_ENV !== 'production') {
  global.__NITH_OTP_CACHE__ = otpCache;
}

export function saveOtp(email: string, code: string, ttlSeconds = 600): void {
  const normalized = email.trim().toLowerCase();
  otpCache.set(normalized, {
    code,
    expiresAt: Date.now() + ttlSeconds * 1000,
    attempts: 0,
  });
}

export function verifyOtp(email: string, code: string): { success: boolean; message: string } {
  const normalized = email.trim().toLowerCase();
  const entry = otpCache.get(normalized);

  if (!entry) {
    return {
      success: false,
      message: "No OTP was requested for this email, or the code has expired. Please request a new one.",
    };
  }

  if (Date.now() > entry.expiresAt) {
    otpCache.delete(normalized);
    return {
      success: false,
      message: "This OTP has expired (10-minute validity limit). Please click Resend OTP.",
    };
  }

  entry.attempts += 1;
  if (entry.attempts > 5) {
    otpCache.delete(normalized);
    return {
      success: false,
      message: "Too many failed attempts. Please request a new verification OTP.",
    };
  }

  if (entry.code !== code.trim()) {
    return {
      success: false,
      message: "Invalid verification code. Please check the 6-digit code received in your inbox.",
    };
  }

  // Verified successfully - consume code
  otpCache.delete(normalized);
  return {
    success: true,
    message: "OTP verified successfully.",
  };
}

export function getStoredOtpForDev(email: string): string | null {
  const normalized = email.trim().toLowerCase();
  const entry = otpCache.get(normalized);
  if (!entry || Date.now() > entry.expiresAt) return null;
  return entry.code;
}
