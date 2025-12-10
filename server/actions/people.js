const User = require('../schemas/person');

const getAllUsers = async (req, res) => {
  try {
    // Don't send back passwords or 2fa secrets
    const users = await User.find().select('-password -twoFactorCode -twoFactorCodeExpires');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: `User not found` });
    }
    
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        if (!user) {
            return res.status(404).json({msg: `User not found`});
        }
        
        res.status(200).json({success: true, data: user});
    } catch (err) {
        res.status(400).json({success: false, msg: err.message});
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser
};