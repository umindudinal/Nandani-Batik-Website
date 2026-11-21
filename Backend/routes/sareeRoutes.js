import { Router } from 'express';
import {
  getSarees,
  getSareeById,
  createSaree,
  updateSaree,
  toggleSaree,
  deleteSaree,
} from '../controllers/sareeController.js';

const router = Router();

router.get('/', getSarees);
router.get('/:id', getSareeById);
router.post('/', createSaree);
router.put('/:id', updateSaree);
router.patch('/:id/toggle', toggleSaree);
router.delete('/:id', deleteSaree);

export default router;
