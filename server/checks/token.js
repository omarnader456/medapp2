const jwt = require('jsonwebtoken');
const Person = require('../schemas/person');

const checkToken = async (req, res, next) => {
  try {
    let t;
    if (req.cookies.token) t = req.cookies.token;

    if (!t) return res.status(401).json({ msg: 'No token' });

    const d = jwt.verify(t, process.env.JWT_SECRET);
    const u = await Person.findById(d.user.id);
    
    if (!u) return res.status(401).json({ msg: 'No user' });

    req.user = d.user;
    next();
  } catch (e) {
    res.status(401).json({ msg: 'Bad token' });
  }
};

module.exports = checkToken;