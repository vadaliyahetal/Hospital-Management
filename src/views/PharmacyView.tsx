import React, { useState } from 'react';
import { Pill, AlertTriangle, Search, Plus, MinusCircle, PackagePlus, AlertCircle, X, ShieldAlert } from 'lucide-react';
import { Medicine } from '../types';

interface PharmacyViewProps {
  medicines: Medicine[];
  onAddMedicine: (med: any) => Promise<boolean>;
  onDispenseMedicine: (id: number, qty: number) => Promise<boolean>;
}

export const PharmacyView: React.FC<PharmacyViewProps> = ({
  medicines,
  onAddMedicine,
  onDispenseMedicine
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [dispenseTarget, setDispenseTarget] = useState<Medicine | null>(null);
  const [dispenseQty, setDispenseQty] = useState(1);

  const [newMed, setNewMed] = useState({
    item_code: '',
    brand_name: '',
    generic_name: '',
    category: 'Tablet',
    manufacturer: '',
    batch_number: '',
    expiry_date: '2028-12-31',
    unit_price: 15,
    mrp: 18,
    stock_quantity: 100,
    reorder_level: 30,
    location_rack: 'Rack A-01'
  });

  const categories = Array.from(new Set(medicines.map(m => m.category)));
  const criticalItems = medicines.filter(m => m.stock_quantity <= m.reorder_level);

  const filtered = medicines.filter(m => {
    const q = search.toLowerCase();
    const matchesSearch =
      m.brand_name.toLowerCase().includes(q) ||
      m.generic_name.toLowerCase().includes(q) ||
      m.item_code.toLowerCase().includes(q);
    const matchesCategory = !categoryFilter || m.category === categoryFilter;
    const matchesLow = !lowStockOnly || m.stock_quantity <= m.reorder_level;
    return matchesSearch && matchesCategory && matchesLow;
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.brand_name) return;
    const success = await onAddMedicine(newMed);
    if (success) {
      setShowAddModal(false);
      setNewMed({
        item_code: '',
        brand_name: '',
        generic_name: '',
        category: 'Tablet',
        manufacturer: '',
        batch_number: '',
        expiry_date: '2028-12-31',
        unit_price: 15,
        mrp: 18,
        stock_quantity: 100,
        reorder_level: 30,
        location_rack: 'Rack A-01'
      });
    }
  };

  const handleDispenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispenseTarget) return;
    const success = await onDispenseMedicine(dispenseTarget.id, dispenseQty);
    if (success) {
      setDispenseTarget(null);
      setDispenseQty(1);
    }
  };

  return (
    <div>
      {/* Low stock critical alert banner */}
      {criticalItems.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--danger-light)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          padding: '14px 20px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          color: 'var(--danger)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={20} />
            <div>
              <strong style={{ fontSize: '0.95rem' }}>Low Stock Inventory Alert!</strong>
              <div style={{ fontSize: '0.84rem' }}>
                {criticalItems.length} medication(s) have fallen below their safety reorder thresholds: {criticalItems.map(c => c.brand_name).join(', ')}.
              </div>
            </div>
          </div>
          <button
            className="btn btn-sm"
            style={{ background: 'var(--danger)', color: '#fff' }}
            onClick={() => setLowStockOnly(!lowStockOnly)}
          >
            {lowStockOnly ? 'Show All Medicines' : 'Filter Critical Stock'}
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search brand, generic name, or item code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          <button
            className={`filter-pill ${!categoryFilter && !lowStockOnly ? 'active' : ''}`}
            onClick={() => { setCategoryFilter(''); setLowStockOnly(false); }}
          >
            All Products ({medicines.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-pill ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(categoryFilter === cat ? '' : cat)}
            >
              {cat}
            </button>
          ))}
          <button
            className={`filter-pill ${lowStockOnly ? 'active' : ''}`}
            style={{ color: lowStockOnly ? 'var(--danger)' : undefined }}
            onClick={() => setLowStockOnly(!lowStockOnly)}
          >
            Low Stock ({criticalItems.length})
          </button>

          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            <PackagePlus size={16} />
            <span>Add Medicine to Stock</span>
          </button>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Brand & Generic Composition</th>
                <th>Category</th>
                <th>Batch # & Expiry</th>
                <th>Storage Rack</th>
                <th>Stock Level</th>
                <th>MRP / Price</th>
                <th>Dispense Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(med => {
                const isCritical = med.stock_quantity <= med.reorder_level;
                return (
                  <tr key={med.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>
                        {med.item_code}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{med.brand_name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{med.generic_name} • {med.manufacturer}</div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{med.category}</span>
                    </td>
                    <td>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{med.batch_number}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Exp: {med.expiry_date}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500, fontSize: '0.86rem' }}>{med.location_rack}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontWeight: 700,
                          fontSize: '0.98rem',
                          color: isCritical ? 'var(--danger)' : 'var(--text-main)'
                        }}>
                          {med.stock_quantity}
                        </span>
                        {isCritical ? (
                          <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>
                            Low (Min: {med.reorder_level})
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                            Min {med.reorder_level}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>₹{med.mrp}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Cost: ₹{med.unit_price}</div>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        disabled={med.stock_quantity <= 0}
                        onClick={() => {
                          setDispenseTarget(med);
                          setDispenseQty(1);
                        }}
                      >
                        <MinusCircle size={15} />
                        <span>Dispense</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispense Modal */}
      {dispenseTarget && (
        <div className="modal-overlay" onClick={() => setDispenseTarget(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div>
                <h3>Dispense Medicine</h3>
                <div style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  {dispenseTarget.brand_name} ({dispenseTarget.generic_name})
                </div>
              </div>
              <button className="btn-icon-topbar" onClick={() => setDispenseTarget(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleDispenseSubmit}>
              <div className="modal-body">
                <div style={{ padding: '14px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>Available Stock:</span>
                    <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{dispenseTarget.stock_quantity} units</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>Batch Number:</span>
                    <span style={{ fontFamily: 'monospace' }}>{dispenseTarget.batch_number}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Unit MRP:</span>
                    <strong>₹{dispenseTarget.mrp}</strong>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Quantity to Dispense</label>
                  <input
                    type="number"
                    min="1"
                    max={dispenseTarget.stock_quantity}
                    className="form-input"
                    required
                    value={dispenseQty}
                    onChange={(e) => setDispenseQty(Number(e.target.value))}
                  />
                </div>

                <div style={{ marginTop: '14px', textAlign: 'right', fontWeight: 600 }}>
                  Total Payable: ₹{(dispenseQty * dispenseTarget.mrp).toFixed(2)}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setDispenseTarget(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm Dispensation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Medication to Stock</h3>
              <button className="btn-icon-topbar" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Brand Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Augmentin 625"
                      value={newMed.brand_name}
                      onChange={(e) => setNewMed({ ...newMed, brand_name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Generic Composition</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Amoxicillin + Clavulanic"
                      value={newMed.generic_name}
                      onChange={(e) => setNewMed({ ...newMed, generic_name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dosage Form / Category</label>
                    <select
                      className="form-select"
                      value={newMed.category}
                      onChange={(e) => setNewMed({ ...newMed, category: e.target.value })}
                    >
                      {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops', 'Inhaler'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Manufacturer</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Pharma manufacturer"
                      value={newMed.manufacturer}
                      onChange={(e) => setNewMed({ ...newMed, manufacturer: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Batch Number</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="B-XXXX"
                      value={newMed.batch_number}
                      onChange={(e) => setNewMed({ ...newMed, batch_number: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={newMed.expiry_date}
                      onChange={(e) => setNewMed({ ...newMed, expiry_date: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Stock Quantity</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newMed.stock_quantity}
                      onChange={(e) => setNewMed({ ...newMed, stock_quantity: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Reorder Safety Level</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newMed.reorder_level}
                      onChange={(e) => setNewMed({ ...newMed, reorder_level: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Unit Cost (₹)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      value={newMed.unit_price}
                      onChange={(e) => setNewMed({ ...newMed, unit_price: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Retail MRP (₹)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      value={newMed.mrp}
                      onChange={(e) => setNewMed({ ...newMed, mrp: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Storage Rack / Bin Location</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Rack A-02, Fridge-1"
                      value={newMed.location_rack}
                      onChange={(e) => setNewMed({ ...newMed, location_rack: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save to Pharmacy Inventory</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
