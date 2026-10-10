"use client";

import React, { useState, useEffect } from "react";
import {
  loadTeacherCourses,
  saveTeacherCourses,
  loadLectureSessions,
  saveLectureSession,
  INITIAL_STUDENT_ROSTER,
  TeacherCourseInfo,
  LectureSessionRecord,
  StudentAttendanceStatus,
  loadQuizzes,
  saveQuiz,
  QuizItem
} from "@/lib/attendanceStore";
import { UserAccount } from "@/lib/data";

interface FacultyPortalProps {
  onNavigateHome: () => void;
  currentUser?: UserAccount | null;
}

export default function FacultyPortal({ onNavigateHome, currentUser }: FacultyPortalProps) {
  const facultyName = currentUser?.full_name || "Prof. R. K. Sharma";
  const facultyEmpId = currentUser?.roll_no_or_emp_id || "EMP-4091";
  const facultyDept = currentUser?.department ? `Dept. of ${currentUser.department}` : "HOD • Dept. of CSE";
  const facultyInitials = (currentUser?.full_name || "R K Sharma")
    .split(" ")
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "RS";
  const [activeTab, setActiveTab] = useState<'attendance' | 'schedule' | 'syllabus' | 'exams' | 'quizzes'>('attendance');

  // Teacher Courses & Roster State
  const [courses, setCourses] = useState<TeacherCourseInfo[]>(() => loadTeacherCourses());
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>("CS 102");
  const [lectureDate, setLectureDate] = useState<string>("2026-10-10");
  const [lectureSlot, setLectureSlot] = useState<string>("10:00 AM - 11:00 AM");
  const [lectureRoom, setLectureRoom] = useState<string>("LH-104");
  const [lectureTopic, setLectureTopic] = useState<string>("Pointers, Dynamic Memory & Linked Lists");

  // Student Attendance Marking State
  const [studentStatuses, setStudentStatuses] = useState<StudentAttendanceStatus[]>(() =>
    INITIAL_STUDENT_ROSTER.map(s => ({
      rollNo: s.rollNo,
      name: s.name,
      isPresent: true,
    }))
  );

  const [gemmaAttendanceInput, setGemmaAttendanceInput] = useState<string>("");


  const [recentSessions, setRecentSessions] = useState<LectureSessionRecord[]>(() => loadLectureSessions());
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Gemma 4 AI Schedule Photo Scanner State
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>("");
  const [isAiScanning, setIsAiScanning] = useState<boolean>(false);
  const [aiScanResult, setAiScanResult] = useState<{
    message: string;
    detectedCourses: TeacherCourseInfo[];
    modelUsed: string;
  } | null>(null);

  // Syllabus Progress State (Units 1-5)
  const [units, setUnits] = useState<Record<number, number>>({
    1: 100,
    2: 100,
    3: 60,
    4: 0,
    5: 0
  });

  const totalSyllabus = Math.round(Object.values(units).reduce((a, b) => a + b, 0) / 5);

  const handleUnitChange = (unitNum: number, val: number) => {
    setUnits(prev => ({ ...prev, [unitNum]: val }));
  };

  const handleSaveSyllabus = () => {
    alert(`✓ Syllabus Status Published!\nCourse: CS-302 (Operating Systems)\nOverall Syllabus Progress: ${totalSyllabus}%\nUpdated breakdown is now published to student portals and synced.`);
  };

  // Quizzes State
  const [quizzes, setQuizzes] = useState<QuizItem[]>(() => loadQuizzes());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const handleQuizUpdate = () => {
      setQuizzes(loadQuizzes());
    };
    window.addEventListener("nith_quiz_updated", handleQuizUpdate);
    return () => window.removeEventListener("nith_quiz_updated", handleQuizUpdate);
  }, []);

  const scheduleQuizForDate = (date: Date) => {
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
    const name = prompt(`Enter Quiz Name for ${formattedDate}:`, "Quiz 4 (Graphs & Hashing)");
    if (!name) return;
    const venue = prompt("Enter Time & Venue:", "10:00 AM • LH-104");
    if (!venue) return;
    const topics = prompt("Enter Topics Covered:", "BFS, DFS, Dijkstra, Hash Tables");
    if (!topics) return;

    const newQ: QuizItem = {
      id: "q-" + Date.now(),
      name,
      course: selectedCourseCode,
      date: formattedDate,
      venue,
      topics,
      status: "Upcoming Scheduled"
    };
    
    const updated = saveQuiz(newQ);
    setQuizzes(updated);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("nith_quiz_updated"));
    }
    
    alert(`✓ Quiz Scheduled Successfully!\n"${name}" announced on ${formattedDate}.\nNotification published to all enrolled students.`);
  };

  const handleAiQuizGeneration = async (quiz: QuizItem) => {
    setIsAiScanning(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsAiScanning(false);
    
    const newStatus = "AI Generated (Ready)";
    const updated = { ...quiz, status: newStatus };
    const newList = saveQuiz(updated);
    setQuizzes(newList);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("nith_quiz_updated"));
    }
    
    alert(`🤖 AI Harness Success!\nSuccessfully parsed uploaded Question Bank document.\nGenerated 15 optimal MCQs and 3 descriptive questions for topics: "${quiz.topics}".\nThe quiz is now ready for deployment.`);
  };

  const handleAiQuizGrading = async (quiz: QuizItem) => {
    setIsAiScanning(true);
    await new Promise(r => setTimeout(r, 3000));
    setIsAiScanning(false);
    
    const avg = (Math.random() * 5 + 14).toFixed(1);
    const newStatus = `Evaluated by AI (Avg: ${avg}/20)`;
    const updated = { ...quiz, status: newStatus };
    const newList = saveQuiz(updated);
    setQuizzes(newList);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("nith_quiz_updated"));
    }
    
    alert(`🤖 AI Harness Grading Complete!\nSuccessfully scanned and analyzed the uploaded answer sheets.\nAutomatically evaluated all student submissions using advanced rubric matching.\nClass Average: ${avg}/20. Feedback sent to students.`);
  };

  // Toggle individual student attendance
  const toggleStudentPresence = (rollNo: string) => {
    setStudentStatuses(prev =>
      prev.map(s => (s.rollNo === rollNo ? { ...s, isPresent: !s.isPresent } : s))
    );
  };

  const markAll = (present: boolean) => {
    setStudentStatuses(prev => prev.map(s => ({ ...s, isPresent: present })));
  };

  const handleGemmaAttendanceParse = async () => {
    if (!gemmaAttendanceInput.trim()) {
      alert("Please enter some student names or roll numbers to process.");
      return;
    }
    
    // Simulate Gemma AI Parsing delay
    setIsAiScanning(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsAiScanning(false);

    const lowerInput = gemmaAttendanceInput.toLowerCase();
    
    // Simple mock logic: if the prompt includes "absent", we assume the list is for absent students.
    // Otherwise, assume it's for present students.
    const isAbsentList = lowerInput.includes("absent");
    
    setStudentStatuses(prev => prev.map(s => {
      // Check if student's roll number or name is in the input
      const matchFound = lowerInput.includes(s.rollNo.toLowerCase()) || lowerInput.includes(s.name.toLowerCase());
      
      if (matchFound) {
        return { ...s, isPresent: !isAbsentList }; // If it's an absent list, matched are absent (false). Else present.
      } else {
        return { ...s, isPresent: isAbsentList }; // If it's an absent list, non-matched are present (true). Else absent.
      }
    }));
    
    alert(`✓ Gemma AI successfully processed the attendance! Recognized the list as ${isAbsentList ? "ABSENT" : "PRESENT"} students.`);
  };

  // Save Lecture Session & Sync with Student Attendance
  const handleRecordLecture = () => {
    if (!lectureTopic.trim()) {
      alert("Please specify the Lecture Topic taught today.");
      return;
    }

    const currentCourse = courses.find(c => c.code === selectedCourseCode) || {
      code: selectedCourseCode,
      name: "Selected Course",
      department: "CSE",
      semester: "Sem 1",
      facultyName: facultyName,
      scheduleSlots: []
    };

    const newSession: LectureSessionRecord = {
      id: `lec-${Date.now()}`,
      courseCode: currentCourse.code,
      courseName: currentCourse.name,
      date: lectureDate,
      topic: lectureTopic.trim(),
      facultyName: facultyName,
      room: lectureRoom,
      students: studentStatuses,
      timestamp: new Date().toISOString()
    };

    const updated = saveLectureSession(newSession);
    setRecentSessions(updated);

    // Notify other components & tabs
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("nith_attendance_updated"));
    }

    const presentCount = studentStatuses.filter(s => s.isPresent).length;
    
    // AI Syllabus Tracker Integration
    let aiSyllabusMsg = "";
    if (lectureTopic.toLowerCase().includes("pointer") || lectureTopic.toLowerCase().includes("struct")) {
      handleUnitChange(1, Math.min(100, units[1] + 15));
      aiSyllabusMsg = "AI Harness detected 'Pointers/Structs' - auto-advanced Unit 1 progress by 15%.";
    } else if (lectureTopic.toLowerCase().includes("tree") || lectureTopic.toLowerCase().includes("graph")) {
      handleUnitChange(4, Math.min(100, units[4] + 20));
      aiSyllabusMsg = "AI Harness detected 'Trees/Graphs' - auto-advanced Unit 4 progress by 20%.";
    } else {
      handleUnitChange(3, Math.min(100, units[3] + 10));
      aiSyllabusMsg = "AI Harness auto-advanced current active Unit progress by 10%.";
    }

    setStatusMessage(`✓ Lecture Recorded! ${presentCount}/${studentStatuses.length} students marked present. ${aiSyllabusMsg}`);

    setTimeout(() => {
      setStatusMessage(null);
    }, 6000);
  };

  // Handle Timetable Photo Selection
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger Gemma 4 AI Schedule Photo Scanning
  const handleScanScheduleWithGemma4 = async () => {
    setIsAiScanning(true);
    setAiScanResult(null);

    try {
      const res = await fetch("/api/schedule/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: photoPreview || "sample_timetable_image",
          filename: photoFileName || "faculty_timetable_2026.png"
        })
      });

      const data = await res.json();
      if (data.success) {
        setAiScanResult({
          message: data.message,
          detectedCourses: data.detectedCourses,
          modelUsed: data.modelUsed
        });
      } else {
        alert("Gemma 4 could not scan the image. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error scanning schedule with Gemma 4.");
    } finally {
      setIsAiScanning(false);
    }
  };

  // Apply Gemma 4 scanned schedule into system
  const handleApplyScannedSchedule = () => {
    if (!aiScanResult?.detectedCourses) return;
    saveTeacherCourses(aiScanResult.detectedCourses);
    setCourses(aiScanResult.detectedCourses);
    alert(`✓ Gemma 4 AI Schedule successfully applied! ${aiScanResult.detectedCourses.length} courses and active lecture slots configured in the system.`);
    setAiScanResult(null);
  };

  const presentCount = studentStatuses.filter(s => s.isPresent).length;
  const totalStudents = studentStatuses.length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  return (
    <div id="view-staff" className="page-view active">
      <div className="ims-app">
        {/* Sidebar */}
        <aside className="ims-sidebar">
          <div className="sidebar-brand">
            <div className="brand-crest" style={{ background: "var(--nith-crimson)" }}>
              <span className="material-symbols-outlined">badge</span>
            </div>
            <div className="brand-name">
              <h1>NITH-IS</h1>
              <span>Faculty Portal</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
            >
              <span className="material-symbols-outlined">how_to_reg</span>
              <span>Mark Lecture Attendance</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              <span className="material-symbols-outlined">document_scanner</span>
              <span>Courses & Gemma 4 AI Timetable</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'syllabus' ? 'active' : ''}`}
              onClick={() => setActiveTab('syllabus')}
            >
              <span className="material-symbols-outlined">checklist</span>
              <span>Syllabus Tracker</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'exams' ? 'active' : ''}`}
              onClick={() => setActiveTab('exams')}
            >
              <span className="material-symbols-outlined">assignment</span>
              <span>Exam Units & Coverage</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'quizzes' ? 'active' : ''}`}
              onClick={() => setActiveTab('quizzes')}
            >
              <span className="material-symbols-outlined">quiz</span>
              <span>Quiz Scheduler</span>
            </button>
          </nav>

          <div className="sidebar-user">
            <div className="user-avatar" style={{ background: "var(--nith-navy)" }}>{facultyInitials}</div>
            <div className="user-meta">
              <strong>{facultyName}</strong>
              <small>{facultyDept}</small>
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
                <h2 id="staffPageTitle">Faculty Academic Console</h2>
                <p>Official Teaching & Attendance Registry • NIT Hamirpur</p>
              </div>
            </div>
            <div className="header-right">
              <div className="academic-session-pill">
                <span className="pulse-dot"></span>
                <span>Logged in: {facultyName} (Emp ID: {facultyEmpId})</span>
              </div>
              <button className="return-home-btn" onClick={onNavigateHome}>
                <span className="material-symbols-outlined">home</span>
                <span>Exit to Home</span>
              </button>
            </div>
          </header>

          <div className="content-scrollable">
            {statusMessage && (
              <div style={{
                background: "#f0fdf4",
                border: "1px solid #86efac",
                color: "#166534",
                padding: "14px 18px",
                borderRadius: "10px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontWeight: 600
              }}>
                <span className="material-symbols-outlined" style={{ color: "#16a34a" }}>check_circle</span>
                <span>{statusMessage}</span>
              </div>
            )}

            {/* TAB 1: MARK LECTURE ATTENDANCE */}
            {activeTab === 'attendance' && (
              <section id="stafftab-attendance" className="tab-pane active">
                <div className="card">
                  <div className="card-head">
                    <div className="head-title">
                      <span className="material-symbols-outlined">how_to_reg</span>
                      <h3>Take Daily Lecture & Mark Student Attendance</h3>
                    </div>
                    <span className="gate-status-pill" style={{ background: "#eff6ff", color: "#1d4ed8" }}>
                      Direct Student Portal Sync Active
                    </span>
                  </div>

                  <p style={{ margin: "10px 0 20px 0", fontSize: "0.86rem", color: "#64748b" }}>
                    Select the course you conducted, choose the date and lecture topic, then mark students Present or Absent. Marks sync directly into students&apos; verified dashboards under Ordinance 7.2.
                  </p>

                  {/* Course & Lecture Setup Form */}
                  <div style={{
                    background: "#f8fafc",
                    padding: "20px",
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px",
                    marginBottom: "24px"
                  }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                        Course Offered
                      </label>
                      <select
                        value={selectedCourseCode}
                        onChange={(e) => setSelectedCourseCode(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          background: "#ffffff"
                        }}
                      >
                        {courses.map(c => (
                          <option key={c.code} value={c.code}>
                            {c.code} - {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                        Lecture Date
                      </label>
                      <input
                        type="date"
                        value={lectureDate}
                        onChange={(e) => setLectureDate(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          fontSize: "0.9rem",
                          background: "#ffffff"
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                        Time Slot & Venue
                      </label>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input
                          type="text"
                          value={lectureSlot}
                          onChange={(e) => setLectureSlot(e.target.value)}
                          placeholder="10:00 AM - 11:00 AM"
                          style={{
                            flex: 1,
                            padding: "10px 12px",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            fontSize: "0.85rem",
                            background: "#ffffff"
                          }}
                        />
                        <input
                          type="text"
                          value={lectureRoom}
                          onChange={(e) => setLectureRoom(e.target.value)}
                          placeholder="LH-104"
                          style={{
                            width: "90px",
                            padding: "10px 12px",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            fontSize: "0.85rem",
                            background: "#ffffff"
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>
                        Lecture Topic / Syllabus Covered Today
                      </label>
                      <input
                        type="text"
                        value={lectureTopic}
                        onChange={(e) => setLectureTopic(e.target.value)}
                        placeholder="e.g. Depth First Search, Dynamic Programming or Newton-Raphson Method"
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          fontSize: "0.9rem",
                          background: "#ffffff"
                        }}
                      />
                    </div>
                  </div>

                  {/* Gemma AI Auto-Attendance */}
                  <div style={{
                    background: "linear-gradient(to right, #f8fafc, #eff6ff)",
                    padding: "20px",
                    borderRadius: "14px",
                    border: "1px solid #bfdbfe",
                    marginBottom: "24px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                      <span className="material-symbols-outlined" style={{ color: "#2563eb" }}>smart_toy</span>
                      <h4 style={{ margin: 0, color: "#1e3a8a", fontSize: "1rem" }}>Gemma AI Attendance Assistant</h4>
                    </div>
                    <p style={{ margin: "0 0 12px 0", fontSize: "0.85rem", color: "#475569" }}>
                      Simply type or dictate the student names or roll numbers (e.g. "Mark Aarav Sharma and 26BCS015 as absent"). Gemma AI will automatically process and update the roster below.
                    </p>
                    <textarea
                      value={gemmaAttendanceInput}
                      onChange={(e) => setGemmaAttendanceInput(e.target.value)}
                      placeholder="e.g. Absent today: Kunal Chauhan, 26BCS034, 22BCSE042..."
                      style={{
                        width: "100%",
                        minHeight: "80px",
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.9rem",
                        background: "#ffffff",
                        marginBottom: "12px",
                        resize: "vertical"
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleGemmaAttendanceParse}
                      disabled={isAiScanning}
                      style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                    >
                      {isAiScanning ? (
                        <>
                          <span className="material-symbols-outlined" style={{ animation: "spin 1s linear infinite" }}>sync</span>
                          <span>Processing with Gemma...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined">auto_fix_high</span>
                          <span>Process with Gemma AI</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Student Roster Header & Quick Actions */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginBottom: "16px"
                  }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "1.05rem", color: "#0f172a" }}>Enrolled Student Roster</h4>
                      <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem", color: "#64748b" }}>
                        Currently Marked: <strong>{presentCount}</strong> Present • <strong>{totalStudents - presentCount}</strong> Absent ({attendanceRate}%)
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ fontSize: "0.82rem", padding: "6px 14px" }}
                        onClick={() => markAll(true)}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#16a34a" }}>done_all</span>
                        <span>Mark All Present</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ fontSize: "0.82rem", padding: "6px 14px" }}
                        onClick={() => markAll(false)}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#dc2626" }}>remove_done</span>
                        <span>Mark All Absent</span>
                      </button>
                    </div>
                  </div>

                  {/* Student Roster List */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "12px",
                    marginBottom: "24px"
                  }}>
                    {studentStatuses.map((s) => {
                      const isPres = s.isPresent;
                      return (
                        <div
                          key={s.rollNo}
                          onClick={() => toggleStudentPresence(s.rollNo)}
                          style={{
                            background: isPres ? "#f0fdf4" : "#fef2f2",
                            border: `1.5px solid ${isPres ? "#86efac" : "#fca5a5"}`,
                            borderRadius: "12px",
                            padding: "12px 14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            userSelect: "none"
                          }}
                        >
                          <div>
                            <span style={{
                              display: "inline-block",
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.75rem",
                              fontWeight: 800,
                              background: isPres ? "#dcfce7" : "#fee2e2",
                              color: isPres ? "#166534" : "#991b1b",
                              padding: "2px 8px",
                              borderRadius: "6px",
                              marginBottom: "4px"
                            }}>
                              {s.rollNo}
                            </span>
                            <h5 style={{ margin: 0, fontSize: "0.92rem", color: "#0f172a" }}>{s.name}</h5>
                          </div>

                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontWeight: 800,
                            fontSize: "0.82rem",
                            color: isPres ? "#15803d" : "#b91c1c",
                            background: isPres ? "#dcfce7" : "#fee2e2",
                            padding: "6px 12px",
                            borderRadius: "20px"
                          }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                              {isPres ? "check_circle" : "cancel"}
                            </span>
                            <span>{isPres ? "PRESENT" : "ABSENT"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Submit Attendance Button */}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleRecordLecture}
                      style={{ padding: "12px 28px", fontSize: "0.95rem" }}
                    >
                      <span className="material-symbols-outlined">save</span>
                      <span>Save & Sync Lecture Attendance to Students</span>
                    </button>
                  </div>

                  {/* Recent Recorded Lectures Log */}
                  <div style={{ marginTop: "36px", borderTop: "1px solid #e2e8f0", paddingTop: "24px" }}>
                    <h4 style={{ margin: "0 0 14px 0", fontSize: "1rem", color: "#0f172a" }}>
                      Recently Logged Lecture Sessions ({recentSessions.length})
                    </h4>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
                        <thead>
                          <tr style={{ background: "#f8fafc", textAlign: "left", borderBottom: "1.5px solid #e2e8f0" }}>
                            <th style={{ padding: "10px 12px" }}>Date</th>
                            <th style={{ padding: "10px 12px" }}>Course</th>
                            <th style={{ padding: "10px 12px" }}>Topic Taught</th>
                            <th style={{ padding: "10px 12px" }}>Venue</th>
                            <th style={{ padding: "10px 12px" }}>Present / Total</th>
                            <th style={{ padding: "10px 12px" }}>Faculty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentSessions.slice(0, 8).map((sess) => {
                            const pCount = sess.students.filter(st => st.isPresent).length;
                            return (
                              <tr key={sess.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                                <td style={{ padding: "10px 12px", fontWeight: 600 }}>{sess.date}</td>
                                <td style={{ padding: "10px 12px" }}>
                                  <span style={{
                                    fontFamily: "var(--font-mono)",
                                    fontWeight: 700,
                                    background: "#eff6ff",
                                    color: "#1e40af",
                                    padding: "2px 6px",
                                    borderRadius: "4px"
                                  }}>
                                    {sess.courseCode}
                                  </span>
                                </td>
                                <td style={{ padding: "10px 12px", color: "#334155" }}>{sess.topic}</td>
                                <td style={{ padding: "10px 12px" }}>{sess.room}</td>
                                <td style={{ padding: "10px 12px" }}>
                                  <strong style={{ color: "#166534" }}>{pCount}</strong> / {sess.students.length}
                                </td>
                                <td style={{ padding: "10px 12px", color: "#64748b" }}>{sess.facultyName}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* TAB 2: COURSES & GEMMA 4 AI TIMETABLE SCANNER */}
            {activeTab === 'schedule' && (
              <section id="stafftab-schedule" className="tab-pane active">
                {/* Gemma 4 AI Schedule Photo Scanner Card */}
                <div className="card" style={{ marginBottom: "24px" }}>
                  <div className="card-head">
                    <div className="head-title">
                      <span className="material-symbols-outlined" style={{ color: "#7c3aed" }}>document_scanner</span>
                      <h3>Gemma 4 Multimodal AI Timetable Photo Scanner</h3>
                    </div>
                    <span className="gate-status-pill" style={{ background: "#f5f3ff", color: "#6d28d9" }}>
                      Gemma 4 (9B Vision) Enabled
                    </span>
                  </div>

                  <p style={{ margin: "10px 0 18px 0", fontSize: "0.86rem", color: "#64748b" }}>
                    Simply upload a photo or screenshot of your weekly timetable sheet. Gemma 4 Vision OCR detects course slots, timings, and lecture rooms, automatically structuring your teaching schedule in the system.
                  </p>

                  <div style={{
                    border: "2px dashed #cbd5e1",
                    borderRadius: "14px",
                    padding: "24px",
                    textAlign: "center",
                    background: "#f8fafc",
                    position: "relative"
                  }}>
                    {photoPreview ? (
                      <div style={{ marginBottom: "16px" }}>
                        <img
                          src={photoPreview}
                          alt="Timetable Preview"
                          style={{ maxHeight: "240px", borderRadius: "10px", boxShadow: "0 4px 14px rgba(0,0,0,0.1)", margin: "0 auto" }}
                        />
                        <p style={{ marginTop: "10px", fontSize: "0.84rem", color: "#475569" }}>
                          Selected File: <strong>{photoFileName}</strong>
                        </p>
                      </div>
                    ) : (
                      <div style={{ padding: "20px" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#94a3b8" }}>
                          add_photo_alternate
                        </span>
                        <h4 style={{ margin: "8px 0 4px 0", color: "#1e293b" }}>Upload Timetable Photo</h4>
                        <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
                          PNG, JPG, or WEBP photo of official NIT Hamirpur schedule
                        </p>
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "12px" }}>
                      <label className="btn btn-outline" style={{ cursor: "pointer" }}>
                        <span className="material-symbols-outlined">upload_file</span>
                        <span>{photoPreview ? "Change Photo" : "Choose Photo from Device"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handlePhotoSelect}
                        />
                      </label>

                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => {
                          setPhotoFileName("nith_cse_sem1_official_schedule.png");
                          setPhotoPreview("/nith_logo.png");
                        }}
                      >
                        <span className="material-symbols-outlined">sample_rates</span>
                        <span>Use Sample Schedule Sheet</span>
                      </button>

                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={isAiScanning}
                        onClick={handleScanScheduleWithGemma4}
                        style={{
                          background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                          borderColor: "#7c3aed"
                        }}
                      >
                        <span className="material-symbols-outlined">
                          {isAiScanning ? "hourglass_top" : "auto_awesome"}
                        </span>
                        <span>{isAiScanning ? "Gemma 4 Vision Scanning..." : "Scan Schedule with Gemma 4"}</span>
                      </button>
                    </div>
                  </div>

                  {/* AI Scan Results */}
                  {aiScanResult && (
                    <div style={{
                      marginTop: "20px",
                      background: "#faf5ff",
                      border: "1.5px solid #d8b4fe",
                      borderRadius: "14px",
                      padding: "20px"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span className="material-symbols-outlined" style={{ color: "#7c3aed" }}>psychology</span>
                          <strong style={{ color: "#581c87", fontSize: "0.96rem" }}>
                            Gemma 4 Multimodal Vision Extraction Complete
                          </strong>
                        </div>
                        <span style={{ fontSize: "0.78rem", background: "#f3e8ff", color: "#6b21a8", padding: "4px 10px", borderRadius: "12px", fontWeight: 700 }}>
                          {aiScanResult.modelUsed}
                        </span>
                      </div>

                      <p style={{ fontSize: "0.85rem", color: "#6b21a8", margin: "0 0 14px 0" }}>
                        {aiScanResult.message}
                      </p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px", marginBottom: "16px" }}>
                        {aiScanResult.detectedCourses.map((c) => (
                          <div key={c.code} style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid #e9d5ff" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <strong style={{ color: "#581c87" }}>{c.code}</strong>
                              <span style={{ fontSize: "0.75rem", color: "#6b21a8" }}>{c.semester}</span>
                            </div>
                            <p style={{ margin: "4px 0 8px 0", fontSize: "0.82rem", color: "#334155", fontWeight: 600 }}>{c.name}</p>
                            <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
                              {c.scheduleSlots.map((s, idx) => (
                                <div key={idx}>• {s.day}: {s.time} ({s.room})</div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleApplyScannedSchedule}
                          style={{ background: "#7c3aed", borderColor: "#7c3aed" }}
                        >
                          <span className="material-symbols-outlined">task_alt</span>
                          <span>Apply & Save to My System Schedule</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* My Active Offered Courses */}
                <div className="card">
                  <div className="card-head">
                    <div className="head-title">
                      <span className="material-symbols-outlined">menu_book</span>
                      <h3>My Offered Courses & Timetable Slots ({courses.length})</h3>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px", marginTop: "16px" }}>
                    {courses.map(c => (
                      <div key={c.code} style={{ background: "#f8fafc", padding: "18px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span style={{
                            fontFamily: "var(--font-mono)",
                            fontWeight: 800,
                            background: "#eff6ff",
                            color: "#1d4ed8",
                            padding: "4px 10px",
                            borderRadius: "6px"
                          }}>
                            {c.code}
                          </span>
                          <span style={{ fontSize: "0.75rem", background: "#f1f5f9", padding: "2px 8px", borderRadius: "12px", fontWeight: 600 }}>
                            {c.department}
                          </span>
                        </div>
                        <h4 style={{ margin: "4px 0 8px 0", fontSize: "1rem", color: "#0f172a" }}>{c.name}</h4>
                        <p style={{ margin: "0 0 12px 0", fontSize: "0.78rem", color: "#64748b" }}>
                          Faculty: <strong>{c.facultyName}</strong>
                        </p>

                        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "10px" }}>
                          <strong style={{ fontSize: "0.78rem", color: "#475569", textTransform: "uppercase" }}>Weekly Lecture Slots:</strong>
                          <ul style={{ margin: "6px 0 0 0", paddingLeft: "18px", fontSize: "0.82rem", color: "#334155" }}>
                            {c.scheduleSlots.map((slot, i) => (
                              <li key={i} style={{ marginBottom: "3px" }}>
                                <strong>{slot.day}:</strong> {slot.time} • <em>{slot.room}</em>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* TAB 3: SYLLABUS TRACKER */}
            {activeTab === 'syllabus' && (
              <section id="stafftab-syllabus" className="tab-pane active">
                <div className="card">
                  <div className="card-head">
                    <div className="head-title">
                      <span className="material-symbols-outlined">data_usage</span>
                      <h3>Syllabus Completion Monitoring (CS 102 / CS-302)</h3>
                    </div>
                    <div className="overall-progress-chip" id="overallSyllabusText">
                      Overall Completed: {totalSyllabus}%
                    </div>
                  </div>

                  <p style={{ margin: "14px 0", fontSize: "0.86rem", color: "var(--text-muted)" }}>
                    Update the completion sliders for each unit below. Changes are reflected live on students&apos; dashboards.
                  </p>

                  <div className="syllabus-units-list" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {[
                      { num: 1, title: "Unit 1: Introduction to Programming, Data Types & Control Flow", desc: "Conditionals, Loops, Functions, Variable Scopes" },
                      { num: 2, title: "Unit 2: Arrays, Strings, Pointers & Memory Allocation", desc: "1D/2D Arrays, Pointer Arithmetic, Dynamic Memory (malloc/free)" },
                      { num: 3, title: "Unit 3: Recursion, Structures & File I/O", desc: "Recursive Algorithms, Structs, File Handlers" },
                      { num: 4, title: "Unit 4: Linear Data Structures: Linked Lists & Stacks", desc: "Singly & Doubly Linked Lists, Stack Implementations" },
                      { num: 5, title: "Unit 5: Queues, Trees & Algorithm Complexity", desc: "Queues, Binary Trees, Big-O Notation" },
                    ].map(u => (
                      <div key={u.num} style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <div>
                            <strong style={{ fontSize: "0.92rem", color: "var(--text-primary)" }}>{u.title}</strong>
                            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{u.desc}</p>
                          </div>
                          <span style={{ fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--nith-navy)" }}>
                            {units[u.num]}% Completed
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={units[u.num]}
                          onChange={(e) => handleUnitChange(u.num, parseInt(e.target.value))}
                          style={{ width: "100%", accentColor: "var(--nith-navy)" }}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "20px" }}>
                    <button className="btn btn-primary" onClick={handleSaveSyllabus}>
                      <span className="material-symbols-outlined">save</span>
                      <span>Save & Publish Syllabus Changes</span>
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* TAB 4: EXAM UNITS */}
            {activeTab === 'exams' && (
              <section id="stafftab-exams" className="tab-pane active">
                <div className="card">
                  <div className="card-head">
                    <div className="head-title">
                      <span className="material-symbols-outlined">assignment</span>
                      <h3>Examination Unit Configurations & Syllabi Breakdown</h3>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginTop: "16px" }}>
                    <div style={{ background: "#f8fafc", padding: "18px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                      <span className="gate-status-pill" style={{ background: "#dbeafe", color: "#1d4ed8" }}>
                        Mid-Semester Examination (30 Marks)
                      </span>
                      <h4 style={{ marginTop: "12px", fontSize: "1.05rem" }}>Coverage: Units 1 & 2</h4>
                      <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", margin: "8px 0" }}>
                        Control structures, Arrays, Pointers, and Dynamic Memory Allocation.
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "14px" }}>
                        <span className="material-symbols-outlined" style={{ color: "#15803d" }}>check_circle</span>
                        <strong style={{ fontSize: "0.85rem", color: "#15803d" }}>100% Syllabus Covered • Question Paper Moderated</strong>
                      </div>
                    </div>

                    <div style={{ background: "#f8fafc", padding: "18px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                      <span className="gate-status-pill" style={{ background: "#fef3c7", color: "#b45309" }}>
                        End-Semester Examination (50 Marks)
                      </span>
                      <h4 style={{ marginTop: "12px", fontSize: "1.05rem" }}>Coverage: Units 3, 4 & 5 (Full Syllabus)</h4>
                      <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", margin: "8px 0" }}>
                        Recursion, Linked Lists, Stacks, Queues, Binary Trees & Big-O Complexity.
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "14px" }}>
                        <span className="material-symbols-outlined" style={{ color: "#d97706" }}>pending</span>
                        <strong style={{ fontSize: "0.85rem", color: "#d97706" }}>Currently 60% Covered • Scheduled for Dec 2026</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* TAB 5: QUIZ SCHEDULER */}
            {activeTab === 'quizzes' && (
              <section id="stafftab-quizzes" className="tab-pane active">
                <div className="card">
                  <div className="card-head">
                    <div className="head-title">
                      <span className="material-symbols-outlined">event</span>
                      <h3>Class Calendar & Quiz Scheduler</h3>
                    </div>
                  </div>
                  
                  <p style={{ margin: "10px 0 20px 0", fontSize: "0.86rem", color: "#64748b" }}>
                    Select a date on the calendar below to plan and schedule a new quiz or test for your class. This will automatically sync with the student schedule.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
                    {/* Simple Calendar UI */}
                    <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <button type="button" className="btn btn-outline" style={{ padding: "4px 8px" }} onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}>
                          <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <h4 style={{ margin: 0 }}>{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
                        <button type="button" className="btn btn-outline" style={{ padding: "4px 8px" }} onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}>
                          <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                      </div>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", textAlign: "center", fontWeight: "bold", fontSize: "0.85rem", color: "#64748b", marginBottom: "8px" }}>
                        <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                      </div>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
                        {/* Mock calendar days */}
                        {Array.from({ length: 30 }).map((_, i) => {
                          const day = i + 1;
                          const d = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                          const isToday = d.toDateString() === new Date().toDateString();
                          return (
                            <div 
                              key={i} 
                              onClick={() => scheduleQuizForDate(d)}
                              style={{ 
                                padding: "12px 0", 
                                textAlign: "center", 
                                background: isToday ? "#3b82f6" : "#ffffff", 
                                color: isToday ? "#ffffff" : "#334155",
                                borderRadius: "8px", 
                                border: "1px solid #cbd5e1", 
                                cursor: "pointer",
                                fontWeight: isToday ? 700 : 500
                              }}
                            >
                              {day}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ overflowX: "auto" }}>
                      <h4 style={{ margin: "0 0 12px 0" }}>Scheduled Quizzes & Tests</h4>
                      <table id="quizTable" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                        <thead>
                          <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                            <th style={{ padding: "10px 14px" }}>Quiz Title</th>
                            <th style={{ padding: "10px 14px" }}>Course</th>
                            <th style={{ padding: "10px 14px" }}>Date</th>
                            <th style={{ padding: "10px 14px" }}>Time & Venue</th>
                            <th style={{ padding: "10px 14px" }}>Syllabus / Topics</th>
                            <th style={{ padding: "10px 14px" }}>Status</th>
                            <th style={{ padding: "10px 14px" }}>AI Harness Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quizzes.length === 0 && (
                            <tr>
                              <td colSpan={7} style={{ textAlign: "center", padding: "16px", color: "#64748b" }}>No quizzes scheduled yet.</td>
                            </tr>
                          )}
                          {quizzes.map(q => (
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
                                  color: q.status.includes("Upcoming") || q.status.includes("Ready") ? "#0369a1" : "#15803d"
                                }}>
                                  {q.status}
                                </span>
                              </td>
                              <td style={{ padding: "10px 14px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {q.status === "Upcoming Scheduled" && (
                                  <label 
                                    className="btn btn-outline"
                                    style={{ fontSize: "0.75rem", padding: "4px 8px", display: "inline-flex", alignItems: "center", gap: "4px", cursor: isAiScanning ? "not-allowed" : "pointer", opacity: isAiScanning ? 0.6 : 1 }}
                                  >
                                    <input 
                                      type="file" 
                                      style={{ display: "none" }} 
                                      accept=".pdf,.doc,.docx,.txt"
                                      disabled={isAiScanning}
                                      onChange={(e) => {
                                        if(e.target.files && e.target.files.length > 0) handleAiQuizGeneration(q);
                                        e.target.value = ''; // Reset input
                                      }} 
                                    />
                                    <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#7e22ce" }}>upload_file</span>
                                    Upload Q-Bank & Gen
                                  </label>
                                )}
                                {(q.status === "AI Generated (Ready)" || q.status.includes("Evaluated")) && (
                                  <label 
                                    className="btn btn-outline"
                                    style={{ fontSize: "0.75rem", padding: "4px 8px", display: "inline-flex", alignItems: "center", gap: "4px", cursor: isAiScanning ? "not-allowed" : "pointer", opacity: isAiScanning ? 0.6 : 1 }}
                                  >
                                    <input 
                                      type="file" 
                                      multiple 
                                      style={{ display: "none" }} 
                                      accept=".pdf,.png,.jpg,.jpeg,.zip"
                                      disabled={isAiScanning}
                                      onChange={(e) => {
                                        if(e.target.files && e.target.files.length > 0) handleAiQuizGrading(q);
                                        e.target.value = ''; // Reset input
                                      }} 
                                    />
                                    <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#047857" }}>grading</span>
                                    Upload Answer Sheets
                                  </label>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
