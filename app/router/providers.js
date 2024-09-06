import express from 'express'

import pool from '../db.js';

const router = express.Router()

// Get all providers
router.get('/providers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM providers');
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Additional CRUD operations for providers...

export default router