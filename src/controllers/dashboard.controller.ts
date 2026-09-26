import { Request, Response } from 'express';
import {
  initialPatients,
  initialDoctors,
  initialAppointments,
  initialBeds,
  initialMedicines,
  initialLabOrders,
  initialInvoices
} from '../data/mockStore.js';

export const getDashboardSummary = (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const totalPatients = initialPatients.length + 1420; // Enterprise scaled base
    const totalDoctors = initialDoctors.length + 38;
    const appointmentsToday = initialAppointments.length + 24;
    const pendingConsultations = initialAppointments.filter(a => a.status === 'Checked-In' || a.status === 'Scheduled').length;

    const totalBeds = initialBeds.length + 80;
    const occupiedBeds = initialBeds.filter(b => b.status === 'Occupied').length + 54;
    const bedOccupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

    const totalRevenueToday = initialInvoices.reduce((sum, inv) => sum + inv.paid_amount, 0) + 142500;
    const criticalLabAlerts = 2;
    const lowStockMedicines = initialMedicines.filter(m => m.stock_quantity <= m.reorder_level).length;

    const weeklyTrend = [
      { day: 'Mon', opd: 110, ipd: 22, revenue: 145000 },
      { day: 'Tue', opd: 135, ipd: 28, revenue: 178000 },
      { day: 'Wed', opd: 142, ipd: 31, revenue: 192000 },
      { day: 'Thu', opd: 128, ipd: 26, revenue: 165000 },
      { day: 'Fri', opd: 165, ipd: 35, revenue: 220000 },
      { day: 'Sat', opd: 180, ipd: 40, revenue: 245000 },
      { day: 'Sun', opd: 75,  ipd: 18, revenue: 98000 }
    ];

    const departmentStats = [
      { name: 'Cardiology', patients: 38, doctors: 6, load: 85 },
      { name: 'Neurology', patients: 29, doctors: 4, load: 72 },
      { name: 'Orthopedics', patients: 44, doctors: 5, load: 88 },
      { name: 'General Medicine', patients: 65, doctors: 8, load: 92 },
      { name: 'Pediatrics', patients: 31, doctors: 4, load: 65 }
    ];

    const recentActivities = [
      { id: 1, type: 'emergency', time: '10 mins ago', title: 'Emergency Intake', description: 'Patient registered in Emergency Observation Unit' },
      { id: 2, type: 'lab', time: '25 mins ago', title: 'Lab Test Verified', description: 'CBC results uploaded for Amit Trivedi (UHID-0001)' },
      { id: 3, type: 'bed', time: '40 mins ago', title: 'Bed Allocated', description: 'Bed SP-201 assigned to Rohan Kadam' },
      { id: 4, type: 'billing', time: '1 hour ago', title: 'Payment Received', description: 'Invoice INV-2026-001 paid ₹2,472.50 via UPI' },
      { id: 5, type: 'pharmacy', time: '2 hours ago', title: 'Low Stock Alert', description: 'Montek-LC reached critical stock level (18 units left)' }
    ];

    return res.json({
      success: true,
      data: {
        metrics: {
          totalPatients,
          totalDoctors,
          appointmentsToday,
          pendingConsultations,
          totalBeds,
          occupiedBeds,
          bedOccupancyRate,
          totalRevenueToday,
          criticalLabAlerts,
          lowStockMedicines
        },
        weeklyTrend,
        departmentStats,
        recentActivities
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
