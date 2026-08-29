require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')

const app = express()

// ---- Middleware (things that run on every request) ----
app.use(cors()) // allows our React frontend (different port) to call this API
app.use(express.json()) // lets us read JSON data sent from the frontend

// ---- Routes ----
app.use('/api/auth', authRoutes)

// A simple "health check" route, just to confirm the server is alive.
app.get('/', (req, res) => {
  res.send('OctaneLink backend is running.')
})

// ---- Start the server ----
const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
})
