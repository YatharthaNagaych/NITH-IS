"use client";

import React from "react";

interface AdmissionPortalProps {
  onNavigateHome: () => void;
}

export default function AdmissionPortal({ onNavigateHome }: AdmissionPortalProps) {
  return (
    <div id="view-admission" className="page-view active">
      <div className="cuims-admission-layout">
        {/* Top Admission Subheader */}
        <div className="admission-banner">
          <div className="adm-banner-content">
            <span className="adm-pill">B.Tech & M.Tech Admissions 2026-27</span>
            <h2>Candidate Admission & Counselling Portal</h2>
            <p>National Institute of Technology Hamirpur • JoSAA & CSAB Reporting Gateway</p>
          </div>
          <button className="return-home-btn" onClick={onNavigateHome}>
            <span className="material-symbols-outlined">home</span>
            <span>Exit to Portal Home</span>
          </button>
        </div>

        {/* Applicant Status & Services Dashboard */}
        <div className="adm-body-grid">
          {/* Left: Applicant File & Verification Status */}
          <div className="card adm-status-card">
            <div className="card-head">
              <div className="head-title">
                <span className="material-symbols-outlined">person_pin</span>
                <h3>Applicant File: Rohini Verma</h3>
              </div>
              <span className="gate-status-pill">JEE Main 2026</span>
            </div>

            <div className="candidate-spec-table">
              <div className="c-row">
                <span>Application Form ID:</span>
                <strong>NITH-UG-2026-4891</strong>
              </div>
              <div className="c-row">
                <span>JEE Main CRL Rank:</span>
                <strong>14,210</strong>
              </div>
              <div className="c-row">
                <span>Allotted Programme:</span>
                <strong style={{ color: "var(--nith-navy)" }}>B.Tech in Computer Science & Engineering</strong>
              </div>
              <div className="c-row">
                <span>Counselling Allocation Round:</span>
                <strong>JoSAA Round 1 (Provisional)</strong>
              </div>
              <div className="c-row">
                <span>Hostel Accommodation:</span>
                <strong>Ambika Girls Hostel (Allotted)</strong>
              </div>
            </div>

            {/* Stepper Verification Tracker */}
            <div className="counselling-stepper">
              <div className="step-item completed">
                <div className="step-circle">
                  <span className="material-symbols-outlined">done</span>
                </div>
                <div className="step-text">
                  <strong>1. Registration & Choice Locking</strong>
                  <small>Completed on 15 June 2026</small>
                </div>
              </div>

              <div className="step-item completed">
                <div className="step-circle">
                  <span className="material-symbols-outlined">done</span>
                </div>
                <div className="step-text">
                  <strong>2. Seat Allotment (Round 1: CSE)</strong>
                  <small>Allotted at NIT Hamirpur</small>
                </div>
              </div>

              <div className="step-item in-progress">
                <div className="step-circle">3</div>
                <div className="step-text">
                  <strong>3. Document Verification</strong>
                  <small>Class 10/12 Marksheets & Medical Certificate Under Review</small>
                </div>
              </div>

              <div className="step-item pending">
                <div className="step-circle">4</div>
                <div className="step-text">
                  <strong>4. Seat Acceptance Fee & Reporting</strong>
                  <small>Pay balance semester fee to confirm admission</small>
                </div>
              </div>
            </div>

            <div className="adm-action-row">
              <button
                className="btn btn-primary"
                onClick={() => alert("Downloading Provisional Seat Allotment Letter (PDF)...")}
              >
                <span className="material-symbols-outlined">download</span>
                <span>Download Allotment Letter</span>
              </button>
              <button
                className="btn btn-outline"
                onClick={() => alert("Opening Document Upload Portal...")}
              >
                <span className="material-symbols-outlined">upload_file</span>
                <span>Re-upload Documents</span>
              </button>
            </div>
          </div>

          {/* Right: Fee Payment & Important Dates */}
          <div className="adm-sidebar-column">
            <div className="card">
              <div className="card-head">
                <div className="head-title">
                  <span className="material-symbols-outlined">payments</span>
                  <h3>Admission Fee Breakdown</h3>
                </div>
              </div>
              <div className="fee-receipt-box">
                <div className="fee-row">
                  <span>Tuition Fee (Sem 1):</span>
                  <strong>₹ 62,500</strong>
                </div>
                <div className="fee-row">
                  <span>Institute Caution Deposit:</span>
                  <strong>₹ 5,000</strong>
                </div>
                <div className="fee-row">
                  <span>Hostel & Mess Advance:</span>
                  <strong>₹ 28,000</strong>
                </div>
                <div className="fee-row total-fee">
                  <span>Total Payable:</span>
                  <strong>₹ 95,500</strong>
                </div>
                <button
                  className="btn btn-primary btn-block"
                  style={{ marginTop: "14px" }}
                  onClick={() => alert("Redirecting to SBI Collect / HDFC Payment Gateway for NIT Hamirpur Fee Payment...")}
                >
                  <span>Pay Admission Fee Online</span>
                  <span className="material-symbols-outlined">lock</span>
                </button>
              </div>
            </div>

            <div className="card" style={{ marginTop: "18px" }}>
              <div className="card-head">
                <div className="head-title">
                  <span className="material-symbols-outlined">schedule</span>
                  <h3>Key Admission Deadlines</h3>
                </div>
              </div>
              <ul className="adm-dates-list">
                <li><strong>15 Oct 2026:</strong> Physical Reporting at NIT Hamirpur Auditorium</li>
                <li><strong>18 Oct 2026:</strong> Hostel Room Allotment (Kailash & Ambika)</li>
                <li><strong>21 Oct 2026:</strong> Orientation Programme & Commencement of Classes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
