import express from 'express';
import { register, login, getLastSearchedStage, setLastSearchedStage } from '../Controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/last-searched-stage', verifyToken, getLastSearchedStage);
router.post('/last-searched-stage', verifyToken, setLastSearchedStage);

export default router;