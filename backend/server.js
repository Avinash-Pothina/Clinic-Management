require('dotenv').config({quiet: true});
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth-routes');
const patientRoutes = require('./routes/patient-routes');
const tokenRoutes = require('./routes/token-routes');
const prescriptionRoutes = require('./routes/prescription-routes');
const billRoutes = require('./routes/bill-routes');
const historyRoutes = require('./routes/history-routes');

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/history', historyRoutes);

const port = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}); 