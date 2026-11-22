import { Router } from 'express';
import {
  getCustomers,
  getCustomerByPhone,
  registerCustomer,
  loginCustomer,
  googleCustomerAuth,
  deleteCustomer,
} from '../controllers/customerController.js';

const router = Router();

router.get('/', getCustomers);
router.get('/by-phone/:phone', getCustomerByPhone);
router.post('/', registerCustomer);
router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/google-login', googleCustomerAuth);
router.post('/google-auth', googleCustomerAuth);
router.delete('/:id', deleteCustomer);

export default router;
