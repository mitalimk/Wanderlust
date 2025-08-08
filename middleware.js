const Listing=require("./models/listing");
const Review=require("./models/reviews")
const ExpressErrors=require("./utils/ExpressErrors.js")
const {listingSchema,reviewSchema}=require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create listing!");
        return res.redirect("/login");
      }
      next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};


module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(", ");
      throw new ExpressErrors(400, msg);
    } else {
      next();
    }
  };

  module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(", ");
      throw new ExpressErrors(400, msg);
    } else {
      next();
    }
  };

module.exports.isOwner=async(req,res,next)=>{
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
      }
      next();
}


module.exports.isReviewAuthor=async(req,res,next)=>{
  const { id,reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currUser._id)){
      req.flash("error","You are not author of this review");
      return res.redirect(`/listings/${id}`);
    }
    next();
}