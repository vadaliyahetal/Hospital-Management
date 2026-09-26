import { Router } from 'express';
import { login, getMe } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', login);
router.get('/me', getMe);

export default router;
