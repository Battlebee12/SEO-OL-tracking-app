const pool = require("../db");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
// const { Parser } = require('json2csv');

// POST /api/shifts/signin
exports.signIn = async (req, res) => {
  const { name, id, rsd } = req.body;

  if (!name || !id) {
    return res.status(400).json({ error: "Name and ID are required" });
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
      return res
        .status(400)
        .json({ error: "Already signed in. Please sign out first." });
    }

    const result = await pool.query(
      `INSERT INTO Shifts (ol_name, ol_student_id, rsd) VALUES ($1, $2, $3) RETURNING *`,
      [name, id, rsd]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Sign-in error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /api/shifts/signout
exports.signOut = async (req, res) => {
  const { id, rsd } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Student ID is required" });
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
      return res
        .status(404)
        .json({ error: "No active shift to sign out from" });
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
    console.error("Sign-out error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const calculateShiftDuration = (signIn, signOut) => {
  if (!signIn || !signOut) return null;

  const start = new Date(signIn);
  const end = new Date(signOut);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    console.warn('Invalid date:', signIn, signOut);
    return null;
  }

  const diffMs = end - start;
  return Math.floor(diffMs / 60000);
};


exports.getAdminShifts = async (req, res) => {
  console.log("🔔 getAdminShifts API called");

  const { student_id, date, has_rsd, name } = req.query;
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
  if (has_rsd) {
    conditions.push(`rsd IS NOT NULL`);
  }
  if (name) {
    values.push(`%${name}%`);
    conditions.push(`ol_name ILIKE $${values.length}`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY sign_in_time DESC';

  try {
    const result = await pool.query(query, values);
    const shiftsWithDuration = result.rows.map((shift) => ({
      ...shift,
      duration_minutes: calculateShiftDuration(shift.sign_in_time, shift.sign_out_time),
    }));

    console.log(shiftsWithDuration); // 🔍 Check here
    res.json(shiftsWithDuration);
  } catch (err) {
    console.error('Fetch shifts error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.exportShiftsToExcel = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM Shifts ORDER BY sign_in_time DESC"
    );
    const shifts = result.rows;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Shifts");

    // Define columns
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Name", key: "ol_name", width: 20 },
      { header: "Student ID", key: "ol_student_id", width: 15 },
      { header: "Sign In Time", key: "sign_in_time", width: 25 },
      { header: "Sign Out Time", key: "sign_out_time", width: 25 },
      { header: "RSD", key: "rsd", width: 30 },
    ];

    // Add rows
    shifts.forEach((shift) => {
      worksheet.addRow(shift);
    });

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=shifts.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Error exporting shifts:", err);
    res.status(500).json({ error: "Failed to export shifts" });
  }
};

// controllers/shiftsController.js
exports.getTotalHours = async (req, res) => {
  console.log("Query params:", req.query);
 let { dates, 'dates[]': datesArray, student_id, name } = req.query;

// Normalize dates param from either 'dates' or 'dates[]'
dates = dates || datesArray;

dates = !dates
  ? []
  : Array.isArray(dates)
  ? dates
  : [dates];

console.log("Normalized dates:", dates);



  const values = [];
  const conditions = [];

  // Optional: Only add date filter if dates are provided
  if (Array.isArray(dates) && dates.length > 0) {
  const placeholders = dates.map((_, i) => `$${values.length + i + 1}`).join(", ");
  conditions.push(`DATE(sign_in_time) IN (${placeholders})`);
  values.push(...dates);
  }


  if (student_id) {
    values.push(student_id);
    conditions.push(`ol_student_id = $${values.length}`);
  }

  if (name) {
    values.push(`%${name}%`);
    conditions.push(`ol_name ILIKE $${values.length}`);
  }

  // sign_out_time condition is always needed
  conditions.push(`sign_out_time IS NOT NULL`);
const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
try{
const query = `
  SELECT 
    ol_name,
    ol_student_id,
    SUM(EXTRACT(EPOCH FROM (sign_out_time - sign_in_time)) / 60) AS total_minutes
  FROM Shifts
  ${whereClause}
  GROUP BY ol_name, ol_student_id
  ORDER BY ol_name ASC
`;

    console.log("Final query:", query);
    console.log("With values:", values);


    const result = await pool.query(query, values);

    const formatted = result.rows.map(row => ({
      ol_name: row.ol_name,
      ol_student_id: row.ol_student_id,
      total_minutes: Math.round(row.total_minutes),
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching total hours:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// // GET /api/shifts
// exports.getShifts = async (req, res) => {
//   const { student_id, date } = req.query;
//   let query = 'SELECT * FROM Shifts';
//   const conditions = [];
//   const values = [];

//   if (student_id) {
//     values.push(student_id);
//     conditions.push(`ol_student_id = $${values.length}`);
//   }

//   if (date) {
//     values.push(date);
//     conditions.push(`DATE(sign_in_time) = $${values.length}`);
//   }

//   if (conditions.length > 0) {
//     query += ' WHERE ' + conditions.join(' AND ');
//   }

//   query += ' ORDER BY sign_in_time DESC';

//   try {
//     const result = await pool.query(query, values);
//     res.json(result.rows);
//   } catch (err) {
//     console.error('Fetch shifts error:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

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
