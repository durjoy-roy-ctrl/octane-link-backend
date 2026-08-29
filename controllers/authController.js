const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Helper function: creates a JWT token for a user.
// This token proves "this person is logged in" without needing
// a database check on every single request.
function createToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // token stays valid for 7 days
  )
}

// POST /api/auth/signup
// Creates a new user account.
async function signup(req, res) {
  try {
    const { name, email, phone, password, role } = req.body

    // Basic validation — beginner-level, just checking fields exist.
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please fill in all fields.' })
    }

    // Check if this email is already registered.
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' })
    }

    // Never store the plain password! We hash it first.
    // "Hashing" turns the password into scrambled text that can't be reversed.
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || 'retail',
    })

    const token = createToken(newUser)

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error('Signup error:', error.message)
    res.status(500).json({ message: 'Something went wrong. Please try again.' })
  }
}

// POST /api/auth/login
// Logs an existing user in.
async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password.' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      // We don't say "email not found" specifically — that helps
      // attackers guess which emails are registered. Keep it generic.
      return res.status(400).json({ message: 'Invalid email or password.' })
    }

    // Compare the typed password against the stored (hashed) password.
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' })
    }

    const token = createToken(user)

    res.status(200).json({
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error.message)
    res.status(500).json({ message: 'Something went wrong. Please try again.' })
  }
}

// POST /api/auth/forgot-password
// Demo-level password reset: in a real app, this would email a reset
// link. Here we just confirm the email exists (or pretend to, for
// security) so the frontend flow can be demonstrated.
async function forgotPassword(req, res) {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Please enter your email.' })
    }

    const user = await User.findOne({ email })

    // Even if the user isn't found, we send the same success message.
    // This is a common security practice so people can't use this
    // endpoint to check which emails are registered.
    res.status(200).json({
      message: 'If an account exists with this email, a reset link has been sent.',
    })

    if (user) {
      // In a real project: generate a reset token and email it here.
      console.log(`(Demo) Password reset requested for: ${email}`)
    }
  } catch (error) {
    console.error('Forgot password error:', error.message)
    res.status(500).json({ message: 'Something went wrong. Please try again.' })
  }
}

module.exports = { signup, login, forgotPassword }
