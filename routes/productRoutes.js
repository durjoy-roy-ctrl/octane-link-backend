const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Buy পেজের প্রোডাক্ট লিস্ট পাওয়ার API
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;