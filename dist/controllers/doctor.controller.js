"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDoctorById = exports.getDoctors = void 0;
const mockStore_js_1 = require("../data/mockStore.js");
let doctorsStore = [...mockStore_js_1.initialDoctors];
const getDoctors = (req, res) => {
    try {
        const { department } = req.query;
        let list = [...doctorsStore];
        if (department) {
            list = list.filter(d => d.department.toLowerCase() === String(department).toLowerCase());
        }
        return res.json({ success: true, count: list.length, data: list });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getDoctors = getDoctors;
const getDoctorById = (req, res) => {
    const id = Number(req.params.id);
    const doctor = doctorsStore.find(d => d.id === id);
    if (!doctor)
        return res.status(404).json({ success: false, message: 'Doctor not found' });
    return res.json({ success: true, data: doctor });
};
exports.getDoctorById = getDoctorById;
