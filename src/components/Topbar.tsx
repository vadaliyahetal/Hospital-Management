import React from 'react';
import { Sun, Moon, Bell, ShieldCheck, Plus, RefreshCw } from 'lucide-react';

interface TopbarProps {
  currentTab: string;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  onRefresh: () => void;
  onQuickAction?: () => void;
  quickActionLabel?: string;
  dbStatus: string;
}

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Executive Operations Dashboard', subtitle: 'Live overview of hospital capacity, admissions, and revenue metrics' },
  patients: { title: 'Patient Registry & Electronic Health Records', subtitle: 'Master UHID directory with demographics, allergies & medical history' },
  appointments: { title: 'OPD Appointment & Queue Management', subtitle: 'Real-time patient check-in, token tracking & doctor consultations' },
  doctors: { title: 'Physicians & Specialists Directory', subtitle: 'Departmental faculty, consulting rooms, schedules & fees' },
  beds: { title: 'IPD Ward & Bed Occupancy Matrix', subtitle: 'Live bed availability, allocations, transfers & sanitization workflows' },
  pharmacy: { title: 'Pharmacy & Drug Formulary', subtitle: 'Inventory control, batch tracking, expiry monitoring & dispensing' },
  laboratory: { title: 'Diagnostic Pathology & Radiology', subtitle: 'Test requisition, specimen tracking & verified diagnostic reporting' },
  billing: { title: 'Revenue & Patient Invoicing', subtitle: 'OPD/IPD itemized billing, GST calculation, payments & receipts' }
};

export const Topbar: React.FC<TopbarProps> = ({
  currentTab,
  theme,
  setTheme,
  onRefresh,
  onQuickAction,
  quickActionLabel,
  dbStatus
}) => {
  const currentInfo = TAB_TITLES[currentTab] || { title: 'Hospital Management', subtitle: 'MediCare HMS' };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div>
          <h1 className="topbar-page-title">{currentInfo.title}</h1>
          <p className="card-subtitle">{currentInfo.subtitle}</p>
        </div>
      </div>

      <div className="topbar-right">
        <div className="live-badge" title="Backend Connection Status">
          <span className="live-dot"></span>
          <span>{dbStatus || 'Connected'}</span>
        </div>

        {quickActionLabel && onQuickAction && (
          <button className="btn btn-primary btn-sm" onClick={onQuickAction}>
            <Plus size={16} />
            <span>{quickActionLabel}</span>
          </button>
        )}

        <button
          className="btn-icon-topbar"
          title="Refresh Data"
          onClick={onRefresh}
        >
          <RefreshCw size={17} />
        </button>

        <button
          className="btn-icon-topbar"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};
