import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';

import pool from './db.js';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, NODE_ENV, SESSION_SECRET } from '../config.js';
import router from './router/index.js';
import { checkAuth } from './middleware.js';

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
    maxAge: 1000 * 60 * 60 * 24, // valid for 1 day
    secure: NODE_ENV === "production" ?? false, // Set to true if using HTTPS
    httpOnly: NODE_ENV === "production" ? true : false,
  }
}));

// UI - Routes
app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/about', (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'public', 'about.html'));
});

app.get('/contact', (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'public', 'contact.html'));
});

app.get('/login', (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'public', 'register.html'));
});

app.get('/dashboard', checkAuth, (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'public', 'dashboard.html'));
});

// API routes
app.use("/api/v1", router);

// Catch All Routes & UI Error handling
app.use((req, res) => {
  return res.status(404).sendFile(path.join(__dirname, '..', 'public', 'error.html'));
});

export default app
