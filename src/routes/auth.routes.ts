import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import {
  validateRegistration,
  validateLogin,
  handleValidationErrors,
} from '../middleware/validation';

const router = Router();

router.post('/register', validateRegistration, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);

export default router;
