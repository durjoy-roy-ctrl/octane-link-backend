const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: String,
  fuelType: String,
  quantity: Number,
  totalAmount: Number,
  address: String,
  paymentStatus: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);