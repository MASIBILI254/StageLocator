import mongoose from 'mongoose';

const incidentReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  stageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stage', required: false },
  type: { type: String, required: true, enum: ['harassment', 'lost item', 'accident', 'other'] },
  description: { type: String, required: true },
  photoUrl: { type: String },
  contactInfo: { type: String },
  status: { type: String, enum: ['pending', 'in review', 'resolved'], default: 'pending' },
  adminResponse: { type: String },
}, { timestamps: true });

const IncidentReport = mongoose.model('IncidentReport', incidentReportSchema);
export default IncidentReport; 