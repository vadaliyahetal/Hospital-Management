import React, { useState } from 'react';
import { Stethoscope, Award, Calendar, DollarSign, MapPin, Phone, Mail, Search, Clock } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorsViewProps {
  doctors: Doctor[];
  onBookForDoctor: (docId: number) => void;
}

export const DoctorsView: React.FC<DoctorsViewProps> = ({ doctors, onBookForDoctor }) => {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const departments = Array.from(new Set(doctors.map(d => d.department)));

  const filtered = doctors.filter(d => {
    const q = search.toLowerCase();
    const matchesSearch = d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q);
    const matchesDept = !deptFilter || d.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div>
      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search doctors by name or sub-specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          <button
            className={`filter-pill ${!deptFilter ? 'active' : ''}`}
            onClick={() => setDeptFilter('')}
          >
            All Departments ({doctors.length})
          </button>
          {departments.map(dep => (
            <button
              key={dep}
              className={`filter-pill ${deptFilter === dep ? 'active' : ''}`}
              onClick={() => setDeptFilter(deptFilter === dep ? '' : dep)}
            >
              {dep}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px' }}>
        {filtered.map(doc => (
          <div key={doc.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                <div className="user-avatar-circle" style={{ width: '56px', height: '56px', fontSize: '1.4rem', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', flexShrink: 0 }}>
                  {doc.name.replace('Dr. ', '').charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{doc.name}</h3>
                  <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.86rem' }}>{doc.department}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{doc.specialization}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={15} style={{ color: 'var(--accent-teal)' }} />
                  <span>{doc.qualification}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={15} style={{ color: 'var(--accent-indigo)' }} />
                  <span>OPD Chamber: <strong>{doc.room_number}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={15} style={{ color: 'var(--warning)' }} />
                  <span>Days: {doc.available_days}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={15} style={{ color: 'var(--success)' }} />
                  <span>Consultation Fee: <strong style={{ color: 'var(--success)', fontSize: '0.95rem' }}>₹{doc.consultation_fee}</strong></span>
                </div>
              </div>
            </div>

            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-card-subtle)', borderRadius: '0 0 var(--radius-md) var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {doc.license_number}
              </span>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onBookForDoctor(doc.id)}
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
