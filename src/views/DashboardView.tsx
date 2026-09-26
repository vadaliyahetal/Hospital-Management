import React from 'react';
import {
  Users,
  Stethoscope,
  CalendarCheck,
  BedDouble,
  ReceiptIndianRupee,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { DashboardData } from '../types';

interface DashboardViewProps {
  data: DashboardData | null;
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ data, onNavigate }) => {
  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Activity className="animate-spin" size={32} style={{ color: 'var(--primary)', margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--text-muted)' }}>Loading live hospital analytics...</p>
      </div>
    );
  }

  const { metrics, weeklyTrend, departmentStats, recentActivities } = data;

  return (
    <div>
      {/* Primary KPI Grid */}
      <div className="kpi-grid">
        <div className="kpi-card" onClick={() => onNavigate('patients')} style={{ cursor: 'pointer' }}>
          <div className="kpi-header">
            <span className="kpi-title">Total Registered Patients</span>
            <div className="kpi-icon-pill" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Users size={20} />
            </div>
          </div>
          <div className="kpi-value">{metrics.totalPatients.toLocaleString()}</div>
          <div className="kpi-meta">
            <span className="trend-badge up">
              <TrendingUp size={12} /> +12%
            </span>
            <span>Active EMR health records</span>
          </div>
        </div>

        <div className="kpi-card teal" onClick={() => onNavigate('appointments')} style={{ cursor: 'pointer' }}>
          <div className="kpi-header">
            <span className="kpi-title">OPD Consultations Today</span>
            <div className="kpi-icon-pill" style={{ background: 'var(--accent-teal-light)', color: 'var(--accent-teal)' }}>
              <CalendarCheck size={20} />
            </div>
          </div>
          <div className="kpi-value">{metrics.appointmentsToday}</div>
          <div className="kpi-meta">
            <span className="badge badge-warning" style={{ fontSize: '0.74rem' }}>
              {metrics.pendingConsultations} In Queue
            </span>
            <span>Tokens active right now</span>
          </div>
        </div>

        <div className="kpi-card indigo" onClick={() => onNavigate('beds')} style={{ cursor: 'pointer' }}>
          <div className="kpi-header">
            <span className="kpi-title">Bed Occupancy Rate</span>
            <div className="kpi-icon-pill" style={{ background: 'var(--accent-indigo-light)', color: 'var(--accent-indigo)' }}>
              <BedDouble size={20} />
            </div>
          </div>
          <div className="kpi-value">{metrics.bedOccupancyRate}%</div>
          <div className="kpi-meta">
            <span style={{ fontWeight: 600, color: 'var(--accent-indigo)' }}>
              {metrics.occupiedBeds} / {metrics.totalBeds} Beds
            </span>
            <span>Across 5 IPD Wards</span>
          </div>
        </div>

        <div className="kpi-card success" onClick={() => onNavigate('billing')} style={{ cursor: 'pointer' }}>
          <div className="kpi-header">
            <span className="kpi-title">Hospital Collections Today</span>
            <div className="kpi-icon-pill" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
              <ReceiptIndianRupee size={20} />
            </div>
          </div>
          <div className="kpi-value">₹{metrics.totalRevenueToday.toLocaleString()}</div>
          <div className="kpi-meta">
            <span className="trend-badge up">
              <ArrowUpRight size={12} /> Verified
            </span>
            <span>Real-time OPD & IPD cash flow</span>
          </div>
        </div>
      </div>

      {/* Main Insights Dual Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        
        {/* Weekly Census Trend */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Weekly Patient Admissions & OPD Flow</h2>
              <p className="card-subtitle">Daily consultation & indoor patient volume</p>
            </div>
            <span className="badge badge-info">This Week</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', gap: '12px', paddingTop: '20px' }}>
              {weeklyTrend.map((t) => {
                const maxVal = 200;
                const heightPercent = Math.min(100, Math.round((t.opd / maxVal) * 100));
                return (
                  <div key={t.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t.opd}</div>
                    <div style={{
                      width: '100%',
                      maxWidth: '36px',
                      height: `${heightPercent}%`,
                      background: 'linear-gradient(180deg, #0ea5e9 0%, #0284c7 100%)',
                      borderRadius: '6px 6px 0 0',
                      boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)',
                      transition: 'height 0.4s ease'
                    }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t.day}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#0284c7' }}></span>
                <span>OPD Consultations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Department Workload & Utilization */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Department Clinical Workload</h2>
              <p className="card-subtitle">Staffing ratios and patient volume</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('doctors')}>
              View Specialists
            </button>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {departmentStats.map((dep) => (
              <div key={dep.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.86rem' }}>
                  <span style={{ fontWeight: 600 }}>{dep.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {dep.patients} Patients • {dep.doctors} Doctors on Duty
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{
                    width: `${dep.load}%`,
                    height: '100%',
                    background: dep.load > 85 ? 'var(--danger)' : (dep.load > 75 ? 'var(--warning)' : 'var(--accent-teal)'),
                    borderRadius: 'var(--radius-full)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Activity Stream & Quick Launch */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        
        {/* Recent Operational Events */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Clock size={18} style={{ color: 'var(--primary)' }} />
              Live Clinical Activity Stream
            </h2>
            <span className="live-badge">
              <span className="live-dot"></span> Realtime
            </span>
          </div>
          <div className="card-body" style={{ padding: '16px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {recentActivities.map((act) => (
                <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Activity size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{act.title}</span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{act.time}</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>{act.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fast Action Shortcuts */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Quick Action Desk</h2>
            <span className="card-subtitle">Common Frontline Operations</span>
          </div>
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            <button className="btn btn-secondary" style={{ flexDirection: 'column', height: '90px', padding: '12px' }} onClick={() => onNavigate('patients')}>
              <Users size={22} style={{ color: 'var(--primary)' }} />
              <span>Register Patient</span>
            </button>

            <button className="btn btn-secondary" style={{ flexDirection: 'column', height: '90px', padding: '12px' }} onClick={() => onNavigate('appointments')}>
              <CalendarCheck size={22} style={{ color: 'var(--accent-teal)' }} />
              <span>Book OPD Token</span>
            </button>

            <button className="btn btn-secondary" style={{ flexDirection: 'column', height: '90px', padding: '12px' }} onClick={() => onNavigate('beds')}>
              <BedDouble size={22} style={{ color: 'var(--accent-indigo)' }} />
              <span>Admit to Ward</span>
            </button>

            <button className="btn btn-secondary" style={{ flexDirection: 'column', height: '90px', padding: '12px' }} onClick={() => onNavigate('billing')}>
              <ReceiptIndianRupee size={22} style={{ color: 'var(--success)' }} />
              <span>Generate Bill</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
