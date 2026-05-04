# NestMate

NestMate is a full-stack platform for finding compatible roommates and discovering available rooms. It brings together roommate matching, room listings, and real-time chat in one place so you don't have to jump between apps to sort out your living situation.

## What It Does

- **Roommate Matching:** The backend runs a compatibility algorithm that compares budget, location, sleep schedule, and lifestyle preferences to surface the best matches.
- **Room Listings:** Users can post available rooms with photos, rent, location, amenities, and occupancy details. Others can browse and filter by city, budget range, and amenities.
- **Real-Time Chat:** Built with Socket.io, the messaging system shows online status, typing indicators, and instant message delivery. Message history is persisted to MongoDB.
- **Reviews:** Leave star ratings and comments on rooms or other users to help people make better decisions.
- **Geospatial Search:** Find rooms within a specific radius using GeoJSON coordinates.

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS
- React Router DOM
- React Hook Form + Zod for validation
- Axios for API calls
- Socket.io-client for real-time events
- Heroicons + Lucide React for icons

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT + bcryptjs for authentication
- Socket.io for WebSocket communication
- Multer for image uploads
- Winston for logging
- Helmet, CORS, and express-rate-limit for security

## Project Structure

```
NestMate/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI, forms, cards, chat
│   │   ├── pages/           # Route-level views
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # API clients, socket init, validators
│   │   ├── contexts/        # Auth context
│   │   └── utils/           # Helpers and formatters
│   ├── index.html
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API route definitions
│   │   ├── middleware/      # Auth, error handling, rate limiting
│   │   ├── utils/           # Logger, errors, geospatial helpers
│   │   └── validators/      # Request validation schemas
│   ├── uploads/             # Local image storage
│   └── package.json
│
├── README.md
└── package.json             # Root workspace config
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/nestmate.git
cd nestmate
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env   # fill in your MongoDB URI and JWT secret
npm install
npm run dev            # starts on http://localhost:5000 with nodemon
```

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev            # starts Vite dev server, usually on http://localhost:5173
```

## Environment Variables

Create a `.env` file inside `backend/` with at least the following:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key
CORS_ORIGIN=http://localhost:5173
```

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login, receive JWT |
| GET | `/api/listings/search` | — | Search and filter listings |
| POST | `/api/listings` | Required | Post a new room |
| GET | `/api/listings/:id` | — | Get single listing |
| POST | `/api/reviews` | Required | Submit a review |
| GET | `/api/reviews` | — | Get reviews for a room/user |
| POST | `/api/matches` | Required | Get compatibility matches |

## Notes

- Images are stored locally in `backend/src/uploads/` via Multer. If you deploy to production, you'll likely want to swap this for cloud storage like S3 or Cloudinary.
- The matching engine uses rule-based scoring right now. It's modular enough to plug in more advanced logic later if needed.
- Socket.io handles chat events under the same server instance as the REST API, so only one port needs to be exposed.

## Author

**Sahil** — B.Tech student and full-stack developer.


