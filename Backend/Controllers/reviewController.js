import mongoose from "mongoose";
import Review from "../module/reviewModel.js";
import Stage from "../module/stageModule.js";

// Add a review
export const addReview = async (req, res) => {
    try {
        const { stageId, rating, comment } = req.body;
        const userId = req.user.id;
        // Prevent duplicate reviews by same user for same stage
        const existing = await Review.findOne({ user: userId, stage: stageId });
        if (existing) return res.status(400).json({ message: "You have already reviewed this stage." });
        const review = new Review({ user: userId, stage: stageId, rating, comment });
        await review.save();
        res.status(201).json(review);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all reviews for a stage
export const getReviewsForStage = async (req, res) => {
    try {
        const { stageId } = req.params;
        const reviews = await Review.find({ stage: stageId }).populate('user', 'username');
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get average rating for a stage
export const getAverageRating = async (req, res) => {
    try {
        const { stageId } = req.params;
        const result = await Review.aggregate([
            { $match: { stage: new mongoose.Types.ObjectId(stageId) } },
            { $group: { _id: "$stage", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
        ]);
        if (result.length === 0) return res.json({ avgRating: 0, count: 0 });
        res.json(result[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate('user', 'username')
            .populate('stage', 'name');
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get total count of reviews
export const getReviewCount = async (req, res) => {
  try {
    const count = await Review.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get review count' });
  }
}; 