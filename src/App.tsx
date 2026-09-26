import React, { useState, useEffect } from 'react';
import { Sidebar, DEMO_ROLES } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { DashboardView } from './views/DashboardView';
import { PatientsView } from './views/PatientsView';
import { AppointmentsView } from './views/AppointmentsView';
import { DoctorsView } from './views/DoctorsView';
import { BedsView } from './views/BedsView';
import { PharmacyView } from './views/PharmacyView';
import { LaboratoryView } from './views/LaboratoryView';
import { BillingView } from './views/BillingView';

import { api } from './services/api';
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
} from './types';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface Toast {
  id: number;
  type: 'success' | 'warn' | 'info';
  message: string;
}

export function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentUser, setCurrentUser] = useState(DEMO_ROLES[0]);
  const [dbStatus, setDbStatus] = useState('Checking connection...');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // State
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Set Theme attribute on document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const addToast = (message: string, type: 'success' | 'warn' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [
        healthRes,
        dashRes,
        patRes,
        docRes,
        aptRes,
        bedRes,
        medRes,
        testRes,
        orderRes,
        invRes
      ] = await Promise.all([
        api.getHealth().catch(() => null),
        api.getDashboard().catch(() => null),
        api.getPatients().catch(() => null),
        api.getDoctors().catch(() => null),
        api.getAppointments().catch(() => null),
        api.getBeds().catch(() => null),
        api.getMedicines().catch(() => null),
        api.getLabTests().catch(() => null),
        api.getLabOrders().catch(() => null),
        api.getInvoices().catch(() => null)
      ]);

      if (healthRes) {
        setDbStatus(healthRes.database || 'Online');
      }

      if (dashRes?.success) setDashboardData(dashRes.data);
      if (patRes?.success) setPatients(patRes.data);
      if (docRes?.success) setDoctors(docRes.data);
      if (aptRes?.success) setAppointments(aptRes.data);
      if (bedRes?.success) setBeds(bedRes.data);
      if (medRes?.success) setMedicines(medRes.data);
      if (testRes?.success) setLabTests(testRes.data);
      if (orderRes?.success) setLabOrders(orderRes.data);
      if (invRes?.success) setInvoices(invRes.data);
    } catch (err: any) {
      console.error('Data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers
  const handleRegisterPatient = async (patientData: Partial<Patient>): Promise<boolean> => {
    try {
      const res = await api.createPatient(patientData);
      if (res.success) {
        setPatients(prev => [res.data, ...prev]);
        addToast(res.message, 'success');
        api.getDashboard().then(d => d.success && setDashboardData(d.data));
        return true;
      }
      addToast(res.message || 'Registration failed', 'warn');
      return false;
    } catch (err: any) {
      addToast(err.message, 'warn');
      return false;
    }
  };

  const handleBookAppointment = async (appointmentData: any): Promise<boolean> => {
    try {
      const res = await api.bookAppointment(appointmentData);
      if (res.success) {
        setAppointments(prev => [res.data, ...prev]);
        addToast(res.message, 'success');
        api.getDashboard().then(d => d.success && setDashboardData(d.data));
        return true;
      }
      addToast(res.message || 'Booking failed', 'warn');
      return false;
    } catch (err: any) {
      addToast(err.message, 'warn');
      return false;
    }
  };

  const handleUpdateAppointmentStatus = async (id: number, status: string): Promise<boolean> => {
    try {
      const res = await api.updateAppointmentStatus(id, status);
      if (res.success) {
        setAppointments(prev => prev.map(a => a.id === id ? res.data : a));
        addToast(res.message, 'info');
        return true;
      }
      return false;
    } catch (err: any) {
      addToast(err.message, 'warn');
      return false;
    }
  };

  const handleAllocateBed = async (id: number, data: { patient_name: string; uhid: string }): Promise<boolean> => {
    try {
      const res = await api.allocateBed(id, data);
      if (res.success) {
        setBeds(prev => prev.map(b => b.id === id ? res.data : b));
        addToast(res.message, 'success');
        api.getDashboard().then(d => d.success && setDashboardData(d.data));
        return true;
      }
      addToast(res.message, 'warn');
      return false;
    } catch (err: any) {
      addToast(err.message, 'warn');
      return false;
    }
  };

  const handleDischargeBed = async (id: number): Promise<boolean> => {
    try {
      const res = await api.dischargeBed(id);
      if (res.success) {
        setBeds(prev => prev.map(b => b.id === id ? res.data : b));
        addToast(res.message, 'info');
        api.getDashboard().then(d => d.success && setDashboardData(d.data));
        return true;
      }
      return false;
    } catch (err: any) {
      addToast(err.message, 'warn');
      return false;
    }
  };

  const handleUpdateBedStatus = async (id: number, status: string): Promise<boolean> => {
    try {
      const res = await api.updateBedStatus(id, status);
      if (res.success) {
        setBeds(prev => prev.map(b => b.id === id ? res.data : b));
        addToast(res.message, 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      addToast(err.message, 'warn');
      return false;
    }
  };

  const handleAddMedicine = async (medData: any): Promise<boolean> => {
    try {
      const res = await api.addMedicine(medData);
      if (res.success) {
        setMedicines(prev => [res.data, ...prev]);
        addToast(res.message, 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      addToast(err.message, 'warn');
      return false;
    }
  };

  const handleDispenseMedicine = async (id: number, qty: number): Promise<boolean> => {
    try {
      const res = await api.dispenseMedicine(id, qty);
      if (res.success) {
        setMedicines(prev => prev.map(m => m.id === id ? res.data : m));
        addToast(res.message, 'success');
        return true;
      }
      addToast(res.message, 'warn');
      return false;
    } catch (err: any) {
      addToast(err.message, 'warn');
      return false;
    }
  };

  const handleCreateLabOrder = async (orderData: any): Promise<boolean> => {
    try {
      const res = await api.createLabOrder(orderData);
      if (res.success) {
        setLabOrders(prev => [res.data, ...prev]);
        addToast(res.message, 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      addToast(err.message, 'warn');
      return false;
    }
  };

  const handleUpdateLabOrder = async (id: number, data: { status?: string; result_value?: string }): Promise<boolean> => {
    try {
      const res = await api.updateLabOrder(id, data);
      if (res.success) {
        setLabOrders(prev => prev.map(o => o.id === id ? res.data : o));
        addToast(res.message, 'info');
        return true;
      }
      return false;
    } catch (err: any) {
      addToast(err.message, 'warn');
      return false;
    }
  };

  const handleCreateInvoice = async (invoiceData: any): Promise<boolean> => {
    try {
      const res = await api.createInvoice(invoiceData);
      if (res.success) {
        setInvoices(prev => [res.data, ...prev]);
        addToast(res.message, 'success');
        api.getDashboard().then(d => d.success && setDashboardData(d.data));
        return true;
      }
      return false;
    } catch (err: any) {
      addToast(err.message, 'warn');
      return false;
    }
  };

  const handleRecordPayment = async (id: number, amount: number, method: string): Promise<boolean> => {
    try {
      const res = await api.recordPayment(id, amount, method);
      if (res.success) {
        setInvoices(prev => prev.map(i => i.id === id ? res.data : i));
        addToast(res.message, 'success');
        api.getDashboard().then(d => d.success && setDashboardData(d.data));
        return true;
      }
      return false;
    } catch (err: any) {
      addToast(err.message, 'warn');
      return false;
    }
  };

  // Badge calculations
  const badgeCounts = {
    appointments: appointments.filter(a => a.status === 'Checked-In' || a.status === 'Scheduled').length,
    beds: beds.filter(b => b.status === 'Occupied').length,
    pharmacyAlerts: medicines.filter(m => m.stock_quantity <= m.reorder_level).length,
    labAlerts: labOrders.filter(o => o.sample_status !== 'Completed').length
  };

  return (
    <div className="app-container">
      {/* Toast Notification Deck */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            {t.type === 'success' && <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />}
            {t.type === 'warn' && <AlertTriangle size={18} style={{ color: 'var(--danger)' }} />}
            {t.type === 'info' && <Info size={18} style={{ color: 'var(--primary)' }} />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        badgeCounts={badgeCounts}
      />

      {/* Main Screen Content */}
      <div className="main-wrapper">
        <Topbar
          currentTab={currentTab}
          theme={theme}
          setTheme={setTheme}
          onRefresh={loadAllData}
          dbStatus={dbStatus}
        />

        <main className="page-content">
          {currentTab === 'dashboard' && (
            <DashboardView
              data={dashboardData}
              onNavigate={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'patients' && (
            <PatientsView
              patients={patients}
              onRegisterPatient={handleRegisterPatient}
            />
          )}

          {currentTab === 'appointments' && (
            <AppointmentsView
              appointments={appointments}
              doctors={doctors}
              patients={patients}
              onBookAppointment={handleBookAppointment}
              onUpdateStatus={handleUpdateAppointmentStatus}
            />
          )}

          {currentTab === 'doctors' && (
            <DoctorsView
              doctors={doctors}
              onBookForDoctor={(docId) => {
                setCurrentTab('appointments');
              }}
            />
          )}

          {currentTab === 'beds' && (
            <BedsView
              beds={beds}
              patients={patients}
              onAllocateBed={handleAllocateBed}
              onDischargeBed={handleDischargeBed}
              onUpdateBedStatus={handleUpdateBedStatus}
            />
          )}

          {currentTab === 'pharmacy' && (
            <PharmacyView
              medicines={medicines}
              onAddMedicine={handleAddMedicine}
              onDispenseMedicine={handleDispenseMedicine}
            />
          )}

          {currentTab === 'laboratory' && (
            <LaboratoryView
              tests={labTests}
              orders={labOrders}
              patients={patients}
              doctors={doctors}
              onCreateOrder={handleCreateLabOrder}
              onUpdateOrder={handleUpdateLabOrder}
            />
          )}

          {currentTab === 'billing' && (
            <BillingView
              invoices={invoices}
              patients={patients}
              onCreateInvoice={handleCreateInvoice}
              onRecordPayment={handleRecordPayment}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
