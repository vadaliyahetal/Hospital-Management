export interface Patient {
  id: number;
  uhid: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'Male' | 'Female' | 'Other';
  blood_group: string;
  phone: string;
  email: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  allergies: string;
  chronic_conditions: string;
  created_at: string;
}

export interface Doctor {
  id: number;
  name: string;
  email: string;
  department: string;
  specialization: string;
  qualification: string;
  license_number: string;
  consultation_fee: number;
  room_number: string;
  available_days: string;
  phone: string;
  avatar_url?: string;
}

export interface Appointment {
  id: number;
  appointment_code: string;
  patient_id: number;
  patient_name: string;
  patient_uhid: string;
  doctor_id: number;
  doctor_name: string;
  department: string;
  appointment_date: string;
  time_slot: string;
  token_number: number;
  type: 'OPD' | 'Follow-up' | 'Emergency' | 'Teleconsultation';
  status: 'Scheduled' | 'Checked-In' | 'In-Consultation' | 'Completed' | 'Cancelled';
  symptoms: string;
}

export interface Bed {
  id: number;
  ward_name: string;
  ward_type: string;
  bed_number: string;
  daily_charge: number;
  status: 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';
  patient_name?: string;
  uhid?: string;
  admission_date?: string;
}

export interface Medicine {
  id: number;
  item_code: string;
  brand_name: string;
  generic_name: string;
  category: string;
  manufacturer: string;
  batch_number: string;
  expiry_date: string;
  unit_price: number;
  mrp: number;
  stock_quantity: number;
  reorder_level: number;
  location_rack: string;
}

export interface LabTest {
  id: number;
  test_code: string;
  test_name: string;
  category: string;
  sample_type: string;
  normal_range: string;
  unit: string;
  price: number;
  turnaround_hours: number;
}

export interface LabOrder {
  id: number;
  order_code: string;
  patient_id: number;
  patient_name: string;
  patient_uhid: string;
  doctor_name: string;
  test_name: string;
  category: string;
  sample_status: 'Ordered' | 'Collected' | 'In-Analysis' | 'Completed';
  result_value?: string;
  normal_range: string;
  order_date: string;
  completed_at?: string;
}

export interface InvoiceItem {
  item_type: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  patient_id: number;
  patient_name: string;
  patient_uhid: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  payment_status: 'Paid' | 'Partially Paid' | 'Unpaid';
  payment_method: string;
  insurance_provider?: string;
  created_at: string;
  items: InvoiceItem[];
}

export interface DashboardData {
  metrics: {
    totalPatients: number;
    totalDoctors: number;
    appointmentsToday: number;
    pendingConsultations: number;
    totalBeds: number;
    occupiedBeds: number;
    bedOccupancyRate: number;
    totalRevenueToday: number;
    criticalLabAlerts: number;
    lowStockMedicines: number;
  };
  weeklyTrend: { day: string; opd: number; ipd: number; revenue: number }[];
  departmentStats: { name: string; patients: number; doctors: number; load: number }[];
  recentActivities: { id: number; type: string; time: string; title: string; description: string }[];
}
