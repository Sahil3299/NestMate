const request = require('supertest');
const mongoose = require('mongoose');

const TEST_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nestmate_test';

let app;

beforeAll(async () => {
  await mongoose.connect(TEST_URI);
  app = require('../app');
});

afterAll(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  await mongoose.connection.close();
});

describe('Listing Routes', () => {
  let accessToken;
  let listingId;

  beforeAll(async () => {
    // Register and login to get token
    const registerRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Listing Owner',
        email: 'owner@example.com',
        password: 'password123',
        role: 'lister',
      });

    accessToken = registerRes.body.data.accessToken;
  });

  describe('POST /api/v1/listings', () => {
    it('should create a listing', async () => {
      const res = await request(app)
        .post('/api/v1/listings')
        .set('Authorization', `Bearer ${accessToken}`)
        .field('title', 'Cozy 1BHK in Pune')
        .field('description', 'Fully furnished apartment with all amenities')
        .field('rent', '15000')
        .field('city', 'pune')
        .field('locality', 'Koregaon Park')
        .field('roomType', '1BHK')
        .field('genderPreference', 'Any')
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.title).toBe('Cozy 1BHK in Pune');
      listingId = res.body.data._id;
    });

    it('should reject without auth', async () => {
      const res = await request(app)
        .post('/api/v1/listings')
        .send({ title: 'Test' })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/listings', () => {
    it('should return paginated listings', async () => {
      const res = await request(app)
        .get('/api/v1/listings')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter by city', async () => {
      const res = await request(app)
        .get('/api/v1/listings?city=pune')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /api/v1/listings/:id', () => {
    it('should return listing by id', async () => {
      const res = await request(app)
        .get(`/api/v1/listings/${listingId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(listingId);
    });

    it('should return 404 for non-existent id', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/v1/listings/${fakeId}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/v1/listings/:id', () => {
    it('should update own listing', async () => {
      const res = await request(app)
        .patch(`/api/v1/listings/${listingId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ rent: 18000, title: 'Updated Title' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.rent).toBe(18000);
    });
  });

  describe('DELETE /api/v1/listings/:id', () => {
    it('should delete own listing', async () => {
      const res = await request(app)
        .delete(`/api/v1/listings/${listingId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
    });
  });
});
