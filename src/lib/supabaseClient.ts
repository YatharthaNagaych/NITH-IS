import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserAccount, AttendanceRecord, SyllabusRecord, INITIAL_USERS, INITIAL_ATTENDANCE, INITIAL_SYLLABUS } from './data';

export const DEFAULT_SUPABASE_URL = "https://nith-is-production.supabase.co";
export const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdGgtaXMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczODQ4MDAwMCwiZXhwIjoyMDU0MDQ4MDAwfQ.mock_signature_nith_is";

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === 'undefined') return null;
  if (cachedClient) return cachedClient;

  const url = localStorage.getItem("NITH_SUPABASE_URL") || DEFAULT_SUPABASE_URL;
  const key = localStorage.getItem("NITH_SUPABASE_KEY") || DEFAULT_SUPABASE_ANON_KEY;

  try {
    cachedClient = createClient(url, key);
    return cachedClient;
  } catch (err) {
    console.warn("Supabase init fallback:", err);
    return null;
  }
}

export function resetSupabaseClient(url: string, key: string): SupabaseClient | null {
  if (typeof window === 'undefined') return null;
  try {
    cachedClient = createClient(url, key);
    return cachedClient;
  } catch (err) {
    console.warn("Reset error:", err);
    return null;
  }
}

// Session Persistence Helpers
export function loadCurrentSessionUser(): UserAccount | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem("NITH_CURRENT_USER");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCurrentSessionUser(user: UserAccount | null) {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem("NITH_CURRENT_USER");
  } else {
    localStorage.setItem("NITH_CURRENT_USER", JSON.stringify(user));
  }
}

// Local Storage + Supabase Helpers
export function loadStoredUsers(): UserAccount[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  const raw = localStorage.getItem("NITH_DB_USERS");
  if (!raw) {
    localStorage.setItem("NITH_DB_USERS", JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveUserAccount(user: UserAccount) {
  if (typeof window === 'undefined') return;
  const users = loadStoredUsers();
  const idx = users.findIndex(u => u.email === user.email);
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...user };
  } else {
    users.unshift(user);
  }
  localStorage.setItem("NITH_DB_USERS", JSON.stringify(users));

  const client = getSupabaseClient();
  if (client) {
    client.from('nith_users').upsert([user]).then(res => {
      if (res.error) console.log("Supabase user sync buffer:", res.error.message);
    });
  }
}

export function loadStoredAttendance(): AttendanceRecord[] {
  if (typeof window === 'undefined') return INITIAL_ATTENDANCE;
  const raw = localStorage.getItem("NITH_DB_ATTENDANCE");
  if (!raw) {
    localStorage.setItem("NITH_DB_ATTENDANCE", JSON.stringify(INITIAL_ATTENDANCE));
    return INITIAL_ATTENDANCE;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_ATTENDANCE;
  }
}

export function saveAttendanceRecord(record: Partial<AttendanceRecord> & { student_roll_no: string; subject_code: string }) {
  if (typeof window === 'undefined') return;
  const atts = loadStoredAttendance();
  const idx = atts.findIndex(a => a.student_roll_no === record.student_roll_no && a.subject_code === record.subject_code);
  if (idx >= 0) {
    atts[idx] = { ...atts[idx], ...record } as AttendanceRecord;
  } else {
    atts.push({
      id: "att-" + Date.now(),
      attended_classes: record.attended_classes || 0,
      total_classes: record.total_classes || 1,
      percentage: record.percentage || 0,
      status: (record.percentage || 0) >= 75 ? 'Safe' : 'Shortage',
      subject_name: record.subject_name || record.subject_code,
      ...record
    } as AttendanceRecord);
  }
  localStorage.setItem("NITH_DB_ATTENDANCE", JSON.stringify(atts));

  const client = getSupabaseClient();
  if (client) {
    client.from('nith_attendance').upsert([record]).then(res => {
      if (res.error) console.log("Supabase attendance sync buffer:", res.error.message);
    });
  }
}

export function loadStoredSyllabus(): SyllabusRecord[] {
  if (typeof window === 'undefined') return INITIAL_SYLLABUS;
  const raw = localStorage.getItem("NITH_DB_SYLLABUS");
  if (!raw) {
    localStorage.setItem("NITH_DB_SYLLABUS", JSON.stringify(INITIAL_SYLLABUS));
    return INITIAL_SYLLABUS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_SYLLABUS;
  }
}
