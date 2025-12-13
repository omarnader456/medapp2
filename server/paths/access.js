const express = require('express');
const router = express.Router();

const act = require('../actions/access');
const check = require('../checks/token');
const role = require('../checks/role');
const { limitAuth } = require('../checks/limiter');

router.post('/register', limitAuth, check, role('admin'), act.doRegister);
router.post('/login', limitAuth, act.doLogin);
router.post('/verify-2fa', limitAuth, act.check2FA);
router.post('/enable-2fa', check, act.toggle2FA);
router.get('/logout', act.doLogout);
router.get('/me', check, act.getMe);
router.put('/updatedetails', check, act.updateInfo);
router.put('/updatepassword', check, act.updatePass);
router.get('/refresh-token', act.doRefresh);
module.exports = router;