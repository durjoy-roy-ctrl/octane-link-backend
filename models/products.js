const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  brand: {
    type: String,
    required: true
  },

  oilType: {
    type: String,
    required: true
  },

  compatibility: {
    type: [String],
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  stock: {
    type: Number,
    required: true
  },

  image: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ''
  }
})

module.exports = mongoose.model('Product', productSchema)