// server/scripts/migrate.js
const pool = require('../db');

async function migrate() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Shifts (
        id SERIAL PRIMARY KEY,
        ol_name VARCHAR(255) NOT NULL,
        ol_student_id INT NOT NULL,
        sign_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        sign_out_time TIMESTAMP,
        rsd TEXT,
        group_no INT
      );
    `);
    console.log('✅ Migration complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrate();
