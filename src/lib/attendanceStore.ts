export interface TeacherCourseInfo {
  code: string;
  name: string;
  department: string;
  semester: string;
  facultyName: string;
  scheduleSlots: { day: string; time: string; room: string }[];
}

export interface StudentRosterEntry {
  rollNo: string;
  name: string;
  email: string;
  department: string;
}

export interface QuizItem {
  id: string;
  name: string;
  course: string;
  date: string;
  venue: string;
  topics: string;
  status: string;
}

export interface StudentAttendanceStatus {
  rollNo: string;
  name: string;
  isPresent: boolean;
}

export interface LectureSessionRecord {
  id: string;
  courseCode: string;
  courseName: string;
  date: string;
  topic: string;
  facultyName: string;
  room: string;
  students: StudentAttendanceStatus[];
  timestamp: string;
}

// Initial 1st Year Core Courses as shown in user image
export const INITIAL_TEACHER_COURSES: TeacherCourseInfo[] = [
  {
    code: "MA 101",
    name: "Engineering Mathematics-I",
    department: "Mathematics",
    semester: "Semester 1",
    facultyName: "Dr. Shilpa • Dept. of Mathematics",
    scheduleSlots: [
      { day: "Monday", time: "09:00 AM - 10:00 AM", room: "LH-108" },
      { day: "Wednesday", time: "10:00 AM - 11:00 AM", room: "LH-108" },
      { day: "Friday", time: "09:00 AM - 10:00 AM", room: "LH-108" },
    ]
  },
  {
    code: "CS 102",
    name: "Computer Programming & Problem Solving",
    department: "Computer Science",
    semester: "Semester 1",
    facultyName: "Prof. R. K. Sharma • Dept. of CSE",
    scheduleSlots: [
      { day: "Tuesday", time: "10:00 AM - 11:00 AM", room: "LH-104" },
      { day: "Thursday", time: "11:00 AM - 12:00 PM", room: "LH-104" },
      { day: "Friday", time: "02:00 PM - 04:00 PM", room: "CC Lab 2" },
    ]
  },
  {
    code: "EP101",
    name: "Engineering Physics",
    department: "Physics",
    semester: "Semester 1",
    facultyName: "Dr. Arvind Kumar • Dept. of Physics",
    scheduleSlots: [
      { day: "Monday", time: "11:00 AM - 12:00 PM", room: "LH-105" },
      { day: "Thursday", time: "09:00 AM - 10:00 AM", room: "LH-105" },
    ]
  },
  {
    code: "EN 101",
    name: "Environmental Science & Engineering",
    department: "Civil & Environmental",
    semester: "Semester 1",
    facultyName: "Dr. R. S. Bansal • Civil Engg",
    scheduleSlots: [
      { day: "Wednesday", time: "02:00 PM - 03:00 PM", room: "LH-106" },
      { day: "Friday", time: "11:00 AM - 12:00 PM", room: "LH-106" },
    ]
  },
  {
    code: "HS 101",
    name: "Professional Communication & Ethics",
    department: "Humanities",
    semester: "Semester 1",
    facultyName: "Dr. Vandana Sharma • Humanities",
    scheduleSlots: [
      { day: "Tuesday", time: "02:00 PM - 03:00 PM", room: "LH-107" },
      { day: "Thursday", time: "10:00 AM - 11:00 AM", room: "LH-107" },
    ]
  }
];

export const INITIAL_STUDENT_ROSTER: StudentRosterEntry[] = [
  { rollNo: "26BCS015", name: "Yathartha Nagaych", email: "26bcs015@nith.ac.in", department: "CSE" },
  { rollNo: "26BCE123", name: "Yathartha Nagaych", email: "26bce123@nith.ac.in", department: "CE" },
  { rollNo: "22BCSE042", name: "Aarav Sharma", email: "22bcse042@nith.ac.in", department: "CSE" },
  { rollNo: "26BCS002", name: "Aarushi Verma", email: "26bcs002@nith.ac.in", department: "CSE" },
  { rollNo: "26BCS021", name: "Abhishek Thakur", email: "26bcs021@nith.ac.in", department: "CSE" },
  { rollNo: "26BCS034", name: "Divyansh Mehra", email: "26bcs034@nith.ac.in", department: "CSE" },
  { rollNo: "26BCS049", name: "Isha Kapoor", email: "26bcs049@nith.ac.in", department: "CSE" },
  { rollNo: "26BCS070", name: "Kunal Chauhan", email: "26bcs070@nith.ac.in", department: "CSE" },
];

// Baseline Initial Lectures so Student Dashboard displays values matching the user image
export const INITIAL_LECTURE_SESSIONS: LectureSessionRecord[] = [
  // MA 101: 20 lectures total (Yathartha present in 17 -> 85%)
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `lec-ma101-${i + 1}`,
    courseCode: "MA 101",
    courseName: "Engineering Mathematics-I",
    date: `2026-09-${String((i % 25) + 1).padStart(2, "0")}`,
    topic: `Calculus & Differential Equations: Lecture ${i + 1}`,
    facultyName: "Dr. Shilpa",
    room: "LH-108",
    students: INITIAL_STUDENT_ROSTER.map(s => ({
      rollNo: s.rollNo,
      name: s.name,
      isPresent: i % 7 !== 0,
    })),
    timestamp: new Date(Date.now() - (20 - i) * 86400000).toISOString(),
  })),

  // CS 102: 22 lectures total (Yathartha present in 21 -> ~95%)
  ...Array.from({ length: 22 }, (_, i) => ({
    id: `lec-cs102-${i + 1}`,
    courseCode: "CS 102",
    courseName: "Computer Programming & Problem Solving",
    date: `2026-09-${String((i % 26) + 1).padStart(2, "0")}`,
    topic: `Data Structures & Algorithms: Lecture ${i + 1}`,
    facultyName: "Prof. R. K. Sharma",
    room: "LH-104",
    students: INITIAL_STUDENT_ROSTER.map(s => ({
      rollNo: s.rollNo,
      name: s.name,
      isPresent: i !== 8,
    })),
    timestamp: new Date(Date.now() - (22 - i) * 86400000).toISOString(),
  })),

  // EP101: 18 lectures total (Yathartha present in 16 -> ~89%)
  ...Array.from({ length: 18 }, (_, i) => ({
    id: `lec-ep101-${i + 1}`,
    courseCode: "EP101",
    courseName: "Engineering Physics",
    date: `2026-09-${String((i % 22) + 1).padStart(2, "0")}`,
    topic: `Quantum Mechanics & Optics: Lecture ${i + 1}`,
    facultyName: "Dr. Arvind Kumar",
    room: "LH-105",
    students: INITIAL_STUDENT_ROSTER.map(s => ({
      rollNo: s.rollNo,
      name: s.name,
      isPresent: i % 9 !== 0,
    })),
    timestamp: new Date(Date.now() - (18 - i) * 86400000).toISOString(),
  })),

  // EN 101: 16 lectures total (Yathartha present in 16 -> 100%)
  ...Array.from({ length: 16 }, (_, i) => ({
    id: `lec-en101-${i + 1}`,
    courseCode: "EN 101",
    courseName: "Environmental Science & Engineering",
    date: `2026-09-${String((i % 20) + 1).padStart(2, "0")}`,
    topic: `Ecology & Solid Waste Management: Lecture ${i + 1}`,
    facultyName: "Dr. R. S. Bansal",
    room: "LH-106",
    students: INITIAL_STUDENT_ROSTER.map(s => ({
      rollNo: s.rollNo,
      name: s.name,
      isPresent: true,
    })),
    timestamp: new Date(Date.now() - (16 - i) * 86400000).toISOString(),
  })),

  // HS 101: 15 lectures total (Yathartha present in 14 -> ~93%)
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `lec-hs101-${i + 1}`,
    courseCode: "HS 101",
    courseName: "Professional Communication & Ethics",
    date: `2026-09-${String((i % 18) + 1).padStart(2, "0")}`,
    topic: `Technical Writing & Ethics: Lecture ${i + 1}`,
    facultyName: "Dr. Vandana Sharma",
    room: "LH-107",
    students: INITIAL_STUDENT_ROSTER.map(s => ({
      rollNo: s.rollNo,
      name: s.name,
      isPresent: i !== 5,
    })),
    timestamp: new Date(Date.now() - (15 - i) * 86400000).toISOString(),
  })),
];

// Helper Functions with LocalStorage Persistence
const STORAGE_KEY_COURSES = "nith_teacher_courses";
const STORAGE_KEY_SESSIONS = "nith_teacher_sessions";

export function loadTeacherCourses(): TeacherCourseInfo[] {
  if (typeof window === "undefined") return INITIAL_TEACHER_COURSES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COURSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(INITIAL_TEACHER_COURSES));
      return INITIAL_TEACHER_COURSES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TEACHER_COURSES;
  }
}

export function saveTeacherCourses(courses: TeacherCourseInfo[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));
  } catch (err) {
    console.error("Failed to save teacher courses:", err);
  }
}

export function loadLectureSessions(): LectureSessionRecord[] {
  if (typeof window === "undefined") return INITIAL_LECTURE_SESSIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(INITIAL_LECTURE_SESSIONS));
      return INITIAL_LECTURE_SESSIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LECTURE_SESSIONS;
  }
}

export function saveLectureSession(newSession: LectureSessionRecord): LectureSessionRecord[] {
  const current = loadLectureSessions();
  const updated = [newSession, ...current];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save lecture session:", err);
    }
  }
  return updated;
}

export interface StudentSubjectAttendance {
  code: string;
  name: string;
  attended: number;
  total: number;
  percentage: number;
  color: string;
}

export interface ComputedStudentAttendance {
  overallPercentage: number;
  totalAttended: number;
  totalHeld: number;
  cgpa: number;
  noticesCount: number;
  subjects: StudentSubjectAttendance[];
}

const SUBJECT_COLORS: Record<string, string> = {
  "MA 101": "#2563eb", // Rich Blue
  "CS 102": "#06b6d4", // Vibrant Cyan
  "EP101": "#f97316",  // Warm Orange
  "EN 101": "#8b5cf6",  // Purple / Violet
  "HS 101": "#10b981",  // Emerald Green
  "CS-302": "#3b82f6",
  "CS-301": "#6366f1",
  "CS-303": "#ec4899",
  "CS-304": "#14b8a6",
  "CS-305": "#f59e0b",
};

export function computeStudentAttendance(studentRollOrEmail?: string): ComputedStudentAttendance {
  const sessions = loadLectureSessions();
  const courses = loadTeacherCourses();

  // Normalize student lookup
  const cleanId = (studentRollOrEmail || "").trim().toLowerCase();

  const subjectsMap: Record<string, { attended: number; total: number; name: string }> = {};

  // Initialize for all active teacher courses
  courses.forEach(c => {
    subjectsMap[c.code] = { attended: 0, total: 0, name: c.name };
  });

  // Tally each lecture session marked by teachers
  sessions.forEach(sess => {
    const code = sess.courseCode;
    if (!subjectsMap[code]) {
      subjectsMap[code] = { attended: 0, total: 0, name: sess.courseName };
    }

    subjectsMap[code].total += 1;

    // Check student's marked presence
    const found = sess.students.find(s => {
      const r = s.rollNo.toLowerCase();
      return r === cleanId || cleanId.includes(r) || r.includes(cleanId);
    });

    if (found) {
      if (found.isPresent) {
        subjectsMap[code].attended += 1;
      }
    } else {
      // Default present if student not explicitly marked absent
      subjectsMap[code].attended += 1;
    }
  });

  let grandAttended = 0;
  let grandTotal = 0;

  const subjects: StudentSubjectAttendance[] = Object.entries(subjectsMap).map(([code, data]) => {
    grandAttended += data.attended;
    grandTotal += data.total;
    const pct = data.total > 0 ? Math.round((data.attended / data.total) * 100) : 100;
    return {
      code,
      name: data.name,
      attended: data.attended,
      total: data.total,
      percentage: pct,
      color: SUBJECT_COLORS[code] || "#3b82f6",
    };
  });

  // Calculate overall percentage
  const overallPercentage = grandTotal > 0 ? Math.round((grandAttended / grandTotal) * 100) : 91;

  return {
    overallPercentage: overallPercentage > 0 ? overallPercentage : 91,
    totalAttended: grandAttended,
    totalHeld: grandTotal,
    cgpa: 8.7,
    noticesCount: 4,
    subjects,
  };
}

export function loadQuizzes(): QuizItem[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("nith_quizzes");
  if (stored) {
    try {
      return JSON.parse(stored) as QuizItem[];
    } catch {
      return [];
    }
  }
  return [
    {
      id: "q-1",
      name: "Quiz 1 (Data Structures)",
      course: "CS 102",
      date: "2026-08-14",
      venue: "10:00 AM • LH-104",
      topics: "Arrays, Pointers, Structs",
      status: "Evaluated (Avg: 16.2/20)"
    },
    {
      id: "q-2",
      name: "Quiz 2 (Recursion & Sorting)",
      course: "CS 102",
      date: "2026-09-18",
      venue: "10:00 AM • LH-104",
      topics: "Merge Sort, Quick Sort, Backtracking",
      status: "Evaluated (Avg: 15.4/20)"
    },
    {
      id: "q-3",
      name: "Quiz 3 (Linked Lists & Trees)",
      course: "CS 102",
      date: "2026-10-24",
      venue: "10:00 AM • LH-104",
      topics: "BST, Inorder Traversal, Deletion",
      status: "Upcoming Scheduled"
    }
  ];
}

export function saveQuiz(quiz: QuizItem): QuizItem[] {
  const current = loadQuizzes();
  const existingIndex = current.findIndex(q => q.id === quiz.id);
  
  if (existingIndex >= 0) {
    current[existingIndex] = quiz;
  } else {
    current.push(quiz);
  }
  
  if (typeof window !== "undefined") {
    localStorage.setItem("nith_quizzes", JSON.stringify(current));
  }
  
  return current;
}
