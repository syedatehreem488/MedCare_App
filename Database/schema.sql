-- MedCare database. Tables follow the ERD from Lab 3.

DROP DATABASE IF EXISTS medcare;
CREATE DATABASE medcare;
USE medcare;

-- ---------- Users ----------
CREATE TABLE patient (
  patient_id     INT AUTO_INCREMENT PRIMARY KEY,
  full_name      VARCHAR(100) NOT NULL,
  phone          VARCHAR(20)  NOT NULL UNIQUE,
  email          VARCHAR(100) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  date_of_birth  DATE,
  grace_period   INT NOT NULL DEFAULT 30          -- minutes (15 to 60)
);

CREATE TABLE caregiver (
  caregiver_id   INT AUTO_INCREMENT PRIMARY KEY,
  full_name      VARCHAR(100) NOT NULL,
  phone          VARCHAR(20)  NOT NULL UNIQUE,
  email          VARCHAR(100) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL
);

-- ---------- Link (the M:N relationship between patient and caregiver) ----------
CREATE TABLE care_link (
  patient_id     INT NOT NULL,
  caregiver_id   INT NOT NULL,
  relation       VARCHAR(50),
  linked_on      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  link_status    ENUM('Pending','Active','Removed') NOT NULL DEFAULT 'Pending',
  PRIMARY KEY (patient_id, caregiver_id),
  FOREIGN KEY (patient_id)   REFERENCES patient(patient_id)     ON DELETE CASCADE,
  FOREIGN KEY (caregiver_id) REFERENCES caregiver(caregiver_id) ON DELETE CASCADE
);

-- ---------- Medicines and doses ----------
CREATE TABLE medicine (
  medicine_id    INT AUTO_INCREMENT PRIMARY KEY,
  patient_id     INT NOT NULL,
  medicine_name  VARCHAR(100) NOT NULL,
  dosage         VARCHAR(50)  NOT NULL,
  instructions   VARCHAR(255),
  start_date     DATE NOT NULL,
  end_date       DATE NULL,
  FOREIGN KEY (patient_id) REFERENCES patient(patient_id) ON DELETE CASCADE
);

CREATE TABLE dose_schedule (
  schedule_id    INT AUTO_INCREMENT PRIMARY KEY,
  medicine_id    INT NOT NULL,
  dose_time      TIME NOT NULL,
  days           VARCHAR(30) NOT NULL DEFAULT 'Mon,Tue,Wed,Thu,Fri,Sat,Sun',
  FOREIGN KEY (medicine_id) REFERENCES medicine(medicine_id) ON DELETE CASCADE
);

CREATE TABLE dose_log (
  log_id         INT AUTO_INCREMENT PRIMARY KEY,
  schedule_id    INT NOT NULL,
  due_datetime   DATETIME NOT NULL,
  status         ENUM('Pending','Taken','Skipped','Delayed','Missed') NOT NULL DEFAULT 'Pending',
  response_time  DATETIME NULL,
  delay_count    INT NOT NULL DEFAULT 0,
  FOREIGN KEY (schedule_id) REFERENCES dose_schedule(schedule_id) ON DELETE CASCADE
);

CREATE TABLE alert (
  alert_id       INT AUTO_INCREMENT PRIMARY KEY,
  log_id         INT NOT NULL,
  caregiver_id   INT NOT NULL,
  alert_type     ENUM('Missed','Skipped','NoResponse') NOT NULL,
  sent_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_seen        BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (log_id)       REFERENCES dose_log(log_id)        ON DELETE CASCADE,
  FOREIGN KEY (caregiver_id) REFERENCES caregiver(caregiver_id) ON DELETE CASCADE
);

-- ---------- Sample data (fake passwords) ----------
INSERT INTO patient (full_name, phone, email, password_hash, date_of_birth) VALUES
  ('Ahmed Raza',  '03001234567', 'ahmed@example.com',  'not-a-real-hash', '1955-03-12'),
  ('Nasreen Bibi','03007654321', 'nasreen@example.com','not-a-real-hash', '1960-08-25');

INSERT INTO caregiver (full_name, phone, email, password_hash) VALUES
  ('Ali Raza', '03111234567', 'ali@example.com', 'not-a-real-hash');

INSERT INTO care_link (patient_id, caregiver_id, relation, link_status) VALUES
  (1, 1, 'Son', 'Active');

INSERT INTO medicine (patient_id, medicine_name, dosage, instructions, start_date) VALUES
  (1, 'Metformin',  '1 tablet', 'After breakfast', '2026-10-01'),
  (1, 'Amlodipine', '1 tablet', 'At night',        '2026-10-01'),
  (2, 'Vitamin D',  '1 capsule','After lunch',     '2026-10-01');

INSERT INTO dose_schedule (medicine_id, dose_time) VALUES
  (1, '08:00:00'), (2, '21:00:00'), (3, '14:00:00');