import mongoose from "mongoose";

const stageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  img: { type: String },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }
  },
  routes: [{
    destination: String,
    fare: Number,
    duration: String
  }],
  decs: { type: String },
  searchCount: { type: Number, default: 0 }
});


const Stage = mongoose.model("Stage", stageSchema);

export default Stage;
