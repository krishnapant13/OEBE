const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dutkerqvn",
  api_key: "265392333877159",
  api_secret: "CofBqLFK6vmPvTnf0TfZJoy_PZw",
});

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "users" }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      })
      .end(fileBuffer);
  });
};

module.exports = uploadToCloudinary;
