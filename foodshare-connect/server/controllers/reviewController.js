const Review = require(
  "../models/Review"
);
const FoodRequest = require(
  "../models/FoodRequest"
);

function validateReview(req, res) {
  const rating = Number(req.body.rating);
  const feedback = String(
    req.body.feedback || ""
  ).trim();

  if (
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    res.status(400).json({
      message:
        "Rating must be between 1 and 5",
    });

    return null;
  }

  if (feedback.length > 500) {
    res.status(400).json({
      message:
        "Feedback cannot exceed 500 characters",
    });

    return null;
  }

  return {
    rating: rating,
    feedback: feedback,
  };
}

async function createDonorReview(
  req,
  res
) {
  try {
    const reviewData =
      validateReview(req, res);

    if (!reviewData) {
      return;
    }

    const request =
      await FoodRequest.findById(
        req.params.requestId
      );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (
      request.donorId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You cannot review this request",
      });
    }

    if (
      request.status !== "Completed"
    ) {
      return res.status(400).json({
        message:
          "Review is allowed only after completed pickup",
      });
    }

    if (
      request.donorReviewSubmitted
    ) {
      return res.status(400).json({
        message:
          "You already reviewed this request",
      });
    }

    const review =
      await Review.create({
        requestId: request._id,
        donationId:
          request.foodDonationId,
        donorId: request.donorId,
        receiverId:
          request.receiverId,
        reviewerRole: "donor",
        rating: reviewData.rating,
        feedback:
          reviewData.feedback,
        flagged:
          reviewData.rating <= 2,
      });

    request.donorReviewSubmitted =
      true;

    await request.save();

    res.status(201).json({
      message:
        "Review submitted successfully",
      review: review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "You already reviewed this request",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function createReceiverReview(
  req,
  res
) {
  try {
    const reviewData =
      validateReview(req, res);

    if (!reviewData) {
      return;
    }

    const request =
      await FoodRequest.findById(
        req.params.requestId
      );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (
      request.receiverId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You cannot review this request",
      });
    }

    if (
      request.status !== "Completed"
    ) {
      return res.status(400).json({
        message:
          "Review is allowed only after completed pickup",
      });
    }

    if (
      request.receiverReviewSubmitted
    ) {
      return res.status(400).json({
        message:
          "You already reviewed this request",
      });
    }

    const review =
      await Review.create({
        requestId: request._id,
        donationId:
          request.foodDonationId,
        donorId: request.donorId,
        receiverId:
          request.receiverId,
        reviewerRole: "receiver",
        rating: reviewData.rating,
        feedback:
          reviewData.feedback,
        flagged:
          reviewData.rating <= 2,
      });

    request.receiverReviewSubmitted =
      true;

    await request.save();

    res.status(201).json({
      message:
        "Review submitted successfully",
      review: review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "You already reviewed this request",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function getFlaggedReviews(
  req,
  res
) {
  try {
    const reviews =
      await Review.find({
        flagged: true,
      })
        .populate(
          "donationId",
          "foodName foodType quantity"
        )
        .populate(
          "donorId",
          "name organizationName email phone"
        )
        .populate(
          "receiverId",
          "name organizationName email phone"
        )
        .sort({
          createdAt: -1,
        });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

module.exports = {
  createDonorReview,
  createReceiverReview,
  getFlaggedReviews,
};