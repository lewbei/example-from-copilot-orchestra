import { Router } from 'express';
import { register } from '../controllers/auth.controller';
import { validateRegistration, handleValidationErrors } from '../middleware/validation';

const router = Router();

router.post('/register', validateRegistration, handleValidationErrors, register);

export default router;
