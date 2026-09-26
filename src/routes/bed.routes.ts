import { Router } from 'express';
import { getBeds, allocateBed, dischargeBed, updateBedStatus } from '../controllers/bed.controller.js';

const router = Router();

router.get('/', getBeds);
router.post('/:id/allocate', allocateBed);
router.post('/:id/discharge', dischargeBed);
router.patch('/:id/status', updateBedStatus);

export default router;
