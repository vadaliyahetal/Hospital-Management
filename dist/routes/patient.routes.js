"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patient_controller_js_1 = require("../controllers/patient.controller.js");
const router = (0, express_1.Router)();
router.get('/', patient_controller_js_1.getPatients);
router.get('/:id', patient_controller_js_1.getPatientById);
router.post('/', patient_controller_js_1.createPatient);
exports.default = router;
