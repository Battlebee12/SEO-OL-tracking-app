const pool = require('../db');

async function seed() {
  await pool.query(`
    INSERT INTO shifts (ol_name, ol_student_id, rsd, group_no)
    VALUES ('Test OL', '12345678', 'Seeded for test', 2);
  `);
  console.log('✅ Seed complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
