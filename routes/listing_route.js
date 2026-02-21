import express from "express";
import { wrapAsync } from "../utils/wrapasync.js";
import { isLoggedIn,isOwner,validateListing ,validateObjectId} from "../middleware.js";
import {index,renderNewForm,createListing, showListing, editListing, updateListing, destroyListing,searchListing, filterListing} from "../controller/listings.js"
export const router = express.Router();
import multer from "multer";
import { storage } from "../cloudConfig.js"; 
const upload = multer({ storage })

router
    .route('/')
    .get(wrapAsync(index)) 
    .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(createListing))

// New Route
router.get("/new",isLoggedIn,renderNewForm);
router.get('/search',searchListing)
router.get('/filter',filterListing)

router
    .route('/:id')
    .get(validateObjectId,wrapAsync(showListing))
    .put(validateObjectId,isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(updateListing))
    .delete(validateObjectId,isLoggedIn,isOwner,wrapAsync(destroyListing))

// Edit Route
router.get("/:id/edit",validateObjectId,isLoggedIn,isOwner,wrapAsync(editListing));