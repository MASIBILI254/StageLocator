import express from 'express';
import { submitIncident, getAllIncidents, getUserIncidents, updateIncident, getIncidentReportCount } from '../Controllers/incidentReportController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/submit', verifyToken, submitIncident);

router.get('/all', verifyToken, requireRole('admin'), getAllIncidents);


router.get('/my', verifyToken, getUserIncidents);

router.patch('/:id', verifyToken, requireRole('admin'), updateIncident);

router.get('/count', verifyToken, requireRole('admin'), getIncidentReportCount);

router.get('/test-alive', (req, res) => {
  res.json({ message: 'IncidentReport router is active and running latest code.' });
});

export default router; 