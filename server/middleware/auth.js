const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Get token from HttpOnly cookie
  const token = req.cookies.token;

  // 2. Check if no token exists
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. Verify token
  try {
    // jwt.verify will decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Add user from payload to the request object
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};