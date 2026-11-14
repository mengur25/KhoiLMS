import express from 'express';
import { getGoals, toggleGoal, createGoal, deleteGoal } from '../controllers/goalController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getGoals);
router.post('/', protect, createGoal);
router.patch('/:id/toggle', protect, toggleGoal);
router.delete('/:id', protect, deleteGoal);

export default router;
