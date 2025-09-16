import IncidentReport from '../module/incidentReportModel.js';

// Submit a new incident report
export const submitIncident = async (req, res) => {
  try {
    const { stageId, type, description, photoUrl, contactInfo } = req.body;
    const userId = req.user ? req.user.id : null; 
    const report = new IncidentReport({
      userId,
      stageId,
      type,
      description,
      photoUrl,
      contactInfo,
    });
    await report.save();
    res.status(201).json({ message: 'Incident report submitted', report });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit incident report', error: err.message });
  }
};

// Get all incident reports (admin)
export const getAllIncidents = async (req, res) => {
  try {
    const reports = await IncidentReport.find().populate('userId', 'username').populate('stageId', 'name');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch incident reports', error: err.message });
  }
};

// Get reports by user
export const getUserIncidents = async (req, res) => {
  try {
    const userId = req.user.id;
    const reports = await IncidentReport.find({ userId }).populate('stageId', 'name');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user incident reports', error: err.message });
  }
};

// Update incident status(admin)
export const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;
    const report = await IncidentReport.findByIdAndUpdate(
      id,
      { status, adminResponse },
      { new: true }
    );
    if (!report) return res.status(404).json({ message: 'Incident report not found' });
    res.json({ message: 'Incident report updated', report });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update incident report', error: err.message });
  }
};

// Get total count of incident reports
export const getIncidentReportCount = async (req, res) => {
  try {
    const count = await IncidentReport.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get incident report count' });
  }
}; 