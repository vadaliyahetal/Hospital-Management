import { Router } from 'express';
import { getMedicines, addMedicine, dispenseMedicine, updateStock } from '../controllers/pharmacy.controller.js';

const router = Router();

router.get('/medicines', getMedicines);
router.post('/medicines', addMedicine);
router.post('/medicines/:id/dispense', dispenseMedicine);
router.patch('/medicines/:id/stock', updateStock);

export default router;
