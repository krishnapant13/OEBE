const Messages = require("../model/messages");
const ErrorHandler = require("../utills/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { upload } = require("../multer");
const router = express.Router();

// create new message
router.post(
  "/create-new-message",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messagesData = req.body;
      if (req.files) {
        const files = req.files;
        const imageUrl = files.map((file) => `${file.fileName}`);
        messagesData.images = imageUrl;
      }
      messagesData.conversationId = req.body.conversationId;
      messagesData.sender = req.body.sender;
      messagesData.text = req.body.text;
      const message = new Messages({
        conversationId: messagesData.conversationId,
        text: messagesData.text,
        sender: messagesData.sender,
        images: messagesData.images ? messagesData.images : undefined,
      });
      await message.save();

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  })
);

// get all messages with conversation id
router.get(
  "/get-all-messages/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messages = await Messages.find({
        conversationId: req.params.id,
      });

      res.status(201).json({
        success: true,
        messages,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  })
);

module.exports = router;
