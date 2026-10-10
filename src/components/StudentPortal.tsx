"use client";

import React, { useState, useEffect } from "react";
import { Course, DepartmentInfo, UserAccount } from "@/lib/data";
import {
  computeStudentAttendance,
  ComputedStudentAttendance,
  loadLectureSessions,
  LectureSessionRecord,
  loadQuizzes,
  QuizItem
} from "@/lib/attendanceStore";

interface StudentPortalProps {
  onNavigateHome: () => void;
  activeDeptKey: string;
  onDeptChange: (key: string) => void;
  deptData: DepartmentInfo;
  courses: Course[];
  currentUser: UserAccount | null;
  onQuickAdjustAttendance?: (courseCode: string, deltaAttended: number, deltaTotal: number) => void;
  onOpenAttendanceModal?: () => void;
}

export default function StudentPortal({
  onNavigateHome,
  activeDeptKey,
  onDeptChange,
  deptData,
  courses,
  currentUser,
}: StudentPortalProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'attendance' | 'timetable' | 'grades' | 'notices' | 'codegemma'>('dashboard');
  const [activeDay, setActiveDay] = useState<string>("Wed");
  const [scheduleViewMode, setScheduleViewMode] = useState<'timeline' | 'matrix'>('timeline');

  // CodeGemma Lab State
  const [codeQuery, setCodeQuery] = useState("Dijkstra Algorithm in C++ with Min-Heap for CS-304 DAA Lab");
  const [codeLang, setCodeLang] = useState("cpp");
  const [codeResult, setCodeResult] = useState<string | null>(null);
  const [isCodeLoading, setIsCodeLoading] = useState(false);
  const [gemma2Advice, setGemma2Advice] = useState<string | null>(null);
  const [isGemma2Loading, setIsGemma2Loading] = useState(false);
  const [paligemmaVerified, setPaligemmaVerified] = useState(true);

  // Real-time Teacher-Linked Student Attendance
  const [studentAtt, setStudentAtt] = useState<ComputedStudentAttendance>(() =>
    computeStudentAttendance(currentUser?.roll_no_or_emp_id || currentUser?.email)
  );
  const [lectureSessions, setLectureSessions] = useState<LectureSessionRecord[]>(() =>
    loadLectureSessions()
  );
  const [quizzes, setQuizzes] = useState<QuizItem[]>(() => loadQuizzes());

  useEffect(() => {
    const handleSync = () => {
      const att = computeStudentAttendance(currentUser?.roll_no_or_emp_id || currentUser?.email);
      setStudentAtt(att);
      setLectureSessions(loadLectureSessions());
      setQuizzes(loadQuizzes());
    };
    handleSync();
    window.addEventListener("storage", handleSync);
    window.addEventListener("nith_attendance_updated", handleSync);
    window.addEventListener("nith_quiz_updated", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("nith_attendance_updated", handleSync);
      window.removeEventListener("nith_quiz_updated", handleSync);
    };
  }, [currentUser]);

  const overallPct = studentAtt.overallPercentage;
  const isOverallSafe = overallPct >= 75;

  // Timetable slots
  const slots = (deptData.timetable && deptData.timetable[activeDay]) || [];

  const studentName = currentUser?.full_name || "Yathartha Nagaych";
  const studentRoll = currentUser?.roll_no_or_emp_id || "26bce123";
  const studentMeta = `${studentRoll} • ${activeDeptKey} (Verified)`;
  const initials = studentName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div id="view-student" className="page-view active">
      <div className="ims-app">
        {/* Sidebar */}
        <aside className="ims-sidebar">
          <div className="sidebar-brand">
            <div className="brand-crest">
              <span className="material-symbols-outlined">school</span>
            </div>
            <div className="brand-name">
              <h1>NITH-IS</h1>
              <span>Student Portal</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
            >
              <span className="material-symbols-outlined">fact_check</span>
              <span>Attendance & Courses</span>
              <span className={`nav-badge ${isOverallSafe ? 'success' : 'alert'}`}>
                {overallPct}%
              </span>
            </button>
            <button
              className={`nav-item ${activeTab === 'timetable' ? 'active' : ''}`}
              onClick={() => setActiveTab('timetable')}
            >
              <span className="material-symbols-outlined">calendar_month</span>
              <span>Timetable & Schedule</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'grades' ? 'active' : ''}`}
              onClick={() => setActiveTab('grades')}
            >
              <span className="material-symbols-outlined">grade</span>
              <span>Grades & SGPA</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'notices' ? 'active' : ''}`}
              onClick={() => setActiveTab('notices')}
            >
              <span className="material-symbols-outlined">campaign</span>
              <span>Notices</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'codegemma' ? 'active' : ''}`}
              onClick={() => setActiveTab('codegemma')}
            >
              <span className="material-symbols-outlined">terminal</span>
              <span>CodeGemma Lab</span>
              <span className="nav-badge" style={{ background: "#4f46e5", color: "#fff", fontWeight: 700 }}>7B AI</span>
            </button>
          </nav>

          <div className="sidebar-user">
            <div className="user-avatar" id="sidebarAvatar">{initials}</div>
            <div className="user-meta">
              <strong id="sidebarStudentName">{studentName}</strong>
              <small id="sidebarStudentMeta">{studentMeta}</small>
            </div>
            <button
              className="logout-icon-btn"
              onClick={onNavigateHome}
              title="Logout to Home"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ims-main">
          <header className="ims-header">
            <div className="header-left">
              <div className="welcome-heading">
                <h2 id="studentPageTitle">
                  {activeTab === 'dashboard' && "Student Dashboard"}
                  {activeTab === 'attendance' && "Academic Attendance & Course Register"}
                  {activeTab === 'timetable' && "Weekly Lecture Schedule"}
                  {activeTab === 'grades' && "Academic Grades & SGPA"}
                  {activeTab === 'notices' && "Official Circulars & Notices"}
                </h2>
                <p>National Institute of Technology Hamirpur (H.P.)</p>
              </div>
            </div>
            <div className="header-right">
              {/* Branch / Department Switcher */}
              <div className="dept-quick-badge">
                <span className="material-symbols-outlined">account_tree</span>
                <label htmlFor="headerDeptSelect">Branch:</label>
                <select
                  id="headerDeptSelect"
                  value={activeDeptKey}
                  onChange={(e) => onDeptChange(e.target.value)}
                >
                  <option value="CE">Civil Engg (CE) • Sec D (F1)</option>
                  <option value="CSE">Computer Science (CSE) • Sec F (B2)</option>
                  <option value="ECE">Electronics (ECE) • Sec G (G1)</option>
                  <option value="EE">Electrical (EE) • Sec H (G2)</option>
                  <option value="ME">Mechanical (ME) • Sec B (G1)</option>
                  <option value="CHE">Chemical (CHE) • Sec I (F1)</option>
                  <option value="MSE">Materials (MSE) • Sec E (F2)</option>
                  <option value="MC">Maths & Comp (M&C) • Sec E (F2)</option>
                  <option value="ARCH">Architecture (B.Arch) • Sec Z (Studio I)</option>
                  <option value="DCS">Dual Degree CSE (DCS)</option>
                  <option value="DCE">Dual Degree ECE (DCE)</option>
                </select>
              </div>
              <div className="academic-session-pill">
                <span className="pulse-dot"></span>
                <span>Session: Jan - Jun 2026</span>
              </div>
              <button className="return-home-btn" onClick={onNavigateHome}>
                <span className="material-symbols-outlined">home</span>
                <span>Exit to Home</span>
              </button>
            </div>
          </header>

          <div className="content-scrollable">
            {/* SUB-TAB 1: DASHBOARD (EXACT IMAGE CONCEPT UI) */}
            {activeTab === 'dashboard' && (
              <section id="tab-dashboard" className="tab-pane active">
                {/* USER SPECIFIED EXACT CONCEPT UI WINDOW */}
                <div className="concept-dashboard-window">
                  <div className="window-top-bar">
                    <div className="window-dots">
                      <span className="dot red"></span>
                      <span className="dot yellow"></span>
                      <span className="dot green"></span>
                    </div>
                    <h3 className="window-title">Student Dashboard</h3>
                  </div>

                  <div className="window-body">
                    {/* Top 3 Pastel Summary Cards */}
                    <div className="concept-summary-grid">
                      <div className="concept-stat-card card-blue">
                        <span className="concept-stat-label">ATTENDANCE</span>
                        <div className="concept-stat-value">{studentAtt.overallPercentage}%</div>
                      </div>
                      <div className="concept-stat-card card-cream">
                        <span className="concept-stat-label">CGPA</span>
                        <div className="concept-stat-value">{studentAtt.cgpa.toFixed(1)}</div>
                      </div>
                      <div className="concept-stat-card card-mint">
                        <span className="concept-stat-label">NOTICES</span>
                        <div className="concept-stat-value">{String(studentAtt.noticesCount).padStart(2, '0')}</div>
                      </div>
                    </div>

                    {/* Section Heading: Subject-Wise Attendance */}
                    <div className="subject-heading-row">
                      <h4 className="subject-heading-text"><u>Subject-Wise Attendance</u></h4>
                      <span className="sync-chip">
                        <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>verified</span>
                        Directly Linked to Faculty Attendance Register
                      </span>
                    </div>

                    {/* Modern Colorful Vertical Bar Chart */}
                    <div className="concept-chart-container">
                      <div className="concept-chart-bars-wrap">
                        {studentAtt.subjects.slice(0, 5).map(sub => (
                          <div key={sub.code} className="chart-bar-column">
                            <div className="bar-track">
                              <div
                                className="bar-fill"
                                style={{
                                  height: `${Math.min(100, Math.max(16, sub.percentage))}%`,
                                  backgroundColor: sub.color,
                                }}
                                title={`${sub.code} (${sub.name}): ${sub.attended}/${sub.total} classes attended (${sub.percentage}%)`}
                              >
                                <span className="bar-pct-hover">{sub.percentage}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="chart-baseline"></div>
                      <div className="concept-bar-labels-row">
                        {studentAtt.subjects.slice(0, 5).map(sub => (
                          <span key={sub.code} className="bar-code-label">{sub.code}</span>
                        ))}
                      </div>
                    </div>

                    <div className="concept-footer-note">
                      Concept UI = Sample values for demonstration
                    </div>
                  </div>
                </div>

                {/* Additional Quick Status Cards */}
                <div className="dashboard-mid-grid">
                  <div className="card current-class-card">
                    <div className="card-head">
                      <div className="head-title">
                        <span className="material-symbols-outlined">schedule</span>
                        <h3>Upcoming Lecture</h3>
                      </div>
                      <span className="time-badge">{deptData.upcoming.inMins}</span>
                    </div>
                    <div className="class-alert-box">
                      <div className="class-time-large">{deptData.upcoming.time}</div>
                      <h4 className="class-title-large">{deptData.upcoming.subject}</h4>
                      <div className="class-meta-row">
                        <span>
                          <span className="material-symbols-outlined">location_on</span>
                          <span>{deptData.upcoming.room}</span>
                        </span>
                        <span>
                          <span className="material-symbols-outlined">person</span>
                          <span>{deptData.upcoming.faculty}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-head">
                      <div className="head-title">
                        <span className="material-symbols-outlined">verified_user</span>
                        <h3>Faculty Attendance Status</h3>
                      </div>
                      <span className="gate-status-pill">Locked & Verified</span>
                    </div>
                    <div className="watchlist-container">
                      {studentAtt.subjects.slice(0, 5).map(sub => {
                        const isSafe = sub.percentage >= 75;
                        return (
                          <div key={sub.code} className="watch-item">
                            <div className="watch-info">
                              <div className="watch-name">{sub.name}</div>
                              <span className="watch-code">{sub.code} • {sub.attended}/{sub.total} classes</span>
                              <div className="watch-bar-container">
                                <div
                                  className={`watch-bar ${isSafe ? 'safe' : 'danger'}`}
                                  style={{ width: `${Math.min(100, sub.percentage)}%`, backgroundColor: sub.color }}
                                ></div>
                              </div>
                            </div>
                            <div className="watch-right">
                              <div className={`watch-pct ${isSafe ? 'safe' : 'danger'}`}>{sub.percentage}%</div>
                              <span className={`stat-pill ${isSafe ? 'success' : 'warning'}`} style={{ fontSize: "0.72rem" }}>
                                {isSafe ? 'Compliant' : 'Shortage'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Quizzes and Upcoming Tests Section */}
                <div className="card" style={{ marginTop: "24px" }}>
                  <div className="card-head">
                    <div className="head-title">
                      <span className="material-symbols-outlined">quiz</span>
                      <h3>Scheduled Quizzes & Tests</h3>
                    </div>
                  </div>
                  <div style={{ overflowX: "auto", marginTop: "16px" }}>
                    <table id="quizTable" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                      <thead>
                        <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                          <th style={{ padding: "10px 14px" }}>Quiz Title</th>
                          <th style={{ padding: "10px 14px" }}>Course</th>
                          <th style={{ padding: "10px 14px" }}>Date</th>
                          <th style={{ padding: "10px 14px" }}>Time & Venue</th>
                          <th style={{ padding: "10px 14px" }}>Syllabus / Topics</th>
                          <th style={{ padding: "10px 14px" }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const studentQuizzes = quizzes.filter(q => courses.some(c => c.code === q.course) || q.course.includes("Selected"));
                          
                          if (studentQuizzes.length === 0) {
                            return (
                              <tr>
                                <td colSpan={6} style={{ textAlign: "center", padding: "16px", color: "#64748b" }}>No quizzes scheduled yet for your enrolled courses.</td>
                              </tr>
                            );
                          }
                          
                          return studentQuizzes.map(q => (
                            <tr key={q.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                            <td style={{ padding: "10px 14px", fontWeight: 700 }}>{q.name}</td>
                            <td style={{ padding: "10px 14px" }}>{q.course}</td>
                            <td style={{ padding: "10px 14px" }}>
                              <span className="quiz-date-pill" style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px", fontSize: "0.8rem" }}>
                                {q.date}
                              </span>
                            </td>
                            <td style={{ padding: "10px 14px" }}>{q.venue}</td>
                            <td style={{ padding: "10px 14px" }}>{q.topics}</td>
                            <td style={{ padding: "10px 14px" }}>
                              <span style={{
                                fontWeight: 700,
                                fontSize: "0.8rem",
                                color: q.status.includes("Upcoming") ? "#0369a1" : "#15803d"
                              }}>
                                {q.status}
                              </span>
                            </td>
                          </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* SUB-TAB 2: ATTENDANCE (OFFICIAL REGISTER - READ-ONLY & LINKED TO TEACHERS) */}
            {activeTab === 'attendance' && (
              <section id="tab-attendance" className="tab-pane active">
                <div className="card" style={{ marginBottom: "20px" }}>
                  <div className="card-head">
                    <div className="head-title">
                      <span className="material-symbols-outlined">lock</span>
                      <h3>Official Academic Attendance Register (Ordinance 7.2)</h3>
                    </div>
                    <span className="gate-status-pill">Faculty Controlled</span>
                  </div>
                  <div style={{ padding: "6px 0 16px 0" }}>
                    <p style={{ margin: "0 0 12px 0", color: "#475569", fontSize: "0.88rem" }}>
                      🔒 <strong>Protected Academic Record:</strong> Attendance is marked exclusively by faculty course instructors during scheduled lecture hours. Student attendance cannot be manually edited and directly synchronizes with instructors&apos; lecture records.
                    </p>
                    <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
                      <span className="sync-chip">
                        <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>done_all</span>
                        Overall Compliance: {studentAtt.overallPercentage}% ({studentAtt.overallPercentage >= 75 ? 'Safe / Eligible for Exams' : 'Shortage Notice'})
                      </span>
                      <span className="sync-chip" style={{ background: "#f8fafc", color: "#334155", borderColor: "#cbd5e1" }}>
                        Total Classes Attended: {studentAtt.totalAttended} / {studentAtt.totalHeld}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Course-Wise Attendance Cards (Strictly Read-Only) */}
                <div className="subjects-grid">
                  {studentAtt.subjects.map(c => {
                    const isSafe = c.percentage >= 75;
                    const needed = !isSafe ? Math.ceil((0.75 * c.total - c.attended) / 0.25) : 0;

                    return (
                      <div key={c.code} className="subject-card">
                        <div className="subject-head">
                          <div>
                            <h4 className="subject-name">{c.name}</h4>
                            <span className="subject-code">{c.code}</span>
                          </div>
                          <div className={`subject-pct-box ${isSafe ? 'pct-safe' : 'pct-danger'}`}>
                            {c.percentage}%
                          </div>
                        </div>
                        <div className="progress-container">
                          <div
                            className={`progress-bar ${isSafe ? 'bar-safe' : 'bar-danger'}`}
                            style={{ width: `${Math.min(100, c.percentage)}%`, backgroundColor: c.color }}
                          ></div>
                        </div>
                        <div className={`ordinance-verdict-box ${isSafe ? 'verdict-safe' : 'verdict-danger'}`} style={{ border: "none" }}>
                          <span>
                            {isSafe
                              ? `✓ Compliant: 75% attendance quota satisfied (${c.attended}/${c.total} classes)`
                              : `⚠️ Attendance Shortage: Must attend next ${needed} class(es) to meet 75%`}
                          </span>
                        </div>
                        <div className="subject-card-footer">
                          <span className="subject-classes-count">
                            Classes Held: <strong>{c.attended}</strong> / {c.total}
                          </span>
                          <span style={{ fontSize: "0.76rem", color: "#059669", fontWeight: 700 }}>
                            ✓ Verified by Faculty
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Faculty Marked Lecture Log */}
                <div className="card" style={{ marginTop: "24px" }}>
                  <div className="card-head">
                    <div className="head-title">
                      <span className="material-symbols-outlined">history_edu</span>
                      <h3>Recent Lectures Marked by Faculty</h3>
                    </div>
                    <span className="academic-session-pill">Live Synced</span>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
                      <thead>
                        <tr style={{ background: "#f8fafc", textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
                          <th style={{ padding: "12px 14px", color: "#475569" }}>Date</th>
                          <th style={{ padding: "12px 14px", color: "#475569" }}>Course</th>
                          <th style={{ padding: "12px 14px", color: "#475569" }}>Lecture Topic</th>
                          <th style={{ padding: "12px 14px", color: "#475569" }}>Instructor</th>
                          <th style={{ padding: "12px 14px", color: "#475569" }}>Your Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lectureSessions.slice(0, 8).map(sess => {
                          const userClean = (currentUser?.roll_no_or_emp_id || "26bcs015").toLowerCase();
                          const stud = sess.students.find(s => s.rollNo.toLowerCase().includes(userClean) || userClean.includes(s.rollNo.toLowerCase()));
                          const isPres = stud ? stud.isPresent : true;

                          return (
                            <tr key={sess.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                              <td style={{ padding: "12px 14px", fontWeight: 600 }}>{sess.date}</td>
                              <td style={{ padding: "12px 14px" }}><strong>{sess.courseCode}</strong></td>
                              <td style={{ padding: "12px 14px", color: "#334155" }}>{sess.topic}</td>
                              <td style={{ padding: "12px 14px", color: "#64748b" }}>{sess.facultyName} ({sess.room})</td>
                              <td style={{ padding: "12px 14px" }}>
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "3px 10px",
                                    borderRadius: "12px",
                                    fontSize: "0.76rem",
                                    fontWeight: 700,
                                    background: isPres ? "#ecfdf5" : "#fef2f2",
                                    color: isPres ? "#059669" : "#dc2626",
                                    border: `1px solid ${isPres ? '#a7f3d0' : '#fecaca'}`,
                                  }}
                                >
                                  {isPres ? "✓ Present" : "❌ Absent"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* SUB-TAB 3: TIMETABLE */}
            {activeTab === 'timetable' && (
              <section id="tab-timetable" className="tab-pane active">
                <div className="card">
                  <div className="card-head">
                    <div className="head-title">
                      <span className="material-symbols-outlined">event_note</span>
                      <h3>NIT Hamirpur Timetable: {deptData.name}</h3>
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                      <span className="gate-status-pill">{deptData.sectionCode} • {deptData.classroom}</span>
                      <a
                        href="/Time table 1st year_Updated.pdf"
                        download="NITH_Timetable_2026.pdf"
                        className="btn btn-outline"
                        style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>download</span>
                        <span>Official PDF</span>
                      </a>
                    </div>
                  </div>

                  {/* 1-Tap Department Switcher Pills */}
                  <div style={{ marginTop: "14px", marginBottom: "16px" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px" }}>
                      Select Department to View Official Class Schedule:
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {[
                        { key: "CE", label: "Civil (CE)", sec: "Sec D (F1)" },
                        { key: "CSE", label: "Computer Science (CSE)", sec: "Sec F (B2)" },
                        { key: "ECE", label: "Electronics (ECE)", sec: "Sec G (G1)" },
                        { key: "EE", label: "Electrical (EE)", sec: "Sec H (G2)" },
                        { key: "ME", label: "Mechanical (ME)", sec: "Sec B (G1)" },
                        { key: "CHE", label: "Chemical (CHE)", sec: "Sec I (F1)" },
                        { key: "MSE", label: "Materials (MSE)", sec: "Sec E (F2)" },
                        { key: "MC", label: "Maths & Comp (M&C)", sec: "Sec E (F2)" },
                        { key: "ARCH", label: "Architecture (B.Arch)", sec: "Sec Z (Studio I)" },
                      ].map(d => (
                        <button
                          key={d.key}
                          type="button"
                          onClick={() => onDeptChange(d.key)}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "20px",
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            border: activeDeptKey === d.key ? "2px solid var(--nith-crimson)" : "1px solid #cbd5e1",
                            background: activeDeptKey === d.key ? "var(--nith-crimson)" : "#fff",
                            color: activeDeptKey === d.key ? "#fff" : "var(--text-primary)",
                            boxShadow: activeDeptKey === d.key ? "0 2px 8px rgba(185,28,28,0.25)" : "none"
                          }}
                        >
                          {d.label} • <span style={{ opacity: 0.85, fontSize: "0.75rem" }}>{d.sec}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Section & Classroom Details Banner */}
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px 18px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ background: "var(--nith-navy)", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700 }}>
                          {deptData.sectionCode}
                        </span>
                        <strong style={{ fontSize: "0.98rem", color: "var(--text-primary)" }}>{deptData.name}</strong>
                      </div>
                      <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                        🏛️ <strong>Classroom Location:</strong> {deptData.classroom} • 👥 <strong>Roll Range:</strong> {deptData.rollRange}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        className={`btn ${scheduleViewMode === 'timeline' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: "6px 14px", fontSize: "0.82rem" }}
                        onClick={() => setScheduleViewMode('timeline')}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>view_day</span>
                        <span>Daily Timeline</span>
                      </button>
                      <button
                        type="button"
                        className={`btn ${scheduleViewMode === 'matrix' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: "6px 14px", fontSize: "0.82rem" }}
                        onClick={() => setScheduleViewMode('matrix')}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>grid_view</span>
                        <span>Weekly Matrix</span>
                      </button>
                    </div>
                  </div>

                  {/* MODE 1: DAILY TIMELINE */}
                  {scheduleViewMode === 'timeline' && (
                    <>
                      {/* Day Switcher */}
                      <div className="day-switcher" id="daySwitcher" style={{ display: "flex", gap: "8px", margin: "14px 0" }}>
                        {["Mon", "Tue", "Wed", "Thu", "Fri"].map(day => (
                          <button
                            key={day}
                            type="button"
                            className={`day-btn ${activeDay === day ? 'active' : ''}`}
                            onClick={() => setActiveDay(day)}
                            style={{
                              padding: "8px 18px",
                              borderRadius: "8px",
                              border: activeDay === day ? "2px solid var(--nith-navy)" : "1px solid #cbd5e1",
                              background: activeDay === day ? "var(--nith-navy)" : "#fff",
                              color: activeDay === day ? "#fff" : "var(--text-primary)",
                              fontWeight: 700,
                              cursor: "pointer"
                            }}
                          >
                            {day}
                          </button>
                        ))}
                      </div>

                      {/* Timeline Slots */}
                      <div className="timetable-timeline" id="timetableTimeline">
                        {slots.length === 0 ? (
                          <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>
                            No lectures scheduled for {activeDay} in {deptData.name}.
                          </div>
                        ) : (
                          slots.map((s, idx) => (
                            <div key={idx} className={`timeline-slot ${s.active ? 'active-lecture' : ''}`}>
                              <div className="slot-time">{s.time}</div>
                              <div className="slot-body">
                                <div>
                                  <h4 className="slot-title">{s.subject}</h4>
                                  <p className="slot-faculty">{s.faculty}</p>
                                </div>
                                <div className="slot-location">
                                  <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#b91c1c" }}>
                                    location_on
                                  </span>
                                  <span>{s.room}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </>
                  )}

                  {/* MODE 2: FULL WEEKLY MATRIX TABLE (Monday to Friday) */}
                  {scheduleViewMode === 'matrix' && (
                    <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: "10px", marginTop: "14px" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                        <thead>
                          <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                            <th style={{ padding: "10px 14px", width: "90px" }}>Day</th>
                            <th style={{ padding: "10px 14px" }}>Scheduled Lecture Periods & Practical Conduction</th>
                          </tr>
                        </thead>
                        <tbody>
                          {["Mon", "Tue", "Wed", "Thu", "Fri"].map(day => {
                            const daySlots = (deptData.timetable && deptData.timetable[day]) || [];
                            return (
                              <tr key={day} style={{ borderBottom: "1px solid #e2e8f0" }}>
                                <td style={{ padding: "12px 14px", fontWeight: 800, background: "#f8fafc", color: "var(--nith-navy)" }}>
                                  {day}
                                </td>
                                <td style={{ padding: "12px 14px" }}>
                                  {daySlots.length === 0 ? (
                                    <span style={{ color: "var(--text-muted)" }}>No classes scheduled</span>
                                  ) : (
                                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                      {daySlots.map((slot, sIdx) => (
                                        <div
                                          key={sIdx}
                                          style={{
                                            background: slot.active ? "#eff6ff" : "#fff",
                                            border: slot.active ? "1.5px solid #2563eb" : "1px solid #cbd5e1",
                                            padding: "8px 12px",
                                            borderRadius: "8px",
                                            minWidth: "200px"
                                          }}
                                        >
                                          <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--nith-crimson)" }}>
                                            ⏰ {slot.time}
                                          </div>
                                          <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)", marginTop: "2px" }}>
                                            {slot.subject}
                                          </div>
                                          <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "2px" }}>
                                            👨‍🏫 {slot.faculty}
                                          </div>
                                          <div style={{ fontSize: "0.74rem", color: "var(--nith-navy)", fontWeight: 600, marginTop: "2px" }}>
                                            📍 {slot.room}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            )}



            {/* SUB-TAB 5: GRADES & SGPA */}
            {activeTab === 'grades' && (
              <section id="tab-grades" className="tab-pane active">
                <div className="card">
                  <div className="card-head">
                    <div className="head-title">
                      <span className="material-symbols-outlined">workspace_premium</span>
                      <h3>Academic Performance & SGPA Grade Cards</h3>
                    </div>
                    <span className="gate-status-pill" style={{ background: "#e0f2fe", color: "#0369a1" }}>
                      Current CGPA: 8.74 / 10.0
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px", margin: "16px 0" }}>
                    {[
                      { sem: "Sem 1", sgpa: "8.42", credits: "22" },
                      { sem: "Sem 2", sgpa: "8.65", credits: "22" },
                      { sem: "Sem 3", sgpa: "8.78", credits: "24" },
                      { sem: "Sem 4", sgpa: "8.90", credits: "24" },
                      { sem: "Sem 5", sgpa: "8.85 (Est.)", credits: "22" },
                    ].map((s, i) => (
                      <div key={i} style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px", textAlign: "center", border: "1px solid #e2e8f0" }}>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{s.sem}</div>
                        <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--nith-navy)", margin: "4px 0", fontFamily: "var(--font-mono)" }}>
                          {s.sgpa}
                        </div>
                        <small style={{ fontSize: "0.74rem", color: "var(--text-secondary)" }}>Credits: {s.credits}</small>
                      </div>
                    ))}
                  </div>

                  <div style={{ overflowX: "auto", marginTop: "16px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                      <thead>
                        <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                          <th style={{ padding: "10px 14px" }}>Course Code</th>
                          <th style={{ padding: "10px 14px" }}>Course Name</th>
                          <th style={{ padding: "10px 14px" }}>Credits</th>
                          <th style={{ padding: "10px 14px" }}>Letter Grade</th>
                          <th style={{ padding: "10px 14px" }}>Grade Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map(c => (
                          <tr key={c.code} style={{ borderBottom: "1px solid #e2e8f0" }}>
                            <td style={{ padding: "10px 14px", fontWeight: 700 }}>{c.code}</td>
                            <td style={{ padding: "10px 14px" }}>{c.name}</td>
                            <td style={{ padding: "10px 14px" }}>{c.credits}</td>
                            <td style={{ padding: "10px 14px" }}>
                              <span style={{ background: "#dcfce7", color: "#15803d", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
                                A
                              </span>
                            </td>
                            <td style={{ padding: "10px 14px", fontWeight: 700 }}>9 / 10</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => alert("Downloading Official SGPA Provisional Grade Sheet (PDF)...")}
                    >
                      <span className="material-symbols-outlined">download</span>
                      <span>Download Grade Sheet</span>
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => alert("Downloading Semester Fee Receipt...")}
                    >
                      <span className="material-symbols-outlined">receipt_long</span>
                      <span>Download Fee Receipt</span>
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* SUB-TAB 6: NOTICES */}
            {activeTab === 'notices' && (
              <section id="tab-notices" className="tab-pane active">
                <div className="card">
                  <div className="card-head">
                    <div className="head-title">
                      <span className="material-symbols-outlined">campaign</span>
                      <h3>Dean Academic Affairs (DoAA) Notices & Circulars</h3>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
                    {[
                      {
                        title: "Mandatory 75% Attendance Compliance Rule for End-Term Examinations Even Semester 2026",
                        date: "08 Oct 2026",
                        tag: "Academic Ordinance",
                        color: "#b91c1c"
                      },
                      {
                        title: "Guidelines for End-Term Examination Schedule & Central Library Extended Hours",
                        date: "05 Oct 2026",
                        tag: "Academic Directorate",
                        color: "#0369a1"
                      },
                      {
                        title: "B.Tech & B.Arch Mid-Semester Examination Schedule & Room Allocation Matrix",
                        date: "01 Oct 2026",
                        tag: "Examination Cell",
                        color: "#15803d"
                      },
                      {
                        title: "NEP 2020 First Year Curriculum Revision and Open Elective Basket Registration",
                        date: "26 Sep 2026",
                        tag: "Curriculum Cell",
                        color: "#7c3aed"
                      }
                    ].map((n, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: "#f8fafc",
                          padding: "16px",
                          borderRadius: "10px",
                          border: "1px solid #e2e8f0",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "10px"
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: `${n.color}15`, color: n.color }}>
                              {n.tag}
                            </span>
                            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{n.date}</span>
                          </div>
                          <h4 style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>{n.title}</h4>
                        </div>
                        <button
                          className="btn btn-outline"
                          onClick={() => alert(`Opening PDF circular: "${n.title}"...`)}
                          style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>visibility</span>
                          <span>View Circular</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* SUB-TAB 7: CODEGEMMA ENGINEERING LAB */}
            {activeTab === 'codegemma' && (
              <section id="tab-codegemma" className="tab-pane active">
                <div className="card">
                  <div className="card-head">
                    <div className="head-title">
                      <span className="material-symbols-outlined" style={{ color: "#4f46e5" }}>terminal</span>
                      <div>
                        <h3 style={{ margin: 0 }}>Google CodeGemma 4 (7.2B) Engineering Lab</h3>
                        <small style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                          Powered by <code>google/codegemma-4-7b-it</code> • Official NIT Hamirpur CS & Engineering Practical Copilot
                        </small>
                      </div>
                    </div>
                    <span className="gate-status-pill" style={{ background: "#ede9fe", color: "#6d28d9" }}>
                      7.2B Code Weights Active
                    </span>
                  </div>

                  {/* Preset Lab Modules */}
                  <div style={{ marginTop: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[
                      { label: "Dijkstra C++ (CS-304 DAA)", q: "Explain Dijkstra's Algorithm in C++ with Min-Priority Queue for CS-304 DAA Lab." },
                      { label: "Banker's Algorithm (CS-302 OS)", q: "Implement Banker's Algorithm for deadlock avoidance in C++ for CS-302 Operating Systems." },
                      { label: "QuickSort Partitioning", q: "Write Hoare's vs Lomuto partitioning for QuickSort with asymptotic analysis." },
                      { label: "Verilog 4-Bit ALU", q: "Write Verilog HDL module for 4-bit Arithmetic Logic Unit (ALU) with behavioral testbench." },
                    ].map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        className="btn btn-outline"
                        style={{ fontSize: "0.78rem", padding: "6px 12px", background: "#f8fafc" }}
                        onClick={() => {
                          setCodeQuery(preset.q);
                        }}
                      >
                        ⚡ {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Code Query Box */}
                  <div style={{ marginTop: "16px" }}>
                    <label style={{ display: "block", fontWeight: 700, fontSize: "0.88rem", marginBottom: "6px" }}>
                      Engineering Problem or Code to Synthesize / Debug:
                    </label>
                    <textarea
                      rows={3}
                      value={codeQuery}
                      onChange={(e) => setCodeQuery(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.85rem",
                      }}
                      placeholder="Enter algorithmic query, paste C++/Python code, or ask for complexity proof..."
                    />
                    <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        CodeGemma 4 weights analyze syntax, time complexity O(N), and compile-time issues.
                      </span>
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={isCodeLoading}
                        onClick={async () => {
                          if (!codeQuery.trim()) return;
                          setIsCodeLoading(true);
                          try {
                            const res = await fetch("/api/gemma", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                model: "codegemma",
                                query: codeQuery,
                              })
                            });
                            const data = await res.json();
                            setCodeResult(data.responseHtml || "<p>Analysis complete.</p>");
                          } catch {
                            setCodeResult("<p>⚠️ Error invoking CodeGemma 4 engine. Please try again.</p>");
                          } finally {
                            setIsCodeLoading(false);
                          }
                        }}
                      >
                        <span className="material-symbols-outlined">play_arrow</span>
                        <span>{isCodeLoading ? "CodeGemma 4 Compiling..." : "Run CodeGemma 4"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Code Result Display */}
                  {codeResult && (
                    <div style={{ marginTop: "20px", padding: "16px", background: "#0f172a", color: "#f8fafc", borderRadius: "10px", border: "1px solid #334155" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", borderBottom: "1px solid #334155", paddingBottom: "8px" }}>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#818cf8" }}>
                          💻 CODEGEMMA 4 SYNTHESIS RESULT (google/codegemma-4-7b-it):
                        </span>
                        <button
                          type="button"
                          onClick={() => setCodeResult(null)}
                          style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "18px" }}
                        >&times;</button>
                      </div>
                      <div dangerouslySetInnerHTML={{ __html: codeResult }} />
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
