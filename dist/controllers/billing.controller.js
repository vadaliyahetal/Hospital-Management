"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordPayment = exports.createInvoice = exports.getInvoiceById = exports.getInvoices = void 0;
const mockStore_js_1 = require("../data/mockStore.js");
let invoicesStore = [...mockStore_js_1.initialInvoices];
const getInvoices = (req, res) => {
    try {
        const { status, patient_id, search } = req.query;
        let list = [...invoicesStore];
        if (status) {
            list = list.filter(inv => inv.payment_status.toLowerCase() === String(status).toLowerCase());
        }
        if (patient_id) {
            list = list.filter(inv => inv.patient_id === Number(patient_id));
        }
        if (search) {
            const q = String(search).toLowerCase();
            list = list.filter(inv => inv.invoice_number.toLowerCase().includes(q) ||
                inv.patient_name.toLowerCase().includes(q) ||
                inv.patient_uhid.toLowerCase().includes(q));
        }
        const totalRevenue = invoicesStore.reduce((acc, curr) => acc + curr.paid_amount, 0);
        const pendingAmount = invoicesStore.reduce((acc, curr) => acc + curr.balance_amount, 0);
        return res.json({
            success: true,
            stats: { totalRevenue, pendingAmount, totalInvoices: invoicesStore.length },
            data: list
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getInvoices = getInvoices;
const getInvoiceById = (req, res) => {
    const id = Number(req.params.id);
    const invoice = invoicesStore.find(i => i.id === id || i.invoice_number === req.params.id);
    if (!invoice)
        return res.status(404).json({ success: false, message: 'Invoice not found' });
    return res.json({ success: true, data: invoice });
};
exports.getInvoiceById = getInvoiceById;
const createInvoice = (req, res) => {
    try {
        const body = req.body;
        const invSeq = (invoicesStore.length + 1).toString().padStart(3, '0');
        const items = body.items || [];
        const subtotal = items.reduce((sum, it) => sum + (Number(it.total_price) || (Number(it.quantity) * Number(it.unit_price))), 0);
        const tax_amount = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
        const discount_amount = Number(body.discount_amount) || 0;
        const total_amount = Math.max(0, subtotal + tax_amount - discount_amount);
        const paid_amount = Number(body.paid_amount) || 0;
        const balance_amount = Math.max(0, total_amount - paid_amount);
        const payment_status = balance_amount <= 0 ? 'Paid' : (paid_amount > 0 ? 'Partially Paid' : 'Unpaid');
        const newInvoice = {
            id: Date.now(),
            invoice_number: `INV-2026-${invSeq}`,
            patient_id: Number(body.patient_id) || 1,
            patient_name: body.patient_name || 'Walk-in Patient',
            patient_uhid: body.patient_uhid || 'UHID-2026-0001',
            subtotal,
            tax_amount,
            discount_amount,
            total_amount,
            paid_amount,
            balance_amount,
            payment_status,
            payment_method: body.payment_method || 'UPI',
            insurance_provider: body.insurance_provider || '',
            created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
            items: items.map((it) => ({
                item_type: it.item_type || 'Service',
                description: it.description,
                quantity: Number(it.quantity) || 1,
                unit_price: Number(it.unit_price) || 0,
                total_price: Number(it.total_price) || (Number(it.quantity) * Number(it.unit_price))
            }))
        };
        invoicesStore.unshift(newInvoice);
        return res.status(201).json({
            success: true,
            message: `Invoice ${newInvoice.invoice_number} created successfully`,
            data: newInvoice
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.createInvoice = createInvoice;
const recordPayment = (req, res) => {
    try {
        const id = Number(req.params.id);
        const { amount, method } = req.body;
        const invoice = invoicesStore.find(i => i.id === id);
        if (!invoice)
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        const payAmount = Number(amount) || 0;
        invoice.paid_amount += payAmount;
        invoice.balance_amount = Math.max(0, invoice.total_amount - invoice.paid_amount);
        invoice.payment_status = invoice.balance_amount <= 0 ? 'Paid' : 'Partially Paid';
        if (method)
            invoice.payment_method = method;
        return res.json({
            success: true,
            message: `Payment of ₹${payAmount} recorded for ${invoice.invoice_number}`,
            data: invoice
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.recordPayment = recordPayment;
