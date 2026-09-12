const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const User = require('../models/User')

function createToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

async function signup(req, res) {
  try {
    const { name, email, phone, password, role } = req.body

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please fill in all fields.' })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: 'An account with this email already exists.'
      })
    }

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
    res.status(500).json({
      message: 'Something went wrong. Please try again.'
    })
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please enter email and password.'
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password.'
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid email or password.'
      })
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
    res.status(500).json({
      message: 'Something went wrong. Please try again.'
    })
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        message: 'Please enter your email.'
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: 'User not found.'
      })
    }

    const token = crypto.randomBytes(20).toString('hex')

    user.resetToken = token
    user.resetTokenExpire = Date.now() + 3600000

    await user.save()

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'durjoyroy735@gmail.com',
        pass: 'mvws vuxq zjgg ukba',
      },
    })

    const resetUrl = `http://localhost:5173/reset-password/${token}`

    await transporter.sendMail({
      from: '"OctaneLink Support" <YOUR_GMAIL@gmail.com>',
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h3>OctaneLink Password Reset</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    })

    res.status(200).json({
      message: 'A password reset link has been sent to your email.'
    })
  } catch (error) {
    console.error('Forgot password error:', error.message)
    res.status(500).json({
      message: 'Something went wrong. Please try again.'
    })
  }
}

async function resetPassword(req, res) {
  try {
    const { token } = req.params
    const { password } = req.body

    if (!password) {
      return res.status(400).json({
        message: 'Please provide a new password.'
      })
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired reset token.'
      })
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    user.resetToken = undefined
    user.resetTokenExpire = undefined

    await user.save()

    res.status(200).json({
      message: 'Password updated successfully!'
    })
  } catch (error) {
    console.error('Reset password error:', error.message)
    res.status(500).json({
      message: 'Something went wrong. Please try again.'
    })
  }
}

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword
}