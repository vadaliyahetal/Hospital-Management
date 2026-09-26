"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStock = exports.dispenseMedicine = exports.addMedicine = exports.getMedicines = void 0;
const mockStore_js_1 = require("../data/mockStore.js");
let medicinesStore = [...mockStore_js_1.initialMedicines];
const getMedicines = (req, res) => {
    try {
        const { search, category, low_stock } = req.query;
        let list = [...medicinesStore];
        if (search) {
            const q = String(search).toLowerCase();
            list = list.filter(m => m.brand_name.toLowerCase().includes(q) ||
                m.generic_name.toLowerCase().includes(q) ||
                m.item_code.toLowerCase().includes(q));
        }
        if (category) {
            list = list.filter(m => m.category.toLowerCase() === String(category).toLowerCase());
        }
        if (low_stock === 'true') {
            list = list.filter(m => m.stock_quantity <= m.reorder_level);
        }
        return res.json({ success: true, count: list.length, data: list });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMedicines = getMedicines;
const addMedicine = (req, res) => {
    try {
        const body = req.body;
        const newMed = {
            id: Date.now(),
            item_code: body.item_code || `MED-${(medicinesStore.length + 1).toString().padStart(3, '0')}`,
            brand_name: body.brand_name,
            generic_name: body.generic_name || '',
            category: body.category || 'Tablet',
            manufacturer: body.manufacturer || 'Pharma Corp',
            batch_number: body.batch_number || `B-${Math.floor(1000 + Math.random() * 9000)}`,
            expiry_date: body.expiry_date || '2028-12-31',
            unit_price: Number(body.unit_price) || 10,
            mrp: Number(body.mrp) || 12,
            stock_quantity: Number(body.stock_quantity) || 100,
            reorder_level: Number(body.reorder_level) || 30,
            location_rack: body.location_rack || 'Rack A-01'
        };
        medicinesStore.unshift(newMed);
        return res.status(201).json({ success: true, message: 'Medicine added to inventory', data: newMed });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.addMedicine = addMedicine;
const dispenseMedicine = (req, res) => {
    try {
        const id = Number(req.params.id);
        const { quantity } = req.body;
        const qtyToDispense = Number(quantity) || 1;
        const med = medicinesStore.find(m => m.id === id);
        if (!med) {
            return res.status(404).json({ success: false, message: 'Medicine not found' });
        }
        if (med.stock_quantity < qtyToDispense) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock! Only ${med.stock_quantity} units available.`
            });
        }
        med.stock_quantity -= qtyToDispense;
        return res.json({
            success: true,
            message: `Successfully dispensed ${qtyToDispense} units of ${med.brand_name}`,
            data: med
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.dispenseMedicine = dispenseMedicine;
const updateStock = (req, res) => {
    try {
        const id = Number(req.params.id);
        const { add_quantity } = req.body;
        const med = medicinesStore.find(m => m.id === id);
        if (!med)
            return res.status(404).json({ success: false, message: 'Medicine not found' });
        med.stock_quantity += Number(add_quantity) || 0;
        return res.json({ success: true, message: 'Stock updated successfully', data: med });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateStock = updateStock;
