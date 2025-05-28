// routes/users.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // 👈 import your shared database pool

// GET /api/users — fetch all records from SignInOut
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM SignInOut ORDER BY Day DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching SignInOut records:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
