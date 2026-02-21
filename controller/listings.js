import { Listing } from "../models/listing_model.js";
import mongoose from "mongoose";
import fetch from "node-fetch";
export const index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index.ejs", { listings });
};

export const renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

export const showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist.");
    res.redirect("/listings");
  } else {
    res.render("listings/show.ejs", { listing });
  }
};


export const createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
  listing.image = {url,filename};
  const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(listing.location)}`,
      {
        headers: {
          "User-Agent": "restly-app"
        }
      }
    );
  const data = await response.json();
  console.log(data);
  if (!data.length) {
      req.flash("error", "Invalid location!");
      return res.redirect("/listings/new");
  }
  let lat = data[0].lat;
  let lon = data[0].lon;
  listing.geometry = {type:'Point',coordinates:[lon,lat]}
  console.log(listing);
  await listing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

export const editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist.");
    res.redirect("/listings");
  } else {
    let originalImageURL = listing.image.url;
    originalImageURL= originalImageURL.replace('/upload','/upload/w_250')
    res.render("listings/edit.ejs", { listing,originalImageURL });
  }
};

export const updateListing = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body.listing;

  const listing = await Listing.findById(id);

  listing.title = updatedData.title;
  listing.description = updatedData.description;
  listing.price = updatedData.price;
  listing.location = updatedData.location;
  listing.categories = updatedData.categories;


  if (listing.isModified("location")) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(listing.location)}`,
      {
        headers: { "User-Agent": "YourAppName" }
      }
    );
    const data = await response.json();
    if (data.length > 0) {
      listing.geometry = {
        type: "Point",
        coordinates: [
          parseFloat(data[0].lon),
          parseFloat(data[0].lat),
        ],
      };
    }
  }
  // Update image if new file
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
  await listing.save();
  req.flash("success", "Listing has been Edited Successfully.");
  res.redirect("/listings");
};



export const destroyListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash('success','Listing Deleted.');
    res.redirect("/listings");
}

export const searchListing = async (req,res)=>{
try {
  const query = req.query.title;

  if (!query || query.trim() === "") {
    return res.redirect("/");
  }


  const words = query.trim().split(/\s+/);

  const searchConditions = words.map(word => ({
    title: { $regex: word, $options: "i" }
  }));

  const listings = await Listing.find({
    $or: searchConditions
  });

  res.render("listings/searchResults", {
    listings,
    searchQuery: query
  });

} catch (err) {
  console.error(err);
  res.status(500).send("Server Error");
}

}

export const filterListing = async (req,res) => {
  try {
    const { category } = req.query;

    let listings;

    if (category) {
      listings = await Listing.find({ categories:category });
    } else {
      listings = await Listing.find({});
    }

    res.render("listings/index", {
      listings,
      selectedCategory: category || ""
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}