const express = require('express');
const router = express.Router();
const check = require('../checks/token');
const role = require('../checks/role');
const act = require('../actions/groups');

router.get('/my-assignments', check, act.myGroups);
router.get('/my-patients', [check, role('doctor', 'nurse')], act.myPatients);
router.post('/', [check, role('admin')], act.makeGroup);
router.get('/', [check, role('admin')], act.allGroups);
router.put('/:id', [check, role('admin')], act.editGroup);
router.delete('/:id', [check, role('admin')], act.killGroup);

module.exports = router;