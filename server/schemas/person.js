const mongo = require('mongoose');

const s = new mongo.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Bad email']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'doctor', 'patient', 'nurse'],
    default: 'user',
  },
  password: { type: String, required: true, minlength: 6, select: false },
  
  // 2fa stuff
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorCode: { type: String, select: false },
  twoFactorCodeExpires: { type: Date, select: false },
  
  // security stuff
  createdAt: { type: Date, default: Date.now },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  passwordChangedAt: { type: Date }
});

s.methods.incAttempts = async function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({ $set: { loginAttempts: 1 }, $unset: { lockUntil: 1 } });
  }
  const u = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    u.$set = { lockUntil: Date.now() + 1800000 }; // 30m
  }
  return this.updateOne(u);
};

s.methods.resetAttempts = function() {
  return this.updateOne({ $set: { loginAttempts: 0 }, $unset: { lockUntil: 1 } });
};

module.exports = mongo.model('Person', s); // Collection: people