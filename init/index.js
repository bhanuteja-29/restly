import mongoose from "mongoose";
import { sampleListings } from "./data.js";
import { Listing } from "../models/listing_model.js";

const MONGO_URL = "mongodb://127.0.0.1:27017/restly";

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("Database connected successfully.");
    initializeDB();
  })
  .catch((err) => {
    console.log("DB Connection Error:", err);
  });

async function initializeDB() {
  try {

    // 🔥 STEP 1: Delete all existing listings
    const deleted = await Listing.deleteMany({});
    console.log("Deleted listings count:", deleted.deletedCount);

    const updatedListings = [];

    // 🔥 STEP 2: Geocode each sample listing
    for (let obj of sampleListings) {

      console.log("Geocoding:", obj.location);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(obj.location)}`,
        {
          headers: {
            "User-Agent": "restly-app"
          }
        }
      );

      const data = await response.json();

      if (!data.length) {
        console.log("Location not found:", obj.location);
        continue;
      }

      const longitude = parseFloat(data[0].lon);
      const latitude = parseFloat(data[0].lat);

      updatedListings.push({
        ...obj,
        owner: "6992ede156db367888c2f61c",
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      });

      // ⚠️ Respect Nominatim rate limit (1 request/sec)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // 🔥 STEP 3: Insert new listings with coordinates
    await Listing.insertMany(updatedListings);

    console.log("Successfully initialized data with coordinates!");

  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
}

initializeDB();
