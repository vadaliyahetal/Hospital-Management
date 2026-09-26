import React, { useState } from 'react';
import { FlaskConical, Search, Plus, CheckCircle, Clock, FileCheck, X, FileText, Activity } from 'lucide-react';
import { LabTest, LabOrder, Patient, Doctor } from '../types';

interface LaboratoryViewProps {
  tests: LabTest[];
  orders: LabOrder[];
  patients: Patient[];
  doctors: Doctor[];
  onCreateOrder: (order: any) => Promise<boolean>;
  onUpdateOrder: (id: number, data: { status?: string; result_value?: string }) => Promise<boolean>;
}

export const LaboratoryView: React.FC<LaboratoryViewProps> = ({
  tests,
  orders,
  patients,
  doctors,
  onCreateOrder,
  onUpdateOrder
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'catalog'>('orders');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [resultOrder, setResultOrder] = useState<LabOrder | null>(null);
  const [resultText, setResultText] = useState('');

  const [orderForm, setOrderForm] = useState({
    patient_id: patients[0]?.id || 1,
    doctor_name: doctors[0]?.name || 'Dr. Attending',
    test_id: tests[0]?.id || 1
  });

  const filteredOrders = orders.filter(o => {
    const q = search.toLowerCase();
    const matchesSearch =
      o.patient_name.toLowerCase().includes(q) ||
      o.test_name.toLowerCase().includes(q) ||
      o.order_code.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || o.sample_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === Number(orderForm.patient_id));
    const payload = {
      ...orderForm,
      patient_name: pat ? `${pat.first_name} ${pat.last_name}` : 'Patient',
      patient_uhid: pat?.uhid || 'UHID-2026-9999'
    };

    const success = await onCreateOrder(payload);
    if (success) {
      setShowOrderModal(false);
    }
  };

  const handleResultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultOrder) return;
    const success = await onUpdateOrder(resultOrder.id, {
      status: 'Completed',
      result_value: resultText
    });
    if (success) {
      setResultOrder(null);
      setResultText('');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ordered': return 'badge-neutral';
      case 'Collected': return 'badge-warning';
      case 'In-Analysis': return 'badge-info';
      case 'Completed': return 'badge-success';
      default: return 'badge-neutral';
    }
  };

  return (
    <div>
      {/* Switcher & Toolbar */}
      <div className="toolbar">
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setActiveTab('orders')}
          >
            Diagnostic Test Orders ({orders.length})
          </button>
          <button
            className={`btn ${activeTab === 'catalog' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setActiveTab('catalog')}
          >
            Investigation Test Menu ({tests.length})
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="search-box" style={{ minWidth: '240px' }}>
            <Search size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search tests or patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="btn btn-primary btn-sm" onClick={() => setShowOrderModal(true)}>
            <Plus size={16} />
            <span>Requisition Lab Test</span>
          </button>
        </div>
      </div>

      {/* Orders Table View */}
      {activeTab === 'orders' && (
        <div className="card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order Requisition #</th>
                  <th>Patient Details</th>
                  <th>Investigation Test</th>
                  <th>Category</th>
                  <th>Referring Doctor</th>
                  <th>Order Date</th>
                  <th>Specimen Status</th>
                  <th>Diagnostic Findings / Results</th>
                  <th>Workflow Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>
                        {order.order_code}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.patient_name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{order.patient_uhid}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.test_name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Ref Range: {order.normal_range}</div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{order.category}</span>
                    </td>
                    <td>{order.doctor_name}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{order.order_date}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(order.sample_status)}`}>
                        {order.sample_status}
                      </span>
                    </td>
                    <td style={{ maxWidth: '240px' }}>
                      {order.result_value ? (
                        <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--success)' }}>
                          {order.result_value}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Pending analysis</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {order.sample_status === 'Ordered' && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => onUpdateOrder(order.id, { status: 'Collected' })}
                          >
                            Collect Sample
                          </button>
                        )}
                        {order.sample_status === 'Collected' && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => onUpdateOrder(order.id, { status: 'In-Analysis' })}
                          >
                            Start Analysis
                          </button>
                        )}
                        {order.sample_status === 'In-Analysis' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              setResultOrder(order);
                              setResultText(order.result_value || '');
                            }}
                          >
                            Enter Results
                          </button>
                        )}
                        {order.sample_status === 'Completed' && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>
                            ✓ Verified Report
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Catalog Table View */}
      {activeTab === 'catalog' && (
        <div className="card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Test Code</th>
                  <th>Test Name</th>
                  <th>Category</th>
                  <th>Sample Required</th>
                  <th>Normal Biological Reference Range</th>
                  <th>Turnaround Time</th>
                  <th>Tariff Price</th>
                </tr>
              </thead>
              <tbody>
                {tests.map(test => (
                  <tr key={test.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>
                        {test.test_code}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{test.test_name}</td>
                    <td><span className="badge badge-neutral">{test.category}</span></td>
                    <td>{test.sample_type}</td>
                    <td>{test.normal_range} ({test.unit})</td>
                    <td>{test.turnaround_hours} hours</td>
                    <td style={{ fontWeight: 700, color: 'var(--success)' }}>₹{test.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Requisition Order Modal */}
      {showOrderModal && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Requisition Laboratory Investigation</h3>
              <button className="btn-icon-topbar" onClick={() => setShowOrderModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleOrderSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">Patient *</label>
                    <select
                      className="form-select"
                      required
                      value={orderForm.patient_id}
                      onChange={(e) => setOrderForm({ ...orderForm, patient_id: Number(e.target.value) })}
                    >
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.first_name} {p.last_name} ({p.uhid})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Referring Doctor</label>
                    <select
                      className="form-select"
                      value={orderForm.doctor_name}
                      onChange={(e) => setOrderForm({ ...orderForm, doctor_name: e.target.value })}
                    >
                      {doctors.map(d => (
                        <option key={d.id} value={d.name}>{d.name} ({d.department})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Investigation Test *</label>
                    <select
                      className="form-select"
                      required
                      value={orderForm.test_id}
                      onChange={(e) => setOrderForm({ ...orderForm, test_id: Number(e.target.value) })}
                    >
                      {tests.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.test_name} ({t.category}) — ₹{t.price}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowOrderModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Generate Lab Requisition</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enter Result Modal */}
      {resultOrder && (
        <div className="modal-overlay" onClick={() => setResultOrder(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <div>
                <h3>Upload Diagnostic Finding</h3>
                <p style={{ color: 'var(--primary)', fontWeight: 600 }}>{resultOrder.test_name}</p>
              </div>
              <button className="btn-icon-topbar" onClick={() => setResultOrder(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleResultSubmit}>
              <div className="modal-body">
                <div style={{ marginBottom: '14px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  Normal Reference Range: <strong>{resultOrder.normal_range}</strong>
                </div>
                <div className="form-group">
                  <label className="form-label">Result Finding / Measurement Values *</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    required
                    placeholder="e.g. Hb: 13.8 g/dL, WBC: 6800 /mcL, Platelets: 2.4 Lakhs"
                    value={resultText}
                    onChange={(e) => setResultText(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setResultOrder(null)}>Cancel</button>
                <button type="submit" className="btn btn-success">Verify & Publish Result</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
