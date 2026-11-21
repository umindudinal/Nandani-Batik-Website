import { Router } from 'express';
import { getHealth, getStats, seedDatabase } from '../controllers/systemController.js';

const router = Router();

router.get('/health', getHealth);
router.get('/stats', getStats);
router.post('/seed', seedDatabase);

export default router;
