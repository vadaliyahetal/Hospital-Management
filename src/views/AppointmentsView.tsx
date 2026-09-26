import React, { useState } from 'react';
import { Calendar, Clock, User, Stethoscope, Search, Plus, CheckCircle, Clock3, AlertCircle, X } from 'lucide-react';
import { Appointment, Doctor, Patient } from '../types';

interface AppointmentsViewProps {
  appointments: Appointment[];
  doctors: Doctor[];
  patients: Patient[];
  onBookAppointment: (data: any) => Promise<boolean>;
  onUpdateStatus: (id: number, status: string) => Promise<boolean>;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  doctors,
  patients,
  onBookAppointment,
  onUpdateStatus
}) => {
  const [statusFilter, setStatusFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    patient_id: patients[0]?.id || 1,
    doctor_id: doctors[0]?.id || 1,
    appointment_date: new Date().toISOString().split('T')[0],
    time_slot: '10:00 AM',
    type: 'OPD',
    symptoms: ''
  });

  const filtered = appointments.filter((a) => {
    const q = search.toLowerCase();
    const matchesSearch =
      a.patient_name.toLowerCase().includes(q) ||
      a.doctor_name.toLowerCase().includes(q) ||
      a.appointment_code.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || a.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesDoc = !doctorFilter || a.doctor_id === Number(doctorFilter);
    return matchesSearch && matchesStatus && matchesDoc;
  });

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === Number(bookingForm.patient_id));
    const doc = doctors.find(d => d.id === Number(bookingForm.doctor_id));

    const payload = {
      ...bookingForm,
      patient_name: pat ? `${pat.first_name} ${pat.last_name}` : 'Patient',
      patient_uhid: pat?.uhid || 'UHID-2026-9999',
      doctor_name: doc?.name || 'Dr. On Duty',
      department: doc?.department || 'General Medicine'
    };

    const success = await onBookAppointment(payload);
    if (success) {
      setShowModal(false);
      setBookingForm({
        ...bookingForm,
        symptoms: ''
      });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'checked-in': return 'badge-info';
      case 'in-consultation': return 'badge-warning';
      case 'completed': return 'badge-success';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-neutral';
    }
  };

  return (
    <div>
      {/* Action Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search appointment code, patient or doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          {['', 'Scheduled', 'Checked-In', 'In-Consultation', 'Completed'].map((st) => (
            <button
              key={st || 'all'}
              className={`filter-pill ${statusFilter.toLowerCase() === st.toLowerCase() ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st || 'All Appointments'}
            </button>
          ))}

          <select
            className="form-select"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '0.84rem' }}
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
          >
            <option value="">All Consulting Doctors</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.department})</option>
            ))}
          </select>

          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            <span>Book Appointment Token</span>
          </button>
        </div>
      </div>

      {/* Appointment Queue Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Token #</th>
                <th>Appointment Code</th>
                <th>Patient Details</th>
                <th>Doctor & Dept</th>
                <th>Date & Slot</th>
                <th>Type</th>
                <th>Chief Complaints</th>
                <th>Queue Status</th>
                <th>Advance Workflow</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No appointments found matching your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((apt) => (
                  <tr key={apt.id}>
                    <td>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.95rem'
                      }}>
                        #{apt.token_number}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{apt.appointment_code}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{apt.patient_name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{apt.patient_uhid}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{apt.doctor_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{apt.department}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{apt.appointment_date}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{apt.time_slot}</div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{apt.type}</span>
                    </td>
                    <td style={{ maxWidth: '220px' }}>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={apt.symptoms}>
                        {apt.symptoms || 'General Consultation'}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {apt.status === 'Scheduled' && (
                          <button
                            className="btn btn-secondary btn-sm"
                            title="Check-In Patient to Queue"
                            onClick={() => onUpdateStatus(apt.id, 'Checked-In')}
                          >
                            Check-In
                          </button>
                        )}
                        {apt.status === 'Checked-In' && (
                          <button
                            className="btn btn-primary btn-sm"
                            title="Call Patient into Doctor Chamber"
                            onClick={() => onUpdateStatus(apt.id, 'In-Consultation')}
                          >
                            Consult
                          </button>
                        )}
                        {apt.status === 'In-Consultation' && (
                          <button
                            className="btn btn-success btn-sm"
                            title="Complete Consultation"
                            onClick={() => onUpdateStatus(apt.id, 'Completed')}
                          >
                            Complete
                          </button>
                        )}
                        {apt.status === 'Completed' && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>
                            ✓ Finished
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Schedule OPD Consultation Token</h3>
              <button className="btn-icon-topbar" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleBooking}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">Select Registered Patient *</label>
                    <select
                      className="form-select"
                      required
                      value={bookingForm.patient_id}
                      onChange={(e) => setBookingForm({ ...bookingForm, patient_id: Number(e.target.value) })}
                    >
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.first_name} {p.last_name} ({p.uhid}) - {p.phone}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Consulting Specialist Doctor *</label>
                    <select
                      className="form-select"
                      required
                      value={bookingForm.doctor_id}
                      onChange={(e) => setBookingForm({ ...bookingForm, doctor_id: Number(e.target.value) })}
                    >
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name} — {d.specialization} ({d.department}) - Fee: ₹{d.consultation_fee}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Appointment Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={bookingForm.appointment_date}
                      onChange={(e) => setBookingForm({ ...bookingForm, appointment_date: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred Time Slot</label>
                    <select
                      className="form-select"
                      value={bookingForm.time_slot}
                      onChange={(e) => setBookingForm({ ...bookingForm, time_slot: e.target.value })}
                    >
                      {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM'].map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Visit Type</label>
                    <select
                      className="form-select"
                      value={bookingForm.type}
                      onChange={(e) => setBookingForm({ ...bookingForm, type: e.target.value as any })}
                    >
                      <option value="OPD">OPD Consultation</option>
                      <option value="Follow-up">Follow-up Review</option>
                      <option value="Emergency">Emergency Evaluation</option>
                      <option value="Teleconsultation">Teleconsultation</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Symptoms / Chief Complaints</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      placeholder="e.g. Recurrent fever, shortness of breath, headache for 3 days"
                      value={bookingForm.symptoms}
                      onChange={(e) => setBookingForm({ ...bookingForm, symptoms: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Generate OPD Token</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
