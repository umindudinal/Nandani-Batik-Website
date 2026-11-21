import { Router } from 'express';
import {
  getCustomers,
  getCustomerByPhone,
  registerCustomer,
  loginCustomer,
  deleteCustomer,
} from '../controllers/customerController.js';

const router = Router();

router.get('/', getCustomers);
router.get('/by-phone/:phone', getCustomerByPhone);
router.post('/', registerCustomer);
router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.delete('/:id', deleteCustomer);

export default router;
