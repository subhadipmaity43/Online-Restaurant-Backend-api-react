const express = require("express");
const dotenv = require("dotenv");
const app = express();
// import paymentRoute from "./routes/paymentRoutes.js";

// dotenv({ path: "./.env" });
// export const app = express();
// app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use("/api", paymentRoute);

// app.get("/api/getkey", (req, res) =>
//   res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
// );
