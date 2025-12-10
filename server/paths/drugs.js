const express = require('express');
const router = express.Router();

const controller = require('../actions/drugs');
const authMiddleware = require('../checks/token');
const authorize = require('../checks/role');

// Get all (Staff only)
router.get('/', [authMiddleware, authorize('admin', 'doctor', 'nurse')], controller.getAllMedications);

// Create (Admin only)
router.post('/', [authMiddleware, authorize('admin')], controller.createMedication);

// Update (Admin only)
router.put('/:id', [authMiddleware, authorize('admin')], controller.updateMedication);

// Delete (Admin only)
router.delete('/:id', [authMiddleware, authorize('admin')], controller.deleteMedication);

module.exports = router;