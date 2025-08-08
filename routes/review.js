const express=require("express");
const router=express.Router({mergeParams:true});//to merge the parent route with child route
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressErrors=require("../utils/ExpressErrors.js")
const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");

//add-reviews route
router.post("/",isLoggedIn,validateReview,
wrapAsync(reviewController.createReview));

// delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview) );

module.exports=router;