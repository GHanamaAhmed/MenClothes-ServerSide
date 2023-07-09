require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

const { dbConnect } = require("./config/dbConnect");
const auth = require("./routes/auth/auth");
const products = require("./routes/products/products");
const users = require("./routes/users/users");
const photos = require("./routes/photos/photos");
const reels = require("./routes/reels/reels");
const likes = require("./routes/likes/likes");
const basket = require("./routes/basket/basket");

const app = express();
const port = 4000;

//route authentication
const googleAuthRouter = require("./routes/auth/googleAuth");
const facebookAuthRouter = require("./routes/auth/facebookAuth");

require("./models/basketModel");
require("./models/commentModel");
require("./models/likeModel");
require("./models/orderModel");
require("./models/productModel");
require("./models/reelModel");
require("./models/userModel");
//basic middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      collectionName: "sessions",
      mongoUrl: "mongodb://127.0.0.1:27017/FRIHAECOMMERCE",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

//passport configuration
require("./config/googleStrategy")(passport);
require("./config/facebookStrategy")(passport);
app.use(passport.initialize());
app.use(passport.session());

//Routes auth
app.use("/auth", googleAuthRouter);
app.use("/auth", auth);
//Routes products
app.use("/products", products);
//Router users
app.use("/users", users);
//Route uploads
app.use("/uploads", photos);
//Route reels
app.use("/reels", reels);
//Route likes
app.use("/likes", likes);
//Route basket
app.use("/basket", basket);

dbConnect()
  .then((res) => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
