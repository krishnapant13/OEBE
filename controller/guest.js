const express = require("express");
const router = express.Router();
const Guest = require("../model/guest");
const ErrorHandler = require("../utills/ErrorHandler");

// Create guest
router.post("/create-guest", async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      emailAddress,
      phoneNumber,
      address,
      state,
      country,
      zipCode,
      additionMessage,
    } = req.body;
    console.log("body", req.body);

    const guestEmail = await Guest.findOne({ emailAddress });
    if (guestEmail) {
      return next(new ErrorHandler("Guest already exists", 400));
    }

    const newGuest = new Guest({
      firstName,
      lastName,
      emailAddress,
      phoneNumber,
      address,
      state,
      country,
      zipCode,
      additionMessage,
    });
    await newGuest.save();
    res.status(201).json({
      success: true,
      message: "Guest created successfully",
      guest: newGuest,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = router;
