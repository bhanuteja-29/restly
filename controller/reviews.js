import {Listing} from '../models/listing_model.js';
import {Review} from '../models/review_model.js';

export const createReview = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash('success','Review has been added successfully.');
    res.redirect(`/listings/${id}`);
}

export const destroyReview = async (req, res) => {
    let { id, rid } = req.params;
    await Review.findByIdAndDelete(rid);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: rid } });
    req.flash('success','Review has been deleted successfully.');
    res.redirect(`/listings/${id}`);
}