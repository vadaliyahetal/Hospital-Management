import React, { useState } from 'react';
import { BedDouble, CheckCircle2, UserCheck, Sparkles, AlertCircle, Plus, X, UserX } from 'lucide-react';
import { Bed, Patient } from '../types';

interface BedsViewProps {
  beds: Bed[];
  patients: Patient[];
  onAllocateBed: (id: number, data: { patient_name: string; uhid: string }) => Promise<boolean>;
  onDischargeBed: (id: number) => Promise<boolean>;
  onUpdateBedStatus: (id: number, status: string) => Promise<boolean>;
}

export const BedsView: React.FC<BedsViewProps> = ({
  beds,
  patients,
  onAllocateBed,
  onDischargeBed,
  onUpdateBedStatus
}) => {
  const [wardFilter, setWardFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [patientId, setPatientId] = useState(patients[0]?.id || 1);

  const total = beds.length;
  const occupied = beds.filter(b => b.status === 'Occupied').length;
  const available = beds.filter(b => b.status === 'Available').length;
  const cleaning = beds.filter(b => b.status === 'Cleaning' || b.status === 'Maintenance').length;
  const occupancyPercent = total > 0 ? Math.round((occupied / total) * 100) : 0;

  const wardTypes = Array.from(new Set(beds.map(b => b.ward_type)));

  const filtered = beds.filter(b => {
    const matchesWard = !wardFilter || b.ward_type === wardFilter;
    const matchesStatus = !statusFilter || b.status === statusFilter;
    return matchesWard && matchesStatus;
  });

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBed) return;
    const pat = patients.find(p => p.id === Number(patientId));
    if (!pat) return;

    const success = await onAllocateBed(selectedBed.id, {
      patient_name: `${pat.first_name} ${pat.last_name}`,
      uhid: pat.uhid
    });
    if (success) {
      setSelectedBed(null);
    }
  };

  return (
    <div>
      {/* Capacity Overview Bar */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Ward Beds</span>
            <div className="kpi-icon-pill" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <BedDouble size={20} />
            </div>
          </div>
          <div className="kpi-value">{total}</div>
          <div className="kpi-meta">
            <span>Across General, Semi-Private, Deluxe & ICU</span>
          </div>
        </div>

        <div className="kpi-card teal">
          <div className="kpi-header">
            <span className="kpi-title">Available for Admission</span>
            <div className="kpi-icon-pill" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--success)' }}>{available}</div>
          <div className="kpi-meta">
            <span>Ready for instant admission</span>
          </div>
        </div>

        <div className="kpi-card danger">
          <div className="kpi-header">
            <span className="kpi-title">Currently Occupied</span>
            <div className="kpi-icon-pill" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
              <UserCheck size={20} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--danger)' }}>{occupied}</div>
          <div className="kpi-meta">
            <span>{occupancyPercent}% Total Occupancy Rate</span>
          </div>
        </div>

        <div className="kpi-card warning">
          <div className="kpi-header">
            <span className="kpi-title">Sanitization / Cleaning</span>
            <div className="kpi-icon-pill" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
              <Sparkles size={20} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--warning)' }}>{cleaning}</div>
          <div className="kpi-meta">
            <span>Disinfected prior to patient intake</span>
          </div>
        </div>
      </div>

      {/* Ward Filter Toolbar */}
      <div className="toolbar">
        <div className="filter-pills">
          <button
            className={`filter-pill ${!wardFilter ? 'active' : ''}`}
            onClick={() => setWardFilter('')}
          >
            All Wards ({beds.length})
          </button>
          {wardTypes.map(wt => (
            <button
              key={wt}
              className={`filter-pill ${wardFilter === wt ? 'active' : ''}`}
              onClick={() => setWardFilter(wardFilter === wt ? '' : wt)}
            >
              {wt}
            </button>
          ))}
        </div>

        <div className="filter-pills">
          {['', 'Available', 'Occupied', 'Cleaning'].map(st => (
            <button
              key={st || 'all-status'}
              className={`filter-pill ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st || 'All Statuses'}
            </button>
          ))}
        </div>
      </div>

      {/* Bed Matrix Grid */}
      <div className="bed-matrix-grid">
        {filtered.map(bed => {
          const isAvail = bed.status === 'Available';
          const isOcc = bed.status === 'Occupied';
          const isClean = bed.status === 'Cleaning';

          return (
            <div
              key={bed.id}
              className={`bed-card ${bed.status.toLowerCase()}`}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'monospace' }}>
                      {bed.bed_number}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {bed.ward_name}
                    </div>
                  </div>
                  <span className={`badge ${isAvail ? 'badge-success' : (isOcc ? 'badge-danger' : 'badge-warning')}`}>
                    {bed.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Category: <strong>{bed.ward_type}</strong> • ₹{bed.daily_charge}/day
                </div>

                {isOcc && (
                  <div style={{ background: 'var(--bg-card)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Admitted Patient</div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{bed.patient_name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontFamily: 'monospace' }}>{bed.uhid}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>Admitted: {bed.admission_date}</div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                {isAvail && (
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                    onClick={() => setSelectedBed(bed)}
                  >
                    Admit / Allocate Bed
                  </button>
                )}
                {isOcc && (
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', color: 'var(--danger)' }}
                    onClick={() => onDischargeBed(bed.id)}
                  >
                    <UserX size={15} />
                    <span>Discharge Patient</span>
                  </button>
                )}
                {isClean && (
                  <button
                    className="btn btn-success btn-sm"
                    style={{ width: '100%' }}
                    onClick={() => onUpdateBedStatus(bed.id, 'Available')}
                  >
                    <Sparkles size={15} />
                    <span>Mark Sanitized & Ready</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Allocate Bed Modal */}
      {selectedBed && (
        <div className="modal-overlay" onClick={() => setSelectedBed(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Admit Patient to Bed</h3>
                <p style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  {selectedBed.bed_number} — {selectedBed.ward_name} ({selectedBed.ward_type})
                </p>
              </div>
              <button className="btn-icon-topbar" onClick={() => setSelectedBed(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAllocate}>
              <div className="modal-body">
                <div className="form-group full-width">
                  <label className="form-label">Select Patient from Master Registry *</label>
                  <select
                    className="form-select"
                    required
                    value={patientId}
                    onChange={(e) => setPatientId(Number(e.target.value))}
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.first_name} {p.last_name} ({p.uhid}) - Blood: {p.blood_group}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ marginTop: '16px', padding: '14px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                  <div>Daily Bed Charge: <strong>₹{selectedBed.daily_charge} / day</strong></div>
                  <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                    Admission timestamp will be automatically logged and integrated with IPD Billing.
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedBed(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm Admission</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
