const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://rakky_tyagi:y920lrl2uz@namastenode.ciiscbz.mongodb.net/devTInder"
  );
};

module.exports = connectDB;
