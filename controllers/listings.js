const Listing=require("../models/listing");
const fetch = require("node-fetch");
const axios = require('axios');


module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({
      path:"reviews",
      populate: {
        path:"author"
      }
    }).populate("owner");
    if(!listing){
        req.flash("error","This listing does not exists!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});  
 };

 module.exports.createListing = async (req, res, next) => {
  if (!req.body.listing.image || !req.body.listing.image.url) {
    req.body.listing.image = {
      url: "https://images.unsplash.com/photo-1544894079-e81a9eb1da8b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "default"
    };
  }

  const geoResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
      q: req.body.listing.location,
      format: "json",
      limit: 1
    },
    headers: {
      "User-Agent": "Wanderlust/1.0 (mrunalkulkarni1978@gmail.com)"
    }
  });

  let lat = null;
  let lon = null;

  if (geoResponse.data && geoResponse.data.length > 0) {
    lat = geoResponse.data[0].lat;
    lon = geoResponse.data[0].lon;
  }

  if (!lat || !lon) {
    req.flash("error", "Could not find location. Please enter a valid address");
    return res.redirect("/listings/new");
  }

  let newListing = new Listing({
    ...req.body.listing,
    geometry: {
      type: "Point",
      coordinates: [lon, lat],
    },
    owner: req.user._id,
    image: {
      url: req.file?.path || req.body.listing.image.url,
      filename: req.file?.filename || req.body.listing.image.filename,
    }
  });

  const listing = await newListing.save();
  console.log("Created Listing:", listing);

  req.flash("success", "New listing Created!");
  res.redirect("/listings");
};

  module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested for does not exists!");
      res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
 };

 module.exports.updateListing=async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    const updatedData = { ...req.body.listing };//these req.body.listing is an object so we need to deconstruct it to conver it into the individual values

    if (!updatedData.image || !updatedData.image.url) {
        updatedData.image = listing.image; // fallback if no new image submitted
    }

    listing=await Listing.findByIdAndUpdate(id, updatedData);
    if(typeof req.file!=="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      await listing.save();
    }
   
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`); 
};

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","listing Deleted!");
    res.redirect("/listings");
 };