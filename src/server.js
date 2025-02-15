import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sql from 'mssql';

const app = express();
app.use(cors()); // Allow frontend requests
app.use(bodyParser.json()); // Parse JSON request bodies

// MSSQL Configuration
const dbConfig = {
    user: 'ADITYA',
    password: 'Adi@12345',
    server: 'ADITYAPC',
    database: 'telemedicine',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Connect to MSSQL Database
sql.connect(dbConfig).then(() => console.log('✅ MSSQL Connected'))
    .catch(err => console.error('❌ Database Connection Error:', err.message));

// API Routes
app.get('/', (req, res) => {
    res.send('✅ Telemedicine Backend Running');
});

// Route to add a patient (Fixing the API endpoint)
app.post('/api/patients', async (req, res) => {
    try {
        const { name, age, gender, phone, address } = req.body;
        console.log("📩 Received Data:", req.body);  // Debugging step

        const request = new sql.Request();
        await request.query(
            `INSERT INTO Patients (name, age, gender, phone, address) 
             VALUES ('${name}', ${age}, '${gender}', '${phone}', '${address}')`
        );

        res.status(201).json({ message: '✅ Patient added successfully' });
    } catch (err) {
        console.error("❌ Database Insert Error:", err.message);  // Log errors
        res.status(500).json({ error: err.message });
    }
});

// Fetch all patients
app.get('/api/patients', async (req, res) => {
    try {
        const request = new sql.Request();
        const result = await request.query('SELECT * FROM Patients');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Start Server on PORT 5000
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
