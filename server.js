const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");

// importing routes
const userRoutes = require("./routes/userRoutes");
const ProductRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
// settings
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors("*"));

app.use("/user", userRoutes);
app.use("/product", ProductRoutes);
app.use("/category", categoryRoutes);
app.use("/order", orderRoutes);

const PORT = process.env.PORT || 3000;

// connect to db and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  })
  .catch((err) => {
    console.error(err);
  });
