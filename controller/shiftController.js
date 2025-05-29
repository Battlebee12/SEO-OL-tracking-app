const pool = require('../db');
// const { Parser } = require('json2csv');

// POST /api/shifts/signin
exports.signIn = async (req, res) => {
  const { name, id, rsd } = req.body;

  if (!name || !id) {
    return res.status(400).json({ error: 'Name and ID are required' });
  }

  try {
    // Optional: Check if the user already has an open shift
    const existing = await pool.query(
     `SELECT * FROM Shifts
      WHERE ol_student_id = $1
      AND sign_out_time IS NULL
      AND DATE(sign_in_time) = CURRENT_DATE
      ORDER BY sign_in_time DESC
      LIMIT 1`,
  [id]
);


    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Already signed in. Please sign out first.' });
    }

    const result = await pool.query(
      `INSERT INTO Shifts (ol_name, ol_student_id, rsd) VALUES ($1, $2, $3) RETURNING *`,
      [name, id, rsd]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Sign-in error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/shifts/signout
exports.signOut = async (req, res) => {
  const { id, rsd } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  try {
    const openShift = await pool.query(
      `SELECT * FROM Shifts
       WHERE ol_student_id = $1
         AND sign_out_time IS NULL
       ORDER BY sign_in_time DESC
       LIMIT 1`,
      [id]
    );

    if (openShift.rows.length === 0) {
      return res.status(404).json({ error: 'No active shift to sign out from' });
    }

    const shiftId = openShift.rows[0].id;

    const result = await pool.query(
      `UPDATE Shifts
       SET sign_out_time = CURRENT_TIMESTAMP,
           rsd = COALESCE($2, rsd)
       WHERE id = $1
       RETURNING *`,
      [shiftId, rsd]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Sign-out error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// GET /api/shifts
exports.getShifts = async (req, res) => {
  const { student_id, date } = req.query;
  let query = 'SELECT * FROM Shifts';
  const conditions = [];
  const values = [];

  if (student_id) {
    values.push(student_id);
    conditions.push(`ol_student_id = $${values.length}`);
  }

  if (date) {
    values.push(date);
    conditions.push(`DATE(sign_in_time) = $${values.length}`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY sign_in_time DESC';

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch shifts error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/shifts/export
// exports.exportShifts = async (req, res) => {
//   try {
//     const result = await pool.query(`SELECT * FROM Shifts ORDER BY sign_in_time ASC`);
//     const parser = new Parser();
//     const csv = parser.parse(result.rows);

//     res.header('Content-Type', 'text/csv');
//     res.attachment('shifts.csv');
//     res.send(csv);
//   } catch (err) {
//     console.error('Export error:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
