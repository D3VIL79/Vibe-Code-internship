import express from 'express';
import { register, login, getMe, googleAuth, getDemoProfiles, demoLogin } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/demo-profiles', getDemoProfiles);
router.post('/demo-login', demoLogin);
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleAuth);
router.get('/me', authenticate, getMe);

export default router;
