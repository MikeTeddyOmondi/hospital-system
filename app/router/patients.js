import express from 'express'

import pool from '../db.js';

const router = express.Router()

// Get all patients
router.get('/patients', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM patients');
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get a patient by ID
router.get('/patients/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM patients WHERE patient_id = ?', [req.params.id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      return res.status(404).json({ message: 'Patient not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new patient
router.post('/patients', async (req, res) => {
  const { first_name, last_name, date_of_birth, gender, language } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO patients (first_name, last_name, date_of_birth, gender, language) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, date_of_birth, gender, language]
    );
    return res.status(201).json({ patient_id: result.insertId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update a patient
router.put('/patients/:id', async (req, res) => {
  const { first_name, last_name, date_of_birth, gender, language } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE patients SET first_name = ?, last_name = ?, date_of_birth = ?, gender = ?, language = ? WHERE patient_id = ?',
      [first_name, last_name, date_of_birth, gender, language, req.params.id]
    );
    if (result.affectedRows > 0) {
      return res.json({ message: 'Patient updated' });
    } else {
      return res.status(404).json({ message: 'Patient not found' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete a patient
router.delete('/patients/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM patients WHERE patient_id = ?', [req.params.id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Patient deleted' });
    } else {
      return res.status(404).json({ message: 'Patient not found' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router