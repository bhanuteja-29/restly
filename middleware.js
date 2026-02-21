import { Listing } from "./models/listing_model.js";
import { listingSchema,reviewSchema } from './schema.js';
import { ExpressError } from "./utils/ExpressError.js";
import { Review } from "./models/review_model.js";
import mongoose from "mongoose";
export const isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error','You must be logged in to create a new listing.');
        return res.redirect('/login');
    }
    next();
}

export const saveRedirectURL = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

export const isOwner = async  (req,res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash('error','You cannot edit this listing.');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

export const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

export const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

export const isAuthor = async  (req,res,next) => {
    let { id,rid } = req.params;
    const review = await Review.findById(rid);
    if(!review.author._id.equals(res.locals.currUser._id)) {
        req.flash('error','You cannot delete this review.');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

export const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid ID!");
    return res.redirect("/listings");
  }
  next();
};
