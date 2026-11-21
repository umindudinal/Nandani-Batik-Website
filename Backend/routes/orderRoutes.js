import { Router } from 'express';
import {
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';

const router = Router();

router.get('/', getOrders);
router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

export default router;
