import { Router } from 'express';
import { upload } from '../config/upload.js';
import { uploadImage } from '../controllers/uploadController.js';

const router = Router();

router.post('/', upload.single('image'), uploadImage);

export default router;
