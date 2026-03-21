import express from "express";
import isAuth from "../Middleware/isAuth.js";
import { createReview, getReviews } from "../controllers/reviewController.js";

const reviewRoute = express.Router();

reviewRoute.post("/createreview", isAuth, createReview);
reviewRoute.get("/getreviews", getReviews);

export default reviewRoute