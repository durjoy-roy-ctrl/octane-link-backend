const mongoose = require('mongoose')

// This describes what a "User" looks like in the database.
// It matches the fields from the Signup form on the frontend:
// name, email, phone, password, role.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // no two users can have the same email
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true, // this will store the HASHED password, never plain text
    },
    role: {
      type: String,
      enum: ['retail', 'wholesale', 'delivery'], // only these 3 values allowed
      default: 'retail',
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
)

module.exports = mongoose.model('User', userSchema)
