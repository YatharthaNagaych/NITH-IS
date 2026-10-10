"use client";

import React, { useRef, useState } from "react";

interface HomeViewProps {
  onOpenLogin: (role: 'student' | 'staff' | 'admission') => void;
  onOpenSignUp: () => void;
  onToggleGemma: () => void;
}

export default function HomeView({
  onOpenLogin,
  onOpenSignUp,
  onToggleGemma,
}: HomeViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoSrc, setVideoSrc] = useState("/upscaled-video.mp4");
  const [searchQuery, setSearchQuery] = useState("");

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(err => console.log(err));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const promptChangeVideo = () => {
    const url = prompt(
      "Enter custom MP4 video URL or local file path (e.g. /upscaled-video.mp4 or /campus_bg.mp4):",
      videoSrc
    );
    if (url && url.trim()) {
      setVideoSrc(url.trim());
      setIsPlaying(true);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      alert("Please enter a roll number, course code, faculty name, or keyword (e.g., '22BCSE101', 'attendance', 'hostel', 'fees').");
      return;
    }

    if (
      q.includes("student") ||
      q.includes("roll") ||
      q.includes("22b") ||
      q.includes("23b") ||
      q.includes("26b") ||
      q.includes("bce") ||
      q.includes("bcs") ||
      q.includes("attendance") ||
      q.includes("bunk") ||
      q.includes("gate") ||
      q.includes("pass") ||
      q.includes("fee") ||
      q.includes("sgpa") ||
      q.includes("grade")
    ) {
      onOpenLogin('student');
    } else if (
      q.includes("facult") ||
      q.includes("staff") ||
      q.includes("prof") ||
      q.includes("teach") ||
      q.includes("syllabus") ||
      q.includes("quiz") ||
      q.includes("duty") ||
      q.includes("lecture")
    ) {
      onOpenLogin('staff');
    } else if (
      q.includes("admiss") ||
      q.includes("josaa") ||
      q.includes("csab") ||
      q.includes("counsel") ||
      q.includes("merit") ||
      q.includes("allot") ||
      q.includes("applicant")
    ) {
      onOpenLogin('admission');
    } else if (
      q.includes("gemma") ||
      q.includes("ai") ||
      q.includes("ask") ||
      q.includes("dijkstra") ||
      q.includes("copilot")
    ) {
      onToggleGemma();
    } else {
      onOpenLogin('student');
    }
  };

  return (
    <div id="view-home" className="page-view active">
      {/* ZOMATO-STYLE CINEMATIC CAMPUS VIDEO HERO BANNER */}
      <section className="zomato-hero-section">
        <video
          ref={videoRef}
          id="bgCampusVideo"
          className="zomato-hero-video"
          autoPlay
          muted={isMuted}
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80"
          src={videoSrc}
        >
          Your browser does not support HTML5 video.
        </video>

        <div className="zomato-hero-overlay"></div>

        {/* Center Hero Branding & Zomato Search Bar */}
        <div className="zomato-hero-content">
          <div className="zomato-hero-badge">
            <span className="material-symbols-outlined">account_balance</span>
            <span>National Institute of Technology Hamirpur (H.P.) • An Institute of National Importance</span>
          </div>

          <h1 className="zomato-hero-title">NITH-IS</h1>

          <p className="zomato-hero-subtitle">
            Informatics System • Real-time 75% attendance compliance, digital hostel QR gate passes, faculty syllabus registers & admissions
          </p>

          {/* Zomato-Style Search & Gateway Finder */}
          <div className="zomato-search-wrapper">
            <form className="zomato-search-bar" onSubmit={handleSearch}>
              <span className="material-symbols-outlined zomato-search-icon">search</span>
              <input
                type="text"
                id="zomatoSearchInput"
                placeholder="Search roll number, course, 75% attendance, hostel pass, syllabus, faculty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="zomato-search-submit">
                <span>Find Portal</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>

            {/* Quick Access Tag Chips */}
            <div className="zomato-quick-tags">
              <span className="quick-tag-label">Quick access:</span>
              <button className="zomato-tag-chip" onClick={() => onOpenLogin('student')}>
                <span className="material-symbols-outlined">school</span> Student Portal
              </button>
              <button className="zomato-tag-chip" onClick={() => onOpenLogin('staff')}>
                <span className="material-symbols-outlined">badge</span> Faculty Portal
              </button>
              <button className="zomato-tag-chip" onClick={() => onOpenLogin('admission')}>
                <span className="material-symbols-outlined">how_to_reg</span> Admissions
              </button>
              <button className="zomato-tag-chip chip-gemma" onClick={onToggleGemma}>
                <span className="material-symbols-outlined">auto_awesome</span> Gemma 4 AI
              </button>
            </div>
          </div>
        </div>

        {/* Floating Video Control Pills (Bottom Right) */}
        <div className="zomato-video-controls">
          <button
            type="button"
            className="zomato-ctrl-btn"
            id="btnToggleVideoPlay"
            onClick={togglePlay}
            title="Play / Pause"
          >
            <span className="material-symbols-outlined" id="videoPlayIcon">
              {isPlaying ? "pause" : "play_arrow"}
            </span>
            <span className="ctrl-btn-label">{isPlaying ? "Pause" : "Play"}</span>
          </button>
          <button
            type="button"
            className="zomato-ctrl-btn"
            id="btnToggleVideoMute"
            onClick={toggleMute}
            title="Mute / Sound"
          >
            <span className="material-symbols-outlined" id="videoMuteIcon">
              {isMuted ? "volume_off" : "volume_up"}
            </span>
            <span className="ctrl-btn-label">{isMuted ? "Sound Off" : "Sound On"}</span>
          </button>
          <button
            type="button"
            className="zomato-ctrl-btn"
            onClick={toggleFullscreen}
            title="Fullscreen"
          >
            <span className="material-symbols-outlined">fullscreen</span>
            <span>Fullscreen</span>
          </button>
          <button
            type="button"
            className="zomato-ctrl-btn"
            onClick={promptChangeVideo}
            title="Change Video Source"
          >
            <span className="material-symbols-outlined">video_file</span>
            <span>Video Source</span>
          </button>
        </div>
      </section>

      {/* MAIN PORTAL BODY (SHIFTED JUST BELOW THE VIDEO) */}
      <main className="home-container">
        {/* SECTION HEADING (ZOMATO STYLE) */}
        <section className="portal-cards-section">
          <div className="section-heading">
            <h2>Select Portal Gateway to Sign In</h2>
            <p>Choose your institutional role to access academic, administrative, or admission services</p>
          </div>

          {/* 3 ZOMATO-STYLE FEATURE CARDS (JUST BELOW VIDEO) */}
          <div className="three-cards-grid">
            {/* CARD 1: Student Login */}
            <div className="gateway-card student-card" onClick={() => onOpenLogin('student')}>
              <div className="card-banner-img">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
                  alt="NIT Hamirpur Student Life"
                />
                <span className="card-image-badge">Active Session 2025-26</span>
              </div>
              <div className="card-body-content">
                <div className="card-title-row">
                  <div className="card-icon-bubble">
                    <span className="material-symbols-outlined">school</span>
                  </div>
                  <h3>Student Login</h3>
                </div>
                <p className="card-desc">
                  75% Attendance Compliance Dashboard, Faculty-Synced Registry, Timetable, Digital Hostel QR Gate Pass, Fee Receipts & SGPA Grade Cards.
                </p>
                <div className="card-footer-cta">
                  <span>Access Student Portal</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </div>

            {/* CARD 2: Staff / Faculty Login */}
            <div className="gateway-card staff-card" onClick={() => onOpenLogin('staff')}>
              <div className="card-banner-img">
                <img
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80"
                  alt="Academic Faculty Lecture Hall"
                />
                <span className="card-image-badge staff-badge">Academic Faculty</span>
              </div>
              <div className="card-body-content">
                <div className="card-title-row">
                  <div className="card-icon-bubble">
                    <span className="material-symbols-outlined">badge</span>
                  </div>
                  <h3>Staff / Faculty Login</h3>
                </div>
                <p className="card-desc">
                  Lecture Conduction Logs, Syllabus Completion %, Exam Units, Duty Leave Approvals & Quiz Scheduler.
                </p>
                <div className="card-footer-cta">
                  <span>Access Faculty Portal</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </div>

            {/* CARD 3: Admission Login (CUIMS Style) */}
            <div className="gateway-card admission-card" onClick={() => onOpenLogin('admission')}>
              <div className="card-banner-img">
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
                  alt="NIT Hamirpur Campus Entrance"
                />
                <span className="card-image-badge admission-badge">JoSAA / CSAB 2026</span>
              </div>
              <div className="card-body-content">
                <div className="card-title-row">
                  <div className="card-icon-bubble">
                    <span className="material-symbols-outlined">how_to_reg</span>
                  </div>
                  <h3>Admission Login</h3>
                </div>
                <p className="card-desc">
                  CUIMS-Style JoSAA/CSAB Applicant Portal: Document Verification, Seat Allotment Letter & Online Reporting.
                </p>
                <div className="card-footer-cta">
                  <span>Access Admission Portal</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </div>
          </div>

          {/* Official @nith.ac.in Registration Banner */}
          <div className="signup-callout-card" onClick={onOpenSignUp}>
            <div className="callout-left">
              <div className="callout-icon-box">
                <span className="material-symbols-outlined">mark_email_read</span>
              </div>
              <div>
                <h4>New Student or Staff Registration</h4>
                <p>
                  Activate your NITH-IS account using your official <strong>@nith.ac.in</strong> Google Workspace ID with OTP verification.
                </p>
              </div>
            </div>
            <button className="callout-signup-btn">
              <span>Sign Up with @nith.ac.in</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>

          {/* Quick Gemma 4 AI Launcher Banner */}
          <div className="gemma-promo-strip" onClick={onToggleGemma}>
            <div className="gemma-strip-left">
              <span className="material-symbols-outlined gemma-icon-sparkle">auto_awesome</span>
              <div>
                <strong>Powered by Google Gemma 4:</strong>
                <span>Ask Gemma 4 about Attendance Ordinance 7.2, Timetable Schedules, Dijkstra Algorithms, Gate Passes, or Exam Notes</span>
              </div>
            </div>
            <div className="gemma-strip-btn">
              <span>Launch Gemma 4 Copilot</span>
              <span className="material-symbols-outlined">open_in_new</span>
            </div>
          </div>
        </section>
      </main>

      {/* Institutional Footer */}
      <footer className="cu-portal-footer">
        <div className="footer-inner">
          <div className="footer-links">
            <a href="#">Anti-Ragging Undertaking</a>
            <span>•</span>
            <a href="#">NIRF 2026 Ranking</a>
            <span>•</span>
            <a href="#">National Academic Depository (NAD)</a>
            <span>•</span>
            <a href="#">Hostel Directorate</a>
            <span>•</span>
            <a href="#">Grievance Redressal Cell</a>
          </div>
          <div className="footer-copyright">
            © 2026 National Institute of Technology Hamirpur (H.P.) - 177005. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
