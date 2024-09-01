import mysql from 'mysql2/promise';
import { DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from '../config.js';

const dbConfig = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT
};

async function initializeDatabase() {
  // Create a connection to the database
  const db = await mysql.createConnection(dbConfig);
  // console.log("Database migrations: MySQL database connection thread:", db.threadId);
  
  try {
    // Create the database if it doesn't exist
    await db.query(`CREATE DATABASE IF NOT EXISTS hospital_db`);
    // console.log("Database 'hospital_db' created successfully");

    // Select the 'hospital_db' database
    await db.changeUser({ database: 'hospital_db' });
    // console.log("Database: `hospital_db` is in use!");

    // Create the 'users' table if it doesn't exist
    const usersTable = `
      CREATE TABLE IF NOT EXISTS users (
          user_id INT PRIMARY KEY AUTO_INCREMENT,
          email VARCHAR(100) NOT NULL UNIQUE,
          username VARCHAR(50) NOT NULL,
          password VARCHAR(100) NOT NULL
      );
    `;
    await db.query(usersTable);
    // console.log("Users table created or already exists");

    // Create the 'patients' table
    const patientsTable = `
      CREATE TABLE IF NOT EXISTS patients (
          patient_id INT PRIMARY KEY AUTO_INCREMENT,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50) NOT NULL,
          date_of_birth DATE NOT NULL,
          gender VARCHAR(10) NOT NULL,
          language VARCHAR(20) NOT NULL
      )
    `;
    await db.query(patientsTable);
    // console.log("Patients table created or already exists");

    // Create the 'providers' table
    const providersTable = `
      CREATE TABLE IF NOT EXISTS providers (
          provider_id INT PRIMARY KEY AUTO_INCREMENT,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50) NOT NULL,
          provider_speciality VARCHAR(50) NOT NULL,
          email_address VARCHAR(50),
          phone_number VARCHAR(20),
          date_joined DATE NOT NULL
      )
    `;
    await db.query(providersTable);
    // console.log("Providers table created or already exists");

    // Create the 'visits' table
    const visitsTable = `
      CREATE TABLE IF NOT EXISTS visits (
          visit_id INT PRIMARY KEY AUTO_INCREMENT,
          patient_id INT,
          provider_id INT,
          date_of_visit DATE NOT NULL,
          date_scheduled DATE NOT NULL,
          visit_department_id INT NOT NULL,
          visit_type VARCHAR(50) NOT NULL,
          blood_pressure_systollic INT,
          blood_pressure_diastollic DECIMAL(5,2),
          pulse DECIMAL(5,2),
          visit_status VARCHAR(50) NOT NULL,
          FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
          FOREIGN KEY (provider_id) REFERENCES providers(provider_id)
      )
    `;
    await db.query(visitsTable);
    // console.log("Visits table created or already exists");

    // Create the 'ed_visits' table
    const edVisitsTable = `
      CREATE TABLE IF NOT EXISTS ed_visits (
          ed_visit_id INT PRIMARY KEY AUTO_INCREMENT,
          visit_id INT,
          patient_id INT,
          acuity INT NOT NULL,
          reason_for_visit VARCHAR(100) NOT NULL,
          disposition VARCHAR(50) NOT NULL,
          FOREIGN KEY (visit_id) REFERENCES visits(visit_id),
          FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
      )
    `;
    await db.query(edVisitsTable);
    // console.log("ED Visits table created or already exists");

    // Create the 'admissions' table
    const admissionsTable = `
      CREATE TABLE IF NOT EXISTS admissions (
          admission_id INT PRIMARY KEY AUTO_INCREMENT,
          patient_id INT,
          admission_date DATE NOT NULL,
          discharge_date DATE NOT NULL,
          discharge_disposition VARCHAR(50) NOT NULL,
          service VARCHAR(50) NOT NULL,
          primary_diagnosis VARCHAR(100) NOT NULL,
          FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
      )
    `;
    await db.query(admissionsTable);
    // console.log("Admissions table created or already exists");

    // Create the 'discharges' table
    const dischargesTable = `
      CREATE TABLE IF NOT EXISTS discharges (
          discharge_id INT PRIMARY KEY AUTO_INCREMENT,
          admission_id INT,
          patient_id INT,
          discharge_date DATE NOT NULL,
          discharge_disposition VARCHAR(50) NOT NULL,
          FOREIGN KEY (admission_id) REFERENCES admissions(admission_id),
          FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
      )
    `;
    await db.query(dischargesTable);
    // console.log("Discharges table created or already exists");
  } catch (err) {
    console.error("Error initializing database: ", err);
  } finally {
    // Close the database connection
    await db.end();
    // console.log("Database migrations: connection closed!");
  }
}

export default initializeDatabase;
