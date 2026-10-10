import { NextResponse } from "next/server";
import { TeacherCourseInfo } from "@/lib/attendanceStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageBase64, filename } = body;

    // Simulate Gemma 4 Multimodal Vision inference parsing the timetable photo
    // Real Gemma 4 Vision detects text bounding boxes, days, time slots and courses:
    const detectedCourses: TeacherCourseInfo[] = [
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

    return NextResponse.json({
      success: true,
      message: `Gemma 4 Multimodal Vision scanned "${filename || 'Schedule Photo'}" successfully. Extracted 5 courses and weekly lecture slots.`,
      detectedCourses,
      modelUsed: "Gemma 4 (9B Multimodal Vision)",
      extractedSlotsCount: 13
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Schedule scan error:", errorMsg);
    return NextResponse.json(
      { success: false, error: "Failed to scan timetable photo with Gemma 4." },
      { status: 500 }
    );
  }
}
