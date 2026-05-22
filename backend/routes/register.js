const express = require("express");
const User = require("../models/User");
const { nanoid } = require("nanoid");
const QRCode = require("qrcode");

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("Request Body:", req.body);

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "No data received" });
  }

  const { name, email, age, phone, paymentMethod, ticketAmount } = req.body;

  if (!name || !email || !age || !phone || !paymentMethod || !ticketAmount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const refNum = nanoid(10).toUpperCase();

    const qrData = JSON.stringify({
      refNum,
      email,
      ticketAmount,
      paymentMethod,
    });

    let receiptQR;

    try {
      receiptQR = await QRCode.toDataURL(qrData);
    } catch (qrError) {
      console.error("QR Generation Failed:", qrError);
      return res.status(500).json({ message: "Failed to generate QR code" });
    }

    const user = new User({
      name,
      email,
      password: "guest_checkout", // ADDED DUMMY PASSWORD TO SATISFY SCHEMA
      age,
      phone,
      paymentMethod,
      ticketAmount,
      refNum,
      receiptQR,
    });

    await user.save();

    res.status(201).json({
      message: "Registration successful",
      refNum,
      receiptQR,
    });
  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
