const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Checkout পেজ থেকে অর্ডার সেভ করার API
router.post('/create', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", order: savedOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;