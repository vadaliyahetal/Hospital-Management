"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppointmentStatus = exports.bookAppointment = exports.getAppointments = void 0;
const mockStore_js_1 = require("../data/mockStore.js");
let appointmentsStore = [...mockStore_js_1.initialAppointments];
const getAppointments = (req, res) => {
    try {
        const { status, doctor_id, date } = req.query;
        let list = [...appointmentsStore];
        if (status) {
            list = list.filter(a => a.status.toLowerCase() === String(status).toLowerCase());
        }
        if (doctor_id) {
            list = list.filter(a => a.doctor_id === Number(doctor_id));
        }
        if (date) {
            list = list.filter(a => a.appointment_date === String(date));
        }
        return res.json({ success: true, count: list.length, data: list });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAppointments = getAppointments;
const bookAppointment = (req, res) => {
    try {
        const body = req.body;
        const token = appointmentsStore.length + 1;
        const code = `APT-2026-${(100 + token)}`;
        const newAppointment = {
            id: Date.now(),
            appointment_code: code,
            patient_id: body.patient_id,
            patient_name: body.patient_name || 'Patient',
            patient_uhid: body.patient_uhid || 'UHID-2026-9999',
            doctor_id: body.doctor_id,
            doctor_name: body.doctor_name || 'Dr. Assigned',
            department: body.department || 'General Medicine',
            appointment_date: body.appointment_date || new Date().toISOString().split('T')[0],
            time_slot: body.time_slot || '10:00 AM',
            token_number: token,
            type: body.type || 'OPD',
            status: 'Scheduled',
            symptoms: body.symptoms || ''
        };
        appointmentsStore.unshift(newAppointment);
        return res.status(201).json({
            success: true,
            message: `Appointment booked successfully! Token Number: #${token}`,
            data: newAppointment
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.bookAppointment = bookAppointment;
const updateAppointmentStatus = (req, res) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;
        const apt = appointmentsStore.find(a => a.id === id);
        if (!apt) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }
        apt.status = status;
        return res.json({ success: true, message: `Status updated to ${status}`, data: apt });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateAppointmentStatus = updateAppointmentStatus;
