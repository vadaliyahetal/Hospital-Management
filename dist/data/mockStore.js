"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialInvoices = exports.initialLabOrders = exports.initialLabTests = exports.initialMedicines = exports.initialBeds = exports.initialAppointments = exports.initialDoctors = exports.initialPatients = void 0;
exports.initialPatients = [
    {
        id: 1,
        uhid: 'UHID-2026-0001',
        first_name: 'Amit',
        last_name: 'Trivedi',
        date_of_birth: '1988-06-15',
        gender: 'Male',
        blood_group: 'B+',
        phone: '+91 9820123456',
        email: 'amit.trivedi@gmail.com',
        address: 'Flat 402, Green Park, Mumbai',
        emergency_contact_name: 'Kavita Trivedi (Wife)',
        emergency_contact_phone: '+91 9820123457',
        allergies: 'Penicillin',
        chronic_conditions: 'Hypertension',
        created_at: '2026-09-20 10:15:00'
    },
    {
        id: 2,
        uhid: 'UHID-2026-0002',
        first_name: 'Priya',
        last_name: 'Nair',
        date_of_birth: '1995-11-22',
        gender: 'Female',
        blood_group: 'O+',
        phone: '+91 9833441122',
        email: 'priya.nair@outlook.com',
        address: 'Plot 12, Indiranagar, Bengaluru',
        emergency_contact_name: 'Mohan Nair (Father)',
        emergency_contact_phone: '+91 9833441123',
        allergies: 'Sulfa drugs',
        chronic_conditions: 'Asthma',
        created_at: '2026-09-22 11:30:00'
    },
    {
        id: 3,
        uhid: 'UHID-2026-0003',
        first_name: 'Rohan',
        last_name: 'Kadam',
        date_of_birth: '1976-03-08',
        gender: 'Male',
        blood_group: 'A+',
        phone: '+91 9845098765',
        email: 'rohan.kadam@yahoo.com',
        address: 'Sector 17, Vashi, Navi Mumbai',
        emergency_contact_name: 'Sneha Kadam (Wife)',
        emergency_contact_phone: '+91 9845098766',
        allergies: 'None',
        chronic_conditions: 'Type 2 Diabetes',
        created_at: '2026-09-24 09:00:00'
    },
    {
        id: 4,
        uhid: 'UHID-2026-0004',
        first_name: 'Ananya',
        last_name: 'Desai',
        date_of_birth: '2001-09-14',
        gender: 'Female',
        blood_group: 'AB+',
        phone: '+91 9867011223',
        email: 'ananya.desai@gmail.com',
        address: 'A-104, Sunrise Towers, Pune',
        emergency_contact_name: 'Ramesh Desai (Father)',
        emergency_contact_phone: '+91 9867011224',
        allergies: 'NSAIDs',
        chronic_conditions: 'None',
        created_at: '2026-09-25 14:20:00'
    }
];
exports.initialDoctors = [
    {
        id: 1,
        name: 'Dr. Rajesh Sharma',
        email: 'dr.sharma@medicare.com',
        department: 'Cardiology',
        specialization: 'Senior Interventional Cardiologist',
        qualification: 'MBBS, MD, DM (Cardio)',
        license_number: 'MCI-CARD-98421',
        consultation_fee: 800,
        room_number: 'Room 204',
        available_days: 'Mon, Tue, Wed, Thu, Fri, Sat',
        phone: '+91 9822334455'
    },
    {
        id: 2,
        name: 'Dr. Pooja Patel',
        email: 'dr.patel@medicare.com',
        department: 'Neurology',
        specialization: 'Consultant Neurologist',
        qualification: 'MBBS, MD, DM (Neuro)',
        license_number: 'MCI-NEUR-55120',
        consultation_fee: 900,
        room_number: 'Room 312',
        available_days: 'Mon, Wed, Fri',
        phone: '+91 9811223344'
    },
    {
        id: 3,
        name: 'Dr. Arjun Verma',
        email: 'dr.verma@medicare.com',
        department: 'Orthopedics',
        specialization: 'Orthopedic & Joint Surgeon',
        qualification: 'MBBS, MS (Ortho), DNB',
        license_number: 'MCI-ORTH-77341',
        consultation_fee: 700,
        room_number: 'Room 108',
        available_days: 'Tue, Thu, Sat',
        phone: '+91 9833445566'
    }
];
exports.initialAppointments = [
    {
        id: 1,
        appointment_code: 'APT-2026-101',
        patient_id: 1,
        patient_name: 'Amit Trivedi',
        patient_uhid: 'UHID-2026-0001',
        doctor_id: 1,
        doctor_name: 'Dr. Rajesh Sharma',
        department: 'Cardiology',
        appointment_date: new Date().toISOString().split('T')[0],
        time_slot: '09:30 AM',
        token_number: 1,
        type: 'OPD',
        status: 'Checked-In',
        symptoms: 'Chest tightness and occasional palpitations'
    },
    {
        id: 2,
        appointment_code: 'APT-2026-102',
        patient_id: 2,
        patient_name: 'Priya Nair',
        patient_uhid: 'UHID-2026-0002',
        doctor_id: 2,
        doctor_name: 'Dr. Pooja Patel',
        department: 'Neurology',
        appointment_date: new Date().toISOString().split('T')[0],
        time_slot: '10:00 AM',
        token_number: 2,
        type: 'OPD',
        status: 'In-Consultation',
        symptoms: 'Frequent migraine headaches with aura'
    },
    {
        id: 3,
        appointment_code: 'APT-2026-103',
        patient_id: 3,
        patient_name: 'Rohan Kadam',
        patient_uhid: 'UHID-2026-0003',
        doctor_id: 3,
        doctor_name: 'Dr. Arjun Verma',
        department: 'Orthopedics',
        appointment_date: new Date().toISOString().split('T')[0],
        time_slot: '11:15 AM',
        token_number: 3,
        type: 'Follow-up',
        status: 'Scheduled',
        symptoms: 'Post-arthroscopy knee rehabilitation review'
    },
    {
        id: 4,
        appointment_code: 'APT-2026-104',
        patient_id: 4,
        patient_name: 'Ananya Desai',
        patient_uhid: 'UHID-2026-0004',
        doctor_id: 1,
        doctor_name: 'Dr. Rajesh Sharma',
        department: 'Cardiology',
        appointment_date: new Date().toISOString().split('T')[0],
        time_slot: '12:00 PM',
        token_number: 4,
        type: 'OPD',
        status: 'Scheduled',
        symptoms: 'Routine cardiac fitness checkup'
    }
];
exports.initialBeds = [
    { id: 1, ward_name: 'Florence Nightingale Ward', ward_type: 'General Ward', bed_number: 'GW-101', daily_charge: 1200, status: 'Occupied', patient_name: 'Amit Trivedi', uhid: 'UHID-2026-0001', admission_date: '2026-09-24' },
    { id: 2, ward_name: 'Florence Nightingale Ward', ward_type: 'General Ward', bed_number: 'GW-102', daily_charge: 1200, status: 'Available' },
    { id: 3, ward_name: 'Florence Nightingale Ward', ward_type: 'General Ward', bed_number: 'GW-103', daily_charge: 1200, status: 'Available' },
    { id: 4, ward_name: 'Executive Semi-Private', ward_type: 'Semi-Private', bed_number: 'SP-201', daily_charge: 2800, status: 'Occupied', patient_name: 'Rohan Kadam', uhid: 'UHID-2026-0003', admission_date: '2026-09-25' },
    { id: 5, ward_name: 'Executive Semi-Private', ward_type: 'Semi-Private', bed_number: 'SP-202', daily_charge: 2800, status: 'Available' },
    { id: 6, ward_name: 'Royal Deluxe Private Rooms', ward_type: 'Deluxe Private', bed_number: 'DLX-301', daily_charge: 5500, status: 'Occupied', patient_name: 'Priya Nair', uhid: 'UHID-2026-0002', admission_date: '2026-09-25' },
    { id: 7, ward_name: 'Royal Deluxe Private Rooms', ward_type: 'Deluxe Private', bed_number: 'DLX-302', daily_charge: 5500, status: 'Cleaning' },
    { id: 8, ward_name: 'Intensive Care Unit (ICU)', ward_type: 'ICU', bed_number: 'ICU-401', daily_charge: 9500, status: 'Occupied', patient_name: 'Sunil Patil', uhid: 'UHID-2026-0089', admission_date: '2026-09-26' },
    { id: 9, ward_name: 'Intensive Care Unit (ICU)', ward_type: 'ICU', bed_number: 'ICU-402', daily_charge: 9500, status: 'Available' },
    { id: 10, ward_name: 'Emergency Observation', ward_type: 'Emergency', bed_number: 'EMG-01', daily_charge: 2000, status: 'Occupied', patient_name: 'Emergency Intake', admission_date: '2026-09-26' },
    { id: 11, ward_name: 'Emergency Observation', ward_type: 'Emergency', bed_number: 'EMG-02', daily_charge: 2000, status: 'Available' }
];
exports.initialMedicines = [
    { id: 1, item_code: 'MED-001', brand_name: 'Augmentin 625 Duo', generic_name: 'Amoxicillin + Clavulanic Acid', category: 'Tablet', manufacturer: 'GSK Pharma', batch_number: 'B-AG902', expiry_date: '2027-08-31', unit_price: 18.5, mrp: 22.0, stock_quantity: 450, reorder_level: 50, location_rack: 'Rack A-01' },
    { id: 2, item_code: 'MED-002', brand_name: 'Pan 40', generic_name: 'Pantoprazole 40mg', category: 'Tablet', manufacturer: 'Alkem Labs', batch_number: 'B-PN411', expiry_date: '2027-11-30', unit_price: 9.2, mrp: 11.5, stock_quantity: 800, reorder_level: 100, location_rack: 'Rack A-04' },
    { id: 3, item_code: 'MED-003', brand_name: 'Telma 40', generic_name: 'Telmisartan 40mg', category: 'Tablet', manufacturer: 'Glenmark', batch_number: 'B-TL822', expiry_date: '2027-05-31', unit_price: 12.0, mrp: 14.5, stock_quantity: 320, reorder_level: 40, location_rack: 'Rack B-02' },
    { id: 4, item_code: 'MED-004', brand_name: 'Montek-LC', generic_name: 'Montelukast + Levocetirizine', category: 'Tablet', manufacturer: 'Sun Pharma', batch_number: 'B-ML309', expiry_date: '2026-12-31', unit_price: 14.0, mrp: 17.5, stock_quantity: 18, reorder_level: 50, location_rack: 'Rack B-05' },
    { id: 5, item_code: 'MED-005', brand_name: 'Metrogyl 400', generic_name: 'Metronidazole 400mg', category: 'Tablet', manufacturer: 'J.B. Chemicals', batch_number: 'B-MG198', expiry_date: '2026-10-15', unit_price: 3.5, mrp: 4.8, stock_quantity: 220, reorder_level: 30, location_rack: 'Rack C-01' },
    { id: 6, item_code: 'MED-006', brand_name: 'Paracetamol 650 (Dolo)', generic_name: 'Paracetamol 650mg', category: 'Tablet', manufacturer: 'Micro Labs', batch_number: 'B-DL701', expiry_date: '2028-02-28', unit_price: 2.1, mrp: 3.0, stock_quantity: 1200, reorder_level: 150, location_rack: 'Rack A-02' },
    { id: 7, item_code: 'MED-007', brand_name: 'Monocef 1g Injection', generic_name: 'Ceftriaxone Sodium', category: 'Injection', manufacturer: 'Aristo Pharma', batch_number: 'B-MC102', expiry_date: '2027-04-30', unit_price: 58.0, mrp: 68.0, stock_quantity: 140, reorder_level: 25, location_rack: 'Fridge-01' }
];
exports.initialLabTests = [
    { id: 1, test_code: 'LAB-CBC', test_name: 'Complete Blood Count (CBC)', category: 'Hematology', sample_type: 'Whole Blood (EDTA)', normal_range: 'Hb: 12-16, WBC: 4000-11000', unit: 'g/dL, /mcL', price: 350, turnaround_hours: 6 },
    { id: 2, test_code: 'LAB-LIPID', test_name: 'Lipid Profile Comprehensive', category: 'Biochemistry', sample_type: 'Serum (Fasting)', normal_range: 'Cholesterol < 200, Triglycerides < 150', unit: 'mg/dL', price: 750, turnaround_hours: 12 },
    { id: 3, test_code: 'LAB-HBA1C', test_name: 'HbA1c (Glycated Hemoglobin)', category: 'Biochemistry', sample_type: 'Whole Blood', normal_range: 'Normal < 5.7, Pre-diabetic 5.7-6.4', unit: '%', price: 550, turnaround_hours: 8 },
    { id: 4, test_code: 'LAB-LFT', test_name: 'Liver Function Test (LFT)', category: 'Biochemistry', sample_type: 'Serum', normal_range: 'Bilirubin < 1.2, SGOT < 40, SGPT < 40', unit: 'mg/dL, U/L', price: 650, turnaround_hours: 8 },
    { id: 5, test_code: 'LAB-KFT', test_name: 'Kidney Function Test (KFT/RFT)', category: 'Biochemistry', sample_type: 'Serum', normal_range: 'Creatinine 0.6-1.2, Urea 15-45', unit: 'mg/dL', price: 600, turnaround_hours: 8 },
    { id: 6, test_code: 'LAB-ECG', test_name: '12-Lead Electrocardiogram', category: 'Cardiology', sample_type: 'Clinical Record', normal_range: 'Normal Sinus Rhythm', unit: 'BPM', price: 300, turnaround_hours: 2 },
    { id: 7, test_code: 'LAB-CHEST-XRAY', test_name: 'Digital Chest X-Ray (PA View)', category: 'Radiology', sample_type: 'Radiograph', normal_range: 'Clear lung fields, normal heart size', unit: 'Report', price: 500, turnaround_hours: 4 }
];
exports.initialLabOrders = [
    { id: 1, order_code: 'ORD-2026-001', patient_id: 1, patient_name: 'Amit Trivedi', patient_uhid: 'UHID-2026-0001', doctor_name: 'Dr. Rajesh Sharma', test_name: 'Complete Blood Count (CBC)', category: 'Hematology', sample_status: 'Completed', result_value: 'Hb: 14.2 g/dL, WBC: 7200 /mcL, Platelets: 2.8 Lakhs', normal_range: 'Hb: 12-16, WBC: 4000-11000', order_date: '2026-09-26 09:45', completed_at: '2026-09-26 12:30' },
    { id: 2, order_code: 'ORD-2026-002', patient_id: 1, patient_name: 'Amit Trivedi', patient_uhid: 'UHID-2026-0001', doctor_name: 'Dr. Rajesh Sharma', test_name: 'Lipid Profile Comprehensive', category: 'Biochemistry', sample_status: 'In-Analysis', normal_range: 'Cholesterol < 200, Triglycerides < 150', order_date: '2026-09-26 09:45' },
    { id: 3, order_code: 'ORD-2026-003', patient_id: 2, patient_name: 'Priya Nair', patient_uhid: 'UHID-2026-0002', doctor_name: 'Dr. Pooja Patel', test_name: 'Digital Chest X-Ray (PA View)', category: 'Radiology', sample_status: 'Collected', normal_range: 'Clear lung fields', order_date: '2026-09-26 10:15' },
    { id: 4, order_code: 'ORD-2026-004', patient_id: 3, patient_name: 'Rohan Kadam', patient_uhid: 'UHID-2026-0003', doctor_name: 'Dr. Arjun Verma', test_name: 'Kidney Function Test (KFT/RFT)', category: 'Biochemistry', sample_status: 'Ordered', normal_range: 'Creatinine 0.6-1.2', order_date: '2026-09-26 11:20' }
];
exports.initialInvoices = [
    {
        id: 1,
        invoice_number: 'INV-2026-001',
        patient_id: 1,
        patient_name: 'Amit Trivedi',
        patient_uhid: 'UHID-2026-0001',
        subtotal: 2450.0,
        tax_amount: 122.5,
        discount_amount: 100.0,
        total_amount: 2472.5,
        paid_amount: 2472.5,
        balance_amount: 0.0,
        payment_status: 'Paid',
        payment_method: 'UPI',
        insurance_provider: 'Star Health Insurance',
        created_at: '2026-09-26 10:30',
        items: [
            { item_type: 'Consultation', description: 'Dr. Rajesh Sharma - Cardiology Consultation', quantity: 1, unit_price: 800, total_price: 800 },
            { item_type: 'Lab Test', description: 'Complete Blood Count (CBC)', quantity: 1, unit_price: 350, total_price: 350 },
            { item_type: 'Lab Test', description: '12-Lead Electrocardiogram (ECG)', quantity: 1, unit_price: 300, total_price: 300 },
            { item_type: 'Pharmacy', description: 'Augmentin 625 Duo, Telma 40 Course', quantity: 1, unit_price: 1000, total_price: 1000 }
        ]
    },
    {
        id: 2,
        invoice_number: 'INV-2026-002',
        patient_id: 2,
        patient_name: 'Priya Nair',
        patient_uhid: 'UHID-2026-0002',
        subtotal: 1650.0,
        tax_amount: 82.5,
        discount_amount: 0.0,
        total_amount: 1732.5,
        paid_amount: 1000.0,
        balance_amount: 732.5,
        payment_status: 'Partially Paid',
        payment_method: 'Card',
        created_at: '2026-09-26 11:45',
        items: [
            { item_type: 'Consultation', description: 'Dr. Pooja Patel - Neurology Consultation', quantity: 1, unit_price: 900, total_price: 900 },
            { item_type: 'Lab Test', description: 'Digital Chest X-Ray (PA View)', quantity: 1, unit_price: 500, total_price: 500 },
            { item_type: 'Pharmacy', description: 'Pan 40, Paracetamol 650', quantity: 1, unit_price: 250, total_price: 250 }
        ]
    },
    {
        id: 3,
        invoice_number: 'INV-2026-003',
        patient_id: 3,
        patient_name: 'Rohan Kadam',
        patient_uhid: 'UHID-2026-0003',
        subtotal: 4200.0,
        tax_amount: 210.0,
        discount_amount: 200.0,
        total_amount: 4210.0,
        paid_amount: 4210.0,
        balance_amount: 0.0,
        payment_status: 'Paid',
        payment_method: 'Net Banking',
        insurance_provider: 'HDFC ERGO Health',
        created_at: '2026-09-25 16:00',
        items: [
            { item_type: 'Room/Bed', description: 'Semi-Private Room (SP-201) - 1 Day', quantity: 1, unit_price: 2800, total_price: 2800 },
            { item_type: 'Consultation', description: 'Dr. Arjun Verma - Orthopedic Consultation', quantity: 1, unit_price: 700, total_price: 700 },
            { item_type: 'Pharmacy', description: 'Injections & Dressing Consumables', quantity: 1, unit_price: 700, total_price: 700 }
        ]
    }
];
