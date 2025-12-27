
const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");
const axios = require("axios");

require("dotenv").config();

main()
  .then(() => console.log("connection done!"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

let api_key = process.env.GEOAPIFY_API_KEY;

async function getGeometry(location, country) {
  const address = `${location}, ${country}`;

  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    address
  )}&limit=1&apiKey=${api_key}`;

  const response = await axios.get(url);

  const feature = response.data.features[0];

  return {
    type: "Point",
    coordinates: [
      feature.properties.lon,
      feature.properties.lat,
    ],
  };
}
function getCategory(listing) {
  const title = listing.title.toLowerCase();
  const location = listing.location.toLowerCase();

  if (title.includes("mountain") || location.includes("aspen")) return "mountains";
  if (title.includes("beach")) return "trending";
  if (title.includes("camp") || title.includes("cabin")) return "camping";
  if (title.includes("castle")) return "castles";
  if (title.includes("farm")) return "farms";
  if (title.includes("pool")) return "pools";
  if (title.includes("arctic")) return "arctic";
  if (location.includes("city") || location.includes("new york")) return "cities";

  return "rooms"; // default
}


const initDb = async () => {
  await Listing.deleteMany({});

  const listingsWithExtras = [];

  for (let listing of initData.data) {
    const geometry = await getGeometry(listing.location, listing.country);
    const category = getCategory(listing);

    listingsWithExtras.push({
      ...listing,
      owner: "6946bcc0163cf2e47d322fb3",
      geometry,
      category,
    });
  }

  await Listing.insertMany(listingsWithExtras);
  console.log("✅ data initialized with geometry + category");
};

initDb();

