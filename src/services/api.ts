import {
  Patient,
  Doctor,
  Appointment,
  Bed,
  Medicine,
  LabTest,
  LabOrder,
  Invoice,
  DashboardData
} from '../types';

const API_BASE = '/api';

export const api = {
  // System Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Dashboard
  async getDashboard(): Promise<{ success: boolean; data: DashboardData }> {
    const res = await fetch(`${API_BASE}/dashboard/summary`);
    return res.json();
  },

  // Patients
  async getPatients(params?: { search?: string; gender?: string; blood_group?: string }): Promise<{ success: boolean; data: Patient[] }> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/patients${query ? `?${query}` : ''}`);
    return res.json();
  },

  async createPatient(patientData: Partial<Patient>): Promise<{ success: boolean; message: string; data: Patient }> {
    const res = await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData)
    });
    return res.json();
  },

  // Doctors
  async getDoctors(department?: string): Promise<{ success: boolean; data: Doctor[] }> {
    const url = department ? `${API_BASE}/doctors?department=${encodeURIComponent(department)}` : `${API_BASE}/doctors`;
    const res = await fetch(url);
    return res.json();
  },

  // Appointments
  async getAppointments(params?: { status?: string; doctor_id?: number; date?: string }): Promise<{ success: boolean; data: Appointment[] }> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/appointments${query ? `?${query}` : ''}`);
    return res.json();
  },

  async bookAppointment(appointmentData: any): Promise<{ success: boolean; message: string; data: Appointment }> {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    });
    return res.json();
  },

  async updateAppointmentStatus(id: number, status: string): Promise<{ success: boolean; message: string; data: Appointment }> {
    const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Beds (IPD)
  async getBeds(params?: { status?: string; ward_type?: string }): Promise<{ success: boolean; stats: any; data: Bed[] }> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/beds${query ? `?${query}` : ''}`);
    return res.json();
  },

  async allocateBed(id: number, data: { patient_name: string; uhid: string }): Promise<{ success: boolean; message: string; data: Bed }> {
    const res = await fetch(`${API_BASE}/beds/${id}/allocate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async dischargeBed(id: number): Promise<{ success: boolean; message: string; data: Bed }> {
    const res = await fetch(`${API_BASE}/beds/${id}/discharge`, {
      method: 'POST'
    });
    return res.json();
  },

  async updateBedStatus(id: number, status: string): Promise<{ success: boolean; message: string; data: Bed }> {
    const res = await fetch(`${API_BASE}/beds/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Pharmacy
  async getMedicines(params?: { search?: string; category?: string; low_stock?: boolean }): Promise<{ success: boolean; data: Medicine[] }> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/pharmacy/medicines${query ? `?${query}` : ''}`);
    return res.json();
  },

  async addMedicine(medicineData: any): Promise<{ success: boolean; message: string; data: Medicine }> {
    const res = await fetch(`${API_BASE}/pharmacy/medicines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicineData)
    });
    return res.json();
  },

  async dispenseMedicine(id: number, quantity: number): Promise<{ success: boolean; message: string; data: Medicine }> {
    const res = await fetch(`${API_BASE}/pharmacy/medicines/${id}/dispense`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    });
    return res.json();
  },

  // Laboratory
  async getLabTests(params?: { category?: string; search?: string }): Promise<{ success: boolean; data: LabTest[] }> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/laboratory/tests${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getLabOrders(params?: { status?: string; patient_id?: number }): Promise<{ success: boolean; data: LabOrder[] }> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/laboratory/orders${query ? `?${query}` : ''}`);
    return res.json();
  },

  async createLabOrder(orderData: any): Promise<{ success: boolean; message: string; data: LabOrder }> {
    const res = await fetch(`${API_BASE}/laboratory/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  async updateLabOrder(id: number, data: { status?: string; result_value?: string }): Promise<{ success: boolean; message: string; data: LabOrder }> {
    const res = await fetch(`${API_BASE}/laboratory/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Billing
  async getInvoices(params?: { status?: string; patient_id?: number; search?: string }): Promise<{ success: boolean; stats: any; data: Invoice[] }> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/billing/invoices${query ? `?${query}` : ''}`);
    return res.json();
  },

  async createInvoice(invoiceData: any): Promise<{ success: boolean; message: string; data: Invoice }> {
    const res = await fetch(`${API_BASE}/billing/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData)
    });
    return res.json();
  },

  async recordPayment(id: number, amount: number, method: string): Promise<{ success: boolean; message: string; data: Invoice }> {
    const res = await fetch(`${API_BASE}/billing/invoices/${id}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, method })
    });
    return res.json();
  }
};
