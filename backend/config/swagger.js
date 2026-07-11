const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NestMate API',
      version: '1.0.0',
      description: 'API documentation for NestMate - Roommate & Flat Rental Platform',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API v1',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            gender: { type: 'string', enum: ['Male', 'Female', 'Other', ''] },
            age: { type: 'number' },
            city: { type: 'string' },
            bio: { type: 'string' },
            occupation: { type: 'string' },
            role: { type: 'string', enum: ['seeker', 'lister', 'both'] },
            verified: { type: 'boolean' },
            profileImage: { type: 'string' },
          },
        },
        Listing: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            owner: { $ref: '#/components/schemas/User' },
            type: { type: 'string', enum: ['room', 'flat', 'requirement'] },
            title: { type: 'string' },
            description: { type: 'string' },
            city: { type: 'string' },
            locality: { type: 'string' },
            rent: { type: 'number' },
            deposit: { type: 'number' },
            roomType: { type: 'string' },
            genderPreference: { type: 'string' },
            furnished: { type: 'string' },
            amenities: { type: 'array', items: { type: 'string' } },
            photos: { type: 'array', items: { type: 'string' } },
            isBrokerageFree: { type: 'boolean' },
            status: { type: 'string', enum: ['active', 'rented', 'inactive'] },
          },
        },
        Match: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userA: { $ref: '#/components/schemas/User' },
            userB: { $ref: '#/components/schemas/User' },
            score: { type: 'number', minimum: 0, maximum: 100 },
            breakdown: {
              type: 'object',
              properties: {
                food: { type: 'number' },
                smoking: { type: 'number' },
                drinking: { type: 'number' },
                sleep: { type: 'number' },
                cleanliness: { type: 'number' },
                pets: { type: 'number' },
                workFromHome: { type: 'number' },
                occupation: { type: 'number' },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);
