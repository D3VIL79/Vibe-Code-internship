import express from 'express';
import { uploadTranscript, uploadVideoUrl, listTrainingData, deleteTrainingData } from '../controllers/trainingController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/upload-transcript', uploadTranscript);
router.post('/transcript', uploadTranscript);
router.post('/upload-video-url', uploadVideoUrl);
router.post('/youtube', uploadVideoUrl);
router.get('/', listTrainingData);
router.delete('/:id', deleteTrainingData);

export default router;
