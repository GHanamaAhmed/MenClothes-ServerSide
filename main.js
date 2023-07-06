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
const products = require("./routes/products/products");
const users=require("./routes/users/users")

const app = express();
const port = 4000;



//route authentication
const googleAuthRouter = require("./routes/auth/googleAuth");
const facebookAuthRouter = require("./routes/auth/facebookAuth");

//basic middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true,
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
//Routes products
app.use("/products", products);
//Router users
app.use("/users", users);

dbConnect()
  .then((res) => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
