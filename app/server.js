import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';

import pool from './db.js';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, SESSION_SECRET } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Session Store Options
const sessionStoreOptions = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
};

const mysqlSessionStore = MySQLStore(session);
const sessionStore = new mysqlSessionStore(sessionStoreOptions, pool);

// Optionally use onReady() to get a promise that resolves when store is ready.
sessionStore.onReady().then(() => {
  // MySQL session store ready for use.
  console.log('Session store ready...');
}).catch(err => {
  // Something went wrong.
  console.error({ session_error: `Error initiating session store ${err.message}` });
});

// Session middleware
app.use(session({
  key: 'user_sid',
  secret: SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// UI - Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'contact.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'register.html'));
});

// Login route
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (rows.length > 0) {
      req.session.userId = rows[0].user_id;
      // res.redirect('/dashboard');
      res.status(200).json({ success: true, message: "Login successful!" })
    } else {
      // res.redirect('/login');
      res.status(400).json({ success: false, message: "User not found" })
    }
  } catch (err) {
    console.log({ login_error: err.message })
    res.status(500).json({ success: false, error: "Something went wrong!" });
  }
});

// Register route
app.post('/api/users/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      res.status(500).json({ success: false, error: "User already exists!" });
      return;
    }
    const [result] = await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password]);
    req.session.userId = result.insertId;
    // res.redirect('/dashboard');
    res.status(200).json({ success: true, message: "Signup successful!" })
  } catch (err) {
    console.log({ registration_error: err.message })
    res.status(500).json({ success: false, error: "Something went wrong!" });
  }
});

// Logout route
app.get('/api/users/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(500).json({ success: false, error: 'Logout failed' });
      } else {
        res.clearCookie('user_sid');
        // res.redirect('/login');
        res.status(200).json({ success: true, message: "Logout successful!" })
      }
    });
  }
});

// Checks authentication for API's
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Checks authentication for UI
const checkAuth = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login')
};

app.get('/dashboard', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'dashboard.html'));
});

// Basic API routes will be defined here

// Get all patients
app.get('/api/patients', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM patients');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a patient by ID
app.get('/api/patients/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM patients WHERE patient_id = ?', [req.params.id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new patient
app.post('/api/patients', async (req, res) => {
  const { first_name, last_name, date_of_birth, gender, language } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO patients (first_name, last_name, date_of_birth, gender, language) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, date_of_birth, gender, language]
    );
    res.status(201).json({ patient_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a patient
app.put('/api/patients/:id', async (req, res) => {
  const { first_name, last_name, date_of_birth, gender, language } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE patients SET first_name = ?, last_name = ?, date_of_birth = ?, gender = ?, language = ? WHERE patient_id = ?',
      [first_name, last_name, date_of_birth, gender, language, req.params.id]
    );
    if (result.affectedRows > 0) {
      res.json({ message: 'Patient updated' });
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a patient
app.delete('/api/patients/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM patients WHERE patient_id = ?', [req.params.id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Patient deleted' });
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all providers
app.get('/api/providers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM providers');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Additional CRUD operations for providers...


// Catch All Route & UI Error handling
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '..', 'public', 'error.html'));
});

export default app
