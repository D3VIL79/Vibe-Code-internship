import express from 'express';
import { getPlans, getStatus, checkout, verify, cancelSubscription, upgradePlan } from '../controllers/subscriptionController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/plans', optionalAuth, getPlans);

router.use(authenticate);
router.get('/status', getStatus);
router.post('/checkout', checkout);
router.post('/verify', verify);
router.post('/upgrade', upgradePlan);
router.post('/cancel', cancelSubscription);

export default router;
