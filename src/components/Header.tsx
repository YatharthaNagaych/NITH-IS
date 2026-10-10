"use client";

import React from "react";

interface HeaderProps {
  onNavigate: (view: 'home' | 'student' | 'staff' | 'admission') => void;
  onOpenSupabase: () => void;
  onOpenSignUp: () => void;
  onToggleGemma: () => void;
  isSupabaseConnected: boolean;
  activeView?: 'home' | 'student' | 'staff' | 'admission';
}

export default function Header({
  onNavigate,
  onOpenSupabase,
  onOpenSignUp,
  onToggleGemma,
  isSupabaseConnected,
  activeView = 'home',
}: HeaderProps) {
  // Announcements ticker and institutional top banner remain strictly on Home Page
  if (activeView !== 'home') {
    return null;
  }

  return (
    <>
      {/* Top Institutional Header (Always Visible) */}
      <header className="cu-top-header">
        <div className="header-inner">
          <div
            className="institute-identity"
            onClick={() => onNavigate("home")}
            style={{ cursor: "pointer" }}
            role="button"
            tabIndex={0}
          >
            <div className="institute-emblem">
              <span className="material-symbols-outlined">account_balance</span>
            </div>
            <div className="institute-titles">
              <h1>राष्ट्रीय प्रौद्योगिकी संस्थान हमीरपुर</h1>
              <h2>NATIONAL INSTITUTE OF TECHNOLOGY HAMIRPUR</h2>
              <span className="portal-badge-text">Informatics System (NITH-IS)</span>
            </div>
          </div>

          <div className="header-contact-strip">
            <div className="contact-pill">
              <span className="material-symbols-outlined">call</span>
              <span>Helpdesk: +91 1972 254011</span>
            </div>
            <div className="contact-pill">
              <span className="material-symbols-outlined">mail</span>
              <span>is.support@nith.ac.in</span>
            </div>
            <button
              className="header-supabase-btn"
              onClick={onOpenSupabase}
              id="btnSupabaseHeader"
              title="Supabase Database Connection & Storage"
            >
              <span className="supabase-brand-icon">⚡</span>
              <span
                className={`supabase-status-dot ${isSupabaseConnected ? "connected" : "disconnected"}`}
                id="supabaseHeaderDot"
              ></span>
              <span id="supabaseHeaderLabel">
                {isSupabaseConnected ? "Supabase DB" : "Supabase Offline"}
              </span>
            </button>
            <button className="header-signup-btn" onClick={onOpenSignUp}>
              <span className="material-symbols-outlined">person_add</span>
              <span>Sign Up (@nith.ac.in)</span>
            </button>
            <button className="header-gemma-btn" onClick={onToggleGemma}>
              <span className="material-symbols-outlined">auto_awesome</span>
              <span>Gemma 4 AI</span>
            </button>
            <button className="home-nav-btn" onClick={() => onNavigate("home")}>
              <span className="material-symbols-outlined">home</span>
              <span>Portal Home</span>
            </button>
          </div>
        </div>
      </header>

      {/* CUIMS-Style Live Marquee News Ticker */}
      <div className="cu-ticker-bar">
        <div className="ticker-label">
          <span className="material-symbols-outlined">campaign</span>
          <span>ANNOUNCEMENTS</span>
        </div>
        <div className="ticker-content">
          <div className="ticker-track">
            <span>
              🔔 <strong>DoAA:</strong> Mandatory 75% Attendance compliance rule active for Even Semester End-Term Examinations 2026.
            </span>
            <span>
              📢 <strong>Faculty Notice:</strong> All course coordinators requested to update syllabus completion percentage and quiz dates.
            </span>
            <span>
              🎓 <strong>Admissions 2026:</strong> B.Tech & M.Tech seat allotment round 1 result published on applicant portal.
            </span>
            <span>
              📚 <strong>Central Library:</strong> Extended 24x7 reading room facility open for End-Term Examination preparation.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
