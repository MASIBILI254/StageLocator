import mongoose from "mongoose";

const stageSearchLogSchema = new mongoose.Schema({
  stageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stage"
  },
  searchedAt: {
    type: Date,
    default: Date.now
  }
});

const StageSearchLog = mongoose.model("StageSearchLog", stageSearchLogSchema);
export default StageSearchLog;
