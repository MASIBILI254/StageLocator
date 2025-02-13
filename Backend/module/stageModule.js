import mongoose from "mongoose";
const stageSchema = new mongoose.Schema({
    name: { type: String, 
        required: true 
    },
    location: { 
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    routes: [{ 
        destination: String,
        fare: Number,
        duration: String 
    }],
    decs:{
        type:String,
    
    }
});
stageSchema.index({ location: "2dsphere" });
export default mongoose.model("Stage", stageSchema);