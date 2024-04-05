const express = require("express");
const path = require("path");
const Shop = require("../model/shop");
const router = express.Router();
const multer = require("multer");
const ErrorHandler = require("../utills/ErrorHandler");
const jwt = require("jsonwebtoken");
const sendMail = require("../utills/sendMail");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const fs = require("fs");
const sendShopToken = require("../utills/shopToken");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const uploadToCloudinary = require("../utills/cloudinaryUploads");
const upload = multer().single("file");

//creating activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};
// create seller
router.post("/create-shop", upload, async (req, res, next) => {
  try {
    const shopCount = await Shop.countDocuments();
    if (shopCount >= 10) {
      return next(new ErrorHandler("Shop Creation limit exceeded", 400));
    }
    const email = req.body.email;
    const sellerEmail = await Shop.findOne({ email });
    if (sellerEmail) {
      return next(new ErrorHandler("Seller already exists", 400));
    }
    if (!req.file) {
      return next(new ErrorHandler("No file uploaded", 400));
    }
    const imageUrl = await uploadToCloudinary(req.file.buffer);
    const seller = {
      name: req.body.name,
      email: email,
      password: req.body.password,
      address: req.body.address,
      zipCode: req.body.zipCode,
      phoneNumber: req.body.phoneNumber,
      avatar: imageUrl,
    };
    const activation_token = createActivationToken(seller);

    const activationUrl = `${process.env.APP_URL}/seller/activation/${activation_token}`;

    try {
      await sendMail({
        email: seller.email,
        subject: "Activate your shop",
        message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email:- ${seller.email} to activate your shop!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
// activate seller
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;
      // Verify the activation token and catch any errors
      let newSeller;
      try {
        newSeller = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
      } catch (err) {
        console.log("Token verification error:", err);
        return next(new ErrorHandler("Invalid token", 400));
      }
      if (!newSeller) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password, avatar, phoneNumber, zipCode, address } =
        newSeller;

      let seller = await Shop.findOne({ email });

      if (seller) {
        return next(new ErrorHandler("Seller already exists", 400));
      }

      seller = await Shop.create({
        name,
        email,
        avatar,
        password,
        phoneNumber,
        zipCode,
        address,
      });

      sendShopToken(seller, 201, res);
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//login seller
router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }
      const seller = await Shop.findOne({ email }).select("+password");
      if (!seller) {
        return next(new ErrorHandler("Seller dosen't exists", 400));
      }
      const isPasswordValid = await seller.comparePassword(password);
      if (!isPasswordValid) {
        return next(new ErrorHandler("Invalid Data entered", 400));
      }
      sendShopToken(seller, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//load shop
router.get(
  "/getSeller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);
      if (!seller) {
        return next(new ErrorHandler("Seller dosen't exists", 400));
      }
      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//logout Shop
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("seller_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(201).json({
        success: true,
        message: "Logout Successful",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get shop info
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update shop profile picture
router.put(
  "/update-shop-avatar",
  isSeller,
  upload,
  catchAsyncErrors(async (req, res, next) => {
    try {
      if (!req.file) {
        return next(new ErrorHandler("No file uploaded", 400));
      }
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        avatar: imageUrl,
      });
      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller info
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, description, address, phoneNumber, zipCode } = req.body;

      const shop = await Shop.findOne(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("Seller not found", 400));
      }

      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      shop.zipCode = zipCode;

      await shop.save();

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all sellers --- for admin
router.get(
  "/admin-all-sellers",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sellers = await Shop.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        sellers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller ---admin
router.delete(
  "/delete-seller/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.params.id);

      if (!seller) {
        return next(
          new ErrorHandler("Seller is not available with this id", 400)
        );
      }

      await Shop.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Seller deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller withdraw methods --- sellers
router.put(
  "/update-payment-methods",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { withdrawMethod } = req.body;

      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        withdrawMethod,
      });

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller withdraw merthods --- only seller
router.delete(
  "/delete-withdraw-method/",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("Seller not found with this id", 400));
      }

      seller.withdrawMethod = null;

      await seller.save();

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
