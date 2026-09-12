import express from 'express';
import { generateReport, listReports, getReport, deleteReport } from '../controllers/reportController.js';
import { authenticate } from '../middleware/auth.js';
import { checkTokenLimit } from '../middleware/tokenMeter.js';
import { reportLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(authenticate);

router.post('/generate', reportLimiter, checkTokenLimit, generateReport);
router.get('/', listReports);
router.get('/:id', getReport);
router.delete('/:id', deleteReport);

export default router;
