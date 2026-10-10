"use client";

import React from "react";
import { Course, DepartmentInfo, UserAccount } from "@/lib/data";
import { computeStudentAttendance } from "@/lib/attendanceStore";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  deptData: DepartmentInfo;
  currentUser: UserAccount | null;
  onSaveCourses: (updatedCourses: Course[]) => void;
  onOpenAddCourse: () => void;
}

export default function AttendanceModal({
  isOpen,
  onClose,
  deptData,
  currentUser,
}: AttendanceModalProps) {
  if (!isOpen) return null;

  const studentName = currentUser?.full_name || "Yathartha Nagaych";
  const studentRoll = currentUser?.roll_no_or_emp_id || "26bce123";

  const computedAtt = computeStudentAttendance(studentRoll || currentUser?.email);

  return (
    <div id="attendanceModal" className="att-modal-overlay">
      <div className="att-modal-container">
        <div className="att-modal-header">
          <div className="att-header-info">
            <div className="att-header-icon">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <div>
              <h3>Official Academic Attendance Register</h3>
              <p>
                Department: <strong id="modalDeptName">{deptData.name}</strong> • Student:{" "}
                <span id="modalRollDisplay">{studentRoll} • {studentName}</span>
              </p>
            </div>
          </div>
          <button type="button" className="att-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="att-modal-body">
          <div className="att-notice-box" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534" }}>
            <span className="material-symbols-outlined" style={{ color: "#16a34a" }}>lock</span>
            <div>
              <strong>Faculty-Verified Attendance Registry (Read-Only)</strong>
              <p style={{ color: "#15803d" }}>
                Under NITH Ordinance 7.2, attendance entries are directly recorded and signed off by course instructors during each lecture session. Students cannot manually edit attendance.
              </p>
            </div>
          </div>

          <div className="att-courses-list" id="modalCoursesList" style={{ marginTop: "14px" }}>
            {computedAtt.subjects.map((s) => {
              const isSafe = s.percentage >= 75;

              return (
                <div key={s.code} className="att-course-row" style={{ alignItems: "center" }}>
                  <div className="att-course-info">
                    <strong className="att-course-title">{s.name}</strong>
                    <span className="att-course-sub">{s.code} • Signed by Course Faculty</span>
                  </div>

                  <div className="att-inputs-group" style={{ gap: "24px", alignItems: "center" }}>
                    <div style={{ textAlign: "center" }}>
                      <span style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", display: "block" }}>Attended</span>
                      <strong style={{ fontSize: "1.05rem", color: "#0f172a" }}>{s.attended}</strong>
                    </div>

                    <div style={{ textAlign: "center" }}>
                      <span style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", display: "block" }}>Total Held</span>
                      <strong style={{ fontSize: "1.05rem", color: "#0f172a" }}>{s.total}</strong>
                    </div>
                  </div>

                  <div className="att-live-preview" style={{ minWidth: "120px", textAlign: "right" }}>
                    <span className={`att-pct-pill ${isSafe ? 'safe' : 'danger'}`}>
                      {s.percentage}%
                    </span>
                    <span className={`att-status-tag ${isSafe ? 'safe' : 'danger'}`} style={{ display: "block", marginTop: "4px" }}>
                      {isSafe ? '✓ Ordinance Met (>=75%)' : '⚠️ Shortage (<75%)'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="att-modal-footer" style={{ justifyContent: "space-between", marginTop: "20px" }}>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
              Total Lectures Attended: <strong>{computedAtt.totalAttended}</strong> / {computedAtt.totalHeld} ({computedAtt.overallPercentage}%)
            </span>
            <div className="footer-right-actions">
              <button type="button" className="btn btn-primary" onClick={onClose}>
                <span className="material-symbols-outlined">check</span>
                <span>Close Registry</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
