const request = require('supertest');
const app = require('../index');

describe('GET api/shifts/admin',()=>{
    it('should return all shifts and specifics if OL is provided', async ()=>{
        const res = await request(app).get('/api/shifts/admin')
        expect(res.statusCode).toEqual(200);  

        expect(Array.isArray(res.body)).toBe(true);
        if(res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('ol_student_id');
            expect(res.body[0]).toHaveProperty('sign_in_time');
            expect(res.body[0]).toHaveProperty('duration_minutes');
        }
    });

    it('returns shifts filtered by student_id', async () => {
    const res = await request(app).get('/api/shifts/admin?student_id=1234567');
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    for (const shift of res.body) {
      expect(shift.ol_student_id).toBe('1234567');
    }
  });

  it('returns 200 even with non-matching filters (empty array)', async () => {
    const res = await request(app).get('/api/shifts/admin?student_id=99999');
    
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
})