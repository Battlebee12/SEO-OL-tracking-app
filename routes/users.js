// routes/users.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); 

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

// POST /api/users — insert a new record into SignInOut
router.post('/', async (req, res) => {
  const{name,id,signIn,rsd} = req.body;
  try{
    const result = await pool.query(
      'INSERT INTO SignInOut (OL_Name, OL_Student_ID, Sign_In_Out, RSD) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, id, signIn, rsd]
    );
    res.status(201).json(result.rows[0]);
  }
  catch (err) {
    console.error('Error inserting SignInOut record:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
