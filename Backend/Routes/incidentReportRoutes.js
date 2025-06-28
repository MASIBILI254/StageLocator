import express from 'express';
import { submitIncident, getAllIncidents, getUserIncidents, updateIncident } from '../Controllers/incidentReportController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Submit a new incident report (user or anonymous)
router.post('/submit', verifyToken, submitIncident);

// Get all incident reports (admin only)
router.get('/all', verifyToken, requireRole('admin'), getAllIncidents);

// Get reports by logged-in user
router.get('/my', verifyToken, getUserIncidents);

// Update incident status/response (admin only)
router.patch('/:id', verifyToken, requireRole('admin'), updateIncident);

export default router; 