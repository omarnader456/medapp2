const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose'); 
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); 
  }
};
connectDB();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], 
  credentials: true
}));

app.use(helmet());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 1000 
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use(mongoSanitize());
app.use(xss());

app.get('/', (req, res) => res.send('API is running...'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/care-teams', require('./routes/careTeam'));
app.use('/api/medications', require('./routes/medication'));
app.use('/api/prescriptions', require('./routes/prescription'));
app.use('/api/diagnoses', require('./routes/diagnosis'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});