import express from 'express';
import {
  getSections,
  getAdminSections,
  getSection,
  createSection,
  updateSection,
} from '../controllers/section.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/get/admin', verifyToken, getAdminSections);
router.get('/get/:slug', getSection);
router.get('/get', getSections);
router.post('/create', verifyToken, createSection);
router.patch('/update/:slug', verifyToken, updateSection);

export default router;
