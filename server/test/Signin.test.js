const request = require('supertest');
const app = require('../index'); // your Express app
const pool = require('../db');   // your DB connection

describe('POST /api/shifts/signin', () => {
  const testUser = {
    name: 'Test OL',
    id: 9999999,
    rsd: 'Test RSD',
    gid: 3
  };

  // Clean up any existing shift for this user before each test
  beforeEach(async () => {
    await pool.query(
      `DELETE FROM Shifts WHERE ol_student_id = $1 AND DATE(sign_in_time) = CURRENT_DATE`,
      [testUser.id]
    );
  });

  it('should fail with 400 if name or id is missing', async () => {
    const res = await request(app).post('/api/shifts/signin').send({
      rsd: 'Test RSD',
      gid: 3
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Name and ID are required/i);
  });

  it('should sign in successfully with valid data', async () => {
    const res = await request(app).post('/api/shifts/signin').send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('ol_student_id', testUser.id);
    expect(res.body).toHaveProperty('ol_name', testUser.name);
  });

  it('should fail if user is already signed in today', async () => {
    // First sign-in
    await request(app).post('/api/shifts/signin').send(testUser);

    // Second sign-in attempt
    const res = await request(app).post('/api/shifts/signin').send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Already signed in/i);
  });
});
