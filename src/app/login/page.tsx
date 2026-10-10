"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";
import { UserAccount } from "@/lib/data";
import { saveCurrentSessionUser } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = (user: UserAccount) => {
    saveCurrentSessionUser(user);
    if (typeof window !== "undefined") {
      window.location.href = `/?view=${user.role || 'student'}`;
    }
  };

  const handleClose = () => {
    router.push("/");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #091122 0%, #111e38 50%, #450a0a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <AuthModal
        isOpen={true}
        onClose={handleClose}
        role="student"
        initialMode="signin"
        onLoginSuccess={handleLoginSuccess}
      />
    </main>
  );
}
