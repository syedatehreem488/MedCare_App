// server.js - the MedCare backend(Node.js + Express).
const express = require('express');
const cors = require('cors');
require('dotenv').config({ quiet: true });
const pool = require('./db');

const app = express();
app.use(cors()); //lets the mobile app call this server
app.use(express.json()); // lets us read the JSON sent by the app

app.get('/api/health' , (req, res) => {
    res.json({ status: 'OK', message: 'MedCare API is running smoothly.' });
});
app.get('/api/welcome', async(req, res) => {
    try {
        const [[{ patients }]]   = await pool.query('SELECT COUNT(*) AS patients FROM patient');
        const [[{ caregivers }]] = await pool.query('SELECT COUNT(*) AS caregivers FROM caregiver');
        const [[{ medicines }]]  = await pool.query('SELECT COUNT(*) AS medicines FROM medicine');
    res.json({ 
        appName: 'MedCare',
        tagline: 'Never miss a dose. Keep your family in the loop. \n Designed with Love and Care for the Sick',
        dbConnected: true,
        stats: {
            patients,
            caregivers,
            medicines
        }
     });
    } catch (error) {
        console.error('Database error: ', error.message);
        res.status(500).json({ dbConnected: false, error: 'Failed to fetch database stats' });
    }
  });
const PORT = process.env.PORT || 5000;
// ''0.0.0.0' means: accept requests from other devices on the same Wi-Fi (your phone)
app.listen(PORT, '0.0.0.0' , async() =>{
    console.log('MedCare server running on port ${PORT}');
    try{
        await pool.query('SELECT 1'); // Test the database connection
        console.log('Connected to MySQL database:', process.env.DB_NAME);
    } catch (error) {
        console.error('Database connection failed: ', error.message);
    }
});