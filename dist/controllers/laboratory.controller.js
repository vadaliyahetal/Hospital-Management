"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLabOrderStatus = exports.createLabOrder = exports.getLabOrders = exports.getLabTests = void 0;
const mockStore_js_1 = require("../data/mockStore.js");
let labTestsStore = [...mockStore_js_1.initialLabTests];
let labOrdersStore = [...mockStore_js_1.initialLabOrders];
const getLabTests = (req, res) => {
    try {
        const { category, search } = req.query;
        let list = [...labTestsStore];
        if (category) {
            list = list.filter(t => t.category.toLowerCase() === String(category).toLowerCase());
        }
        if (search) {
            const q = String(search).toLowerCase();
            list = list.filter(t => t.test_name.toLowerCase().includes(q) || t.test_code.toLowerCase().includes(q));
        }
        return res.json({ success: true, count: list.length, data: list });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getLabTests = getLabTests;
const getLabOrders = (req, res) => {
    try {
        const { status, patient_id } = req.query;
        let list = [...labOrdersStore];
        if (status) {
            list = list.filter(o => o.sample_status.toLowerCase() === String(status).toLowerCase());
        }
        if (patient_id) {
            list = list.filter(o => o.patient_id === Number(patient_id));
        }
        return res.json({ success: true, count: list.length, data: list });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getLabOrders = getLabOrders;
const createLabOrder = (req, res) => {
    try {
        const body = req.body;
        const test = labTestsStore.find(t => t.id === Number(body.test_id)) || labTestsStore[0];
        const orderSeq = (labOrdersStore.length + 1).toString().padStart(3, '0');
        const newOrder = {
            id: Date.now(),
            order_code: `ORD-2026-${orderSeq}`,
            patient_id: Number(body.patient_id) || 1,
            patient_name: body.patient_name || 'Patient',
            patient_uhid: body.patient_uhid || 'UHID-2026-0001',
            doctor_name: body.doctor_name || 'Dr. Attending',
            test_name: test.test_name,
            category: test.category,
            sample_status: 'Ordered',
            normal_range: test.normal_range,
            order_date: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        labOrdersStore.unshift(newOrder);
        return res.status(201).json({
            success: true,
            message: `Lab investigation test ordered: ${test.test_name}`,
            data: newOrder
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.createLabOrder = createLabOrder;
const updateLabOrderStatus = (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status, result_value } = req.body;
        const order = labOrdersStore.find(o => o.id === id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Lab order not found' });
        }
        if (status)
            order.sample_status = status;
        if (result_value) {
            order.result_value = result_value;
            if (!order.completed_at) {
                order.completed_at = new Date().toISOString().replace('T', ' ').substring(0, 16);
            }
        }
        return res.json({
            success: true,
            message: 'Lab order updated successfully',
            data: order
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateLabOrderStatus = updateLabOrderStatus;
