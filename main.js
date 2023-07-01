const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const port = 4000;
const { dbConnect } = require("./config/dbConnect");
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  console.log(req.cookies?.name);
  res.cookie("name", "mohamed", { maxAge: 5000, httpOnly: true }).send();
});
dbConnect()
  .then((res) => {
    app.listen(port, () => {
      console.log(res);
      console.log(`http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
