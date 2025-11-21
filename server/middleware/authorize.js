const User = require('../models/User');

const authorize = (...roles) => {
  return async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ msg: 'User not found, authorization denied' });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        msg: `User role '${user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = authorize;