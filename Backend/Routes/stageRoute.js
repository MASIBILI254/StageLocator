import express from 'express';
import { createstage,getNearbystages,getStage,updateStage,deleteStage,getStages } from '../Controllers/stageController.js';
const router = express.Router();
router.post('/', createstage);
router.get('/', getNearbystages);
router.get('/getone/:id', getStage);
router.put('/:id', updateStage);
router.delete('/:id', deleteStage);
router.get('/getAll', getStages);

export default router;