const express = require('express');
const router = express.Router();
const shiftController = require('../controller/shiftController');

// @route   POST /api/shifts/signin
// @desc    Record a sign-in for an OL
router.post('/signin', shiftController.signIn);

// @route   POST /api/shifts/signout
// @desc    Record a sign-out for an OL
router.post('/signout', shiftController.signOut);

// @route   GET /api/shifts
// @desc    Admin: Get all shifts (optionally filtered)
// router.get('/', shiftController.getShifts);

//@route GET /api/shifts/admin
// @desc Admin: Get all shifts for a specific OL
router.get('/admin', shiftController.getAdminShifts);

// @route   GET /api/shifts/export
// @desc    Admin: Export shifts as CSV
router.get('/export', shiftController.exportShiftsToExcel);

router.get('/total-hours', shiftController.getTotalHours);

module.exports = router;
