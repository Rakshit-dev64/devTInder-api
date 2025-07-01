const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://rakky_tyagi:fKHnaHZAwiktIUV0@namastenode.ciiscbz.mongodb.net/devTInder"
  );
};

module.exports = connectDB;
