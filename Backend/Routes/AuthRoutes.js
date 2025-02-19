import express from 'express';
import { loginuser } from '../Controllers/AuthController.js';
const router = express.Router();
router.post('/login',loginuser);

export default router;