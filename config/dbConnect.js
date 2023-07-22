const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/FRIHAECOMMERCE";
const dbConnect = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await mongoose.connect(url);
      resolve("local");
    } catch (error) {
      try {
        await mongoose.connect(process.env.MONGO_URL);
        resolve("server");
      } catch (error) {
        reject(error);
      }
    }
  });
};
module.exports = { dbConnect };
