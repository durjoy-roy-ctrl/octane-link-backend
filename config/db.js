const mongoose = require('mongoose')

// This function connects our backend to the MongoDB database.
// We call it once when the server starts (see server.js).
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1) // stop the server if the database can't connect
  }
}

module.exports = connectDB
