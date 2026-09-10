# OctaneLink Backend

A simple Node.js + Express backend for OctaneLink. Handles **signup**,
**login**, and **forgot password** using MongoDB and JWT — following the
pattern from the reference `node-express-api` repo shared in class.

## What it does

- `POST /api/auth/signup` — creates a new user (name, email, phone, password, role)
- `POST /api/auth/login` — checks email/password, returns a JWT token
- `POST /api/auth/forgot-password` — demo password reset (logs to console, doesn't send real email)

Passwords are **hashed** with bcrypt before being saved — the real
password is never stored anywhere.

## How to run

1. Install [Node.js](https://nodejs.org) (v18+) and make sure you have a
   MongoDB database ready (either install MongoDB locally, or make a
   free one at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

2. Install dependencies:
   ```
   npm install
   ```

3. Copy `.env.example` to a new file called `.env`, then fill in your
   own `MONGO_URI` and `JWT_SECRET`:
   ```
   cp .env.example .env
   ```

4. Start the server:
   ```
   npm run dev
   ```

5. You should see:
   ```
   MongoDB connected successfully
   Server running on http://localhost:5000
   ```

## Folder structure (beginner-friendly, kept simple)

```
octane-link-backend/
├── server.js              → starts everything
├── config/db.js           → connects to MongoDB
├── models/User.js         → what a "user" looks like in the database
├── controllers/authController.js  → the actual signup/login/forgot-password logic
├── routes/authRoutes.js   → connects URLs (like /api/auth/login) to the controller
└── .env                   → your secret settings (never upload this to GitHub!)
```

## Testing it without the frontend

You can test these routes with Postman or Thunder Client (VS Code extension):

**Signup**
```
POST http://localhost:5000/api/auth/signup
Body (JSON):
{
  "name": "Rafi Islam",
  "email": "rafi@example.com",
  "phone": "01712345678",
  "password": "test1234",
  "role": "retail"
}
```

**Login**
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "rafi@example.com",
  "password": "test1234"
}
```

Both should return a `token` and a `user` object if successful.
