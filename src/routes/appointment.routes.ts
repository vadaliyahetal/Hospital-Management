import { Router } from 'express';
import { getAppointments, bookAppointment, updateAppointmentStatus } from '../controllers/appointment.controller.js';

const router = Router();

router.get('/', getAppointments);
router.post('/', bookAppointment);
router.patch('/:id/status', updateAppointmentStatus);

export default router;
