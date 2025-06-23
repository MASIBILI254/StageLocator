import express from 'express';
import {verifyToken} from '../middleware/authMiddleware.js';
import {requireRole} from '../middleware/roleMiddleware.js';
import { createstage,getStage,updateStage,deleteStage,getStages,getMostSearchedStage,getStageAnalytics, incrementSearchCountByStageName } from '../Controllers/stageController.js';
const router = express.Router();
router.post('/add',verifyToken, requireRole('admin'), createstage);
router.get('/getone/:id',verifyToken, getStage);
router.put('/:id', verifyToken, requireRole('admin'),updateStage);
router.delete('/:id',verifyToken, requireRole('admin'), deleteStage);
router.get('/getAll', verifyToken,getStages);
router.get("/most-searched", verifyToken, requireRole('admin'), getMostSearchedStage);
router.get('/analytics',  verifyToken, requireRole('admin'), getStageAnalytics);
router.post('/increment-searchcount', incrementSearchCountByStageName);


export default router;