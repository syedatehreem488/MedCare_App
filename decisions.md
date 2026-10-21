# MedCare – Decisions Log

This file records the important decisions our team has made for MedCare, **why** we made
them, and what else we considered. If anyone (including us, later) asks "why did we do it
this way?", the answer should be here.

**Team:** Tehreem Fatima Gillani (2024-CE-86), Haleema Ahsan (2024-CE-102), Tooba Iftikhar (2024-CE-114)
**Course:** Software Engineering – Semester Project

When we make a new decision or change an old one, add it at the bottom with the date.
Don't delete old decisions. Mark them **Replaced** and point to the new one.

---

## Project and scope

### D1. Project: MedCare – Medication Reminder and Caregiver Support System
- **Date:** Oct 2026 (Lab 1)
- **Decision:** Build an app that reminds patients to take their medicines, lets them
  confirm each dose, and alerts a caregiver when a dose is missed.
- **Why:** Missed doses are a real everyday problem, especially for elderly patients, and
  normal alarm apps don't tell anyone when a dose is ignored.

### D2. MedCare will not give medical advice
- **Date:** Oct 2026 (Lab 1)
- **Decision:** The system only handles reminders, tracking and communication. It will
  **not** suggest medicines, change doses or diagnose anything.
- **Why:** Medical decisions belong to doctors. Keeping this out also keeps the project
  small enough for one semester.

### D3. Android only, no web portal
- **Date:** Oct 14, 2026
- **Decision:** MedCare is only an Android mobile app. We removed the doctor web portal.
- **Why:** It keeps the project smaller and easier to finish and explain. The patient and
  caregiver features are the core of the app.
- **Replaces:** The earlier plan (Lab 2 SRS) of a mobile app plus a React.js web portal for doctors.
- **Note:** iOS is not planned for now, but React Native would let us add it later.

---

## Technology stack

### D4. Mobile app: React Native (with Expo)
- **Date:** Oct 14, 2026
- **Decision:** Build the app in React Native, using Expo.
- **Why:** It uses JavaScript, the same language as our backend, so we only have to learn
  one language for the whole project. There are lots of free tutorials, and Expo makes
  setup and testing on a real phone (with the Expo Go app) very easy.
- **Honest note:** We don't know React yet. We are learning it for this project.
- **Considered:** Flutter (easier to learn, but a second language, Dart), Kotlin/Java
  (Android only, more code), .NET MAUI (C#, which we know, but harder to set up and fewer tutorials).

### D5. Backend: Node.js + Express.js
- **Date:** Oct 7, 2026
- **Decision:** The server is written in Node.js with Express.
- **Why:** Same language as the app (JavaScript), so all three of us can work on any part.
  Express makes building a REST API simple.
- **Why we still need a server:** The patient's phone can't alert the caregiver's phone by
  itself. The server stores the data, checks for missed doses, and sends the alerts.

### D6. Database: MySQL
- **Date:** Oct 7, 2026
- **Decision:** Use MySQL.
- **Why:** Our data is relational (patient → medicines → schedules → dose logs), and MySQL
  keeps these links correct with primary and foreign keys, which matches our Lab 3 ERD.
  We have also studied it in our Database course and used it in our previous project.
- **Considered:** MongoDB. Rejected because our data has many relationships and our ERD
  is designed for relational tables.

### D7. Login security: JWT + bcrypt
- **Date:** Oct 7, 2026
- **Decision:** Hash passwords with bcrypt. Use JWT tokens to keep users logged in.
- **Why:** We store health-related data. bcrypt means real passwords can't be read even if
  the database leaks. JWT means the app doesn't send the password with every request.

### D8. Reminders: local notifications. Caregiver alerts: push notifications (FCM)
- **Date:** Oct 7, 2026
- **Decision:** Dose reminders come from the patient's own phone (local notifications).
  Missed-dose alerts go from the server to the caregiver's phone through Firebase Cloud
  Messaging (through Expo's push service).
- **Why:** Local notifications still ring when the phone has no internet, which matters a
  lot for a reminder app. FCM is free and reaches the caregiver instantly, even when the
  app is closed.

### D9. Email: Nodemailer
- **Date:** Oct 7, 2026
- **Decision:** Use Nodemailer to send emails (e.g. password reset links).
- **Why:** Free, simple, and works directly with Node.js.

### D10. Deployment: Render
- **Date:** Oct 14, 2026
- **Decision:** Host the backend on Render.
- **Why:** Free plan, deploys straight from GitHub, and we have already deployed a project there.
- **Replaces:** "Vercel + Render". Vercel was only for the web portal, which we removed (D3).

### D11. Version control: Git + GitHub
- **Date:** Oct 7, 2026
- **Decision:** All code lives in one GitHub repository.
- **Why:** Three people working on the same code without overwriting each other's work,
  plus a full history of every change.

---

## Database design (from Lab 3 ERD)

### D12. Separate tables for Patient and Caregiver
- **Why:** Each role stores slightly different data, and it keeps the ERD easy to read and
  explain in the viva.
- **Changed Oct 19, 2026:** The Doctor table was removed (see D19).

### D13. A link table for the many-to-many relationship
- **Decision:** `care_link` connects patients and caregivers.
- **Why:** A patient can have many caregivers, and a caregiver can look after many
  patients. A relational database needs a middle table for this. It also stores the
  relation (son, daughter...) and the link status (Pending / Active / Removed).
- **Changed Oct 19, 2026:** `doctor_link` was removed (see D19).

### D14. Adherence % is calculated, not stored
- **Why:** It can always be worked out from `dose_log`. Storing it separately could make
  the two disagree.

### D15. Grace period is stored on the Patient
- **Why:** Each patient has one grace period, and the server needs it to decide when a dose
  becomes "Missed".

---

## App rules

### D16. Dose rules
- **Grace period:** 30 minutes by default; the patient or caregiver can set it between 15
  and 60 minutes. No response by then → the dose is marked **Missed**.
- **Delay:** The patient can delay a dose by 15 minutes, at most 2 times.
- **Alerts:** Caregivers get the missed-dose alert within 2 minutes.
- **Offline:** If the patient's phone was offline, the alert says **"No response
  received"** instead of "Missed", because the dose may actually have been taken.
- **Why:** These numbers make the requirements testable (from our Lab 2 SRS).

---

## Code setup (from the welcome page)

### D17. Secrets go in a `.env` file, never in the code
- **Date:** Oct 18, 2026
- **Decision:** The database password and other settings live in `backend/.env`, which is
  listed in `.gitignore`. We share `.env.example` (without real passwords) instead.
- **Why:** So passwords never get uploaded to GitHub.

### D18. The app uses the laptop's IP address, not `localhost`
- **Date:** Oct 18, 2026
- **Decision:** `medcare-app/config.js` holds the backend address, e.g. `http://192.168.1.7:5000`.
- **Why:** On the phone, `localhost` means the phone itself, so it can't reach the server
  running on the laptop. Once deployed, this will change to the Render URL.

### D19. Doctors are not users of MedCare (version 1)
- **Date:** Oct 19, 2026
- **Decision:** We removed the Doctor role completely. MedCare has two users: **Patient**
  and **Caregiver**. The patient or caregiver enters medicines from the doctor's
  prescription, and the patient can show their dose history to the doctor at a checkup.
- **Why:** The doctor tables were only there for the web portal, which we removed (D3).
  Building doctor screens into the app would add a third set of screens. Dropping it keeps
  the project small enough to finish and explain in one semester.
- **What changed:** The `doctor` and `doctor_link` tables and `medicine.doctor_id` were
  removed (the database now has 7 tables). The Lab 2 SRS (Doctor user class and the Doctor
  Portal feature), the Lab 3 ERD, Lab 1 and Assignment 1 were updated to match.
- **Considered:** Doctors using the mobile app with their own screens. Possible in a later
  version.

---

## Still to decide

- [ ] **Correct course code:** Our documents say CMPE-331L, but the lab manual says
  CMPE-311L. Check with the instructor.
- [ ] **Where to host MySQL online:** Render's free plan doesn't offer MySQL (only
  PostgreSQL). Options: Railway, Aiven, or another MySQL host.
- [ ] **Render free plan sleeps** after about 15 minutes with no traffic, so it can't check
  for missed doses while asleep. For the demo we can keep it awake with a ping service
  (e.g. UptimeRobot); for real use it would need a paid plan.
- [ ] **Later versions (not now):** SMS alerts for caregivers without smartphones, Urdu
  language support, iOS version.
