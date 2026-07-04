# NestMate Backend - Production-Ready API

A complete, scalable backend for a roommate and flat-finding application targeting Indian cities (Pune, Mumbai, Bangalore, Thane, etc.).

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Node.js | 18+ |
| **Framework** | Express.js | 5.2.1 |
| **Database** | MongoDB | 5.0+ |
| **ODM** | Mongoose | 9.3.3 |
| **Authentication** | JWT (HS256) + Bcrypt | jsonwebtoken 9.0.3, bcryptjs 2.4.3 |
| **Real-time Communication** | Socket.io | 4.7.2 |
| **File Uploads** | Multer | 2.1.1 |
| **Validation** | express-validator | 7.3.2 |
| **Security** | Helmet, CORS, Rate Limiting | helmet 8.1.0, cors 2.8.6, express-rate-limit 8.3.2 |
| **Logging** | Morgan, Winston | morgan 1.10.1, winston 3.19.0 |

## Features

✅ **Authentication System**
- User registration with email verification
- JWT-based login with refresh token rotation
- Password reset workflow
- Role-based access control (seeker, host, admin)

✅ **Listing Management**
- Create, read, update, delete listings with images
- Advanced search and filtering (by city, budget, room type, etc.)
- Geographic queries (proximity search)
- View analytics and tracking
- Save/bookmark listings

✅ **Real-Time Chat**
- Socket.io integration for instant messaging
- Conversation history
- Typing indicators
- Online/offline status

✅ **Visit Request System**
- Booking/appointment workflow
- Host can confirm/decline requests
- Visitor can cancel requests
- Rating and review after visits

✅ **Notification System**
- Multiple notification types (listing created, new message, visit request, etc.)
- Mark as read functionality
- Unread count tracking
- Notification deletion

✅ **Roommate Discovery**
- Find compatible roommates by filters (city, budget, lifestyle, gender)
- Compatibility scoring algorithm (40 items with weighted scoring)
- View public roommate profiles

✅ **Admin Dashboard**
- User management (view, ban, delete)
- Listing moderation (approve, reject, flag)
- Review moderation
- System statistics

## Project Structure

```
backend/
├── src/
│   ├── index.js                    # Entry point with Socket.io setup
│   ├── app.js                      # Express app configuration
│   ├── config/
│   │   ├── db.js                   # MongoDB connection
│   │   ├── environment.js          # Environment variables
│   │   ├── multer.js               # File upload configuration
│   │   └── constants.js            # App constants
│   ├── models/                     # Mongoose schemas
│   │   ├── User.js
│   │   ├── Listing.js
│   │   ├── Message.js
│   │   ├── Conversation.js
│   │   ├── Review.js
│   │   ├── Match.js
│   │   ├── Notification.js         # NEW
│   │   ├── VisitRequest.js         # NEW
│   │   └── ...
│   ├── controllers/                # Business logic
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── listing.controller.js
│   │   ├── message.controller.js
│   │   ├── notification.controller.js  # NEW
│   │   ├── visit.controller.js     # NEW
│   │   ├── admin.controller.js     # NEW
│   │   ├── match.controller.js
│   │   └── review.controller.js
│   ├── routes/                     # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── listing.routes.js
│   │   ├── message.routes.js
│   │   ├── notification.routes.js  # NEW
│   │   ├── visit.routes.js         # NEW
│   │   ├── admin.routes.js         # NEW
│   │   ├── match.routes.js
│   │   └── review.routes.js
│   ├── middleware/
│   │   ├── auth.js                 # JWT authentication & authorization
│   │   ├── asyncHandler.js
│   │   ├── validate.js             # Input validation
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── validators/                 # Input validation schemas
│   │   ├── auth.validator.js
│   │   ├── listing.validator.js
│   │   └── message.validator.js
│   ├── services/
│   │   ├── matchingEngine.js       # Compatibility scoring
│   │   └── ...
│   ├── utils/
│   │   ├── AppError.js
│   │   ├── sendResponse.js
│   │   ├── catchAsync.js
│   │   ├── tokens.js
│   │   ├── sendEmail.js
│   │   └── ...
│   ├── uploads/                    # Uploaded files (images, avatars)
│   │   ├── listings/
│   │   └── profiles/
│   └── tests/                      # Test files
├── .env.example
├── package.json
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally or connection string
- npm or yarn

### Installation

1. **Clone and install**
```bash
cd backend
npm install
```

2. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Key environment variables**
```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/nestmate

# JWT
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# File uploads
MAX_UPLOAD_SIZE=5242880
MAX_IMAGES_PER_LISTING=10
UPLOAD_DIR=./src/uploads
```

4. **Run development server**
```bash
npm run dev
# Server starts on http://localhost:5000
```

5. **Run production server**
```bash
npm start
```

## API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Routes
```
POST   /auth/register              - Register new user
POST   /auth/login                 - Login user
POST   /auth/refresh-token         - Refresh access token
POST   /auth/logout                - Logout (requires auth)
GET    /auth/verify-email/:token   - Verify email
POST   /auth/forgot-password       - Request password reset
PATCH  /auth/reset-password/:token - Reset password
```

### User Routes
```
GET    /users/me                   - Get current user profile
PATCH  /users/me                   - Update profile
GET    /users/:id                  - Get public user profile
GET    /users/roommates            - Find compatible roommates
GET    /users/me/saved             - Get saved listings
POST   /users/me/saved/:listingId  - Save/unsave listing
```

### Listing Routes
```
GET    /listings                   - Get all listings (with filters)
GET    /listings/mine              - Get my listings
POST   /listings                   - Create listing
GET    /listings/:id               - Get listing details
PATCH  /listings/:id               - Update listing
DELETE /listings/:id               - Delete listing
GET    /listings/:id/analytics     - Get listing analytics
POST   /listings/:id/view          - Track view
```

### Message Routes
```
POST   /messages                   - Send message
GET    /messages/inbox             - Get conversation list
GET    /messages/unread            - Get unread count
GET    /messages/conversation/:userId - Get conversation history
```

### Notification Routes
```
GET    /notifications              - Get notifications (paginated)
GET    /notifications/:id          - Get single notification
PATCH  /notifications/:id/read     - Mark as read
POST   /notifications/read-all     - Mark all as read
DELETE /notifications/:id          - Delete notification
DELETE /notifications/clear-all    - Clear all notifications
```

### Visit Request Routes
```
POST   /visit-requests             - Create visit request
GET    /visit-requests/incoming    - Get incoming requests (host)
GET    /visit-requests/sent        - Get sent requests (visitor)
GET    /visit-requests/:id         - Get single request
POST   /visit-requests/:id/confirm - Confirm request (host)
POST   /visit-requests/:id/decline - Decline request (host)
POST   /visit-requests/:id/complete - Mark completed
POST   /visit-requests/:id/cancel  - Cancel request
```

### Admin Routes (admin role required)
```
GET    /admin/stats                - Dashboard statistics
GET    /admin/users                - List all users
GET    /admin/users/:userId        - User details
POST   /admin/users/:userId/ban    - Ban user
DELETE /admin/users/:userId        - Delete user
GET    /admin/listings             - List all listings
POST   /admin/listings/:id/approve - Approve listing
POST   /admin/listings/:id/reject  - Reject listing
POST   /admin/listings/:id/flag    - Flag for review
DELETE /admin/listings/:id         - Delete listing
GET    /admin/reviews              - List all reviews
POST   /admin/reviews/:id/flag     - Flag review
DELETE /admin/reviews/:id          - Remove review
```

### Match Routes
```
GET    /matches/seekers            - Find compatible seekers
POST   /matches/invite/:targetId   - Send team invite
DELETE /matches/team               - Leave team
```

### Review Routes
```
POST   /reviews                    - Create review
GET    /reviews/target/:targetType/:targetId - Get reviews
GET    /reviews/:id                - Get single review
DELETE /reviews/:id                - Delete review
```

## WebSocket Events (Socket.io)

### Client to Server
```javascript
// Authentication
socket.auth = { userId: "user_id_here" }

// Chat
socket.emit("join_chat", withUserId)
socket.emit("send_message", { toUserId, content: "message" })
socket.emit("typing", withUserId)
socket.emit("stop_typing", withUserId)
```

### Server to Client
```javascript
// Status
socket.on("user_online", { userId, timestamp })
socket.on("user_offline", { userId, timestamp })

// Messages
socket.on("receive_message", { from, to, content, createdAt })
socket.on("user_typing", { userId })
socket.on("user_stop_typing", { userId })
```

## Authentication Flow

1. **Register** → Email verification link sent
2. **Verify Email** → Click link or enter code
3. **Login** → Get access token (15m) + refresh token (7d)
4. **Access Protected Routes** → Use `Authorization: Bearer <token>` header
5. **Token Expires** → Use refresh token to get new access token
6. **Logout** → Invalidate refresh token

## Response Format

All endpoints return standardized responses:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "status": "fail"
}
```

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (auth failed) |
| 403 | Forbidden (auth passed, not authorized) |
| 404 | Not Found |
| 409 | Conflict (duplicate entry) |
| 422 | Unprocessable Entity (validation) |
| 500 | Internal Server Error |

## Security Features

✅ **Encryption & Hashing**
- Passwords hashed with bcryptjs (10 rounds)
- JWT tokens with HS256
- Refresh token rotation

✅ **Validation & Sanitization**
- Input validation with express-validator
- MongoDB injection prevention
- CORS enabled with credentials

✅ **Rate Limiting**
- General: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- Configurable per route

✅ **Security Headers**
- Helmet.js for HTTP security headers
- HTTPS in production recommended

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Database Migrations
```bash
npm run migrate:up
npm run migrate:down
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET (>32 chars)
3. Enable HTTPS
4. Use MongoDB Atlas or managed service
5. Configure rate limiting appropriately
6. Enable monitoring and logging
7. Use PM2 or Docker for process management

```bash
# Using PM2
pm2 start src/index.js --name "nestmate-api"
pm2 save
```

```bash
# Using Docker
docker build -t nestmate-api .
docker run -p 5000:5000 --env-file .env nestmate-api
```

## Monitoring & Logs

Logs are stored in `./logs` directory with Winston logger:
- `error.log` - Error level logs
- `combined.log` - All logs
- Console output in development

## Support & Contributing

For issues or feature requests, please refer to the main project documentation.

## License

ISC
