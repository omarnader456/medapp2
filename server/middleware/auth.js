const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  let token;

  // Check for token in cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.user.id);
    if (!user) {
        return res.status(401).json({ msg: 'User no longer exists' });
    }

    // Check if password changed after token issue
    if (user.passwordChangedAt) {
        const changedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
        if (changedTimestamp > decoded.iat) {
            return res.status(401).json({ msg: 'Password recently changed. Please login again.' });
        }
    }

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};