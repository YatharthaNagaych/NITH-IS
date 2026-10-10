"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import HomeView from "@/components/HomeView";
import StudentPortal from "@/components/StudentPortal";
import FacultyPortal from "@/components/FacultyPortal";
import AdmissionPortal from "@/components/AdmissionPortal";
import AuthModal from "@/components/AuthModal";
import GemmaAiModal from "@/components/GemmaAiModal";
import SupabaseModal from "@/components/SupabaseModal";
import AttendanceModal from "@/components/AttendanceModal";
import AddCourseModal from "@/components/AddCourseModal";
import {
  DEPARTMENTS_DATA,
  DepartmentInfo,
  Course,
  UserAccount,
  GatePass,
  AttendanceRecord,
  SyllabusRecord,
} from "@/lib/data";
import {
  loadStoredUsers,
  loadStoredGatePasses,
  loadStoredAttendance,
  loadStoredSyllabus,
  saveAttendanceRecord,
  resetSupabaseClient,
  getSupabaseClient,
  loadCurrentSessionUser,
  saveCurrentSessionUser,
} from "@/lib/supabaseClient";

export default function App() {
  const [activeView, setActiveView] = useState<'home' | 'student' | 'staff' | 'admission'>('home');
  const [activeDeptKey, setActiveDeptKey] = useState<string>("CE");
  const [departments, setDepartments] = useState<Record<string, DepartmentInfo>>(DEPARTMENTS_DATA);

  // Persistence State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [gatePasses, setGatePasses] = useState<GatePass[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [syllabusRecords, setSyllabusRecords] = useState<SyllabusRecord[]>([]);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(true);

  // Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState<'student' | 'staff' | 'admission'>('student');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isGemmaOpen, setIsGemmaOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);

  // Load from Storage
  useEffect(() => {
    setUsers(loadStoredUsers());
    setGatePasses(loadStoredGatePasses());
    setAttendanceRecords(loadStoredAttendance());
    setSyllabusRecords(loadStoredSyllabus());

    const savedUser = loadCurrentSessionUser();
    if (savedUser) {
      setCurrentUser(savedUser);
      if (savedUser.department && DEPARTMENTS_DATA[savedUser.department]) {
        setActiveDeptKey(savedUser.department);
      }
      if (savedUser.role === 'student' || savedUser.role === 'staff' || savedUser.role === 'admission') {
        setActiveView(savedUser.role);
      }
    }

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get("view");
      if (viewParam === "student" || viewParam === "staff" || viewParam === "admission") {
        setActiveView(viewParam);
      }
    }

    const client = getSupabaseClient();
    setIsSupabaseConnected(!!client);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    saveCurrentSessionUser(null);
    setActiveView('home');
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigate = (view: 'home' | 'student' | 'staff' | 'admission') => {
    setActiveView(view);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenLogin = (role: 'student' | 'staff' | 'admission') => {
    setAuthRole(role);
    setAuthMode('signin');
    setIsAuthModalOpen(true);
  };

  const handleOpenSignUp = () => {
    setAuthRole('student');
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    saveCurrentSessionUser(user);
    setUsers(loadStoredUsers());

    // Auto-detect student department from user.department, roll number or email
    if (user.department && DEPARTMENTS_DATA[user.department]) {
      setActiveDeptKey(user.department);
    } else {
      const rollOrEmail = (user.roll_no_or_emp_id + " " + user.email).toLowerCase();
      if (rollOrEmail.includes("bce") || rollOrEmail.includes("civil")) {
        setActiveDeptKey("CE");
      } else if (rollOrEmail.includes("bcs") || rollOrEmail.includes("cse") || rollOrEmail.includes("comp")) {
        setActiveDeptKey("CSE");
      } else if (rollOrEmail.includes("bec") || rollOrEmail.includes("ece")) {
        setActiveDeptKey("ECE");
      } else if (rollOrEmail.includes("bee") || rollOrEmail.includes("ee")) {
        setActiveDeptKey("EE");
      } else if (rollOrEmail.includes("bme") || rollOrEmail.includes("mech")) {
        setActiveDeptKey("ME");
      } else if (rollOrEmail.includes("bch") || rollOrEmail.includes("chem")) {
        setActiveDeptKey("CHE");
      } else if (rollOrEmail.includes("bms") || rollOrEmail.includes("mater")) {
        setActiveDeptKey("MSE");
      } else if (rollOrEmail.includes("bma") || rollOrEmail.includes("math")) {
        setActiveDeptKey("MC");
      } else if (rollOrEmail.includes("bar") || rollOrEmail.includes("arch")) {
        setActiveDeptKey("ARCH");
      }
    }

    const target = (user.role === 'staff' ? 'staff' : user.role === 'admission' ? 'admission' : 'student') as 'student' | 'staff' | 'admission';
    setActiveView(target);
    handleNavigate(target);
    setIsAuthModalOpen(false);
  };

  // Quick 1-tap attendance adjustment
  const handleQuickAdjust = (courseCode: string, deltaAttended: number, deltaTotal: number) => {
    const currentCourses = departments[activeDeptKey]?.courses || [];
    const updatedCourses = currentCourses.map(c => {
      if (c.code === courseCode) {
        const newAttended = Math.max(0, c.attended + deltaAttended);
        const newTotal = Math.max(newAttended, c.total + deltaTotal);
        const pct = newTotal > 0 ? (newAttended / newTotal) * 100 : 0;

        const rollNo = currentUser?.roll_no_or_emp_id || "26bce123";
        saveAttendanceRecord({
          student_roll_no: rollNo,
          subject_code: c.code,
          subject_name: c.name,
          attended_classes: newAttended,
          total_classes: newTotal,
          percentage: parseFloat(pct.toFixed(1)),
          status: pct >= 75 ? 'Safe' : 'Shortage',
        });

        return { ...c, attended: newAttended, total: newTotal };
      }
      return c;
    });

    setDepartments(prev => ({
      ...prev,
      [activeDeptKey]: {
        ...prev[activeDeptKey],
        courses: updatedCourses,
      },
    }));

    setAttendanceRecords(loadStoredAttendance());
  };

  // Batch Save from Attendance Modal
  const handleSaveCourses = (newCourses: Course[]) => {
    const rollNo = currentUser?.roll_no_or_emp_id || "26bce123";

    newCourses.forEach(c => {
      const pct = c.total > 0 ? (c.attended / c.total) * 100 : 0;
      saveAttendanceRecord({
        student_roll_no: rollNo,
        subject_code: c.code,
        subject_name: c.name,
        attended_classes: c.attended,
        total_classes: c.total,
        percentage: parseFloat(pct.toFixed(1)),
        status: pct >= 75 ? 'Safe' : 'Shortage',
      });
    });

    setDepartments(prev => ({
      ...prev,
      [activeDeptKey]: {
        ...prev[activeDeptKey],
        courses: newCourses,
      },
    }));

    setAttendanceRecords(loadStoredAttendance());
  };

  // Add New Course
  const handleAddCourse = (newCourse: Course) => {
    const currentCourses = departments[activeDeptKey]?.courses || [];
    const updated = [...currentCourses, newCourse];

    setDepartments(prev => ({
      ...prev,
      [activeDeptKey]: {
        ...prev[activeDeptKey],
        courses: updated,
      },
    }));

    const rollNo = currentUser?.roll_no_or_emp_id || "26bce123";
    const pct = newCourse.total > 0 ? (newCourse.attended / newCourse.total) * 100 : 0;
    saveAttendanceRecord({
      student_roll_no: rollNo,
      subject_code: newCourse.code,
      subject_name: newCourse.name,
      attended_classes: newCourse.attended,
      total_classes: newCourse.total,
      percentage: parseFloat(pct.toFixed(1)),
      status: pct >= 75 ? 'Safe' : 'Shortage',
    });

    setAttendanceRecords(loadStoredAttendance());
  };

  // Supabase Config Reconnection
  const handleSupabaseConfig = (url: string, key: string) => {
    const client = resetSupabaseClient(url, key);
    setIsSupabaseConnected(!!client);
  };

  const activeDeptData = departments[activeDeptKey] || departments["CE"];
  const currentCourses = activeDeptData.courses || [];

  return (
    <>
      <Header
        onNavigate={handleNavigate}
        onOpenSupabase={() => setIsSupabaseOpen(true)}
        onOpenSignUp={handleOpenSignUp}
        onToggleGemma={() => setIsGemmaOpen(prev => !prev)}
        isSupabaseConnected={isSupabaseConnected}
        activeView={activeView}
      />

      {/* Main Routed Page View */}
      {activeView === 'home' && (
        <HomeView
          onOpenLogin={handleOpenLogin}
          onOpenSignUp={handleOpenSignUp}
          onToggleGemma={() => setIsGemmaOpen(true)}
        />
      )}

      {activeView === 'student' && (
        <StudentPortal
          onNavigateHome={handleLogout}
          activeDeptKey={activeDeptKey}
          onDeptChange={(key) => setActiveDeptKey(key)}
          deptData={activeDeptData}
          courses={currentCourses}
          onQuickAdjustAttendance={handleQuickAdjust}
          onOpenAttendanceModal={() => setIsAttendanceModalOpen(true)}
          currentUser={currentUser}
          gatePasses={gatePasses}
          onAddGatePass={(pass) => setGatePasses(prev => [pass, ...prev])}
        />
      )}

      {activeView === 'staff' && (
        <FacultyPortal
          currentUser={currentUser}
          onNavigateHome={handleLogout}
        />
      )}

      {activeView === 'admission' && (
        <AdmissionPortal
          onNavigateHome={handleLogout}
        />
      )}

      {/* Interactive Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        role={authRole}
        initialMode={authMode}
        onLoginSuccess={handleLoginSuccess}
      />

      <GemmaAiModal
        isOpen={isGemmaOpen}
        onClose={() => setIsGemmaOpen(false)}
      />

      <SupabaseModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
        users={users}
        gatePasses={gatePasses}
        attendance={attendanceRecords}
        syllabus={syllabusRecords}
        onConfigChange={handleSupabaseConfig}
        isConnected={isSupabaseConnected}
      />

      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        deptData={activeDeptData}
        courses={currentCourses}
        onSaveCourses={handleSaveCourses}
        onOpenAddCourse={() => setIsAddCourseModalOpen(true)}
        currentUser={currentUser}
      />

      <AddCourseModal
        isOpen={isAddCourseModalOpen}
        onClose={() => setIsAddCourseModalOpen(false)}
        onAddCourse={handleAddCourse}
      />

      {/* Floating Gemma 4 AI Chatbot Option (Bottom Right) */}
      <button
        type="button"
        className={`gemma-floating-trigger ${isGemmaOpen ? 'active' : ''}`}
        onClick={() => setIsGemmaOpen(prev => !prev)}
        id="btnFloatingGemma"
        aria-label="Open Gemma 4 AI Chatbot"
        title="Chat with Gemma 4 Academic Intelligence Copilot"
      >
        <div className="gemma-pulse-ring"></div>
        <div className="gemma-trigger-sparkle">
          <span className="material-symbols-outlined">{isGemmaOpen ? 'close' : 'auto_awesome'}</span>
        </div>
        <div className="gemma-trigger-text">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Gemma 4 AI
            <span className="pulse-gemma-dot"></span>
          </span>
          <small>{isGemmaOpen ? 'Close Chatbot' : 'Academic Copilot'}</small>
        </div>
      </button>
    </>
  );
}
