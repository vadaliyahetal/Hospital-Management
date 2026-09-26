import React, { useState } from 'react';
import { Search, UserPlus, Phone, Mail, MapPin, AlertCircle, Heart, Shield, Calendar, Filter, X } from 'lucide-react';
import { Patient } from '../types';

interface PatientsViewProps {
  patients: Patient[];
  onRegisterPatient: (patientData: Partial<Patient>) => Promise<boolean>;
}

export const PatientsView: React.FC<PatientsViewProps> = ({ patients, onRegisterPatient }) => {
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [bloodFilter, setBloodFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '1990-01-01',
    gender: 'Male',
    blood_group: 'B+',
    phone: '',
    email: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    allergies: '',
    chronic_conditions: ''
  });

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      p.first_name.toLowerCase().includes(q) ||
      p.last_name.toLowerCase().includes(q) ||
      p.uhid.toLowerCase().includes(q) ||
      p.phone.includes(q);
    const matchesGender = !genderFilter || p.gender === genderFilter;
    const matchesBlood = !bloodFilter || p.blood_group === bloodFilter;
    return matchesSearch && matchesGender && matchesBlood;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.phone) {
      alert('Please fill in required fields: First Name, Last Name, Phone Number');
      return;
    }
    const success = await onRegisterPatient(formData as any);
    if (success) {
      setShowModal(false);
      setFormData({
        first_name: '',
        last_name: '',
        date_of_birth: '1990-01-01',
        gender: 'Male',
        blood_group: 'B+',
        phone: '',
        email: '',
        address: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        allergies: '',
        chronic_conditions: ''
      });
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by Patient Name, UHID, or Mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          <button
            className={`filter-pill ${!genderFilter && !bloodFilter ? 'active' : ''}`}
            onClick={() => { setGenderFilter(''); setBloodFilter(''); }}
          >
            All Patients ({patients.length})
          </button>
          <button
            className={`filter-pill ${genderFilter === 'Male' ? 'active' : ''}`}
            onClick={() => setGenderFilter(genderFilter === 'Male' ? '' : 'Male')}
          >
            Male
          </button>
          <button
            className={`filter-pill ${genderFilter === 'Female' ? 'active' : ''}`}
            onClick={() => setGenderFilter(genderFilter === 'Female' ? '' : 'Female')}
          >
            Female
          </button>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '0.84rem' }}
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
          >
            <option value="">All Blood Groups</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>

          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <UserPlus size={16} />
            <span>Register New Patient</span>
          </button>
        </div>
      </div>

      {/* Patients Table Card */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Universal Health ID (UHID)</th>
                <th>Patient Name</th>
                <th>Age / Gender</th>
                <th>Blood Group</th>
                <th>Contact</th>
                <th>Medical Alerts</th>
                <th>Registered On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No patients match your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const birthYear = new Date(p.date_of_birth).getFullYear();
                  const age = isNaN(birthYear) ? '-' : (new Date().getFullYear() - birthYear);
                  return (
                    <tr key={p.id}>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.04em' }}>
                          {p.uhid}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{p.first_name} {p.last_name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.email || 'No email registered'}</div>
                      </td>
                      <td>
                        {age} yrs • {p.gender}
                      </td>
                      <td>
                        <span className="badge badge-danger" style={{ fontWeight: 700 }}>
                          {p.blood_group}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.84rem' }}>
                          <Phone size={13} style={{ color: 'var(--text-dim)' }} />
                          {p.phone}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {p.allergies && p.allergies !== 'None' ? (
                            <span className="badge badge-warning" style={{ fontSize: '0.72rem' }} title={`Allergy: ${p.allergies}`}>
                              ⚠️ {p.allergies}
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>No allergies</span>
                          )}
                          {p.chronic_conditions && p.chronic_conditions !== 'None' && (
                            <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                              {p.chronic_conditions}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {p.created_at.split(' ')[0]}
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedPatient(p)}
                        >
                          View EMR
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient EMR Details Modal */}
      {selectedPatient && (
        <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <div>
                <h3>Electronic Medical Record (EMR)</h3>
                <div style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700 }}>
                  {selectedPatient.uhid}
                </div>
              </div>
              <button className="btn-icon-topbar" onClick={() => setSelectedPatient(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div className="user-avatar-circle" style={{ width: '54px', height: '54px', fontSize: '1.3rem' }}>
                  {selectedPatient.first_name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedPatient.first_name} {selectedPatient.last_name}</h4>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                    Gender: <strong>{selectedPatient.gender}</strong> | DOB: <strong>{selectedPatient.date_of_birth}</strong> | Blood Group: <strong style={{ color: 'var(--danger)' }}>{selectedPatient.blood_group}</strong>
                  </p>
                </div>
              </div>

              <div className="form-grid">
                <div>
                  <span className="form-label">Phone Number</span>
                  <div style={{ fontWeight: 600 }}>{selectedPatient.phone}</div>
                </div>
                <div>
                  <span className="form-label">Email Address</span>
                  <div style={{ fontWeight: 600 }}>{selectedPatient.email || 'N/A'}</div>
                </div>
                <div className="full-width">
                  <span className="form-label">Residential Address</span>
                  <div>{selectedPatient.address || 'Not Provided'}</div>
                </div>
                <div>
                  <span className="form-label">Emergency Contact</span>
                  <div style={{ fontWeight: 600 }}>{selectedPatient.emergency_contact_name || 'N/A'}</div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>{selectedPatient.emergency_contact_phone}</div>
                </div>
                <div>
                  <span className="form-label">Known Allergies</span>
                  <div className="badge badge-warning" style={{ marginTop: '4px' }}>
                    {selectedPatient.allergies || 'None'}
                  </div>
                </div>
                <div className="full-width">
                  <span className="form-label">Chronic Conditions / History</span>
                  <div className="badge badge-info" style={{ marginTop: '4px' }}>
                    {selectedPatient.chronic_conditions || 'None Reported'}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedPatient(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* New Patient Registration Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Register New Patient (UHID Generation)</h3>
              <button className="btn-icon-topbar" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Ramesh"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Kumar"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select
                      className="form-select"
                      value={formData.blood_group}
                      onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-input"
                      required
                      placeholder="+91 98XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="patient@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Residential Address</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Street, City, Pincode"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Emergency Contact Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Relative / Kin Name"
                      value={formData.emergency_contact_name}
                      onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Emergency Contact Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="Phone number"
                      value={formData.emergency_contact_phone}
                      onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Known Allergies (if any)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Penicillin, Peanuts"
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Chronic Conditions</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Hypertension, Diabetes"
                      value={formData.chronic_conditions}
                      onChange={(e) => setFormData({ ...formData, chronic_conditions: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save & Generate UHID</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
