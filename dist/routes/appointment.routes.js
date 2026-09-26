"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointment_controller_js_1 = require("../controllers/appointment.controller.js");
const router = (0, express_1.Router)();
router.get('/', appointment_controller_js_1.getAppointments);
router.post('/', appointment_controller_js_1.bookAppointment);
router.patch('/:id/status', appointment_controller_js_1.updateAppointmentStatus);
exports.default = router;
