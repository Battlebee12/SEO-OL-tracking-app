const request = require('supertest');
const app = require('../index');
const pool = require('../db');

describe('POST /api/shifts/signout', () => {
  const testUser = {
    name: 'Signout Tester',
    id: '8888888',
    rsd: 'Signout RSD',
    gid: 2
  };

  // Ensure no open shifts before each test
  beforeEach(async () => {
    await pool.query(
      `DELETE FROM Shifts WHERE ol_student_id = $1`,
      [testUser.id]
    );
  });

  it('should return 400 if no ID is provided', async () => {
    const res = await request(app).post('/api/shifts/signout').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Student ID is required/i);
  });

  it('should return 404 if no open shift exists', async () => {
    const res = await request(app)
      .post('/api/shifts/signout')
      .send({ id: testUser.id });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/No active shift/i);
  });

  it('should sign out the most recent open shift', async () => {
    // Step 1: Sign in
    const signInRes = await request(app)
      .post('/api/shifts/signin')
      .send(testUser);
    expect(signInRes.statusCode).toBe(201);

    // Step 2: Sign out
    const signOutRes = await request(app)
      .post('/api/shifts/signout')
      .send({ id: testUser.id, rsd: 'Updated RSD' });

    expect(signOutRes.statusCode).toBe(200);
    expect(signOutRes.body).toHaveProperty('sign_out_time');
    expect(signOutRes.body.rsd).toBe('Updated RSD');
  });
});
