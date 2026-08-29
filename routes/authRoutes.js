const express = require('express')
const router = express.Router()
const { signup, login, forgotPassword } = require('../controllers/authController')

// Every route here starts with /api/auth (see server.js)
router.post('/signup', signup)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)

module.exports = router
