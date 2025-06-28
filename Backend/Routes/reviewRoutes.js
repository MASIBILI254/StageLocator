import express from 'express';
import { addReview, getReviewsForStage, getAverageRating, getAllReviews } from '../Controllers/reviewController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router();

// Add a review (user must be logged in)
router.post('/add', verifyToken, addReview);
// Get all reviews for a stage
router.get('/stage/:stageId', getReviewsForStage);
// Get average rating for a stage
router.get('/stage/:stageId/average', getAverageRating);
// Get all reviews
router.get('/all', getAllReviews);

export default router; 