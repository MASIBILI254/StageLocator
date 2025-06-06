import mongoose from "mongoose";
const stageSchema = new mongoose.Schema({
    name: { type: String, 
        required: true 
    },
    img:{
        type : String
    },
    location: { 
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true } 
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