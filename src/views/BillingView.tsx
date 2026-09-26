import React, { useState } from 'react';
import { Receipt, Search, Plus, CreditCard, CheckCircle2, Clock, Printer, X, DollarSign } from 'lucide-react';
import { Invoice, Patient } from '../types';

interface BillingViewProps {
  invoices: Invoice[];
  patients: Patient[];
  onCreateInvoice: (inv: any) => Promise<boolean>;
  onRecordPayment: (id: number, amount: number, method: string) => Promise<boolean>;
}

export const BillingView: React.FC<BillingViewProps> = ({
  invoices,
  patients,
  onCreateInvoice,
  onRecordPayment
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [payModalInvoice, setPayModalInvoice] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState('UPI');

  const totalCollected = invoices.reduce((sum, inv) => sum + inv.paid_amount, 0);
  const totalPending = invoices.reduce((sum, inv) => sum + inv.balance_amount, 0);

  const [newInv, setNewInv] = useState({
    patient_id: patients[0]?.id || 1,
    payment_method: 'UPI',
    paid_amount: 0,
    discount_amount: 0,
    items: [
      { item_type: 'Consultation', description: 'Specialist Doctor Consultation', quantity: 1, unit_price: 800 }
    ]
  });

  const filtered = invoices.filter(inv => {
    const q = search.toLowerCase();
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(q) ||
      inv.patient_name.toLowerCase().includes(q) ||
      inv.patient_uhid.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || inv.payment_status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleAddItemRow = () => {
    setNewInv({
      ...newInv,
      items: [
        ...newInv.items,
        { item_type: 'Pharmacy', description: 'Prescribed Medications', quantity: 1, unit_price: 250 }
      ]
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === Number(newInv.patient_id));
    const payload = {
      ...newInv,
      patient_name: pat ? `${pat.first_name} ${pat.last_name}` : 'Patient',
      patient_uhid: pat?.uhid || 'UHID-2026-9999'
    };

    const success = await onCreateInvoice(payload);
    if (success) {
      setShowCreateModal(false);
    }
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payModalInvoice) return;
    const success = await onRecordPayment(payModalInvoice.id, payAmount, payMethod);
    if (success) {
      setPayModalInvoice(null);
    }
  };

  return (
    <div>
      {/* Revenue KPI Snapshot */}
      <div className="kpi-grid">
        <div className="kpi-card success">
          <div className="kpi-header">
            <span className="kpi-title">Total Payments Collected</span>
            <div className="kpi-icon-pill" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--success)' }}>
            ₹{totalCollected.toLocaleString()}
          </div>
          <div className="kpi-meta">
            <span>Aggregated across UPI, Cards, Net Banking & Cash</span>
          </div>
        </div>

        <div className="kpi-card warning">
          <div className="kpi-header">
            <span className="kpi-title">Outstanding Receivables</span>
            <div className="kpi-icon-pill" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
              <Clock size={20} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: 'var(--warning)' }}>
            ₹{totalPending.toLocaleString()}
          </div>
          <div className="kpi-meta">
            <span>Pending patient dues & insurance claims</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Invoices Raised</span>
            <div className="kpi-icon-pill" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Receipt size={20} />
            </div>
          </div>
          <div className="kpi-value">{invoices.length}</div>
          <div className="kpi-meta">
            <span>OPD Consultation, Diagnostics & IPD Stays</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search invoice number or patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          {['', 'Paid', 'Partially Paid', 'Unpaid'].map(st => (
            <button
              key={st || 'all-status'}
              className={`filter-pill ${statusFilter.toLowerCase() === st.toLowerCase() ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st || 'All Invoices'}
            </button>
          ))}

          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} />
            <span>Generate Itemized Bill</span>
          </button>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Patient Details</th>
                <th>Subtotal</th>
                <th>Tax (GST 5%)</th>
                <th>Total Payable</th>
                <th>Paid Amount</th>
                <th>Due Balance</th>
                <th>Payment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>
                      {inv.invoice_number}
                    </span>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{inv.created_at}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{inv.patient_name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{inv.patient_uhid}</div>
                  </td>
                  <td>₹{inv.subtotal.toFixed(2)}</td>
                  <td>₹{inv.tax_amount.toFixed(2)}</td>
                  <td style={{ fontWeight: 700 }}>₹{inv.total_amount.toFixed(2)}</td>
                  <td style={{ color: 'var(--success)', fontWeight: 600 }}>₹{inv.paid_amount.toFixed(2)}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: inv.balance_amount > 0 ? 'var(--danger)' : 'var(--text-dim)' }}>
                      ₹{inv.balance_amount.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${inv.payment_status === 'Paid' ? 'badge-success' : (inv.payment_status === 'Unpaid' ? 'badge-danger' : 'badge-warning')}`}>
                      {inv.payment_status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedInvoice(inv)}
                      >
                        Receipt
                      </button>
                      {inv.balance_amount > 0 && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setPayModalInvoice(inv);
                            setPayAmount(inv.balance_amount);
                          }}
                        >
                          Collect
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Receipt Print Preview Modal */}
      {selectedInvoice && (
        <div className="modal-overlay" onClick={() => setSelectedInvoice(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <div>
                <h3>Hospital Tax Invoice & Receipt</h3>
                <span style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700 }}>
                  {selectedInvoice.invoice_number}
                </span>
              </div>
              <button className="btn-icon-topbar" onClick={() => setSelectedInvoice(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ fontWeight: 700 }}>MediCare Multispecialty Hospital</h4>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>GSTIN: 27AAAAA0000A1Z5 • NABH Accredited</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Plot 44, Medical Enclave, Health City</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600 }}>Date: {selectedInvoice.created_at}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Payment Mode: {selectedInvoice.payment_method}</div>
                </div>
              </div>

              <div style={{ padding: '12px 16px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)', marginBottom: '18px' }}>
                <div style={{ fontWeight: 700 }}>Billed To: {selectedInvoice.patient_name}</div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>UHID: {selectedInvoice.patient_uhid}</div>
                {selectedInvoice.insurance_provider && (
                  <div style={{ fontSize: '0.84rem', color: 'var(--primary)' }}>TPA Insurance: {selectedInvoice.insurance_provider}</div>
                )}
              </div>

              <table className="data-table" style={{ marginBottom: '16px' }}>
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Type</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((it, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 500 }}>{it.description}</td>
                      <td><span className="badge badge-neutral">{it.item_type}</span></td>
                      <td>{it.quantity}</td>
                      <td>₹{it.unit_price}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{it.total_price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', fontSize: '0.9rem' }}>
                <div>Subtotal: <strong>₹{selectedInvoice.subtotal.toFixed(2)}</strong></div>
                <div>GST (5%): <strong>₹{selectedInvoice.tax_amount.toFixed(2)}</strong></div>
                {selectedInvoice.discount_amount > 0 && (
                  <div style={{ color: 'var(--danger)' }}>Discount: -₹{selectedInvoice.discount_amount.toFixed(2)}</div>
                )}
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
                  Total: ₹{selectedInvoice.total_amount.toFixed(2)}
                </div>
                <div style={{ color: 'var(--success)', fontWeight: 600 }}>Paid: ₹{selectedInvoice.paid_amount.toFixed(2)}</div>
                {selectedInvoice.balance_amount > 0 && (
                  <div style={{ color: 'var(--danger)', fontWeight: 700 }}>Due Balance: ₹{selectedInvoice.balance_amount.toFixed(2)}</div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => window.print()}>
                <Printer size={16} />
                <span>Print Tax Invoice</span>
              </button>
              <button className="btn btn-primary" onClick={() => setSelectedInvoice(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Collect Payment Modal */}
      {payModalInvoice && (
        <div className="modal-overlay" onClick={() => setPayModalInvoice(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <div>
                <h3>Record Patient Payment</h3>
                <p style={{ color: 'var(--primary)', fontWeight: 600 }}>{payModalInvoice.invoice_number}</p>
              </div>
              <button className="btn-icon-topbar" onClick={() => setPayModalInvoice(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handlePaySubmit}>
              <div className="modal-body">
                <div style={{ marginBottom: '14px', padding: '12px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <div>Patient: <strong>{payModalInvoice.patient_name}</strong></div>
                  <div>Outstanding Due: <strong style={{ color: 'var(--danger)' }}>₹{payModalInvoice.balance_amount.toFixed(2)}</strong></div>
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">Payment Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max={payModalInvoice.balance_amount}
                    className="form-input"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-select"
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                  >
                    {['UPI', 'Cash', 'Credit Card', 'Debit Card', 'Net Banking', 'Insurance TPA'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setPayModalInvoice(null)}>Cancel</button>
                <button type="submit" className="btn btn-success">Confirm Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Bill Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Generate Itemized Invoice</h3>
              <button className="btn-icon-topbar" onClick={() => setShowCreateModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                <div className="form-grid" style={{ marginBottom: '16px' }}>
                  <div className="form-group full-width">
                    <label className="form-label">Select Patient *</label>
                    <select
                      className="form-select"
                      required
                      value={newInv.patient_id}
                      onChange={(e) => setNewInv({ ...newInv, patient_id: Number(e.target.value) })}
                    >
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>{p.first_name} {p.last_name} ({p.uhid})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Initial Paid Amount (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newInv.paid_amount}
                      onChange={(e) => setNewInv({ ...newInv, paid_amount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Payment Method</label>
                    <select
                      className="form-select"
                      value={newInv.payment_method}
                      onChange={(e) => setNewInv({ ...newInv, payment_method: e.target.value })}
                    >
                      {['UPI', 'Cash', 'Card', 'Net Banking'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="form-label">Line Items</span>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddItemRow}>
                    + Add Item
                  </button>
                </div>

                {newInv.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <select
                      className="form-select"
                      value={it.item_type}
                      onChange={(e) => {
                        const items = [...newInv.items];
                        items[idx].item_type = e.target.value;
                        setNewInv({ ...newInv, items });
                      }}
                    >
                      <option value="Consultation">Consultation</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Lab Test">Lab Test</option>
                      <option value="Room/Bed">Room/Bed</option>
                      <option value="Procedure">Procedure</option>
                    </select>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Description"
                      value={it.description}
                      onChange={(e) => {
                        const items = [...newInv.items];
                        items[idx].description = e.target.value;
                        setNewInv({ ...newInv, items });
                      }}
                    />
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      placeholder="Qty"
                      value={it.quantity}
                      onChange={(e) => {
                        const items = [...newInv.items];
                        items[idx].quantity = Number(e.target.value);
                        setNewInv({ ...newInv, items });
                      }}
                    />
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Price"
                      value={it.unit_price}
                      onChange={(e) => {
                        const items = [...newInv.items];
                        items[idx].unit_price = Number(e.target.value);
                        setNewInv({ ...newInv, items });
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Generate Tax Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
