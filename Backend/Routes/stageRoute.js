import express from 'express';
import { createstage,getNearbystages,getStage } from '../Controllers/stageController.js';
const router = express.Router();
router.post('/', createstage);
router.get('/', getNearbystages);
router.get('/:id', getStage);

export default router;