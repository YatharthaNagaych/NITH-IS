export interface Course {
  code: string;
  name: string;
  faculty: string;
  attended: number;
  total: number;
  credits: number;
}

export interface TimetableSlot {
  time: string;
  subject: string;
  room: string;
  faculty: string;
  active?: boolean;
}

export interface DepartmentInfo {
  name: string;
  batchTag: string;
  classroom: string;
  sectionCode: string;
  rollRange: string;
  upcoming: {
    time: string;
    subject: string;
    room: string;
    faculty: string;
    inMins: string;
  };
  courses: Course[];
  timetable: Record<string, TimetableSlot[]>;
}

export interface GatePass {
  id: string;
  pass_number: string;
  student_roll_no: string;
  student_name: string;
  hostel_name: string;
  room_no: string;
  destination: string;
  out_time: string;
  in_time: string;
  status: string;
  created_at: string;
}

export interface UserAccount {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'staff' | 'admission';
  roll_no_or_emp_id: string;
  is_verified: boolean;
  created_at: string;
  department?: string;
  password?: string;
}

export interface AttendanceRecord {
  id: string;
  student_roll_no: string;
  subject_code: string;
  subject_name: string;
  attended_classes: number;
  total_classes: number;
  percentage: number;
  status: 'Safe' | 'Shortage';
}

export interface SyllabusRecord {
  id: string;
  course_code: string;
  course_name: string;
  faculty_id: string;
  units_completed: number;
  total_units: number;
  syllabus_percent: number;
}

// =========================================================================
// OFFICIAL NIT HAMIRPUR 1ST YEAR ODD SEMESTER TIMETABLES & SCHEDULES
// Extracted from official "Time table 1st year_Updated.pdf" (Office of Dean Academic)
// =========================================================================
export const DEPARTMENTS_DATA: Record<string, DepartmentInfo> = {
  CE: {
    name: "Civil Engineering (CE)",
    batchTag: "Section D • 26BCE091-26BCE123 • Classroom F1",
    classroom: "F1 (Vivekananda Lecture Hall Complex, 1st Floor)",
    sectionCode: "Section D",
    rollRange: "26BCE091 - 26BCE123 (including Yathartha Nagaych 26bce123)",
    upcoming: {
      time: "10:00 AM - 11:00 AM",
      subject: "MA-111: Mathematics-I",
      room: "Classroom F1 (VLHC 1st Floor)",
      faculty: "Dr. Shilpa • Dept. of Mathematics",
      inMins: "In 15 mins"
    },
    courses: [
      { code: "MA-111", name: "Mathematics-I", faculty: "Dr. Shilpa", attended: 33, total: 38, credits: 4 },
      { code: "PH-101", name: "Physics", faculty: "Dr. Shailja", attended: 27, total: 36, credits: 4 },
      { code: "ME-101", name: "Engineering Graphics", faculty: "Er. Abhishek", attended: 31, total: 37, credits: 3 },
      { code: "CS-111", name: "Computer Programming", faculty: "Dr. Khalid", attended: 30, total: 38, credits: 4 },
      { code: "HS-101", name: "Communication Skills", faculty: "Dr. Sumita", attended: 22, total: 24, credits: 2 },
      { code: "HS-103", name: "Professional Ethics", faculty: "Dr. Spriha", attended: 18, total: 20, credits: 2 },
      { code: "ME-102", name: "Workshop Practice", faculty: "Er. Ankush", attended: 14, total: 15, credits: 2 },
      { code: "PH-102", name: "Physics Laboratory", faculty: "Dr. Shailja", attended: 14, total: 15, credits: 2 }
    ],
    timetable: {
      Mon: [
        { time: "10:00 - 11:00 AM", subject: "CS-111(P) / PH-102 Lab", room: "F1 / Physics Lab", faculty: "Dr. Khalid / Dr. Shailja" },
        { time: "11:00 - 12:00 PM", subject: "ME-101: Engineering Graphics", room: "F1 (VLHC 1st Floor)", faculty: "Er. Abhishek" },
        { time: "12:00 - 01:00 PM", subject: "CS-111: Computer Programming", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Khalid" },
        { time: "01:00 - 02:00 PM", subject: "HS-102: Communication Tutorial", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Sumita" }
      ],
      Tue: [
        { time: "11:00 - 12:00 PM", subject: "HS-101: Communication Skills", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Sumita" },
        { time: "12:00 - 01:00 PM", subject: "HS-103: Professional Ethics", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Spriha" }
      ],
      Wed: [
        { time: "09:00 - 10:00 AM", subject: "CS-111(P) / PH-102 Lab", room: "Computing Lab / Physics Lab", faculty: "Dr. Khalid / Dr. Shailja" },
        { time: "10:00 - 11:00 AM", subject: "MA-111: Mathematics-I", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Shilpa", active: true },
        { time: "11:00 - 12:00 PM", subject: "PH-101: Physics", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Shailja" },
        { time: "12:00 - 01:00 PM", subject: "HS-101: Communication Skills", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Sumita" },
        { time: "01:00 - 02:00 PM", subject: "HS-103: Professional Ethics", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Spriha" }
      ],
      Thu: [
        { time: "09:00 - 10:00 AM", subject: "ME-101: Engineering Graphics", room: "F1 (VLHC 1st Floor)", faculty: "Er. Abhishek" },
        { time: "10:00 - 11:00 AM", subject: "ME-102: Workshop Practice", room: "Workshop Block (Near SBI)", faculty: "Er. Ankush" },
        { time: "11:00 - 12:00 PM", subject: "MA-111: Mathematics-I", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Shilpa" },
        { time: "12:00 - 01:00 PM", subject: "PH-101: Physics", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Shailja" },
        { time: "02:00 - 05:00 PM", subject: "ME-102: Workshop Practice (P)", room: "Workshop Block", faculty: "Er. Ankush" }
      ],
      Fri: [
        { time: "09:00 - 10:00 AM", subject: "ME-101: Engineering Graphics", room: "F1 (VLHC 1st Floor)", faculty: "Er. Abhishek" },
        { time: "10:00 - 11:00 AM", subject: "CS-111: Computer Programming", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Khalid" },
        { time: "11:00 - 12:00 PM", subject: "MA-111: Mathematics-I", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Shilpa" },
        { time: "12:00 - 01:00 PM", subject: "PH-101: Physics", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Shailja" }
      ]
    }
  },

  CSE: {
    name: "Computer Science & Engineering (CSE)",
    batchTag: "Section F • 26BCS001-26BCS090 • Classroom B2",
    classroom: "B2 (Vivekananda Lecture Hall Complex, Basement)",
    sectionCode: "Section F",
    rollRange: "26BCS001 - 26BCS090",
    upcoming: {
      time: "10:00 AM - 11:00 AM",
      subject: "MA-111: Mathematics-I",
      room: "Classroom B2 (VLHC Basement)",
      faculty: "Dr. Maan • Dept. of Mathematics",
      inMins: "In 15 mins"
    },
    courses: [
      { code: "CS-111", name: "Computer Programming", faculty: "Dr. Vidyotima", attended: 35, total: 39, credits: 4 },
      { code: "MA-111", name: "Mathematics-I", faculty: "Dr. Maan", attended: 33, total: 38, credits: 4 },
      { code: "CY-101", name: "Engineering Chemistry", faculty: "Dr. Raj K", attended: 29, total: 36, credits: 4 },
      { code: "EE-101", name: "Basic Electrical Engineering", faculty: "Dr. Ravi", attended: 31, total: 37, credits: 3 },
      { code: "EC-101", name: "Basic Electronics Engineering", faculty: "Dr. Deepanshu", attended: 28, total: 36, credits: 3 },
      { code: "EN-101", name: "Communication Skills", faculty: "Dr. Adya", attended: 21, total: 24, credits: 2 },
      { code: "MB-101", name: "Management & Professional Ethics", faculty: "Dr. Kamboj", attended: 19, total: 22, credits: 2 },
      { code: "CY-102", name: "Chemistry Laboratory", faculty: "Dr. Varun", attended: 14, total: 15, credits: 2 }
    ],
    timetable: {
      Mon: [
        { time: "09:00 - 11:00 AM", subject: "CY-102(P): Chemistry Lab", room: "Chemistry Lab", faculty: "Dr. Varun / Dr. K S Ghosh" },
        { time: "11:00 - 12:00 PM", subject: "CS-111: Computer Programming", room: "B2 (VLHC Basement)", faculty: "Dr. Vidyotima" },
        { time: "12:00 - 01:00 PM", subject: "EN-101: Communication Skills", room: "B2 (VLHC Basement)", faculty: "Dr. Adya" },
        { time: "02:00 - 03:00 PM", subject: "MB-101: Management & Ethics", room: "B2 (VLHC Basement)", faculty: "Dr. Kamboj" },
        { time: "03:00 - 05:00 PM", subject: "EE-102(P): Electrical Lab / CS-111 Lab", room: "Machines Lab / CC Lab", faculty: "Dr. Ashok / Dr. Vidyotima" }
      ],
      Tue: [
        { time: "09:00 - 11:00 AM", subject: "CY-102(P) / EE-102 Lab", room: "Chemistry Lab / Electrical Lab", faculty: "Dr. K S Ghosh / Dr. Krishan K" },
        { time: "11:00 - 12:00 PM", subject: "CS-111: Computer Programming", room: "B2 (VLHC Basement)", faculty: "Dr. Vidyotima" },
        { time: "12:00 - 01:00 PM", subject: "EN-101: Communication Skills", room: "B2 (VLHC Basement)", faculty: "Dr. Adya" }
      ],
      Wed: [
        { time: "10:00 - 11:00 AM", subject: "MA-111: Mathematics-I", room: "B2 (VLHC Basement)", faculty: "Dr. Maan", active: true },
        { time: "11:00 - 12:00 PM", subject: "CY-101: Engineering Chemistry", room: "B2 (VLHC Basement)", faculty: "Dr. Raj K" },
        { time: "12:00 - 01:00 PM", subject: "CE-101: Engineering Drawing", room: "DRG Hall (Admin Block)", faculty: "Er. Harshita" },
        { time: "02:00 - 04:00 PM", subject: "CE-101(P): Drawing Practical", room: "DRG Hall", faculty: "Er. Harshita, Anita, Amit" }
      ],
      Thu: [
        { time: "10:00 - 11:00 AM", subject: "EE-101: Basic Electrical Engg", room: "B2 (VLHC Basement)", faculty: "Dr. Ravi" },
        { time: "11:00 - 12:00 PM", subject: "EC-101: Basic Electronics Engg", room: "B2 (VLHC Basement)", faculty: "Dr. Deepanshu" },
        { time: "12:00 - 01:00 PM", subject: "MA-111: Mathematics-I", room: "B2 (VLHC Basement)", faculty: "Dr. Maan" },
        { time: "01:00 - 02:00 PM", subject: "CY-101: Engineering Chemistry", room: "B2 (VLHC Basement)", faculty: "Dr. Raj K" }
      ],
      Fri: [
        { time: "09:00 - 10:00 AM", subject: "EE-101: Basic Electrical Engg", room: "B2 (VLHC Basement)", faculty: "Dr. Ravi" },
        { time: "10:00 - 11:00 AM", subject: "EC-101: Basic Electronics Engg", room: "B2 (VLHC Basement)", faculty: "Dr. Deepanshu" },
        { time: "11:00 - 12:00 PM", subject: "MA-111: Mathematics-I", room: "B2 (VLHC Basement)", faculty: "Dr. Maan" },
        { time: "12:00 - 01:00 PM", subject: "CY-101: Engineering Chemistry", room: "B2 (VLHC Basement)", faculty: "Dr. Raj K" }
      ]
    }
  },

  ECE: {
    name: "Electronics & Communication Engineering (ECE)",
    batchTag: "Section G • 26BEC001-26BEC090 • Classroom G1",
    classroom: "G1 (Vivekananda Lecture Hall Complex, Ground Floor)",
    sectionCode: "Section G",
    rollRange: "26BEC001 - 26BEC090",
    upcoming: {
      time: "10:00 AM - 11:00 AM",
      subject: "CY-101: Engineering Chemistry",
      room: "Classroom G1 (VLHC Ground Floor)",
      faculty: "Dr. J. Prakash • Dept. of Chemistry",
      inMins: "In 15 mins"
    },
    courses: [
      { code: "EC-101", name: "Basic Electronics Engineering", faculty: "Dr. Abhishek", attended: 34, total: 38, credits: 3 },
      { code: "EE-101", name: "Basic Electrical Engineering", faculty: "Dr. Neeraj", attended: 31, total: 37, credits: 3 },
      { code: "MA-111", name: "Mathematics-I", faculty: "Dr. Monika", attended: 33, total: 38, credits: 4 },
      { code: "CY-101", name: "Engineering Chemistry", faculty: "Dr. J. Prakash", attended: 28, total: 36, credits: 4 },
      { code: "CS-111", name: "Computer Programming", faculty: "Dr. M. Nayyer", attended: 32, total: 38, credits: 4 },
      { code: "EN-101", name: "Communication Skills", faculty: "Dr. Ravin", attended: 21, total: 24, credits: 2 },
      { code: "CE-101", name: "Engineering Drawing", faculty: "Er. Rajat", attended: 25, total: 30, credits: 3 }
    ],
    timetable: {
      Mon: [
        { time: "09:00 - 10:00 AM", subject: "EE-101: Basic Electrical Engg", room: "G1 (VLHC Ground Floor)", faculty: "Dr. Neeraj" },
        { time: "10:00 - 11:00 AM", subject: "EC-101: Basic Electronics Engg", room: "G1 (VLHC Ground Floor)", faculty: "Dr. Abhishek" },
        { time: "11:00 - 12:00 PM", subject: "MA-111: Mathematics-I", room: "G1 (VLHC Ground Floor)", faculty: "Dr. Monika" },
        { time: "12:00 - 01:00 PM", subject: "CY-101: Engineering Chemistry", room: "G1 (VLHC Ground Floor)", faculty: "Dr. J. Prakash" },
        { time: "02:00 - 05:00 PM", subject: "CE-101: Engineering Drawing & (P)", room: "DRG Hall (Admin Block)", faculty: "Er. Rajat, Ram Raj, Amit" }
      ],
      Tue: [
        { time: "09:00 - 10:00 AM", subject: "EE-101: Basic Electrical Engg", room: "G1 (VLHC Ground Floor)", faculty: "Dr. Neeraj" },
        { time: "10:00 - 11:00 AM", subject: "EC-101: Basic Electronics Engg", room: "G1 (VLHC Ground Floor)", faculty: "Dr. Abhishek" },
        { time: "11:00 - 12:00 PM", subject: "MA-111: Mathematics-I", room: "G1 (VLHC Ground Floor)", faculty: "Dr. Monika" },
        { time: "12:00 - 01:00 PM", subject: "CY-101: Engineering Chemistry", room: "G1 (VLHC Ground Floor)", faculty: "Dr. J. Prakash" }
      ],
      Wed: [
        { time: "09:00 - 10:00 AM", subject: "MA-111: Mathematics-I", room: "G1 (VLHC Ground Floor)", faculty: "Dr. Monika" },
        { time: "10:00 - 11:00 AM", subject: "CY-101: Engineering Chemistry", room: "G1 (VLHC Ground Floor)", faculty: "Dr. J. Prakash", active: true },
        { time: "11:00 - 01:00 PM", subject: "CS-111 Lab / CY-102 Lab / EE-102 Lab", room: "Various Dept Labs", faculty: "Dr. M. Nayyer / Dr. J. Prakash" }
      ],
      Thu: [
        { time: "09:00 - 11:00 AM", subject: "CS-111 Lab / CY-102 Lab / EE-102 Lab", room: "Respective Labs", faculty: "Dr. J. Prakash / Dr. P. Awasthi" },
        { time: "11:00 - 12:00 PM", subject: "CS-111: Computer Programming", room: "G1 (VLHC Ground Floor)", faculty: "Dr. M. Nayyer" },
        { time: "12:00 - 01:00 PM", subject: "EN-101: Communication Skills", room: "G1 (VLHC Ground Floor)", faculty: "Dr. Ravin" }
      ],
      Fri: [
        { time: "10:00 - 11:00 AM", subject: "CS-111: Computer Programming", room: "G1 (VLHC Ground Floor)", faculty: "Dr. M. Nayyer" },
        { time: "11:00 - 12:00 PM", subject: "EN-101: Communication Skills", room: "G1 (VLHC Ground Floor)", faculty: "Dr. Ravin" },
        { time: "01:00 - 02:00 PM", subject: "MB-101: Management & Ethics", room: "G1 (VLHC Ground Floor)", faculty: "Dr. Richa" }
      ]
    }
  },

  ME: {
    name: "Mechanical Engineering (ME)",
    batchTag: "Section B • 26BME001-26BME090 • Classroom G1",
    classroom: "G1 (Vivekananda Lecture Hall Complex, Ground Floor)",
    sectionCode: "Section B",
    rollRange: "26BME001 - 26BME090",
    upcoming: {
      time: "10:00 AM - 11:00 AM",
      subject: "MA-111: Mathematics-I",
      room: "Classroom G1 (VLHC Ground Floor)",
      faculty: "Dr. Pawan K • Dept. of Mathematics",
      inMins: "In 15 mins"
    },
    courses: [
      { code: "ME-101", name: "Elements of Mechanical Engineering", faculty: "Dr. Deepak", attended: 33, total: 38, credits: 4 },
      { code: "MA-111", name: "Mathematics-I", faculty: "Dr. Pawan K", attended: 34, total: 39, credits: 4 },
      { code: "PH-101", name: "Physics", faculty: "Dr. B. Das", attended: 28, total: 36, credits: 4 },
      { code: "CS-111", name: "Computer Programming", faculty: "Dr. Jyoti", attended: 31, total: 37, credits: 4 },
      { code: "HS-101", name: "Communication Skills", faculty: "Dr. P. Puri", attended: 21, total: 24, credits: 2 },
      { code: "HS-103", name: "Professional Ethics", faculty: "Dr. Vishal", attended: 18, total: 20, credits: 2 },
      { code: "ME-102", name: "Workshop Practice", faculty: "Er. K Dass", attended: 14, total: 15, credits: 2 }
    ],
    timetable: {
      Mon: [
        { time: "09:00 - 10:00 AM", subject: "CS-111 Lab / PH-102 Lab", room: "Computing Lab / Physics Lab", faculty: "Dr. Jyoti / Dr. Suresh" },
        { time: "10:00 - 12:00 PM", subject: "ME-102: Workshop Practice", room: "Workshop Block (Near SBI)", faculty: "Er. K Dass" },
        { time: "12:00 - 01:00 PM", subject: "ME-101: Elements of Mech Engg", room: "G1 (VLHC Ground Floor)", faculty: "Dr. Deepak" },
        { time: "02:00 - 03:00 PM", subject: "ME-102: Workshop Tutorial", room: "G1 (VLHC Ground Floor)", faculty: "Er. K Dass" }
      ],
      Tue: [
        { time: "09:00 - 11:00 AM", subject: "CS-111 Lab / PH-102 Lab / HS-102", room: "Respective Labs", faculty: "Dr. Jyoti / Dr. Shailja / Dr. P. Puri" },
        { time: "11:00 - 12:00 PM", subject: "HS-103: Professional Ethics", room: "G1 (VLHC Ground Floor)", faculty: "Dr. Vishal" },
        { time: "12:00 - 01:00 PM", subject: "CS-111: Computer Programming", room: "G1 (VLHC Ground Floor)", faculty: "Dr. Jyoti" }
      ],
      Wed: [
        { time: "10:00 - 11:00 AM", subject: "MA-111: Mathematics-I", room: "G1 (VLHC Ground Floor)", faculty: "Dr. Pawan K", active: true },
        { time: "11:00 - 12:00 PM", subject: "PH-101: Physics", room: "G1 (VLHC Ground Floor)", faculty: "Dr. B. Das" },
        { time: "12:00 - 01:00 PM", subject: "HS-103: Professional Ethics", room: "G1 (VLHC Ground Floor)", faculty: "Dr. Vishal" },
        { time: "01:00 - 02:00 PM", subject: "CS-111: Computer Programming", room: "G1 (VLHC Ground Floor)", faculty: "Dr. Jyoti" }
      ],
      Thu: [
        { time: "09:00 - 10:00 AM", subject: "ME-101: Elements of Mech Engg", room: "G1 (VLHC Ground Floor)", faculty: "Dr. Deepak" },
        { time: "10:00 - 11:00 AM", subject: "HS-101: Communication Skills", room: "G1 (VLHC Ground Floor)", faculty: "Dr. P. Puri" },
        { time: "11:00 - 12:00 PM", subject: "MA-111: Mathematics-I", room: "G1 (VLHC Ground Floor)", faculty: "Dr. Pawan K" },
        { time: "12:00 - 01:00 PM", subject: "PH-101: Physics", room: "G1 (VLHC Ground Floor)", faculty: "Dr. B. Das" }
      ],
      Fri: [
        { time: "09:00 - 10:00 AM", subject: "ME-101: Elements of Mech Engg", room: "G1 (VLHC Ground Floor)", faculty: "Dr. Deepak" },
        { time: "10:00 - 11:00 AM", subject: "HS-101: Communication Skills", room: "G1 (VLHC Ground Floor)", faculty: "Dr. P. Puri" },
        { time: "11:00 - 12:00 PM", subject: "MA-111: Mathematics-I", room: "G1 (VLHC Ground Floor)", faculty: "Dr. Pawan K" },
        { time: "12:00 - 01:00 PM", subject: "PH-101: Physics", room: "G1 (VLHC Ground Floor)", faculty: "Dr. B. Das" }
      ]
    }
  },

  EE: {
    name: "Electrical Engineering (EE)",
    batchTag: "Section H • 26BEE001-26BEE090 • Classroom G2",
    classroom: "G2 (Vivekananda Lecture Hall Complex, Ground Floor)",
    sectionCode: "Section H",
    rollRange: "26BEE001 - 26BEE090",
    upcoming: {
      time: "10:00 AM - 11:00 AM",
      subject: "MA-111: Mathematics-I",
      room: "Classroom G2 (VLHC Ground Floor)",
      faculty: "Dr. Shruti • Dept. of Mathematics",
      inMins: "In 15 mins"
    },
    courses: [
      { code: "EE-101", name: "Basic Electrical Engineering", faculty: "Dr. Vishal", attended: 33, total: 38, credits: 3 },
      { code: "CS-111", name: "Computer Programming", faculty: "Dr. Pratibha", attended: 30, total: 37, credits: 4 },
      { code: "MA-111", name: "Mathematics-I", faculty: "Dr. Shruti", attended: 34, total: 39, credits: 4 },
      { code: "CY-101", name: "Engineering Chemistry", faculty: "Dr. J. Kuchlyan", attended: 27, total: 36, credits: 4 },
      { code: "EC-101", name: "Basic Electronics Engineering", faculty: "Dr. Abhishek", attended: 29, total: 36, credits: 3 },
      { code: "EN-101", name: "Communication Skills", faculty: "Dr. Ravin", attended: 20, total: 24, credits: 2 },
      { code: "CE-101", name: "Engineering Drawing", faculty: "Er. Shubham", attended: 25, total: 30, credits: 3 }
    ],
    timetable: {
      Mon: [
        { time: "11:00 - 12:00 PM", subject: "CS-111: Computer Programming", room: "G2 (VLHC Ground Floor)", faculty: "Dr. Pratibha" },
        { time: "12:00 - 01:00 PM", subject: "EE-101: Basic Electrical Engg", room: "G2 (VLHC Ground Floor)", faculty: "Dr. Vishal" }
      ],
      Tue: [
        { time: "09:00 - 11:00 AM", subject: "CY-102 Lab / EE-102 Lab / CS-111 Lab", room: "Various Dept Labs", faculty: "Dr. J. Kuchlyan / Dr. Saurabh" },
        { time: "11:00 - 12:00 PM", subject: "CS-111: Computer Programming", room: "G2 (VLHC Ground Floor)", faculty: "Dr. Pratibha" },
        { time: "12:00 - 01:00 PM", subject: "EE-101: Basic Electrical Engg", room: "G2 (VLHC Ground Floor)", faculty: "Dr. Vishal" },
        { time: "01:00 - 02:00 PM", subject: "MB-101: Management & Ethics", room: "G2 (VLHC Ground Floor)", faculty: "Dr. Pratima" }
      ],
      Wed: [
        { time: "09:00 - 10:00 AM", subject: "CY-102 Lab / EE-102 Lab", room: "Chemistry Lab / Machines Lab", faculty: "Dr. J. Kuchlyan / Dr. Aman" },
        { time: "10:00 - 11:00 AM", subject: "MA-111: Mathematics-I", room: "G2 (VLHC Ground Floor)", faculty: "Dr. Shruti", active: true },
        { time: "11:00 - 12:00 PM", subject: "CY-101: Engineering Chemistry", room: "G2 (VLHC Ground Floor)", faculty: "Dr. J. Kuchlyan" },
        { time: "02:00 - 04:00 PM", subject: "CY-102 Lab / EE-102 Lab / CS-111 Lab", room: "Respective Labs", faculty: "Dr. Arun / Dr. Rakesh" }
      ],
      Thu: [
        { time: "10:00 - 11:00 AM", subject: "EN-101: Communication Skills", room: "G2 (VLHC Ground Floor)", faculty: "Dr. Ravin" },
        { time: "11:00 - 12:00 PM", subject: "EC-101: Basic Electronics Engg", room: "G2 (VLHC Ground Floor)", faculty: "Dr. Abhishek" },
        { time: "12:00 - 01:00 PM", subject: "MA-111: Mathematics-I", room: "G2 (VLHC Ground Floor)", faculty: "Dr. Shruti" },
        { time: "01:00 - 02:00 PM", subject: "CY-101: Engineering Chemistry", room: "G2 (VLHC Ground Floor)", faculty: "Dr. J. Kuchlyan" },
        { time: "03:00 - 06:00 PM", subject: "CE-101: Drawing & Practice", room: "DRG Hall (Admin Block)", faculty: "Er. Shubham, Sumit, Rajat" }
      ],
      Fri: [
        { time: "09:00 - 10:00 AM", subject: "EN-101: Communication Skills", room: "G2 (VLHC Ground Floor)", faculty: "Dr. Ravin" },
        { time: "10:00 - 11:00 AM", subject: "EC-101: Basic Electronics Engg", room: "G2 (VLHC Ground Floor)", faculty: "Dr. Abhishek" },
        { time: "11:00 - 12:00 PM", subject: "MA-111: Mathematics-I", room: "G2 (VLHC Ground Floor)", faculty: "Dr. Shruti" },
        { time: "12:00 - 01:00 PM", subject: "CY-101: Engineering Chemistry", room: "G2 (VLHC Ground Floor)", faculty: "Dr. J. Kuchlyan" }
      ]
    }
  },

  CHE: {
    name: "Chemical Engineering (CHE)",
    batchTag: "Section I • 26BCH001-26BCH076 • Classroom F1",
    classroom: "F1 (Vivekananda Lecture Hall Complex, 1st Floor)",
    sectionCode: "Section I",
    rollRange: "26BCH001 - 26BCH076",
    upcoming: {
      time: "10:00 AM - 11:00 AM",
      subject: "CY-101: Engineering Chemistry",
      room: "Classroom F1 (VLHC 1st Floor)",
      faculty: "Dr. Varun • Dept. of Chemistry",
      inMins: "In 15 mins"
    },
    courses: [
      { code: "CY-101", name: "Engineering Chemistry", faculty: "Dr. Varun", attended: 32, total: 37, credits: 4 },
      { code: "MA-111", name: "Mathematics-I", faculty: "Dr. Suket", attended: 31, total: 38, credits: 4 },
      { code: "EC-101", name: "Basic Electronics Engineering", faculty: "Dr. Apoorva", attended: 29, total: 36, credits: 3 },
      { code: "EE-101", name: "Basic Electrical Engineering", faculty: "Dr. Abhishek", attended: 28, total: 36, credits: 3 },
      { code: "CS-111", name: "Computer Programming", faculty: "Dr. Shobhna", attended: 33, total: 38, credits: 4 },
      { code: "EN-101", name: "Communication Skills", faculty: "Dr. Neha", attended: 21, total: 24, credits: 2 },
      { code: "CE-101", name: "Engineering Drawing", faculty: "Er. Anita", attended: 25, total: 30, credits: 3 }
    ],
    timetable: {
      Mon: [
        { time: "09:00 - 10:00 AM", subject: "EE-101: Basic Electrical Engg", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Abhishek" },
        { time: "10:00 - 11:00 AM", subject: "EC-101: Basic Electronics Engg", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Apoorva" },
        { time: "11:00 - 12:00 PM", subject: "MA-111: Mathematics-I", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Suket" },
        { time: "12:00 - 01:00 PM", subject: "CY-101: Engineering Chemistry", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Varun" }
      ],
      Tue: [
        { time: "09:00 - 10:00 AM", subject: "EE-101: Basic Electrical Engg", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Abhishek" },
        { time: "10:00 - 11:00 AM", subject: "EC-101: Basic Electronics Engg", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Apoorva" },
        { time: "11:00 - 12:00 PM", subject: "MA-111: Mathematics-I", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Suket" },
        { time: "12:00 - 01:00 PM", subject: "CY-101: Engineering Chemistry", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Varun" },
        { time: "02:00 - 05:00 PM", subject: "CE-101: Engineering Drawing (P)", room: "DRG Hall (Admin Block)", faculty: "Er. Anita, Ekta, Rajat" }
      ],
      Wed: [
        { time: "09:00 - 10:00 AM", subject: "MA-111: Mathematics-I", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Suket" },
        { time: "10:00 - 11:00 AM", subject: "CY-101: Engineering Chemistry", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Varun", active: true },
        { time: "02:00 - 05:00 PM", subject: "CS-111 Lab / CY-102 Lab / EE-102 Lab", room: "Various Dept Labs", faculty: "Dr. Shobhna / Dr. Varun / Dr. CS Prasad" }
      ],
      Thu: [
        { time: "12:00 - 01:00 PM", subject: "EN-101: Communication Skills", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Neha" },
        { time: "01:00 - 02:00 PM", subject: "CS-111: Computer Programming", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Shobhna" },
        { time: "02:00 - 05:00 PM", subject: "CS-111 Lab / CY-102 Lab / EE-102 Lab", room: "Respective Labs", faculty: "Dr. Shobhna / Dr. Varun" }
      ],
      Fri: [
        { time: "10:00 - 11:00 AM", subject: "EN-101: Communication Skills", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Neha" },
        { time: "11:00 - 12:00 PM", subject: "CS-111: Computer Programming", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Shobhna" },
        { time: "12:00 - 01:00 PM", subject: "MB-101: Management & Ethics", room: "F1 (VLHC 1st Floor)", faculty: "Dr. Pratima" }
      ]
    }
  },

  MC: {
    name: "Mathematics & Computing (M&C)",
    batchTag: "Section E • 26BMA001-26BMA050 • Classroom F2",
    classroom: "F2 (Vivekananda Lecture Hall Complex, 1st Floor)",
    sectionCode: "Section E",
    rollRange: "26BMA001 - 26BMA050",
    upcoming: {
      time: "10:00 AM - 11:00 AM",
      subject: "PH-101: Physics",
      room: "Classroom F2 (VLHC 1st Floor)",
      faculty: "Dr. S Kaur • Dept. of Physics",
      inMins: "In 15 mins"
    },
    courses: [
      { code: "MA-111", name: "Mathematics-I (Calculus & Linear Algebra)", faculty: "Dr. Soniya", attended: 35, total: 39, credits: 4 },
      { code: "PH-101", name: "Physics", faculty: "Dr. S Kaur", attended: 29, total: 37, credits: 4 },
      { code: "CS-111", name: "Computer Programming", faculty: "Dr. Akanksha", attended: 34, total: 38, credits: 4 },
      { code: "ME-101", name: "Elements of Mechanical Engineering", faculty: "Er. Rohit", attended: 30, total: 36, credits: 4 },
      { code: "HS-101", name: "Communication Skills", faculty: "Dr. Sumita", attended: 21, total: 24, credits: 2 },
      { code: "HS-103", name: "Professional Ethics", faculty: "Dr. SK Negi", attended: 18, total: 20, credits: 2 },
      { code: "ME-102", name: "Workshop Practice", faculty: "Er. Ankush", attended: 14, total: 15, credits: 2 }
    ],
    timetable: {
      Mon: [
        { time: "11:00 - 12:00 PM", subject: "ME-101: Elements of Mech Engg", room: "F2 (VLHC 1st Floor)", faculty: "Er. Rohit" },
        { time: "12:00 - 01:00 PM", subject: "PH-101: Physics", room: "F2 (VLHC 1st Floor)", faculty: "Dr. S Kaur" }
      ],
      Tue: [
        { time: "11:00 - 12:00 PM", subject: "HS-103: Professional Ethics", room: "F2 (VLHC 1st Floor)", faculty: "Dr. SK Negi" },
        { time: "12:00 - 01:00 PM", subject: "HS-101: Communication Skills", room: "F2 (VLHC 1st Floor)", faculty: "Dr. Sumita" }
      ],
      Wed: [
        { time: "09:00 - 10:00 AM", subject: "MA-111: Mathematics-I", room: "F2 (VLHC 1st Floor)", faculty: "Dr. Soniya" },
        { time: "10:00 - 11:00 AM", subject: "PH-101: Physics", room: "F2 (VLHC 1st Floor)", faculty: "Dr. S Kaur", active: true },
        { time: "12:00 - 01:00 PM", subject: "CS-111 Lab / HS-103 / HS-101", room: "F2 (VLHC 1st Floor)", faculty: "Dr. Akanksha / Dr. SK Negi" },
        { time: "02:00 - 05:00 PM", subject: "PH-102: Physics Lab / HS-102 Tutorial", room: "Physics Lab / Humanities", faculty: "Dr. S Kaur / Dr. Sumita" }
      ],
      Thu: [
        { time: "09:00 - 10:00 AM", subject: "ME-101: Elements of Mech Engg", room: "F2 (VLHC 1st Floor)", faculty: "Er. Rohit" },
        { time: "10:00 - 11:00 AM", subject: "CS-111: Computer Programming", room: "F2 (VLHC 1st Floor)", faculty: "Dr. Akanksha" },
        { time: "11:00 - 12:00 PM", subject: "MA-111: Mathematics-I", room: "F2 (VLHC 1st Floor)", faculty: "Dr. Soniya" },
        { time: "12:00 - 01:00 PM", subject: "PH-101: Physics", room: "F2 (VLHC 1st Floor)", faculty: "Dr. S Kaur" }
      ],
      Fri: [
        { time: "09:00 - 10:00 AM", subject: "ME-101: Elements of Mech Engg", room: "F2 (VLHC 1st Floor)", faculty: "Er. Rohit" },
        { time: "10:00 - 11:00 AM", subject: "CS-111: Computer Programming", room: "F2 (VLHC 1st Floor)", faculty: "Dr. Akanksha" },
        { time: "11:00 - 12:00 PM", subject: "MA-111: Mathematics-I", room: "F2 (VLHC 1st Floor)", faculty: "Dr. Soniya" },
        { time: "12:00 - 01:00 PM", subject: "ME-102: Workshop Practice", room: "Workshop Block", faculty: "Er. Ankush" },
        { time: "02:00 - 05:00 PM", subject: "ME-102(P): Workshop Practice Lab", room: "Workshop Block (Near SBI)", faculty: "Er. Ankush" }
      ]
    }
  },

  MSE: {
    name: "Materials Science & Engineering (MSE)",
    batchTag: "Section E • 26BMS001-26BMS040 • Classroom F2",
    classroom: "F2 (Vivekananda Lecture Hall Complex, 1st Floor)",
    sectionCode: "Section E",
    rollRange: "26BMS001 - 26BMS040",
    upcoming: {
      time: "10:00 AM - 11:00 AM",
      subject: "PH-101: Physics",
      room: "Classroom F2 (VLHC 1st Floor)",
      faculty: "Dr. S Kaur • Dept. of Physics",
      inMins: "In 15 mins"
    },
    courses: [
      { code: "MA-111", name: "Mathematics-I", faculty: "Dr. Soniya", attended: 32, total: 38, credits: 4 },
      { code: "PH-101", name: "Physics", faculty: "Dr. S Kaur", attended: 28, total: 36, credits: 4 },
      { code: "CS-111", name: "Computer Programming", faculty: "Dr. Akanksha", attended: 31, total: 37, credits: 4 },
      { code: "ME-101", name: "Elements of Mechanical Engineering", faculty: "Er. Rohit", attended: 29, total: 36, credits: 4 },
      { code: "HS-101", name: "Communication Skills", faculty: "Dr. Sumita", attended: 20, total: 24, credits: 2 },
      { code: "ME-102", name: "Workshop Practice", faculty: "Er. Ankush", attended: 14, total: 15, credits: 2 }
    ],
    timetable: {
      Mon: [
        { time: "11:00 - 12:00 PM", subject: "ME-101: Elements of Mech Engg", room: "F2 (VLHC 1st Floor)", faculty: "Er. Rohit" },
        { time: "12:00 - 01:00 PM", subject: "PH-101: Physics", room: "F2 (VLHC 1st Floor)", faculty: "Dr. S Kaur" }
      ],
      Tue: [
        { time: "11:00 - 12:00 PM", subject: "HS-103: Professional Ethics", room: "F2 (VLHC 1st Floor)", faculty: "Dr. SK Negi" },
        { time: "12:00 - 01:00 PM", subject: "HS-101: Communication Skills", room: "F2 (VLHC 1st Floor)", faculty: "Dr. Sumita" }
      ],
      Wed: [
        { time: "09:00 - 10:00 AM", subject: "MA-111: Mathematics-I", room: "F2 (VLHC 1st Floor)", faculty: "Dr. Soniya" },
        { time: "10:00 - 11:00 AM", subject: "PH-101: Physics", room: "F2 (VLHC 1st Floor)", faculty: "Dr. S Kaur", active: true },
        { time: "02:00 - 05:00 PM", subject: "PH-102 Lab / HS-102 Tutorial", room: "Physics Lab / Humanities", faculty: "Dr. S Kaur / Dr. Sumita" }
      ],
      Thu: [
        { time: "09:00 - 10:00 AM", subject: "ME-101: Elements of Mech Engg", room: "F2 (VLHC 1st Floor)", faculty: "Er. Rohit" },
        { time: "10:00 - 11:00 AM", subject: "CS-111: Computer Programming", room: "F2 (VLHC 1st Floor)", faculty: "Dr. Akanksha" },
        { time: "11:00 - 12:00 PM", subject: "MA-111: Mathematics-I", room: "F2 (VLHC 1st Floor)", faculty: "Dr. Soniya" },
        { time: "12:00 - 01:00 PM", subject: "PH-101: Physics", room: "F2 (VLHC 1st Floor)", faculty: "Dr. S Kaur" }
      ],
      Fri: [
        { time: "09:00 - 10:00 AM", subject: "ME-101: Elements of Mech Engg", room: "F2 (VLHC 1st Floor)", faculty: "Er. Rohit" },
        { time: "10:00 - 11:00 AM", subject: "CS-111: Computer Programming", room: "F2 (VLHC 1st Floor)", faculty: "Dr. Akanksha" },
        { time: "11:00 - 12:00 PM", subject: "MA-111: Mathematics-I", room: "F2 (VLHC 1st Floor)", faculty: "Dr. Soniya" },
        { time: "12:00 - 01:00 PM", subject: "ME-102: Workshop Practice", room: "Workshop Block", faculty: "Er. Ankush" },
        { time: "02:00 - 05:00 PM", subject: "ME-102(P): Workshop Practice Lab", room: "Workshop Block", faculty: "Er. Ankush" }
      ]
    }
  },

  ARCH: {
    name: "Architecture (B.Arch)",
    batchTag: "Section Z • 26BAR001-26BAR058 • Studio I",
    classroom: "Studio I (Department of Architecture)",
    sectionCode: "Section Z",
    rollRange: "26BAR001 - 26BAR058",
    upcoming: {
      time: "11:00 AM - 01:00 PM",
      subject: "AR-111: Architectural Design-I",
      room: "Studio I (Dept of Architecture)",
      faculty: "Ar. RK, NK, BP • Dept. of Architecture",
      inMins: "In 15 mins"
    },
    courses: [
      { code: "AR-111", name: "Architectural Design-I", faculty: "Ar. RK, NK, BP", attended: 36, total: 40, credits: 5 },
      { code: "AR-112", name: "Building Construction-I", faculty: "Ar. SD, RS, DB", attended: 32, total: 38, credits: 4 },
      { code: "AR-113", name: "Architectural Drawing & Graphics", faculty: "Ar. AMI", attended: 34, total: 39, credits: 4 },
      { code: "AR-114", name: "Climatology & Environmental Studies", faculty: "Ar. BM, DB, VS", attended: 30, total: 36, credits: 3 },
      { code: "AR-115", name: "Theory of Design", faculty: "Ar. SR", attended: 28, total: 34, credits: 3 },
      { code: "MA-112", name: "Mathematics for Architects", faculty: "Dr. MS", attended: 31, total: 36, credits: 3 }
    ],
    timetable: {
      Mon: [
        { time: "09:00 - 10:00 AM", subject: "MA-112(L): Architecture Mathematics", room: "Studio I (Architecture)", faculty: "Dr. MS" },
        { time: "12:00 - 01:00 PM", subject: "AR-115(L): Theory of Design", room: "Studio I (Architecture)", faculty: "Ar. SR" },
        { time: "01:00 - 02:00 PM", subject: "AR-113(L): Architectural Drawing", room: "Studio I (Architecture)", faculty: "Ar. AMI" },
        { time: "02:00 - 03:00 PM", subject: "AR-113(T): Architectural Studio", room: "Studio I (Architecture)", faculty: "Ar. AMI" }
      ],
      Tue: [
        { time: "09:00 - 10:00 AM", subject: "MA-112(L): Architecture Mathematics", room: "Studio I (Architecture)", faculty: "Dr. MS" },
        { time: "11:00 - 01:00 PM", subject: "AR-112: Building Construction-I", room: "Studio I (Architecture)", faculty: "Ar. SD, RS, DB" },
        { time: "02:00 - 05:00 PM", subject: "AR-114: Climatology & Environment", room: "Studio I (Architecture)", faculty: "Ar. BM, DB, VS" }
      ],
      Wed: [
        { time: "09:00 - 11:00 AM", subject: "AR-112: Building Construction-I", room: "Studio I (Architecture)", faculty: "Ar. SD, RS, VF1" },
        { time: "11:00 - 01:00 PM", subject: "AR-111: Architectural Design-I", room: "Studio I (Architecture)", faculty: "Ar. RK, NK, BP", active: true },
        { time: "02:00 - 05:00 PM", subject: "AR-111: Architectural Design Studio", room: "Studio I (Architecture)", faculty: "Ar. RK, NK, BP, VS" }
      ],
      Thu: [
        { time: "09:00 - 10:00 AM", subject: "MA-112(L): Architecture Mathematics", room: "Studio I (Architecture)", faculty: "Dr. MS" },
        { time: "10:00 - 12:00 PM", subject: "AR-111: Architectural Design-I", room: "Studio I (Architecture)", faculty: "Ar. RK, NK, BP" },
        { time: "01:00 - 02:00 PM", subject: "AR-115(L): Theory of Design", room: "Studio I (Architecture)", faculty: "Ar. SR" },
        { time: "02:00 - 03:00 PM", subject: "AR-115(T): Theory Studio", room: "Studio I (Architecture)", faculty: "Ar. SR" }
      ],
      Fri: [
        { time: "09:00 - 10:00 AM", subject: "MA-112(T): Architecture Tutorial", room: "Studio I (Architecture)", faculty: "Dr. MS" },
        { time: "10:00 - 12:00 PM", subject: "AR-114: Climatology & Environment", room: "Studio I (Architecture)", faculty: "Ar. BM, DB" },
        { time: "12:00 - 01:00 PM", subject: "AR-113(L): Architectural Drawing", room: "Studio I (Architecture)", faculty: "Ar. AMI" }
      ]
    }
  }
};

export const INITIAL_USERS: UserAccount[] = [
  { id: "u-101", email: "26bce123@nith.ac.in", full_name: "Yathartha Nagaych", role: "student", roll_no_or_emp_id: "26bce123", is_verified: true, created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: "u-102", email: "26bcs042@nith.ac.in", full_name: "Aman Sharma", role: "student", roll_no_or_emp_id: "26BCS042", is_verified: true, created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: "u-103", email: "rksharma@nith.ac.in", full_name: "Prof. R. K. Sharma", role: "staff", roll_no_or_emp_id: "EMP-4091", is_verified: true, created_at: new Date(Date.now() - 86400000 * 12).toISOString() },
  { id: "u-104", email: "naveenchauhan@nith.ac.in", full_name: "Dr. Naveen Chauhan", role: "staff", roll_no_or_emp_id: "EMP-3088", is_verified: true, created_at: new Date(Date.now() - 86400000 * 15).toISOString() }
];

export const INITIAL_GATE_PASSES: GatePass[] = [
  { id: "gp-901", pass_number: "GP-2026-901", student_roll_no: "26bce123", student_name: "Yathartha Nagaych", hostel_name: "Kailash Boys Hostel", room_no: "B-214", destination: "Hamirpur Main Market (Stationery)", out_time: "17:00", in_time: "20:30", status: "APPROVED", created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: "gp-902", pass_number: "GP-2026-902", student_roll_no: "26BCS042", student_name: "Aman Sharma", hostel_name: "Kailash Boys Hostel", room_no: "B-108", destination: "Anu Chowk (Project Printouts)", out_time: "16:30", in_time: "19:45", status: "APPROVED", created_at: new Date(Date.now() - 3600000 * 5).toISOString() }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: "att-1", student_roll_no: "26bce123", subject_code: "MA-111", subject_name: "Mathematics-I", attended_classes: 33, total_classes: 38, percentage: 86.8, status: "Safe" },
  { id: "att-2", student_roll_no: "26bce123", subject_code: "PH-101", subject_name: "Physics", attended_classes: 27, total_classes: 36, percentage: 75.0, status: "Safe" },
  { id: "att-3", student_roll_no: "26bce123", subject_code: "ME-101", subject_name: "Engineering Graphics", attended_classes: 31, total_classes: 37, percentage: 83.8, status: "Safe" },
  { id: "att-4", student_roll_no: "26bce123", subject_code: "CS-111", subject_name: "Computer Programming", attended_classes: 30, total_classes: 38, percentage: 78.9, status: "Safe" }
];

export const INITIAL_SYLLABUS: SyllabusRecord[] = [
  { id: "syl-1", course_code: "MA-111", course_name: "Mathematics-I", faculty_id: "EMP-2041", units_completed: 3, total_units: 5, syllabus_percent: 60.0 },
  { id: "syl-2", course_code: "PH-101", course_name: "Physics", faculty_id: "EMP-4091", units_completed: 3, total_units: 5, syllabus_percent: 60.0 },
  { id: "syl-3", course_code: "CS-111", course_name: "Computer Programming", faculty_id: "EMP-3088", units_completed: 2, total_units: 5, syllabus_percent: 40.0 }
];
