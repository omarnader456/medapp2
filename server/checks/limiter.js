const rateLimit = require('express-rate-limit');

// Strict limiter for auth routes
const limitAuth = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 20, 
  message: {
    success: false,
    msg: 'Too many attempts. Please try again later.'
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

module.exports = {
    limitAuth
};