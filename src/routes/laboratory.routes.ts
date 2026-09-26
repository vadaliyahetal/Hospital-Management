import { Router } from 'express';
import { getLabTests, getLabOrders, createLabOrder, updateLabOrderStatus } from '../controllers/laboratory.controller.js';

const router = Router();

router.get('/tests', getLabTests);
router.get('/orders', getLabOrders);
router.post('/orders', createLabOrder);
router.patch('/orders/:id', updateLabOrderStatus);

export default router;
