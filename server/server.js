const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose'); // Import Mongoose
const path = require('path');

// Load .env variables from the server directory
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Initialize App
const app = express();

// 0. DATABASE CONNECTION
// We connect to the DB before starting the server logic
const connectDB = async () => {
  try {
    // Ensure MONGO_URI is in your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};
// Execute connection
connectDB();

// 5. CORS (Allow frontend to communicate)
// This MUST come before other middleware and routes
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], 
  credentials: true
}));

// 1. SECURITY HEADERS
app.use(helmet());

// 2. RATE LIMITING
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1000 // Increased limit for development
});
app.use('/api', limiter);

// 3. BODY PARSERS & COOKIES
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// 4. DATA SANITIZATION
app.use(mongoSanitize());
app.use(xss());

// ROUTES
app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/care-teams', require('./routes/careTeam'));
app.use('/api/medications', require('./routes/medication'));
// Add this line in server.js under the other app.use() statements for routes
app.use('/api/prescriptions', require('./routes/prescription'));
app.use('/api/diagnoses', require('./routes/diagnosis'));


// 6. START SERVER (The fix for "Clean Exit")
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});