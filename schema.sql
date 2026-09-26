-- =====================================================================
-- HOSPITAL MANAGEMENT SYSTEM (HMS) - ENTERPRISE MYSQL DATABASE SCHEMA
-- Normalized Relational Schema with Constraints, Foreign Keys & Indices
-- =====================================================================

CREATE DATABASE IF NOT EXISTS hospital_management_db
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE hospital_management_db;

-- 1. ROLES & USERS (Role-Based Access Control)
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(60) NOT NULL,
  last_name VARCHAR(60) NOT NULL,
  phone VARCHAR(20),
  avatar_url VARCHAR(255),
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
  INDEX idx_user_email (email),
  INDEX idx_user_role (role_id)
) ENGINE=InnoDB;

-- 2. CLINICAL DEPARTMENTS
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(20) NOT NULL UNIQUE,
  head_of_department VARCHAR(100),
  location VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. DOCTORS DIRECTORY
CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  department_id INT NOT NULL,
  specialization VARCHAR(100) NOT NULL,
  qualification VARCHAR(100) NOT NULL,
  license_number VARCHAR(50) NOT NULL UNIQUE,
  consultation_fee DECIMAL(10,2) NOT NULL DEFAULT 500.00,
  room_number VARCHAR(20),
  available_days VARCHAR(100) DEFAULT 'Mon,Tue,Wed,Thu,Fri',
  shift_start TIME DEFAULT '09:00:00',
  shift_end TIME DEFAULT '17:00:00',
  bio TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
  INDEX idx_doctor_department (department_id)
) ENGINE=InnoDB;

-- 4. STAFF & CLINICAL NURSES (HR)
CREATE TABLE IF NOT EXISTS staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  department_id INT,
  designation VARCHAR(100) NOT NULL,
  employment_type ENUM('Full-time', 'Part-time', 'Contract', 'On-Call') DEFAULT 'Full-time',
  shift ENUM('Morning', 'Evening', 'Night', 'Rotational') DEFAULT 'Morning',
  joining_date DATE,
  salary DECIMAL(10,2),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. PATIENTS (OPD & IPD Master Record)
CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uhid VARCHAR(30) NOT NULL UNIQUE, -- Universal Health ID, e.g. UHID-2026-0001
  user_id INT NULL UNIQUE,
  first_name VARCHAR(60) NOT NULL,
  last_name VARCHAR(60) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender ENUM('Male', 'Female', 'Other') NOT NULL,
  blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(120),
  address TEXT,
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  allergies TEXT,
  chronic_conditions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_patient_uhid (uhid),
  INDEX idx_patient_phone (phone)
) ENGINE=InnoDB;

-- 6. PATIENT VITALS LOG (EMR)
CREATE TABLE IF NOT EXISTS patient_vitals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  recorded_by INT,
  blood_pressure VARCHAR(20), -- e.g. 120/80
  heart_rate INT, -- bpm
  temperature DECIMAL(4,1), -- Fahrenheit, e.g. 98.6
  respiratory_rate INT, -- breaths/min
  spo2 INT, -- Oxygen saturation %
  blood_sugar DECIMAL(5,1), -- mg/dL
  weight_kg DECIMAL(5,2),
  height_cm DECIMAL(5,2),
  notes VARCHAR(255),
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_vitals_patient (patient_id)
) ENGINE=InnoDB;

-- 7. APPOINTMENTS & OPD QUEUE
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  appointment_code VARCHAR(30) NOT NULL UNIQUE,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  time_slot VARCHAR(20) NOT NULL,
  token_number INT NOT NULL,
  type ENUM('OPD', 'Follow-up', 'Emergency', 'Teleconsultation') DEFAULT 'OPD',
  status ENUM('Scheduled', 'Checked-In', 'In-Consultation', 'Completed', 'Cancelled', 'No-Show') DEFAULT 'Scheduled',
  symptoms TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT,
  INDEX idx_appointment_date (appointment_date),
  INDEX idx_appointment_doctor (doctor_id),
  INDEX idx_appointment_patient (patient_id)
) ENGINE=InnoDB;

-- 8. WARDS & BEDS (IPD)
CREATE TABLE IF NOT EXISTS wards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  floor VARCHAR(20) NOT NULL,
  type ENUM('General Ward', 'Semi-Private', 'Deluxe Private', 'ICU', 'NICU', 'Emergency', 'Post-Op') NOT NULL,
  total_beds INT NOT NULL DEFAULT 10,
  daily_charge DECIMAL(10,2) NOT NULL DEFAULT 1500.00
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS beds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ward_id INT NOT NULL,
  bed_number VARCHAR(20) NOT NULL UNIQUE,
  status ENUM('Available', 'Occupied', 'Cleaning', 'Maintenance', 'Reserved') DEFAULT 'Available',
  FOREIGN KEY (ward_id) REFERENCES wards(id) ON DELETE CASCADE,
  INDEX idx_bed_status (status)
) ENGINE=InnoDB;

-- 9. IPD ADMISSIONS & DISCHARGE
CREATE TABLE IF NOT EXISTS admissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admission_number VARCHAR(30) NOT NULL UNIQUE,
  patient_id INT NOT NULL,
  bed_id INT NOT NULL,
  primary_doctor_id INT NOT NULL,
  admission_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  discharge_date DATETIME NULL,
  admission_reason TEXT NOT NULL,
  discharge_summary TEXT NULL,
  status ENUM('Admitted', 'Discharged', 'Transferred') DEFAULT 'Admitted',
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT,
  FOREIGN KEY (bed_id) REFERENCES beds(id) ON DELETE RESTRICT,
  FOREIGN KEY (primary_doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 10. PHARMACY & MEDICINE INVENTORY
CREATE TABLE IF NOT EXISTS medicines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_code VARCHAR(30) NOT NULL UNIQUE,
  brand_name VARCHAR(100) NOT NULL,
  generic_name VARCHAR(100) NOT NULL,
  category ENUM('Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'IV Fluid', 'Drops', 'Other') NOT NULL,
  manufacturer VARCHAR(100),
  batch_number VARCHAR(50) NOT NULL,
  expiry_date DATE NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  mrp DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  reorder_level INT NOT NULL DEFAULT 20,
  location_rack VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_medicine_expiry (expiry_date),
  INDEX idx_medicine_stock (stock_quantity)
) ENGINE=InnoDB;

-- 11. PRESCRIPTIONS & PRESCRIPTION ITEMS
CREATE TABLE IF NOT EXISTS prescriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prescription_code VARCHAR(30) NOT NULL UNIQUE,
  appointment_id INT NULL,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  diagnosis TEXT NOT NULL,
  clinical_notes TEXT,
  dispense_status ENUM('Pending', 'Partially Dispensed', 'Dispensed', 'Cancelled') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS prescription_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prescription_id INT NOT NULL,
  medicine_id INT NOT NULL,
  dosage VARCHAR(50) NOT NULL,
  frequency VARCHAR(50) NOT NULL,
  duration_days INT NOT NULL,
  total_quantity INT NOT NULL,
  instructions VARCHAR(255),
  FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 12. LABORATORY TESTS CATALOG
CREATE TABLE IF NOT EXISTS lab_tests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  test_code VARCHAR(30) NOT NULL UNIQUE,
  test_name VARCHAR(120) NOT NULL,
  category ENUM('Pathology', 'Biochemistry', 'Hematology', 'Microbiology', 'Radiology', 'Cardiology') NOT NULL,
  sample_type VARCHAR(50),
  normal_range VARCHAR(100),
  unit VARCHAR(30),
  price DECIMAL(10,2) NOT NULL DEFAULT 350.00,
  turnaround_hours INT NOT NULL DEFAULT 24
) ENGINE=InnoDB;

-- 13. LAB ORDERS & INVESTIGATIONS
CREATE TABLE IF NOT EXISTS lab_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_code VARCHAR(30) NOT NULL UNIQUE,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  test_id INT NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sample_status ENUM('Ordered', 'Collected', 'In-Analysis', 'Completed', 'Rejected') DEFAULT 'Ordered',
  collected_at DATETIME NULL,
  completed_at DATETIME NULL,
  result_value TEXT,
  reference_interpretation TEXT,
  technician_id INT NULL,
  verified_by_doctor_id INT NULL,
  status ENUM('Pending', 'Verified', 'Delivered') DEFAULT 'Pending',
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT,
  FOREIGN KEY (test_id) REFERENCES lab_tests(id) ON DELETE RESTRICT,
  FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (verified_by_doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 14. INVOICES, BILLING & INSURANCE (TPA)
CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(30) NOT NULL UNIQUE,
  patient_id INT NOT NULL,
  appointment_id INT NULL,
  admission_id INT NULL,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  balance_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  payment_status ENUM('Unpaid', 'Partially Paid', 'Paid', 'Refunded') DEFAULT 'Unpaid',
  payment_method ENUM('Cash', 'Card', 'UPI', 'Net Banking', 'Insurance / TPA') DEFAULT 'Cash',
  insurance_provider VARCHAR(100) NULL,
  insurance_policy_number VARCHAR(50) NULL,
  claim_status ENUM('None', 'Initiated', 'Approved', 'Rejected') DEFAULT 'None',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
  FOREIGN KEY (admission_id) REFERENCES admissions(id) ON DELETE SET NULL,
  INDEX idx_invoice_status (payment_status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS invoice_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT NOT NULL,
  item_type ENUM('Consultation', 'Room/Bed', 'Pharmacy', 'Lab Test', 'Procedure', 'Nursing/Other') NOT NULL,
  description VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB;
