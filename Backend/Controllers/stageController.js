import Stage from "../module/stageModule.js";
// create a new stage
export const createstage = async (req,res) => {
    try {
        const stage = new Stage(req.body);
        await stage.save();
        res.status(201).json(stage);
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    
};

//get nearby stages
export const getNearbystages = async (req,res) => {
    // convert the query parameters to numbers
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    // check if the query parameters are valid
    if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ message: 'Invalid query parameters' });
    }
    
    try {
        const stages = await Stage.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    $maxDistance: 5000
                }
            }
        });
        res.json(stages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
}
// get a stage by id
export const getStage = async (req, res) => {
    const id = req.params.id;
    try {
        const stage = await Stage.findById(id);
        if (!stage) {
            return res.status(404).json({ message: 'Stage not found' });
        }
        res.json(stage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// update a stage by id
export const updateStage = async (req, res) => {
    const id = req.params.id;
    try {
        const stage = await Stage.findByIdAndUpdate(id, req.body, { new: true });
        if (!stage) {
            return res.status(404).json({ message: 'Stage not found' });
        }
        res.status(200).json("stage updated successfully");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// delete a stage by id
export const deleteStage = async (req, res) => {
    const id = req.params.id;
    try {
        const stage = await Stage.findByIdAndDelete(id);
        if (!stage) {
            return res.status(404).json({ message: 'Stage not found' });
        }
        res.json({ message: 'Stage deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};  
    
// get all stages
export const getStages = async (req, res) => {
    try {
        const stages = await Stage.find();
        res.json(stages);
    } catch (error){
        res.status(500).json({ message: error.message });
    }
    };