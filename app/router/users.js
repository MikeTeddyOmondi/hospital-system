import express from 'express'

import pool from '../db.js';

const router = express.Router()

// Login route
router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: "Please enter all fields!" })
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (rows.length > 0) {
      req.session.userId = rows[0].user_id;
      // res.redirect('/dashboard');
      return res.status(200).json({ success: true, message: "Login successful!" })
    } else {
      // res.redirect('/login');
      return res.status(400).json({ success: false, message: "User not found" })
    }
  } catch (err) {
    console.log({ login_error: err.message })
    return res.status(500).json({ success: false, error: "Something went wrong!" });
  }
});

// Register route
router.post('/users/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ success: false, error: "Please enter all fields!" })
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(500).json({ success: false, error: "User already exists!" });
    }
    const [result] = await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [String(username).toLowerCase(), email, password]);
    req.session.userId = result.insertId;
    // res.redirect('/dashboard');
    return res.status(200).json({ success: true, message: "Signup successful!" })
  } catch (err) {
    console.log({ registration_error: err.message })
    return res.status(500).json({ success: false, error: "Something went wrong!" });
  }
});

// Logout route
router.get('/users/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Logout failed' });
      } else {
        res.clearCookie('user_sid');
        // res.redirect('/login');
        return res.status(200).json({ success: true, message: "Logout successful!" })
      }
    });
  }
});


export default router