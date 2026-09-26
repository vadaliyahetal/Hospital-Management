import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  Stethoscope,
  BedDouble,
  Pill,
  FlaskConical,
  ReceiptIndianRupee,
  HeartPulse
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: { name: string; role: string; email: string };
  setCurrentUser: (user: any) => void;
  badgeCounts: {
    appointments: number;
    beds: number;
    pharmacyAlerts: number;
    labAlerts: number;
  };
}

export const DEMO_ROLES = [
  { name: 'Super Admin', role: 'Super Admin', email: 'admin@medicare.com' },
  { name: 'Dr. Rajesh Sharma', role: 'Doctor (Cardiology)', email: 'dr.sharma@medicare.com' },
  { name: 'Sunita Deshmukh', role: 'Frontdesk Receptionist', email: 'reception@medicare.com' },
  { name: 'Vikram Mehta', role: 'Chief Pharmacist', email: 'pharmacy@medicare.com' },
  { name: 'Neha Kulkarni', role: 'Senior Lab Technician', email: 'lab@medicare.com' },
  { name: 'Ramesh Gupta', role: 'Billing & Accounts Manager', email: 'billing@medicare.com' }
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  setCurrentUser,
  badgeCounts
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard & KPI', icon: LayoutDashboard },
    { id: 'patients', label: 'Patient Master (EMR)', icon: Users },
    { id: 'appointments', label: 'OPD Appointments', icon: CalendarClock, badge: badgeCounts.appointments },
    { id: 'doctors', label: 'Doctors Directory', icon: Stethoscope },
    { id: 'beds', label: 'IPD Bed Management', icon: BedDouble, badge: badgeCounts.beds },
    { id: 'pharmacy', label: 'Pharmacy & Stock', icon: Pill, badge: badgeCounts.pharmacyAlerts, badgeWarn: true },
    { id: 'laboratory', label: 'Laboratory & Diagnostics', icon: FlaskConical, badge: badgeCounts.labAlerts },
    { id: 'billing', label: 'Billing & Invoices', icon: ReceiptIndianRupee }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon-wrapper">
          <HeartPulse size={24} strokeWidth={2.4} />
        </div>
        <div>
          <div className="brand-title">MediCare HMS</div>
          <div className="brand-subtitle">Enterprise Healthcare</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Clinical Core Modules</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentTab(item.id)}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{item.label}</span>
              {Boolean(item.badge) && (
                <span className={`badge-count ${item.badgeWarn ? 'warn' : ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-summary">
          <div className="user-avatar-circle">
            {currentUser.name.charAt(0)}
          </div>
          <div className="user-info-text">
            <div className="name">{currentUser.name}</div>
            <select
              value={currentUser.email}
              className="sidebar-user-select"
              onChange={(e) => {
                const selected = DEMO_ROLES.find(r => r.email === e.target.value);
                if (selected) setCurrentUser(selected);
              }}
            >
              {DEMO_ROLES.map(r => (
                <option key={r.email} value={r.email}>
                  {r.role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
};
