"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const doctor_controller_js_1 = require("../controllers/doctor.controller.js");
const router = (0, express_1.Router)();
router.get('/', doctor_controller_js_1.getDoctors);
router.get('/:id', doctor_controller_js_1.getDoctorById);
exports.default = router;
