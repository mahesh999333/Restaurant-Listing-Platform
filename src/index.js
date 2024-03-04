const express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const {MONGO_HOST, MONGO_PASSWORD, MONGO_DBNAME, MONGO_USERNAME} = require("./config/config.js")

const userRoutes = require("./routes/userRoutes.js");
const businessRoutes = require("./routes/businessRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");
const app = express();
const multer = require('multer');




app.use(bodyParser.json()); // tells the system that you want json to be used
// app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(multer().any());
// mongoDb connection
mongoose
  .connect(
    `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DBNAME}`,
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb connected"))
  .catch((err) => console.log(err));

// Initial route
app.use("/user/", userRoutes);
app.use("/business/", businessRoutes);
app.use("/review/", reviewRoutes);

// port
app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
