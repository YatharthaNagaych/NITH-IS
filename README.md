# 🏛️ NIT Hamirpur Informatics System (NITH-IS) — Next.js Edition

> **Official Multi-Portal Institutional Hub for National Institute of Technology Hamirpur**  
> Powered by Next.js 14 (App Router) + TypeScript, Supabase Realtime Storage, and Google Gemma 4 AI Academic Copilot.

---

## 🌟 Key Features

1. Background Video
   - Edge-to-edge ambient campus showcase.
   - High contrast video stream with clean curved portal search bar and quick access chips.

2. **🎓 3 Institutional Gateways**:
   - **Student Gateway**: 75% Attendance compliance engine, faculty-synced attendance registry, weekly timetable, digital hostel QR gate passes, SGPA grade cards & fee receipts.
   - **Faculty & Staff Gateway**: Daily lecture conduction registers, syllabus progress logs (units 1–5 sliders), exam unit configurations & continuous assessment quiz scheduler.
   - **Admission Gateway**: JoSAA/CSAB applicant tracking portal with document verification stepper, seat allotment letter and fee breakdown.

3. **⚡ Supabase Realtime Cloud Database & Storage**:
   - Dual-mode local and cloud PostgreSQL persistence:
     - `nith_users`: Strict `@nith.ac.in` verified accounts with OTP authentication.
     - `nith_gate_passes`: Digital QR hostel passes for Kailash & Dhauladhar hostels.
     - `nith_attendance`: 75% attendance logs and ordinance compliance records.
     - `nith_syllabus`: Faculty syllabus completion records.
   - Interactive **Supabase Cloud Manager Modal** with live row counters, custom API key configuration, and 1-click PostgreSQL DDL schema exporter.

4. **✨ Google Gemma 4 AI Academic Copilot**:
   - DeepMind Gemma 4 architecture built into floating launcher and modal.
   - Instant academic advice: NITH 75% attendance ordinance reasoning, Dijkstra & algorithm explainers, digital hostel pass drafting, and optional custom Google AI Studio API key integration.

---

## 🚀 Running Locally with Next.js

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Run the Next.js development server
npm run dev

# 3. Open in your browser:
# http://localhost:3000
```

### Production Build
```bash
npm run build
npm run start
```

---

## 👥 Contributors & Core Team

- **[@YatharthaNagaych](https://github.com/YatharthaNagaych)** (Lead Developer & Maintainer)
- **[@naitikgarg780](https://github.com/naitikgarg780)** (Contributor)
- **[@tanuj1037](https://github.com/tanuj1037)** (Contributor)
- **[@sprezzatura-20](https://github.com/sprezzatura-20)** (Contributor)

---

## 📄 License
This project is licensed under the [Apache License 2.0](LICENSE).
