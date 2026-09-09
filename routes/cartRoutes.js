const express = require("express");
const Cart = require('../models/cart');
const router = express.Router();
router.get('/',(req,res)=>{
    res.json({message: 'Cart route is working'})
})
module.exports = router;