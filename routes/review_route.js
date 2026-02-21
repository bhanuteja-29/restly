import express from "express";
import { wrapAsync } from "../utils/wrapasync.js";
import { isLoggedIn, validateReview,isAuthor } from "../middleware.js";
import { createReview, destroyReview } from "../controller/reviews.js";
export const router = express.Router({mergeParams:true});

// Create Review Route
router.post("/",isLoggedIn,validateReview,wrapAsync(createReview));

// Delete Review Route
router.delete("/:rid",isLoggedIn,isAuthor,wrapAsync(destroyReview));
