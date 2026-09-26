-- =====================================================================
-- HOSPITAL MANAGEMENT SYSTEM - SEED DATA SCRIPT
-- Realistic demo data for all roles, clinical records, and modules
-- =====================================================================

USE hospital_management_db;

-- 1. ROLES
INSERT INTO roles (id, name, description) VALUES
(1, 'Super Admin', 'Full system management and configuration rights'),
(2, 'Doctor', 'Clinical access, consultations, prescriptions, and medical orders'),
(3, 'Receptionist', 'Front-desk, patient registration, appointments & OPD queue'),
(4, 'Pharmacist', 'Medicine inventory, dispensing, and drug stock control'),
(5, 'Lab Technician', 'Diagnostics, sample management, and test reports'),
(6, 'Accountant', 'Billing, invoicing, payments, and insurance claims'),
(7, 'Patient', 'Patient portal, appointment tracking, and lab reports access')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. USERS (Password for all demo accounts is 'admin123' hashed with bcrypt)
-- Hash: $2a$10$w6uK2F9eYV2f5R7d4o0GvOTzD3v1L7sU9zD3v1L7sU9zD3v1L7sU.
INSERT INTO users (id, role_id, email, password_hash, first_name, last_name, phone, status) VALUES
(1, 1, 'admin@medicare.com', '$2a$10$4y9p03H2GfC1o5mF7A1LbeG4V0cE6J7o2B7r1N9k3U5j8T2l4W6qG', 'Super', 'Admin', '+91 9876543210', 'active'),
(2, 2, 'dr.sharma@medicare.com', '$2a$10$4y9p03H2GfC1o5mF7A1LbeG4V0cE6J7o2B7r1N9k3U5j8T2l4W6qG', 'Rajesh', 'Sharma', '+91 9822334455', 'active'),
(3, 2, 'dr.patel@medicare.com', '$2a$10$4y9p03H2GfC1o5mF7A1LbeG4V0cE6J7o2B7r1N9k3U5j8T2l4W6qG', 'Pooja', 'Patel', '+91 9811223344', 'active'),
(4, 2, 'dr.verma@medicare.com', '$2a$10$4y9p03H2GfC1o5mF7A1LbeG4V0cE6J7o2B7r1N9k3U5j8T2l4W6qG', 'Arjun', 'Verma', '+91 9833445566', 'active'),
(5, 3, 'reception@medicare.com', '$2a$10$4y9p03H2GfC1o5mF7A1LbeG4V0cE6J7o2B7r1N9k3U5j8T2l4W6qG', 'Sunita', 'Deshmukh', '+91 9844556677', 'active'),
(6, 4, 'pharmacy@medicare.com', '$2a$10$4y9p03H2GfC1o5mF7A1LbeG4V0cE6J7o2B7r1N9k3U5j8T2l4W6qG', 'Vikram', 'Mehta', '+91 9855667788', 'active'),
(7, 5, 'lab@medicare.com', '$2a$10$4y9p03H2GfC1o5mF7A1LbeG4V0cE6J7o2B7r1N9k3U5j8T2l4W6qG', 'Neha', 'Kulkarni', '+91 9866778899', 'active'),
(8, 6, 'billing@medicare.com', '$2a$10$4y9p03H2GfC1o5mF7A1LbeG4V0cE6J7o2B7r1N9k3U5j8T2l4W6qG', 'Ramesh', 'Gupta', '+91 9877889900', 'active')
ON DUPLICATE KEY UPDATE first_name=VALUES(first_name);

-- 3. DEPARTMENTS
INSERT INTO departments (id, name, code, head_of_department, location, description) VALUES
(1, 'Cardiology', 'CARDIO', 'Dr. Rajesh Sharma', 'Block A, 2nd Floor', 'Heart care, ECG, Echo, and cardiac diagnostics'),
(2, 'Neurology', 'NEURO', 'Dr. Pooja Patel', 'Block B, 3rd Floor', 'Brain, spinal cord, and nervous system disorders'),
(3, 'Orthopedics', 'ORTHO', 'Dr. Arjun Verma', 'Block A, 1st Floor', 'Bone joints, fractures, and orthopedic surgeries'),
(4, 'General Medicine', 'GENMED', 'Dr. Ananya Roy', 'Block C, Ground Floor', 'Primary care, fevers, internal medicine & health checkups'),
(5, 'Pediatrics', 'PEDIA', 'Dr. Sanjay Joshi', 'Block B, 2nd Floor', 'Child health, neonatal care, and vaccinations'),
(6, 'Emergency & Trauma', 'EMERG', 'Dr. Sameer Khan', 'Ground Floor (East Wing)', '24/7 Acute trauma, resuscitation, and emergency care')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. DOCTORS
INSERT INTO doctors (id, user_id, department_id, specialization, qualification, license_number, consultation_fee, room_number, available_days) VALUES
(1, 2, 1, 'Senior Interventional Cardiologist', 'MBBS, MD, DM (Cardiology)', 'MCI-CARD-98421', 800.00, 'Room 204', 'Mon,Tue,Wed,Thu,Fri,Sat'),
(2, 3, 2, 'Consultant Neurologist', 'MBBS, MD, DM (Neurology)', 'MCI-NEUR-55120', 900.00, 'Room 312', 'Mon,Wed,Fri'),
(3, 4, 3, 'Orthopedic & Joint Surgeon', 'MBBS, MS (Ortho), DNB', 'MCI-ORTH-77341', 700.00, 'Room 108', 'Tue,Thu,Sat')
ON DUPLICATE KEY UPDATE specialization=VALUES(specialization);

-- 5. WARDS & BEDS
INSERT INTO wards (id, name, floor, type, total_beds, daily_charge) VALUES
(1, 'Florence Nightingale General Ward', '1st Floor', 'General Ward', 12, 1200.00),
(2, 'Executive Semi-Private Ward', '2nd Floor', 'Semi-Private', 8, 2800.00),
(3, 'Royal Deluxe Private Rooms', '3rd Floor', 'Deluxe Private', 6, 5500.00),
(4, 'Intensive Care Unit (ICU)', '4th Floor', 'ICU', 6, 9500.00),
(5, 'Emergency Triage & Observation', 'Ground Floor', 'Emergency', 8, 2000.00)
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO beds (id, ward_id, bed_number, status) VALUES
(1, 1, 'GW-101', 'Occupied'),
(2, 1, 'GW-102', 'Available'),
(3, 1, 'GW-103', 'Available'),
(4, 2, 'SP-201', 'Occupied'),
(5, 2, 'SP-202', 'Available'),
(6, 3, 'DLX-301', 'Occupied'),
(7, 3, 'DLX-302', 'Cleaning'),
(8, 4, 'ICU-401', 'Occupied'),
(9, 4, 'ICU-402', 'Available'),
(10, 5, 'EMG-01', 'Occupied'),
(11, 5, 'EMG-02', 'Available')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 6. PATIENTS
INSERT INTO patients (id, uhid, first_name, last_name, date_of_birth, gender, blood_group, phone, email, address, emergency_contact_name, emergency_contact_phone, allergies, chronic_conditions) VALUES
(1, 'UHID-2026-0001', 'Amit', 'Trivedi', '1988-06-15', 'Male', 'B+', '+91 9820123456', 'amit.trivedi@gmail.com', 'Flat 402, Green Park, Mumbai', 'Kavita Trivedi (Wife)', '+91 9820123457', 'Penicillin', 'Hypertension'),
(2, 'UHID-2026-0002', 'Priya', 'Nair', '1995-11-22', 'Female', 'O+', '+91 9833441122', 'priya.nair@outlook.com', 'Plot 12, Indiranagar, Bengaluru', 'Mohan Nair (Father)', '+91 9833441123', 'Sulfa drugs', 'Asthma'),
(3, 'UHID-2026-0003', 'Rohan', 'Kadam', '1976-03-08', 'Male', 'A+', '+91 9845098765', 'rohan.kadam@yahoo.com', 'Sector 17, Vashi, Navi Mumbai', 'Sneha Kadam (Wife)', '+91 9845098766', 'None known', 'Type 2 Diabetes'),
(4, 'UHID-2026-0004', 'Ananya', 'Desai', '2001-09-14', 'Female', 'AB+', '+91 9867011223', 'ananya.desai@gmail.com', 'A-104, Sunrise Towers, Pune', 'Ramesh Desai (Father)', '+91 9867011224', 'Peanuts, NSAIDs', 'None')
ON DUPLICATE KEY UPDATE uhid=VALUES(uhid);

-- 7. PATIENT VITALS
INSERT INTO patient_vitals (id, patient_id, blood_pressure, heart_rate, temperature, respiratory_rate, spo2, blood_sugar, weight_kg, height_cm, notes) VALUES
(1, 1, '138/88', 76, 98.4, 18, 98, 124.0, 78.5, 175.0, 'Mild hypertension noted during morning rounds'),
(2, 2, '118/76', 82, 99.1, 20, 97, 98.0, 56.0, 162.0, 'Complaining of shortness of breath after exertion'),
(3, 3, '126/82', 72, 98.6, 16, 99, 148.0, 82.0, 172.0, 'Postprandial sugar check'),
(4, 4, '110/70', 68, 98.2, 16, 100, 92.0, 52.0, 158.0, 'Normal baseline vitals recorded')
ON DUPLICATE KEY UPDATE blood_pressure=VALUES(blood_pressure);

-- 8. APPOINTMENTS
INSERT INTO appointments (id, appointment_code, patient_id, doctor_id, appointment_date, time_slot, token_number, type, status, symptoms) VALUES
(1, 'APT-2026-101', 1, 1, CURDATE(), '09:30 AM', 1, 'OPD', 'Checked-In', 'Chest tightness and occasional palpitations'),
(2, 'APT-2026-102', 2, 2, CURDATE(), '10:00 AM', 2, 'OPD', 'In-Consultation', 'Frequent migraine headaches with visual aura'),
(3, 'APT-2026-103', 3, 3, CURDATE(), '11:15 AM', 3, 'Follow-up', 'Scheduled', 'Post-arthroscopy knee rehabilitation review'),
(4, 'APT-2026-104', 4, 1, CURDATE(), '12:00 PM', 4, 'OPD', 'Scheduled', 'Routine cardiac fitness checkup')
ON DUPLICATE KEY UPDATE appointment_code=VALUES(appointment_code);

-- 9. MEDICINES INVENTORY
INSERT INTO medicines (id, item_code, brand_name, generic_name, category, manufacturer, batch_number, expiry_date, unit_price, mrp, stock_quantity, reorder_level, location_rack) VALUES
(1, 'MED-001', 'Augmentin 625 Duo', 'Amoxicillin + Clavulanic Acid', 'Tablet', 'GSK Pharma', 'B-AG902', '2027-08-31', 18.50, 22.00, 450, 50, 'Rack A-01'),
(2, 'MED-002', 'Pan 40', 'Pantoprazole 40mg', 'Tablet', 'Alkem Labs', 'B-PN411', '2027-11-30', 9.20, 11.50, 800, 100, 'Rack A-04'),
(3, 'MED-003', 'Telma 40', 'Telmisartan 40mg', 'Tablet', 'Glenmark', 'B-TL822', '2027-05-31', 12.00, 14.50, 320, 40, 'Rack B-02'),
(4, 'MED-004', 'Montek-LC', 'Montelukast + Levocetirizine', 'Tablet', 'Sun Pharma', 'B-ML309', '2026-12-31', 14.00, 17.50, 18, 50, 'Rack B-05'), -- Low stock
(5, 'MED-005', 'Metrogyl 400', 'Metronidazole 400mg', 'Tablet', 'J.B. Chemicals', 'B-MG198', '2026-10-15', 3.50, 4.80, 220, 30, 'Rack C-01'), -- Near expiry
(6, 'MED-006', 'Paracetamol 650 (Dolo)', 'Paracetamol 650mg', 'Tablet', 'Micro Labs', 'B-DL701', '2028-02-28', 2.10, 3.00, 1200, 150, 'Rack A-02'),
(7, 'MED-007', 'Monocef 1g Injection', 'Ceftriaxone Sodium', 'Injection', 'Aristo Pharma', 'B-MC102', '2027-04-30', 58.00, 68.00, 140, 25, 'Fridge-01')
ON DUPLICATE KEY UPDATE brand_name=VALUES(brand_name);

-- 10. LAB TESTS CATALOG
INSERT INTO lab_tests (id, test_code, test_name, category, sample_type, normal_range, unit, price, turnaround_hours) VALUES
(1, 'LAB-CBC', 'Complete Blood Count (CBC)', 'Hematology', 'Whole Blood (EDTA)', 'Hb: 12-16, WBC: 4000-11000', 'g/dL, /mcL', 350.00, 6),
(2, 'LAB-LIPID', 'Lipid Profile Comprehensive', 'Biochemistry', 'Serum (Fasting)', 'Cholesterol < 200, Triglycerides < 150', 'mg/dL', 750.00, 12),
(3, 'LAB-HBA1C', 'HbA1c (Glycated Hemoglobin)', 'Biochemistry', 'Whole Blood', 'Normal < 5.7, Pre-diabetic 5.7-6.4', '%', 550.00, 8),
(4, 'LAB-LFT', 'Liver Function Test (LFT)', 'Biochemistry', 'Serum', 'Bilirubin < 1.2, SGOT < 40, SGPT < 40', 'mg/dL, U/L', 650.00, 8),
(5, 'LAB-KFT', 'Kidney Function Test (KFT/RFT)', 'Biochemistry', 'Serum', 'Creatinine 0.6-1.2, Urea 15-45', 'mg/dL', 600.00, 8),
(6, 'LAB-ECG', '12-Lead Electrocardiogram', 'Cardiology', 'Clinical Record', 'Normal Sinus Rhythm', 'BPM', 300.00, 2),
(7, 'LAB-CHEST-XRAY', 'Digital Chest X-Ray (PA View)', 'Radiology', 'Radiograph', 'Clear lung fields, normal cardiothoracic ratio', 'Report', 500.00, 4)
ON DUPLICATE KEY UPDATE test_name=VALUES(test_name);

-- 11. INVOICES
INSERT INTO invoices (id, invoice_number, patient_id, subtotal, tax_amount, discount_amount, total_amount, paid_amount, balance_amount, payment_status, payment_method, insurance_provider) VALUES
(1, 'INV-2026-001', 1, 2450.00, 122.50, 100.00, 2472.50, 2472.50, 0.00, 'Paid', 'UPI', 'Star Health Insurance'),
(2, 'INV-2026-002', 2, 1650.00, 82.50, 0.00, 1732.50, 1000.00, 732.50, 'Partially Paid', 'Card', NULL),
(3, 'INV-2026-003', 3, 4200.00, 210.00, 200.00, 4210.00, 4210.00, 0.00, 'Paid', 'Net Banking', 'HDFC ERGO Health'),
(4, 'INV-2026-004', 4, 800.00, 40.00, 0.00, 840.00, 0.00, 840.00, 'Unpaid', 'Cash', NULL)
ON DUPLICATE KEY UPDATE invoice_number=VALUES(invoice_number);

INSERT INTO invoice_items (id, invoice_id, item_type, description, quantity, unit_price, total_price) VALUES
(1, 1, 'Consultation', 'Dr. Rajesh Sharma - Cardiology Consultation', 1, 800.00, 800.00),
(2, 1, 'Lab Test', 'Complete Blood Count (CBC)', 1, 350.00, 350.00),
(3, 1, 'Lab Test', '12-Lead Electrocardiogram (ECG)', 1, 300.00, 300.00),
(4, 1, 'Pharmacy', 'Augmentin 625 Duo, Telma 40 Course', 1, 1000.00, 1000.00)
ON DUPLICATE KEY UPDATE description=VALUES(description);
