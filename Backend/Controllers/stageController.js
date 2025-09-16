import Stage from "../module/stageModule.js";
import StageSearchLog from "../module/StageSearchLog.js";
// create a new stage
export const createstage = async (req,res) => {
    try {
        // Debug: log the incoming request body
        console.log('CreateStage req.body:', req.body);
        // Validate required fields
        if (!req.body.boardingPoint || typeof req.body.boardingPoint !== 'string') {
            return res.status(400).json({ message: 'Boarding point is required and must be a string.' });
        }
        const stage = new Stage(req.body);
        await stage.save();
        console .log('Stage created successfully:', stage);
        res.status(201).json(stage);
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    
};

//get nearby stages
export const getNearbystages = async (req,res) => {
   
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    
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


export const getStage = async (req, res) => {
    const id = req.params.id;
    try {
        const stage = await Stage.findByIdAndUpdate(
            id,
            { $inc: { searchCount: 1 } },
            { new: true }
        );
        if (!stage) {
            return res.status(404).json({ message: 'Stage not found' });
        }

        // Log the search
        const searchLog = await StageSearchLog.create({ stageId: id });
        console.log('Search logged:', searchLog);

        res.json(stage);
    } catch (error) {
        console.error('Error in getStage:', error);
        res.status(500).json({ message: error.message });
    }
};

// get the most searched stage(s)
export const getMostSearchedStage = async (req, res) => {
    try {
        const mostSearched = await Stage.find()
            .sort({ searchCount: -1 })
            .limit(1); // or remove limit to get top N
        res.json(mostSearched);
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
    
    export const getStageAnalytics = async (req, res) => {
  try {
    // Get all stages with their complete data
    const allStages = await Stage.find();
    
    // Get search statistics for stages that have been searched
    const searchStats = await StageSearchLog.aggregate([
      {
        $group: {
          _id: "$stageId",
          totalSearches: { $sum: 1 },
          lastSearched: { $max: "$searchedAt" },
        },
      },
    ]);

    // Create a map of search statistics
    const searchStatsMap = {};
    searchStats.forEach(stat => {
      searchStatsMap[stat._id.toString()] = {
        totalSearches: stat.totalSearches,
        lastSearched: stat.lastSearched
      };
    });

    // Combine stage data with search statistics
    const analytics = allStages.map(stage => {
      const searchData = searchStatsMap[stage._id.toString()] || {
        totalSearches: 0,
        lastSearched: null
      };

      return {
        stageId: stage._id,
        stageName: stage.name,
        stageImage: stage.img,
        stageDescription: stage.decs,
        routes: stage.routes || [],
        totalRoutes: stage.routes ? stage.routes.length : 0,
        searchCount: stage.searchCount || 0,
        totalSearches: searchData.totalSearches,
        lastSearched: searchData.lastSearched,
        averageFare: stage.routes && stage.routes.length > 0 ? 
          stage.routes.reduce((sum, route) => sum + (route.fare || 0), 0) / stage.routes.length : 0,
        minFare: stage.routes && stage.routes.length > 0 ? 
          Math.min(...stage.routes.map(route => route.fare || 0)) : 0,
        maxFare: stage.routes && stage.routes.length > 0 ? 
          Math.max(...stage.routes.map(route => route.fare || 0)) : 0
      };
    });

    // Sort by total searches (descending)
    analytics.sort((a, b) => b.totalSearches - a.totalSearches);

    console.log('Analytics data prepared:', {
      totalStages: analytics.length,
      stagesWithRoutes: analytics.filter(s => s.totalRoutes > 0).length,
      totalRoutes: analytics.reduce((sum, s) => sum + s.totalRoutes, 0)
    });

    res.status(200).json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Increment searchCount by stage name
export const incrementSearchCountByStageName = async (req, res) => {
    const { stageName } = req.body;
    if (!stageName) {
        return res.status(400).json({ message: 'Stage name is required' });
    }
    try {
        const stage = await Stage.findOneAndUpdate(
            { name: stageName },
            { $inc: { searchCount: 1 } },
            { new: true }
        );
        if (!stage) {
            return res.status(404).json({ message: 'Stage not found' });
        }
        // Optionally log the search
        await StageSearchLog.create({ stageId: stage._id });
        res.json({ message: 'Search count updated', stage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
