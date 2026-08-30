const Product = require('../models/products')

async function getProducts(req, res) {
  try {
    const products = await Product.find()

    res.status(200).json(products)
  } catch (error) {
    console.error('Get products error:', error.message)

    res.status(500).json({
      message: 'Failed to fetch products.'
    })
  }
}

async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        message: 'Product not found.'
      })
    }

    res.status(200).json(product)
  } catch (error) {
    console.error('Get product error:', error.message)

    res.status(500).json({
      message: 'Failed to fetch product.'
    })
  }
}

async function createProduct(req, res) {
  try {
    const {
      name,
      brand,
      oilType,
      compatibility,
      price,
      stock,
      image,
      description
    } = req.body

    if (
      !name ||!brand ||!oilType ||!compatibility ||!price ||!stock ||!image
    ) {
      return res.status(400).json({
        message: 'Please fill in all product fields.'
      })
    }

    const product = await Product.create({
      name,
      brand,
      oilType,
      compatibility,
      price,
      stock,
      image,
      description
    })

    res.status(201).json({
      message: 'Product created successfully.',
      product
    })
  } catch (error) {
    console.error('Create product error:', error.message)

    res.status(500).json({
      message: 'Failed to create product.'
    })
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct
}