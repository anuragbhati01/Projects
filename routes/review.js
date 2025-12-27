const express = require("express");
const router = express.Router({ mergeParams: true }); // with this we can access the parent route info like :id in /listings/:id/reviews in child which is /reviewsId
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// Reviews Routes
// Post Review Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// Delete Review Route
router.delete("/:reviewId", isAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
