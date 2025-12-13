const crypto = require('crypto');
const Person = require('../schemas/person'); // Renamed import
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mailer = require('../helpers/mailer'); // Renamed import

const doRegister = async (req, res) => {
  try {
    const n = req.body.name;
    const e = req.body.email;
    const p = req.body.password;
    const r = req.body.role;

    if (!n || !e || !p) return res.status(400).json({ msg: 'Missing fields' });
    if (p.length < 6) return res.status(400).json({ msg: 'Password too short' });

    const roles = ['user', 'admin', 'doctor', 'patient', 'nurse'];
    if (r && !roles.includes(r)) return res.status(400).json({ msg: 'Bad role' });

    let u = await Person.findOne({ email: e });
    if (u) return res.status(400).json({ msg: 'Exists already' });

    u = new Person({ name: n, email: e, password: p, role: r || 'user' });

    const s = await bcrypt.genSalt(10);
    u.password = await bcrypt.hash(p, s);
    
    await u.save();
    res.status(201).json({ success: true, data: u });

  } catch (err) {
    console.log(err);
    res.status(500).send('Error');
  }
};

const doLogin = async (req, res) => {
  const e = req.body.email;
  const p = req.body.password;

  if (!e || !p) return res.status(400).json({ msg: 'Enter info' });

  try {
    const u = await Person.findOne({ email: e }).select('+password +loginAttempts +lockUntil');
    if (!u) return res.status(400).json({ msg: 'Wrong info' });

    if (u.lockUntil && u.lockUntil > Date.now()) {
      return res.status(403).json({ msg: 'Locked out. Wait.' });
    }

    const match = await bcrypt.compare(p, u.password);
    if (!match) {
      await u.incAttempts();
      return res.status(400).json({ msg: 'Wrong info' });
    }

    await u.resetAttempts();

    // 2FA check
    if (u.twoFactorEnabled) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const s = await bcrypt.genSalt(10);
      u.twoFactorCode = await bcrypt.hash(code, s);
      u.twoFactorCodeExpires = Date.now() + 600000;
      await u.save();

      try {
        await mailer({
          email: u.email,
          subject: 'Code',
          message: `Code: ${code}`,
        });

        const tmp = jwt.sign({ user: { id: u.id }, type: '2fa' }, process.env.JWT_SECRET, { expiresIn: '10m' });
        return res.status(200).json({ success: true, need2fa: true, tmpToken: tmp });
      } catch (error) {
        return res.status(500).send('Email broke');
      }
    }

    // Set Cookies (Manual copy-paste)
    const acc = jwt.sign({ user: { id: u.id } }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const ref = jwt.sign({ user: { id: u.id } }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    const prod = process.env.NODE_ENV === 'production';

    res.cookie('token', acc, { httpOnly: true, secure: prod, sameSite: 'strict', maxAge: 900000 });
    res.cookie('refreshToken', ref, { httpOnly: true, secure: prod, sameSite: 'strict', maxAge: 604800000 });

    res.status(200).json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).send('Err');
  }
};

const check2FA = async (req, res) => {
  const c = req.body.token; // code
  const t = req.body.twoFactorToken; // jwt
  
  if (!c || !t) return res.status(400).json({ msg: 'Missing inputs' });

  try {
    const dec = jwt.verify(t, process.env.JWT_SECRET);
    if (dec.type !== '2fa') return res.status(400).json({ msg: 'Bad token' });

    const u = await Person.findById(dec.user.id).select('+twoFactorCode +twoFactorCodeExpires');
    if (!u) return res.status(400).json({ msg: 'No user' });

    const ok = await bcrypt.compare(c, u.twoFactorCode);
    if (!ok || u.twoFactorCodeExpires < Date.now()) return res.status(400).json({ msg: 'Bad code' });

    u.twoFactorCode = undefined;
    u.twoFactorCodeExpires = undefined;
    await u.save();

    // Cookies again
    const acc = jwt.sign({ user: { id: u.id } }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const ref = jwt.sign({ user: { id: u.id } }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    const prod = process.env.NODE_ENV === 'production';

    res.cookie('token', acc, { httpOnly: true, secure: prod, sameSite: 'strict', maxAge: 900000 });
    res.cookie('refreshToken', ref, { httpOnly: true, secure: prod, sameSite: 'strict', maxAge: 604800000 });

    res.status(200).json({ success: true });

  } catch (err) {
    res.status(500).send('Err');
  }
};

const doRefresh = (req, res) => {
  const r = req.cookies.refreshToken;
  if (!r) return res.status(401).json({ msg: 'No token' });

  try {
    const d = jwt.verify(r, process.env.REFRESH_TOKEN_SECRET);
    const n = jwt.sign({ user: { id: d.user.id } }, process.env.JWT_SECRET, { expiresIn: '15m' });
    
    res.cookie('token', n, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 900000 });
    res.json({ success: true });
  } catch (e) {
    res.status(401).json({ msg: 'Bad token' });
  }
};

const doLogout = (req, res) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, msg: 'Bye' });
};

const getMe = async (req, res) => {
  try {
    const u = await Person.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, data: u });
  } catch (e) { res.status(500).json({ success: false }); }
};

const updateInfo = async (req, res) => {
  try {
    const u = await Person.findByIdAndUpdate(req.user.id, { name: req.body.name, email: req.body.email }, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: u });
  } catch (e) { res.status(400).json({ success: false, msg: e.message }); }
};

const updatePass = async (req, res) => {
  try {
    const curr = req.body.currentPassword;
    const newP = req.body.newPassword;
    
    const u = await Person.findById(req.user.id).select('+password');
    const m = await bcrypt.compare(curr, u.password);
    if (!m) return res.status(401).json({ msg: 'Wrong pass' });
    
    const s = await bcrypt.genSalt(10);
    u.password = await bcrypt.hash(newP, s);
    u.passwordChangedAt = Date.now();
    await u.save();
    res.status(200).json({ success: true });
  } catch (e) { res.status(400).json({ success: false }); }
};

const toggle2FA = async (req, res) => {
  try {
    const u = await Person.findById(req.user.id);
    u.twoFactorEnabled = !u.twoFactorEnabled; 
    await u.save();
    res.json({ success: true, status: u.twoFactorEnabled });
  } catch (e) { res.status(500).send('Err'); }
};

module.exports = { doRegister, doLogin, check2FA, doRefresh, doLogout, getMe, updateInfo, updatePass, toggle2FA };