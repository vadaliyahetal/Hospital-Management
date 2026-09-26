import { Router } from 'express';
import { getInvoices, getInvoiceById, createInvoice, recordPayment } from '../controllers/billing.controller.js';

const router = Router();

router.get('/invoices', getInvoices);
router.get('/invoices/:id', getInvoiceById);
router.post('/invoices', createInvoice);
router.post('/invoices/:id/pay', recordPayment);

export default router;
