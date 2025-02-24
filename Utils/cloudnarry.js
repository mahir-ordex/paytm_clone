const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: "dmyarmveu",
  api_key: "491125229817185",
  api_secret: "Jf1Ay-T-53B0jR9ju4MqZZ9HPCk",
});

module.exports = cloudinary;
