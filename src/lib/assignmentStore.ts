import { INITIAL_STUDENT_ROSTER, StudentRosterEntry } from "./attendanceStore";

export interface AssignmentItem {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  description: string;
  facultyName: string;
  facultyEmpId: string;
  dueDate: string; // ISO or YYYY-MM-DDTHH:mm
  maxMarks: number;
  assignedToAll: boolean;
  assignedRollNumbers: string[]; // Specific roll numbers assigned to this assignment
  attachmentUrl?: string;
  createdAt: string;
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  studentRollNo: string;
  studentName: string;
  studentEmail: string;
  submissionText: string;
  codeSnippet?: string;
  attachmentUrl?: string;
  attachmentFileName?: string;
  submittedAt: string;
  status: 'submitted' | 'graded';
  marksObtained?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
}

const STORAGE_KEY_ASSIGNMENTS = "nith_assignments_v1";
const STORAGE_KEY_SUBMISSIONS = "nith_submissions_v1";

// Default realistic sample assignments
export const INITIAL_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: "asg-cs102-1",
    courseCode: "CS 102",
    courseName: "Computer Programming & Problem Solving",
    title: "Lab Assignment 3: Binary Search Tree & Min-Heap Implementation",
    description: "Implement a complete Min-Heap in C++ with insert, extract-min, and heapify operations. Provide time complexity analysis and test cases with at least 15 randomly generated elements.",
    facultyName: "Prof. R. K. Sharma",
    facultyEmpId: "EMP-4091",
    dueDate: "2026-10-18T23:59",
    maxMarks: 25,
    assignedToAll: true,
    assignedRollNumbers: INITIAL_STUDENT_ROSTER.map(s => s.rollNo),
    attachmentUrl: "https://nith.ac.in/academic/cse/lab-sheets/cs102_heap_spec.pdf",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "asg-ma101-1",
    courseCode: "MA 101",
    courseName: "Engineering Mathematics-I",
    title: "Problem Set 4: Partial Differential Equations & Laplace Transforms",
    description: "Solve problems 14 through 28 from Kreyszig Chapter 12 on boundary value problems for vibrating strings. Show complete step-by-step Fourier series expansion.",
    facultyName: "Dr. Shilpa",
    facultyEmpId: "EMP-2041",
    dueDate: "2026-10-22T17:00",
    maxMarks: 20,
    assignedToAll: true,
    assignedRollNumbers: INITIAL_STUDENT_ROSTER.map(s => s.rollNo),
    attachmentUrl: "https://nith.ac.in/academic/math/ps4_laplace.pdf",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "asg-cs102-2",
    courseCode: "CS 102",
    courseName: "Computer Programming & Problem Solving",
    title: "Project Milestone 1: Custom Memory Allocator in C",
    description: "Design a free-list based malloc and free implementation with first-fit and best-fit algorithms. Assigned specifically to Honors Batch students.",
    facultyName: "Prof. R. K. Sharma",
    facultyEmpId: "EMP-4091",
    dueDate: "2026-10-25T23:59",
    maxMarks: 50,
    assignedToAll: false,
    assignedRollNumbers: ["26BCS015", "26BCE123", "22BCSE042"],
    attachmentUrl: "https://nith.ac.in/academic/cse/allocator_guide.pdf",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

// Default sample submissions so evaluation and grading work out-of-the-box
export const INITIAL_SUBMISSIONS: StudentSubmission[] = [
  {
    id: "sub-1",
    assignmentId: "asg-cs102-1",
    studentRollNo: "26BCS015",
    studentName: "Yathartha Nagaych",
    studentEmail: "26bcs015@nith.ac.in",
    submissionText: "Completed Min-Heap implementation with zero memory leaks verified using Valgrind. Included unit tests for boundary conditions (empty heap extraction, duplicate keys).",
    codeSnippet: `#include <iostream>
#include <vector>

class MinHeap {
    std::vector<int> heap;
    void heapifyUp(int i) {
        while (i > 0 && heap[(i - 1) / 2] > heap[i]) {
            std::swap(heap[i], heap[(i - 1) / 2]);
            i = (i - 1) / 2;
        }
    }
public:
    void insert(int val) {
        heap.push_back(val);
        heapifyUp(heap.size() - 1);
    }
    int getMin() { return heap.empty() ? -1 : heap[0]; }
};`,
    attachmentFileName: "min_heap_submission_26BCS015.cpp",
    submittedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: "graded",
    marksObtained: 24,
    feedback: "Excellent heapify logic and clean algorithmic structure. Full marks for proper edge-case validation.",
    gradedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    gradedBy: "Prof. R. K. Sharma"
  },
  {
    id: "sub-2",
    assignmentId: "asg-cs102-1",
    studentRollNo: "22BCSE042",
    studentName: "Aarav Sharma",
    studentEmail: "22bcse042@nith.ac.in",
    submissionText: "Implemented Min-Heap in C++ using std::vector. Time complexity for insert is O(log N) and extract-min is O(log N).",
    attachmentFileName: "aarav_heap_solution.zip",
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: "submitted"
  }
];

export function loadAssignments(): AssignmentItem[] {
  if (typeof window === "undefined") return INITIAL_ASSIGNMENTS;
  const raw = localStorage.getItem(STORAGE_KEY_ASSIGNMENTS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_ASSIGNMENTS, JSON.stringify(INITIAL_ASSIGNMENTS));
    return INITIAL_ASSIGNMENTS;
  }
  try {
    return JSON.parse(raw) as AssignmentItem[];
  } catch {
    return INITIAL_ASSIGNMENTS;
  }
}

export function saveAssignment(asg: AssignmentItem): AssignmentItem[] {
  const current = loadAssignments();
  const existingIdx = current.findIndex(a => a.id === asg.id);
  if (existingIdx >= 0) {
    current[existingIdx] = asg;
  } else {
    current.unshift(asg);
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_ASSIGNMENTS, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent("nith_assignment_sync", { detail: { type: "assignment_saved", asg } }));
  }
  return current;
}

export function deleteAssignment(id: string): AssignmentItem[] {
  const current = loadAssignments();
  const updated = current.filter(a => a.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_ASSIGNMENTS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("nith_assignment_sync", { detail: { type: "assignment_deleted", id } }));
  }
  return updated;
}

export function loadSubmissions(): StudentSubmission[] {
  if (typeof window === "undefined") return INITIAL_SUBMISSIONS;
  const raw = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
    return INITIAL_SUBMISSIONS;
  }
  try {
    return JSON.parse(raw) as StudentSubmission[];
  } catch {
    return INITIAL_SUBMISSIONS;
  }
}

export function saveSubmission(sub: StudentSubmission): StudentSubmission[] {
  const current = loadSubmissions();
  const existingIdx = current.findIndex(s => s.id === sub.id || (s.assignmentId === sub.assignmentId && s.studentRollNo === sub.studentRollNo));
  if (existingIdx >= 0) {
    current[existingIdx] = { ...current[existingIdx], ...sub };
  } else {
    current.unshift(sub);
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent("nith_assignment_sync", { detail: { type: "submission_saved", sub } }));
  }
  return current;
}

export function gradeSubmission(
  submissionId: string,
  marks: number,
  feedback: string,
  graderName: string
): StudentSubmission[] {
  const current = loadSubmissions();
  const existingIdx = current.findIndex(s => s.id === submissionId);
  if (existingIdx >= 0) {
    current[existingIdx] = {
      ...current[existingIdx],
      status: "graded",
      marksObtained: marks,
      feedback,
      gradedAt: new Date().toISOString(),
      gradedBy: graderName
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(current));
      window.dispatchEvent(new CustomEvent("nith_assignment_sync", { detail: { type: "submission_graded", submissionId } }));
    }
  }
  return current;
}

/**
 * Filter assignments applicable to a student based on their roll number or email
 */
export function getStudentAssignments(studentIdentifier: string) {
  const assignments = loadAssignments();
  const submissions = loadSubmissions();
  const cleanId = (studentIdentifier || "").trim().toLowerCase();

  return assignments.filter(asg => {
    if (asg.assignedToAll) return true;
    return asg.assignedRollNumbers.some(r => cleanId.includes(r.toLowerCase()) || r.toLowerCase().includes(cleanId));
  }).map(asg => {
    const sub = submissions.find(s => 
      s.assignmentId === asg.id && 
      (cleanId.includes(s.studentRollNo.toLowerCase()) || s.studentRollNo.toLowerCase().includes(cleanId) || cleanId === s.studentEmail.toLowerCase())
    );

    const isDuePassed = new Date(asg.dueDate).getTime() < Date.now();
    const isSubmitted = !!sub;
    const isOverdue = !isSubmitted && isDuePassed;
    const isPending = !isSubmitted && !isDuePassed;

    return {
      assignment: asg,
      submission: sub,
      isSubmitted,
      isPending,
      isOverdue,
      status: sub?.status === "graded" ? "graded" : (isSubmitted ? "submitted" : (isOverdue ? "overdue" : "pending"))
    };
  });
}
