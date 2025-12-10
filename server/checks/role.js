const User = require('../schemas/person');

const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(401).json({ msg: 'User not found' });
        }

        // Check if role matches
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                msg: `User role ${user.role} is not allowed to access this route`,
            });
        }

        next();
    } catch (err) {
        res.status(500).send('Server Error');
    }
  };
};

module.exports = authorize;