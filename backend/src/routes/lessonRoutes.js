import express from 'express';
import {
  getLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
} from '../controllers/lessonController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';

const router = express.Router();

router.get('/', optionalAuth, getLessons);
router.get('/:id', optionalAuth, getLessonById);
router.post('/', protect, requireAdmin, createLesson);
router.put('/:id', protect, requireAdmin, updateLesson);
router.delete('/:id', protect, requireAdmin, deleteLesson);

export default router;
