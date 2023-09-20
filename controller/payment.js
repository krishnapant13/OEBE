const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
router.post(
  "/process",
  catchAsyncErrors(async (req, res, next) => {
    const payment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr",
      metadata: {
        company: "TheOEStore",
      },
    });
    res.status(200).json({
      success: true,
      client_secret: payment.client_secret,
    });
  })
);

router.get(
  "/stripeapikey",
  catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({
      stripeapikey: process.env.STRIPE_API_KEY,
    });
  })
);

module.exports = router;
