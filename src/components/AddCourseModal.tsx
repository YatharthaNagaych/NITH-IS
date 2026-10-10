"use client";

import React, { useState } from "react";
import { Course } from "@/lib/data";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCourse: (newCourse: Course) => void;
}

export default function AddCourseModal({
  isOpen,
  onClose,
  onAddCourse,
}: AddCourseModalProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [faculty, setFaculty] = useState("Dr. Faculty Name");
  const [attended, setAttended] = useState(20);
  const [total, setTotal] = useState(24);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    const course: Course = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      faculty: faculty.trim(),
      attended: Math.max(0, attended),
      total: Math.max(attended, total),
      credits: 4
    };

    onAddCourse(course);
    onClose();
    setCode("");
    setName("");
  };

  return (
    <div id="addCourseModal" className="att-modal-overlay">
      <div className="att-modal-container small-modal">
        <div className="att-modal-header">
          <div className="att-header-info">
            <div className="att-header-icon">
              <span className="material-symbols-outlined">post_add</span>
            </div>
            <div>
              <h3>Add New Course</h3>
              <p>Register a new subject to track attendance</p>
            </div>
          </div>
          <button type="button" className="att-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form id="addCourseForm" onSubmit={handleSubmit} className="att-modal-body">
          <div className="form-field">
            <label>Course Code</label>
            <input
              type="text"
              placeholder="e.g. CE-306"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>Course Name</label>
            <input
              type="text"
              placeholder="e.g. Hydraulic Engineering & Hydrology"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>Faculty Name</label>
            <input
              type="text"
              placeholder="e.g. Dr. P. K. Sood"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              required
            />
          </div>

          <div className="att-grid-2col">
            <div className="form-field">
              <label>Classes Attended</label>
              <input
                type="number"
                min="0"
                value={attended}
                onChange={(e) => setAttended(parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div className="form-field">
              <label>Total Classes Held</label>
              <input
                type="number"
                min="1"
                value={total}
                onChange={(e) => setTotal(parseInt(e.target.value) || 1)}
                required
              />
            </div>
          </div>

          <div className="att-modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <span className="material-symbols-outlined">add</span>
              <span>Add Course</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
