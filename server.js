
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
const upload = require('./middleware/multer.middleware')
const cloudinary = require('./config/cloudinary')

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/cart', cartRoutes)

app.get('/', (req, res) => {
  res.send('OctaneLink backend is running.')
})

// Test Cloudinary connection
app.get('/test-cloudinary', async (req, res) => {
  try {
    const result = await cloudinary.api.ping()

    res.json({
      message: 'Cloudinary connected successfully',
      result
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Cloudinary connection failed',
      error: error.message
    })
  }
})

// Test image upload
app.post('/test-upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No image uploaded'
      })
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'octanelink/products'
    })

    res.json({
      message: 'Image uploaded successfully',
      image: result.secure_url,
      publicId: result.public_id
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Image upload failed',
      error: error.message
    })
  }
})

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
})

