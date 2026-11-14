import express from 'express';
import { getDashboardStats, getAllStudents, getIntegrationGuide } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';

const router = express.Router();

router.use(protect, requireAdmin);

router.get('/stats', getDashboardStats);
router.get('/students', getAllStudents);
router.get('/guide', getIntegrationGuide);

export default router;
