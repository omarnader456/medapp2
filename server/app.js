const exp = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const limit = require('express-rate-limit');
const sanitize = require('express-mongo-sanitize');
const cors = require('cors');
const cookie = require('cookie-parser');
const mongo = require('mongoose'); 
const path = require('path');
const https = require('https');
const fs = require('fs');
const hpp = require('hpp');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = exp();

// DB Connect
const startDB = async () => {
  try {
    const c = await mongo.connect(process.env.MONGO_URI);
    console.log(`DB Connected: ${c.connection.host}`);
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    // keep running in dev
    if (process.env.NODE_ENV === 'production') process.exit(1); 
  }
};
startDB();

// Logs
app.use((req, res, next) => {
  console.log(`REQ: ${req.method} ${req.url}`);
  next();
});

// Cors
app.use(cors({
  origin: ['https://localhost:5173', 'http://localhost:5173', 'http://localhost:3000','https://127.0.0.1:5173','https://127.0.0.1:3000'], 
  credentials: true
}));

const isProd = process.env.NODE_ENV === 'production';

// Secure headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://localhost:5000", "http://localhost:5000","https://127.0.0.1:5000",
        "wss://127.0.0.1:5173"], 
      scriptSrc: isProd ? ["'self'"] : ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: isProd ? ["'self'"] : ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(hpp()); 
app.use(sanitize());
app.use(xss());

// Limits
const genLimit = limit({
  windowMs: 600000, // 10m
  max: 100, 
  message: 'Slow down.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', genLimit);

app.use(exp.json({ limit: '10kb' }));
app.use(cookie());

// Routes
const accessRoutes = require('./paths/access'); 
app.use('/api/auth', accessRoutes);

app.get('/', (req, res) => res.send('API running...'));

app.use('/api/users', require('./paths/people'));
app.use('/api/care-teams', require('./paths/groups'));
app.use('/api/medications', require('./paths/drugs'));
app.use('/api/prescriptions', require('./paths/scripts'));
app.use('/api/diagnoses', require('./paths/reports'));

const P = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  app.listen(P, () => console.log(`Prod running on ${P}`));
} else {
  // SSL
  let k = path.join(__dirname, '../server.key');
  let c = path.join(__dirname, '../server.cert');

  if (!fs.existsSync(k)) {
    k = path.join(__dirname, 'server.key');
    c = path.join(__dirname, 'server.cert');
  }

  if (fs.existsSync(k) && fs.existsSync(c)) {
    const opts = { key: fs.readFileSync(k), cert: fs.readFileSync(c) };
    https.createServer(opts, app).listen(P, () => {
      console.log(`Secure Server on https://localhost:${P}`);
    });
  } else {
    console.log("No SSL. Running HTTP.");
    app.listen(P, () => console.log(`Insecure on http://localhost:${P}`));
  }
}