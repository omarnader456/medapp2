const User = require('../models/User');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private (Admin only)
 */
exports.getAllUsers = async (req, res) => {
  try {
    // We select which fields to return, excluding sensitive ones like passwords
    const users = await User.find().select('-password -twoFactorCode -twoFactorCodeExpires');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};