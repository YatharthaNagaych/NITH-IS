"use client";

import React, { useState, useEffect, useRef } from "react";
import { UserAccount } from "@/lib/data";
import { saveUserAccount, loadStoredUsers, loadCurrentSessionUser } from "@/lib/supabaseClient";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'student' | 'staff' | 'admission';
  initialMode: 'signin' | 'signup';
  onLoginSuccess: (user: UserAccount) => void;
}

const DEPARTMENT_LOOKUP: Record<string, { name: string; section: string; room: string }> = {
  CE: { name: "Civil Engineering", section: "Section D", room: "LH-108 (Classroom F1)" },
  CSE: { name: "Computer Science & Engg", section: "Section F", room: "LH-104 (Classroom B2)" },
  ECE: { name: "Electronics & Communication", section: "Section G", room: "LH-102 (Classroom G1)" },
  EE: { name: "Electrical Engineering", section: "Section H", room: "LH-103 (Classroom G2)" },
  ME: { name: "Mechanical Engineering", section: "Section B", room: "LH-105 (Classroom G1)" },
  CHE: { name: "Chemical Engineering", section: "Section I", room: "LH-106 (Classroom F1)" },
  MSE: { name: "Materials Science & Engg", section: "Section E", room: "LH-107 (Classroom F2)" },
  MC: { name: "Mathematics & Computing", section: "Section E", room: "LH-109 (Classroom F2)" },
  ARCH: { name: "Architecture (B.Arch)", section: "Section Z", room: "DoA Studio I" },
};

export default function AuthModal({
  isOpen,
  onClose,
  role,
  initialMode,
  onLoginSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<'student' | 'staff' | 'admission'>(role);

  // Sign In fields - clean & blank by default
  const [identifier, setIdentifier] = useState("");
  const [signinBranch, setSigninBranch] = useState("CE");
  const [detectedBranch, setDetectedBranch] = useState<{ code: string; label: string } | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [captchaCode, setCaptchaCode] = useState("8M4K2");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [isCaptchaSpinning, setIsCaptchaSpinning] = useState(false);

  // Sign Up fields
  const [signupName, setSignupName] = useState("");
  const [signupRoll, setSignupRoll] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupBranch, setSignupBranch] = useState("CE");
  const [emailError, setEmailError] = useState(false);

  // Help / Forgot Password Dialog State
  const [showForgotModal, setShowForgotModal] = useState(false);

  // OTP Step & Network State
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [otpNotice, setOtpNotice] = useState<string>("");
  const [otpErrorMessage, setOtpErrorMessage] = useState<string>("");
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password Setup Step State (Post-OTP Verification)
  const [isPasswordStep, setIsPasswordStep] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const resetFormState = () => {
    setIdentifier("");
    setPassword("");
    setUserCaptcha("");
    setDetectedBranch(null);
    setShowPassword(false);
    setIsOtpStep(false);
    setIsPasswordStep(false);
    setOtpDigits(["", "", "", "", "", ""]);
    setOtpErrorMessage("");
    setPasswordErrorMessage("");
    setSignupName("");
    setSignupRoll("");
    setSignupEmail("");
    setNewPassword("");
    setConfirmPassword("");
    reloadCaptcha();
  };

  const handleRoleSelect = (newRole: 'student' | 'staff' | 'admission') => {
    setSelectedRole(newRole);
    resetFormState();
  };

  const handleModalClose = () => {
    resetFormState();
    onClose();
  };

  useEffect(() => {
    setMode(initialMode);
    setSelectedRole(role);
    resetFormState();
  }, [role, isOpen, initialMode]);

  // Auto-detect branch as student types roll number in Sign In
  useEffect(() => {
    const val = identifier.toLowerCase();
    let detected: string | null = null;
    if (val.includes("bce") || val.includes("civil")) detected = "CE";
    else if (val.includes("bcs") || val.includes("cse") || val.includes("comp")) detected = "CSE";
    else if (val.includes("bec") || val.includes("ece")) detected = "ECE";
    else if (val.includes("bee") || val.includes("ee")) detected = "EE";
    else if (val.includes("bme") || val.includes("mech")) detected = "ME";
    else if (val.includes("bch") || val.includes("chem")) detected = "CHE";
    else if (val.includes("bms") || val.includes("mater")) detected = "MSE";
    else if (val.includes("bma") || val.includes("math")) detected = "MC";
    else if (val.includes("bar") || val.includes("arch")) detected = "ARCH";

    if (detected) {
      setSigninBranch(detected);
      const info = DEPARTMENT_LOOKUP[detected];
      setDetectedBranch({
        code: detected,
        label: `${info.name} • ${info.section} • ${info.room}`,
      });
    } else {
      setDetectedBranch(null);
    }
  }, [identifier]);

  // OTP Countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOtpStep && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpStep, secondsRemaining]);

  const reloadCaptcha = () => {
    setIsCaptchaSpinning(true);
    setTimeout(() => setIsCaptchaSpinning(false), 500);
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setUserCaptcha("");
  };

  if (!isOpen) return null;

  // Handle Sign In Submit
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userCaptcha.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      alert("⚠️ Invalid Captcha code. Please enter the exact characters displayed in the security verification box.");
      reloadCaptcha();
      return;
    }

    const cleanId = identifier.trim();
    if (!cleanId) {
      alert("Please enter your Roll Number / Student UID or Email.");
      return;
    }

    // Look up existing registered user from storage
    const storedUsers = loadStoredUsers();
    const existing = storedUsers.find(
      (u) =>
        u.roll_no_or_emp_id.toLowerCase() === cleanId.toLowerCase() ||
        u.email.toLowerCase() === cleanId.toLowerCase() ||
        u.email.toLowerCase() === `${cleanId.toLowerCase()}@nith.ac.in`
    );

    let loggedUser: UserAccount;
    if (existing) {
      loggedUser = {
        ...existing,
        role: selectedRole, // Override role for this session to route correctly
        department: signinBranch || existing.department || "CE",
      };
    } else {
      const isEmail = cleanId.includes("@");
      const derivedEmail = isEmail ? cleanId.toLowerCase() : `${cleanId.toLowerCase()}@nith.ac.in`;
      const derivedRoll = isEmail ? cleanId.split("@")[0].toUpperCase() : cleanId.toUpperCase();

      let derivedName = `Student (${derivedRoll})`;
      if (selectedRole === "staff") derivedName = `Faculty (${derivedRoll})`;
      if (selectedRole === "admission") derivedName = `Candidate (${derivedRoll})`;

      loggedUser = {
        id: "u-" + Date.now(),
        email: derivedEmail,
        full_name: derivedName,
        role: selectedRole,
        roll_no_or_emp_id: derivedRoll,
        is_verified: true,
        department: signinBranch || "CE",
        created_at: new Date().toISOString(),
      };
      saveUserAccount(loggedUser);
    }

    onLoginSuccess(loggedUser);
    resetFormState();
    onClose();
  };

  // Handle Sign Up Submit (Dispatches OTP to official email)
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = signupEmail.trim().toLowerCase();
    const cleanRoll = signupRoll.trim().toUpperCase();
    const cleanName = signupName.trim();

    if (!cleanEmail.endsWith("@nith.ac.in")) {
      setEmailError(true);
      alert("⚠️ Access Restricted: Registration is strictly reserved for official Google Workspace accounts ending in @nith.ac.in.");
      return;
    }
    setEmailError(false);

    setIsSendingOtp(true);
    setOtpErrorMessage("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          name: cleanName,
          rollNo: cleanRoll,
          branch: signupBranch,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to dispatch verification code.");
      }

      setIsOtpStep(true);
      setOtpNotice(data.message || `Verification code sent to ${cleanEmail}`);
      setOtpDigits(["", "", "", "", "", ""]);
      setSecondsRemaining(30);

      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`⚠️ Email Dispatch Notice:\n${msg}`);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle OTP Inputs
  const handleOtpChange = (index: number, val: string) => {
    setOtpErrorMessage("");
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const newDigits = [...otpDigits];
    newDigits[index] = val;
    setOtpDigits(newDigits);

    if (val && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      setOtpDigits(pasted.split(""));
      otpInputRefs.current[5]?.focus();
    }
  };

  const resendOtp = async () => {
    setIsSendingOtp(true);
    setOtpErrorMessage("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupEmail.trim().toLowerCase(),
          name: signupName.trim(),
          rollNo: signupRoll.trim().toUpperCase(),
          branch: signupBranch,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to resend verification code.");
      }
      setSecondsRemaining(30);
      setOtpNotice(data.message || `New 6-digit OTP sent to ${signupEmail}!`);
      alert(`✓ ${data.message || 'OTP verification code processed successfully.'}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`⚠️ Resend Error: ${msg}`);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpDigits.join("");
    if (entered.length < 6) {
      setOtpErrorMessage("Please enter all 6 digits of the verification code.");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpErrorMessage("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupEmail.trim().toLowerCase(),
          otp: entered,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid OTP code. Please enter the code sent to your email.");
      }

      // OTP Verified Successfully -> Now advance to Password Setup Step!
      setIsOtpStep(false);
      setIsPasswordStep(true);
      setPasswordErrorMessage("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setOtpErrorMessage(msg);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      setPasswordErrorMessage("Password must be at least 4 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    const newUser: UserAccount = {
      id: "u-" + Date.now(),
      email: signupEmail.trim().toLowerCase(),
      full_name: signupName.trim(),
      role: "student",
      roll_no_or_emp_id: signupRoll.trim().toUpperCase(),
      is_verified: true,
      department: signupBranch,
      password: newPassword,
      created_at: new Date().toISOString(),
    };

    saveUserAccount(newUser);
    onLoginSuccess(newUser);
    resetFormState();
    onClose();
  };

  const handleMobileAppClick = (platform: string) => {
    alert(`📱 NITH-IS Student Mobile App (${platform}):\n\nThe official Android APK and iOS build are deployed via the NIT Hamirpur Computer Centre portal. Biometric login, push attendance notifications, and grade cards are integrated.`);
  };

  return (
    <div id="loginModal" className="login-modal-overlay">
      <div className="cuims-modal-backdrop" onClick={handleModalClose}></div>

      {/* THE CUIMS EXECUTIVE GATEWAY CARD */}
      <div className="cuims-gateway-card">
        {/* Floating Close Button */}
        <button
          type="button"
          className="cuims-close-floating-btn"
          onClick={handleModalClose}
          title="Close Gateway"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* ========================================================= */}
        {/* LEFT PANEL: CUIMS INSTITUTIONAL SHOWCASE & CAMPUS LIFE   */}
        {/* ========================================================= */}
        <div className="cuims-left-showcase">
          <div className="cuims-showcase-bg-overlay"></div>

          <div className="cuims-showcase-top">
            {/* Top Institutional Crest & Bilingual Branding */}
            <div className="cuims-inst-header">
              <div className="cuims-crest-bubble">
                <span className="material-symbols-outlined">account_balance</span>
              </div>
              <div className="cuims-inst-text">
                <div className="cuims-hindi-title">राष्ट्रीय प्रौद्योगिकी संस्थान हमीरपुर</div>
                <h4>NIT HAMIRPUR</h4>
                <p>UIMS • INFORMATICS SYSTEM (NITH-IS)</p>
              </div>
            </div>

            {/* Accreditation & Campus Status Pill */}
            <div className="cuims-accreditation-strip">
              <span className="cuims-badge-red">NAAC &apos;A+&apos; GRADE</span>
              <span className="cuims-badge-gold">NIRF RANKED</span>
              <span className="cuims-badge-blue">MHRD / INI</span>
            </div>

            {/* Portal Headline */}
            <div className="cuims-showcase-headline">
              <h2>Student Gateway Portal</h2>
              <p>
                Unified Information Management System for Ordinance 7.2 compliance, VLHC lecture hall timetable & academic fee receipts.
              </p>
            </div>

            {/* CUIMS Feature Showcase Cards */}
            <div className="cuims-features-list">
              <div className="cuims-feature-item">
                <div className="cuims-feat-icon-bubble feat-att">
                  <span className="material-symbols-outlined">fact_check</span>
                </div>
                <div className="cuims-feat-text">
                  <strong>75% Attendance Compliance Engine</strong>
                  <span>Automated Ordinance 7.2 attendance compliance & shortage alerts</span>
                </div>
              </div>

              <div className="cuims-feature-item">
                <div className="cuims-feat-icon-bubble feat-time">
                  <span className="material-symbols-outlined">calendar_month</span>
                </div>
                <div className="cuims-feat-text">
                  <strong>Official VLHC Lecture Schedule</strong>
                  <span>Vivekananda Complex rooms F1, B2, G1, G2, LH-108 synced</span>
                </div>
              </div>

              <div className="cuims-feature-item">
                <div className="cuims-feat-icon-bubble feat-pass">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <div className="cuims-feat-text">
                  <strong>Fee Receipts & Academic Forms</strong>
                  <span>Semester tuition fee receipts & official academic verification</span>
                </div>
              </div>

              <div className="cuims-feature-item">
                <div className="cuims-feat-icon-bubble feat-grade">
                  <span className="material-symbols-outlined">grade</span>
                </div>
                <div className="cuims-feat-text">
                  <strong>Academic Grades & SGPA Transcripts</strong>
                  <span>Semester transcript records & syllabus completion tracker</span>
                </div>
              </div>
            </div>

            {/* Mobile App Download Badges (Exact CUIMS students.cuchd.in style) */}
            <div className="cuims-mobile-apps-section">
              <div className="cuims-mobile-title">
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>smartphone</span>
                <span>Download NITH-IS Student App</span>
              </div>
              <div className="cuims-app-badges-row">
                <button
                  type="button"
                  className="cuims-app-store-btn"
                  onClick={() => handleMobileAppClick("Google Play")}
                >
                  <svg className="cuims-store-svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.947 1.947 0 01-.61-1.424V3.238c0-.54.22-1.049.609-1.424zm11.242 11.243l2.25 2.25-12.062 6.945 9.812-9.195zm0-2.114L5.039 1.748l12.062 6.945-2.25 2.25zm1.09 1.09l3.522 2.025a1.5 1.5 0 010 2.597l-3.522 2.025-1.782-1.782 1.782-1.865z" />
                  </svg>
                  <div>
                    <span className="store-sub">GET IT ON</span>
                    <span className="store-main">Google Play</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="cuims-app-store-btn"
                  onClick={() => handleMobileAppClick("App Store")}
                >
                  <svg className="cuims-store-svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.09 1.73-.95 2.76.99.08 2.05-.51 2.67-1.26z" />
                  </svg>
                  <div>
                    <span className="store-sub">Download on the</span>
                    <span className="store-main">App Store</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Showcase Footer */}
          <div className="cuims-showcase-bottom">
            <span>Session: Jan - Jun 2026 (Even Sem)</span>
            <span>Computer Centre • NIT Hamirpur</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT PANEL: CUIMS AUTHENTICATION CONSOLE                 */}
        {/* ========================================================= */}
        <div className="cuims-right-auth">
          <div>
            {/* CUIMS Official Role Segment Switcher (Student / Faculty / Admissions) */}
            <div className="cuims-role-tabs-bar">
              <button
                type="button"
                className={`cuims-role-pill-btn ${selectedRole === "student" ? "active" : ""}`}
                onClick={() => handleRoleSelect("student")}
              >
                <span className="material-symbols-outlined">school</span>
                <span>Student / Parent</span>
              </button>
              <button
                type="button"
                className={`cuims-role-pill-btn ${selectedRole === "staff" ? "active" : ""}`}
                onClick={() => handleRoleSelect("staff")}
              >
                <span className="material-symbols-outlined">badge</span>
                <span>Faculty / Staff</span>
              </button>
              <button
                type="button"
                className={`cuims-role-pill-btn ${selectedRole === "admission" ? "active" : ""}`}
                onClick={() => handleRoleSelect("admission")}
              >
                <span className="material-symbols-outlined">how_to_reg</span>
                <span>Admissions</span>
              </button>
            </div>

            {/* CUIMS Header Banner inside form */}
            <div className="cuims-login-header-banner">
              <div className="cuims-form-crest">
                <span className="material-symbols-outlined">account_balance</span>
              </div>
              <div>
                <h2 className="cuims-login-title">Log in</h2>
                <p className="cuims-login-sub">
                  Welcome to University Information Management System —{" "}
                  <span className="cuims-campus-highlight">Hamirpur Campus</span>
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs (Sign In vs Sign Up) */}
            <div className="cuims-auth-mode-switch">
              <button
                type="button"
                className={`cuims-auth-mode-tab ${mode === "signin" ? "active" : ""}`}
                onClick={() => {
                  setMode("signin");
                  setIsOtpStep(false);
                  setIsPasswordStep(false);
                }}
              >
                <span className="material-symbols-outlined">login</span>
                <span>Sign In</span>
              </button>
              {selectedRole !== "admission" && (
                <button
                  type="button"
                  className={`cuims-auth-mode-tab ${mode === "signup" ? "active" : ""}`}
                  onClick={() => {
                    setMode("signup");
                    setIsOtpStep(false);
                    setIsPasswordStep(false);
                  }}
                >
                  <span className="material-symbols-outlined">person_add</span>
                  <span>First Time Registration (@nith.ac.in)</span>
                </button>
              )}
            </div>

            {/* ===================================================== */}
            {/* MODE 1: CUIMS SIGN IN FORM                            */}
            {/* ===================================================== */}
            {mode === "signin" && (
              <form id="activeRoleLoginForm" onSubmit={handleSignInSubmit} autoComplete="off">
                {/* User ID / Roll Number input */}
                <div className="cuims-form-group">
                  <label>
                    {selectedRole === "student"
                      ? "User ID / Roll Number (UID)"
                      : selectedRole === "staff"
                      ? "Employee ID / Faculty Code"
                      : "Application No. / JEE Main Roll"}
                  </label>
                  <div className="cuims-input-wrapper">
                    <span className="material-symbols-outlined cuims-field-icon">person</span>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        selectedRole === "student"
                          ? "Enter User Id (e.g. 26BCE123 or 26BCS042)"
                          : "Enter Employee Code (e.g. NITH-EMP-108)"
                      }
                      required
                      autoComplete="off"
                    />
                  </div>
                  {/* Real-time Branch detection badge */}
                  {selectedRole === "student" && detectedBranch && (
                    <div className="cuims-detected-pill">
                      <span className="material-symbols-outlined">verified</span>
                      <span>Detected: {detectedBranch.label}</span>
                    </div>
                  )}
                </div>

                {/* Department / Branch (For Schedule Linking) */}
                {selectedRole === "student" && (
                  <div className="cuims-form-group">
                    <label>Department / Official Schedule</label>
                    <div className="cuims-input-wrapper">
                      <span className="material-symbols-outlined cuims-field-icon">school</span>
                      <select
                        value={signinBranch}
                        onChange={(e) => setSigninBranch(e.target.value)}
                      >
                        <option value="CE">Civil Engineering (CE) • Section D (LH-108 / F1)</option>
                        <option value="CSE">Computer Science & Engg (CSE) • Section F (LH-104 / B2)</option>
                        <option value="ECE">Electronics & Communication (ECE) • Section G (LH-102 / G1)</option>
                        <option value="EE">Electrical Engineering (EE) • Section H (LH-103 / G2)</option>
                        <option value="ME">Mechanical Engineering (ME) • Section B (LH-105 / G1)</option>
                        <option value="CHE">Chemical Engineering (CHE) • Section I (LH-106 / F1)</option>
                        <option value="MSE">Materials Science & Engg (MSE) • Section E (LH-107 / F2)</option>
                        <option value="MC">Mathematics & Computing (M&C) • Section E (LH-109 / F2)</option>
                        <option value="ARCH">Architecture (B.Arch) • Section Z (DoA Studio I)</option>
                        <option value="DCS">Dual Degree CSE (DCS)</option>
                        <option value="DCE">Dual Degree ECE (DCE)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Password / Pin with Show/Hide toggle */}
                <div className="cuims-form-group">
                  <label>Password / Pin</label>
                  <div className="cuims-input-wrapper">
                    <span className="material-symbols-outlined cuims-field-icon">lock</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Password"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="cuims-password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      <span className="material-symbols-outlined">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* CUIMS Realistic Security Captcha Box */}
                <div className="cuims-form-group">
                  <label>Security Verification Code (Captcha)</label>
                  <div className="cuims-captcha-container">
                    <div className="cuims-captcha-card">
                      <div className="cuims-captcha-noise-line noise-1"></div>
                      <div className="cuims-captcha-noise-line noise-2"></div>
                      <span className="cuims-captcha-char char-1">{captchaCode[0]}</span>
                      <span className="cuims-captcha-char char-2">{captchaCode[1]}</span>
                      <span className="cuims-captcha-char char-3">{captchaCode[2]}</span>
                      <span className="cuims-captcha-char char-4">{captchaCode[3]}</span>
                      <span className="cuims-captcha-char char-5">{captchaCode[4]}</span>
                    </div>

                    <button
                      type="button"
                      className={`cuims-captcha-reload-btn ${isCaptchaSpinning ? "spinning" : ""}`}
                      onClick={reloadCaptcha}
                      title="Reload Captcha Code"
                    >
                      <span className="material-symbols-outlined">sync</span>
                    </button>

                    <div className="cuims-input-wrapper cuims-captcha-input">
                      <input
                        type="text"
                        value={userCaptcha}
                        onChange={(e) => setUserCaptcha(e.target.value)}
                        placeholder="Enter Captcha"
                        required
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>

                {/* Extras: Remember Me & Forgot Password */}
                <div className="cuims-form-extras">
                  <label className="cuims-remember-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember UID on this device</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="cuims-forgot-link"
                  >
                    Forgot Password / PIN?
                  </button>
                </div>

                {/* CUIMS Signature Red Submit Button */}
                <button type="submit" className="cuims-primary-submit-btn">
                  <span>
                    {selectedRole === "student"
                      ? "NEXT / SIGN IN TO STUDENT PORTAL"
                      : selectedRole === "staff"
                      ? "NEXT / SIGN IN TO FACULTY PORTAL"
                      : "NEXT / SIGN IN TO ADMISSIONS"}
                  </span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>

                {/* CUIMS Secondary Link (students.cuchd.in style) */}
                {selectedRole !== "admission" && (
                  <div className="cuims-secondary-or-row">
                    <div className="cuims-or-divider">
                      <span>OR</span>
                    </div>
                    <button
                      type="button"
                      className="cuims-reg-button-link"
                      onClick={() => {
                        setMode("signup");
                        setIsOtpStep(false);
                      }}
                    >
                      {selectedRole === "student"
                        ? "Click here for New Student Registration (@nith.ac.in)"
                        : "Click here for New Faculty/Staff Registration (@nith.ac.in)"}
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* ===================================================== */}
            {/* MODE 2: CUIMS REGISTRATION FORM (STEP 1: DETAILS)     */}
            {/* ===================================================== */}
            {mode === "signup" && !isOtpStep && !isPasswordStep && (
              <form id="signUpForm" onSubmit={handleSignUpSubmit}>
                <div className="cuims-nith-banner">
                  <span className="material-symbols-outlined">verified_user</span>
                  <div>
                    <strong>Official @nith.ac.in Verification</strong>
                    <p>Enter your institutional credentials. A 6-digit verification code will be dispatched to your email.</p>
                  </div>
                </div>

                <div className="cuims-form-group">
                  <label>{selectedRole === "student" ? "Full Student Name" : "Full Faculty/Staff Name"}</label>
                  <div className="cuims-input-wrapper">
                    <span className="material-symbols-outlined cuims-field-icon">badge</span>
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="Enter Full Name (e.g. Yathartha Nagaych)"
                      required
                    />
                  </div>
                </div>

                <div className="cuims-form-group">
                  <label>{selectedRole === "student" ? "Student UID / Roll Number" : "Employee ID / Faculty Code"}</label>
                  <div className="cuims-input-wrapper">
                    <span className="material-symbols-outlined cuims-field-icon">id_card</span>
                    <input
                      type="text"
                      value={signupRoll}
                      onChange={(e) => setSignupRoll(e.target.value)}
                      placeholder="e.g. 26BCE123 or 26BCS042"
                      required
                    />
                  </div>
                </div>

                <div className="cuims-form-group">
                  <label>Official Institutional Email (@nith.ac.in)</label>
                  <div className="cuims-input-wrapper">
                    <span className="material-symbols-outlined cuims-field-icon">mail</span>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => {
                        setSignupEmail(e.target.value);
                        if (e.target.value.endsWith("@nith.ac.in")) setEmailError(false);
                      }}
                      placeholder="username@nith.ac.in"
                      required
                    />
                  </div>
                  {emailError && (
                    <div className="cuims-error-msg">
                      ⚠️ Registration is restricted to official <strong>@nith.ac.in</strong> email accounts.
                    </div>
                  )}
                </div>

                <div className="cuims-form-group">
                  <label>Department / Branch</label>
                  <div className="cuims-input-wrapper">
                    <span className="material-symbols-outlined cuims-field-icon">account_tree</span>
                    <select
                      value={signupBranch}
                      onChange={(e) => setSignupBranch(e.target.value)}
                    >
                      <option value="CE">Civil Engineering (CE) • Section D (LH-108 / F1)</option>
                      <option value="CSE">Computer Science & Engg (CSE) • Section F (LH-104 / B2)</option>
                      <option value="ECE">Electronics & Communication (ECE) • Section G (LH-102 / G1)</option>
                      <option value="EE">Electrical Engineering (EE) • Section H (LH-103 / G2)</option>
                      <option value="ME">Mechanical Engineering (ME) • Section B (LH-105 / G1)</option>
                      <option value="CHE">Chemical Engineering (CHE) • Section I (LH-106 / F1)</option>
                      <option value="MSE">Materials Science & Engg (MSE) • Section E (LH-107 / F2)</option>
                      <option value="MC">Mathematics & Computing (M&C) • Section E (LH-109 / F2)</option>
                      <option value="ARCH">Architecture (B.Arch) • Section Z (DoA Studio I)</option>
                      <option value="DCS">Dual Degree CSE (DCS)</option>
                      <option value="DCE">Dual Degree ECE (DCE)</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="cuims-primary-submit-btn" disabled={isSendingOtp}>
                  <span>{isSendingOtp ? "DISPATCHING OTP TO EMAIL..." : "SEND 6-DIGIT OTP TO EMAIL"}</span>
                  <span className="material-symbols-outlined">{isSendingOtp ? "hourglass_top" : "send"}</span>
                </button>
              </form>
            )}

            {/* ===================================================== */}
            {/* MODE 2 (STEP 2): OTP VERIFICATION STEP                */}
            {/* ===================================================== */}
            {mode === "signup" && isOtpStep && !isPasswordStep && (
              <form id="otpVerificationForm" onSubmit={handleVerifyOtp} autoComplete="off">
                <div className="cuims-otp-dispatched-box">
                  <div className="otp-box-header">
                    <span className="material-symbols-outlined">mark_email_read</span>
                    <span>6-Digit OTP Sent to Official Email</span>
                  </div>
                  <p>
                    A 6-digit OTP verification code has been dispatched to your official Google Workspace address:
                  </p>
                  <div className="otp-target-email">
                    <span className="material-symbols-outlined">mail</span>
                    <span>{signupEmail}</span>
                  </div>
                  <p className="otp-help-text">
                    ⏱️ Please check your institutional inbox (or spam) and enter the 6-digit OTP code below:
                  </p>
                </div>

                {otpErrorMessage && (
                  <div className="cuims-error-msg-card">
                    ⚠️ {otpErrorMessage}
                  </div>
                )}

                {/* 6 OTP Input Boxes */}
                <div className="cuims-otp-grid">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className="cuims-otp-single-box"
                      required
                    />
                  ))}
                </div>

                <div className="cuims-otp-timer-row">
                  {secondsRemaining > 0 ? (
                    <span className="otp-countdown">Resend code in {secondsRemaining}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={resendOtp}
                      disabled={isSendingOtp}
                      className="otp-resend-active-btn"
                    >
                      {isSendingOtp ? "Dispatching..." : "Resend OTP Code"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpStep(false);
                      setIsPasswordStep(false);
                      setOtpErrorMessage("");
                    }}
                    className="otp-change-email-btn"
                  >
                    Change Email
                  </button>
                </div>

                <button type="submit" className="cuims-primary-submit-btn" disabled={isVerifyingOtp}>
                  <span>{isVerifyingOtp ? "VERIFYING CODE..." : "VERIFY CODE & CONTINUE"}</span>
                  <span className="material-symbols-outlined">{isVerifyingOtp ? "hourglass_top" : "arrow_forward"}</span>
                </button>
              </form>
            )}

            {/* ===================================================== */}
            {/* MODE 2 (STEP 3): SET PORTAL PASSWORD STEP             */}
            {/* ===================================================== */}
            {mode === "signup" && isPasswordStep && (
              <form id="createPasswordForm" onSubmit={handleSetPasswordSubmit} autoComplete="off">
                <div className="cuims-otp-dispatched-box" style={{ background: "#ecfdf5", borderColor: "#10b981" }}>
                  <div className="otp-box-header" style={{ color: "#065f46" }}>
                    <span className="material-symbols-outlined" style={{ color: "#059669" }}>verified</span>
                    <span>Email & OTP Verified Successfully!</span>
                  </div>
                  <p style={{ margin: "6px 0 0 0", color: "#047857" }}>
                    Account verified for <strong>{signupEmail}</strong> ({signupRoll}). Now create your portal password to access the Student Dashboard:
                  </p>
                </div>

                {passwordErrorMessage && (
                  <div className="cuims-error-msg-card">
                    ⚠️ {passwordErrorMessage}
                  </div>
                )}

                <div className="cuims-form-group">
                  <label>Create Account Password</label>
                  <div className="cuims-input-wrapper">
                    <span className="material-symbols-outlined cuims-field-icon">lock</span>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter minimum 4 characters"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      className="cuims-password-toggle-btn"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      <span className="material-symbols-outlined">
                        {showNewPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="cuims-form-group">
                  <label>Confirm Account Password</label>
                  <div className="cuims-input-wrapper">
                    <span className="material-symbols-outlined cuims-field-icon">lock_reset</span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type your password"
                      required
                    />
                    <button
                      type="button"
                      className="cuims-password-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <span className="material-symbols-outlined">
                        {showConfirmPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="cuims-primary-submit-btn"
                  style={{ background: "linear-gradient(135deg, #059669 0%, #047857 100%)" }}
                >
                  <span>SET PASSWORD & ENTER STUDENT DASHBOARD</span>
                  <span className="material-symbols-outlined">rocket_launch</span>
                </button>
              </form>
            )}
          </div>

          {/* CUIMS Helpdesk & Portal Footer */}
          <div className="cuims-auth-footer-help">
            <div className="cuims-help-contact">
              <span>Computer Centre Helpline: <strong>+91 1972 254011</strong></span>
              <span>•</span>
              <span>uims-support@nith.ac.in</span>
            </div>
            <div className="cuims-legal-note">
              Ordinance 7.2 attendance compliance & digital biometric passes are monitored by Academic Branch, NIT Hamirpur.
            </div>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD / PIN MODAL DIALOG */}
      {showForgotModal && (
        <div className="cuims-submodal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="cuims-submodal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cuims-submodal-header">
              <div className="submodal-icon">
                <span className="material-symbols-outlined">lock_reset</span>
              </div>
              <div>
                <h3>Password / PIN Reset Assistance</h3>
                <p>NITH-IS Computer Centre & Student Services</p>
              </div>
              <button
                type="button"
                className="submodal-close"
                onClick={() => setShowForgotModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="cuims-submodal-body">
              <div className="submodal-step">
                <strong>Option 1: First-Time User Default PIN</strong>
                <p>If this is your first time logging in, your default PIN is your Date of Birth in <code>DDMMYYYY</code> format or the last 6 digits of your registration roll number.</p>
              </div>
              <div className="submodal-step">
                <strong>Option 2: Register via Official @nith.ac.in Email</strong>
                <p>Use the <strong>&apos;First Time Registration&apos;</strong> tab to verify your account with an OTP sent to your institutional Google Workspace email.</p>
              </div>
              <div className="submodal-step">
                <strong>Option 3: In-Person / Helpdesk Reset</strong>
                <p>Visit the Computer Centre Block (Ground Floor), NIT Hamirpur with your Student Identity Card, or call <strong>+91 1972 254011</strong> (Intercom 254011).</p>
              </div>
            </div>
            <div className="cuims-submodal-footer">
              <button
                type="button"
                className="btn-submodal-primary"
                onClick={() => setShowForgotModal(false)}
              >
                Understood, Return to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
