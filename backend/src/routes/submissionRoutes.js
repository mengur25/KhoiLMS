import express from 'express';
import {
  getMySubmissions,
  getAllSubmissions,
  checkGoogleFormStatus,
  simulateGoogleFormSubmit,
} from '../controllers/submissionController.js';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';

const router = express.Router();

router.get('/my', protect, getMySubmissions);
router.get('/all', protect, requireAdmin, getAllSubmissions);
router.get('/check/:lessonId', protect, checkGoogleFormStatus);
router.post('/simulate', protect, simulateGoogleFormSubmit);

export default router;
