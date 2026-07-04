# NestMate Backend - API Documentation

Complete reference for all NestMate API endpoints with detailed request/response examples.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Listings](#listings)
4. [Messages](#messages)
5. [Notifications](#notifications)
6. [Visit Requests](#visit-requests)
7. [Reviews](#reviews)
8. [Matches](#matches)
9. [Admin](#admin)
10. [Error Handling](#error-handling)

---

## Authentication

All protected endpoints require the `Authorization: Bearer <token>` header.

### 1. Register User

**Endpoint:** `POST /api/v1/auth/register`

**Description:** Create a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "passwordConfirm": "SecurePass123!",
  "role": "seeker",
  "phoneNumber": "+919876543210",
  "gender": "male",
  "preferredCity": "Pune"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "seeker",
      "isVerified": false,
      "createdAt": "2026-05-16T10:30:00Z"
    }
  }
}
```

**Validation Rules:**
- Name: 2-50 characters
- Email: Valid email format, unique
- Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
- Role: "seeker" or "host"

---

### 2. Login

**Endpoint:** `POST /api/v1/auth/login`

**Description:** Authenticate user and get tokens

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "seeker",
      "isVerified": true
    }
  }
}
```

**Cookie:** `refresh_token` sent as HttpOnly cookie

---

### 3. Refresh Token

**Endpoint:** `POST /api/v1/auth/refresh-token`

**Description:** Get new access token using refresh token

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 4. Verify Email

**Endpoint:** `GET /api/v1/auth/verify-email/:token`

**Description:** Verify user email address

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "isVerified": true
  }
}
```

---

### 5. Forgot Password

**Endpoint:** `POST /api/v1/auth/forgot-password`

**Description:** Request password reset link

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

---

### 6. Reset Password

**Endpoint:** `PATCH /api/v1/auth/reset-password/:token`

**Description:** Reset password with token

**Request Body:**
```json
{
  "password": "NewSecurePass123!",
  "passwordConfirm": "NewSecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### 7. Logout

**Endpoint:** `POST /api/v1/auth/logout`

**Description:** Logout user and invalidate refresh token

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Users

### 1. Get Current User Profile

**Endpoint:** `GET /api/v1/users/me`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Profile fetched",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "/uploads/profiles/avatar_123.jpg",
    "bio": "Looking for a 1BHK in Pune",
    "phone": "+919876543210",
    "gender": "male",
    "age": 28,
    "occupation": "Software Engineer",
    "preferredCity": "Pune",
    "minBudget": 10000,
    "maxBudget": 20000,
    "lifestyle": "quiet",
    "genderPreference": "any",
    "savedListings": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "title": "1BHK near IT Park"
      }
    ],
    "isVerified": true,
    "role": "seeker",
    "createdAt": "2026-05-16T10:30:00Z"
  }
}
```

---

### 2. Update Profile

**Endpoint:** `PATCH /api/v1/users/me`

**Headers:** 
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (form-data):**
```
name: John Doe
bio: Updated bio text
age: 29
avatar: [file]
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated",
  "data": { ... }
}
```

---

### 3. Get Public User Profile

**Endpoint:** `GET /api/v1/users/:userId`

**Response (200):**
```json
{
  "success": true,
  "message": "User profile",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "avatar": "/uploads/profiles/avatar_123.jpg",
    "bio": "Looking for a 1BHK in Pune",
    "gender": "male",
    "age": 28,
    "occupation": "Software Engineer",
    "preferredCity": "Pune",
    "lifestyle": "quiet",
    "isVerified": true
  }
}
```

---

### 4. Find Compatible Roommates

**Endpoint:** `GET /api/v1/users/roommates`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
```
city=Pune
minBudget=10000
maxBudget=20000
gender=male
lifestyle=quiet
page=1
limit=20
```

**Response (200):**
```json
{
  "success": true,
  "message": "Compatible roommates found",
  "data": [
    {
      "user": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Jane Smith",
        "avatar": "/uploads/profiles/avatar_456.jpg",
        "age": 26,
        "occupation": "Designer",
        "lifestyle": "quiet",
        "minBudget": 12000,
        "maxBudget": 18000
      },
      "compatibilityScore": 85
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

**Compatibility Scoring:**
- Budget overlap: 30%
- Lifestyle match: 30%
- Gender preference: 25%
- Location match: 15%

---

### 5. Get Saved Listings

**Endpoint:** `GET /api/v1/users/me/saved`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Saved listings",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "1BHK near IT Park",
      "rent": 15000,
      "location": "Pune",
      "images": ["/uploads/listings/img1.jpg"]
    }
  ]
}
```

---

### 6. Save/Unsave Listing

**Endpoint:** 
```
POST /api/v1/users/me/saved/:listingId
DELETE /api/v1/users/me/saved/:listingId
```

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Listing saved",
  "data": {
    "saved": true,
    "listingId": "507f1f77bcf86cd799439012"
  }
}
```

---

## Listings

### 1. Create Listing

**Endpoint:** `POST /api/v1/listings`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (form-data):**
```
title: 1BHK near IT Park
description: Spacious room with attached bathroom
listingType: rent
roomType: 1bhk
rent: 15000
location: {"city":"Pune","area":"Hinjewadi","coordinates":{"lat":18.5912,"lng":73.7999}}
images: [file1, file2, file3]
amenities: ["WiFi","AC","Parking"]
preferences: {"gender":"any","smoking":false,"pets":false,"vegetarian":false}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Listing created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "1BHK near IT Park",
    "owner": "507f1f77bcf86cd799439011",
    "rent": 15000,
    "location": {
      "city": "Pune",
      "area": "Hinjewadi",
      "coordinates": {
        "type": "Point",
        "coordinates": [73.7999, 18.5912]
      }
    },
    "images": [
      "/uploads/listings/img1_507f.jpg",
      "/uploads/listings/img2_507f.jpg"
    ],
    "views": 0,
    "isVerified": false,
    "createdAt": "2026-05-16T10:30:00Z"
  }
}
```

**Validation:**
- Title: 5-100 characters
- Rent: Positive number
- Images: Max 10 per listing, 5MB each
- Valid location coordinates required

---

### 2. Get All Listings (with Filters)

**Endpoint:** `GET /api/v1/listings`

**Query Parameters:**
```
city=Pune
minRent=10000
maxRent=20000
roomType=1bhk
gender=any
smoking=false
pets=true
vegetarian=false
lat=18.5912
lng=73.7999
radius=10
search=hinjewadi
sort=newest
page=1
limit=12
```

**Response (200):**
```json
{
  "success": true,
  "message": "Listings fetched",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "1BHK near IT Park",
      "owner": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Owner Name"
      },
      "rent": 15000,
      "location": {
        "city": "Pune",
        "area": "Hinjewadi"
      },
      "images": ["/uploads/listings/img1_507f.jpg"],
      "roomType": "1bhk",
      "views": 45,
      "avgRating": 4.5,
      "matchScore": 87
    }
  ],
  "meta": {
    "total": 245,
    "page": 1,
    "limit": 12,
    "totalPages": 21
  }
}
```

**Sort Options:**
- `newest` - Recently created (default)
- `rent_asc` - Lowest rent first
- `rent_desc` - Highest rent first
- `match` - Best matching (if authenticated)

---

### 3. Get Listing Details

**Endpoint:** `GET /api/v1/listings/:listingId`

**Response (200):**
```json
{
  "success": true,
  "message": "Listing details",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "1BHK near IT Park",
    "description": "Spacious room with attached bathroom",
    "owner": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Owner Name",
      "phone": "+919876543210",
      "avatar": "/uploads/profiles/avatar_123.jpg",
      "rating": 4.5,
      "reviews": 8
    },
    "rent": 15000,
    "deposit": 30000,
    "location": {
      "city": "Pune",
      "area": "Hinjewadi",
      "address": "Street Name, Building No.",
      "coordinates": {
        "type": "Point",
        "coordinates": [73.7999, 18.5912]
      }
    },
    "roomType": "1bhk",
    "amenities": ["WiFi", "AC", "Parking", "Kitchen"],
    "preferences": {
      "gender": "any",
      "smoking": false,
      "pets": false,
      "vegetarian": false
    },
    "images": [
      "/uploads/listings/img1_507f.jpg",
      "/uploads/listings/img2_507f.jpg"
    ],
    "views": 45,
    "savedBy": 12,
    "avgRating": 4.5,
    "reviews": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "author": "Reviewer Name",
        "rating": 5,
        "comment": "Great place and friendly owner",
        "createdAt": "2026-04-20T15:30:00Z"
      }
    ],
    "createdAt": "2026-03-15T10:30:00Z",
    "lastUpdated": "2026-05-10T14:20:00Z"
  }
}
```

---

### 4. Update Listing

**Endpoint:** `PATCH /api/v1/listings/:listingId`

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as create, with optional fields

**Response (200):** Updated listing object

---

### 5. Delete Listing

**Endpoint:** `DELETE /api/v1/listings/:listingId`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Listing deleted"
}
```

---

### 6. Get My Listings

**Endpoint:** `GET /api/v1/listings/mine`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Your listings",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "1BHK near IT Park",
      "rent": 15000,
      "views": 45,
      "isVerified": false,
      "createdAt": "2026-03-15T10:30:00Z"
    }
  ]
}
```

---

### 7. Get Listing Analytics

**Endpoint:** `GET /api/v1/listings/:listingId/analytics`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Listing analytics",
  "data": {
    "listingId": "507f1f77bcf86cd799439012",
    "title": "1BHK near IT Park",
    "views": 45,
    "saves": 12,
    "visits": 3,
    "reviews": 2,
    "avgRating": 4.5,
    "createdAt": "2026-03-15T10:30:00Z",
    "lastViewed": "2026-05-16T14:20:00Z"
  }
}
```

---

### 8. Track Listing View

**Endpoint:** `POST /api/v1/listings/:listingId/view`

**Response (200):**
```json
{
  "success": true,
  "message": "View count updated",
  "data": {
    "views": 46
  }
}
```

---

## Messages

### 1. Send Message

**Endpoint:** `POST /api/v1/messages`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "toUserId": "507f1f77bcf86cd799439012",
  "content": "Hi, I'm interested in your listing"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Message sent",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "from": "507f1f77bcf86cd799439011",
    "to": "507f1f77bcf86cd799439012",
    "content": "Hi, I'm interested in your listing",
    "read": false,
    "createdAt": "2026-05-16T15:30:00Z"
  }
}
```

---

### 2. Get Inbox (Conversations)

**Endpoint:** `GET /api/v1/messages/inbox`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Inbox fetched",
  "data": [
    {
      "conversationId": "507f1f77bcf86cd799439014",
      "participant": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Jane Smith",
        "avatar": "/uploads/profiles/avatar_456.jpg"
      },
      "lastMessage": "Thanks for the info!",
      "lastMessageTime": "2026-05-16T14:20:00Z",
      "unreadCount": 2
    }
  ]
}
```

---

### 3. Get Conversation History

**Endpoint:** `GET /api/v1/messages/conversation/:userId`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
```
page=1
limit=50
```

**Response (200):**
```json
{
  "success": true,
  "message": "Conversation history",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "from": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "You"
      },
      "to": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Jane Smith"
      },
      "content": "Hi, is the room still available?",
      "read": true,
      "createdAt": "2026-05-16T10:30:00Z"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 50
  }
}
```

---

### 4. Get Unread Count

**Endpoint:** `GET /api/v1/messages/unread`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Unread count",
  "data": {
    "unreadCount": 5
  }
}
```

---

## Notifications

### 1. Get Notifications

**Endpoint:** `GET /api/v1/notifications`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
```
page=1
limit=20
read=false
type=NEW_MESSAGE
```

**Response (200):**
```json
{
  "success": true,
  "message": "Notifications fetched",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "type": "NEW_MESSAGE",
      "message": "Jane Smith sent you a message",
      "read": false,
      "relatedModel": "Message",
      "relatedId": "507f1f77bcf86cd799439014",
      "createdAt": "2026-05-16T15:30:00Z"
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3,
    "unreadCount": 5
  }
}
```

**Notification Types:**
- `LISTING_CREATED` - Your listing was created
- `NEW_MESSAGE` - New message received
- `VISIT_REQUEST` - Visit request received
- `VISIT_APPROVED` - Visit request approved
- `VISIT_DECLINED` - Visit request declined
- `REVIEW_LEFT` - New review on your listing
- `MATCH_FOUND` - Compatible roommate found
- `PROFILE_VIEWED` - Someone viewed your profile
- `LISTING_SAVED` - Someone saved your listing
- `LISTING_APPROVED` - Your listing was approved by admin
- `LISTING_REJECTED` - Your listing was rejected

---

### 2. Mark Notification as Read

**Endpoint:** `PATCH /api/v1/notifications/:notificationId/read`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": { ... }
}
```

---

### 3. Mark All as Read

**Endpoint:** `POST /api/v1/notifications/read-all`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": {
    "modifiedCount": 5
  }
}
```

---

### 4. Delete Notification

**Endpoint:** `DELETE /api/v1/notifications/:notificationId`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

---

### 5. Clear All Notifications

**Endpoint:** `DELETE /api/v1/notifications`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "All notifications cleared",
  "data": {
    "deletedCount": 12
  }
}
```

---

## Visit Requests

### 1. Create Visit Request

**Endpoint:** `POST /api/v1/visit-requests`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "listingId": "507f1f77bcf86cd799439012",
  "requestedDate": "2026-05-20",
  "requestedTime": "10:00-11:00",
  "visitorNote": "I'm very interested in this property"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Visit request created",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "listing": "507f1f77bcf86cd799439012",
    "fromUser": "507f1f77bcf86cd799439011",
    "toUser": "507f1f77bcf86cd799439010",
    "requestedDate": "2026-05-20",
    "requestedTime": "10:00-11:00",
    "status": "pending",
    "visitorNote": "I'm very interested in this property",
    "createdAt": "2026-05-16T15:30:00Z"
  }
}
```

---

### 2. Get Incoming Requests (Host)

**Endpoint:** `GET /api/v1/visit-requests/incoming`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
```
page=1
limit=20
status=pending
```

**Response (200):**
```json
{
  "success": true,
  "message": "Incoming visit requests fetched",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "listing": {
        "_id": "507f1f77bcf86cd799439012",
        "title": "1BHK near IT Park",
        "budget": 15000
      },
      "fromUser": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "profile": {
          "age": 28,
          "occupation": "Software Engineer"
        }
      },
      "requestedDate": "2026-05-20",
      "requestedTime": "10:00-11:00",
      "status": "pending",
      "visitorNote": "I'm very interested",
      "createdAt": "2026-05-16T15:30:00Z"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 20
  }
}
```

---

### 3. Get Sent Requests (Visitor)

**Endpoint:** `GET /api/v1/visit-requests/sent`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
```
page=1
limit=20
status=pending
```

**Response (200):** Similar to incoming requests

---

### 4. Confirm Visit Request (Host)

**Endpoint:** `POST /api/v1/visit-requests/:requestId/confirm`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Visit request confirmed",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "status": "confirmed",
    "respondedAt": "2026-05-17T10:00:00Z"
  }
}
```

---

### 5. Decline Visit Request (Host)

**Endpoint:** `POST /api/v1/visit-requests/:requestId/decline`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "hostNote": "Property is on hold"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Visit request declined",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "status": "declined",
    "hostNote": "Property is on hold",
    "respondedAt": "2026-05-17T10:00:00Z"
  }
}
```

---

### 6. Complete Visit Request

**Endpoint:** `POST /api/v1/visit-requests/:requestId/complete`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "visitorRating": 4,
  "visitorReview": "Great property, friendly owner"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Visit request marked as completed",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "status": "completed",
    "visitorRating": 4,
    "visitorReview": "Great property, friendly owner",
    "completedAt": "2026-05-20T12:00:00Z"
  }
}
```

---

### 7. Cancel Visit Request (Visitor)

**Endpoint:** `POST /api/v1/visit-requests/:requestId/cancel`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Visit request cancelled",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "status": "cancelled",
    "cancelledAt": "2026-05-17T10:00:00Z"
  }
}
```

---

## Admin

All admin endpoints require `Authorization: Bearer <token>` header and `admin` role.

### 1. Get Dashboard Stats

**Endpoint:** `GET /api/v1/admin/stats`

**Response (200):**
```json
{
  "success": true,
  "message": "Dashboard statistics fetched",
  "data": {
    "totalUsers": 1245,
    "totalListings": 3420,
    "totalReviews": 892,
    "totalVisitRequests": 5123,
    "avgRating": "4.23"
  }
}
```

---

### 2. Get All Users

**Endpoint:** `GET /api/v1/admin/users`

**Query Parameters:**
```
page=1
limit=20
role=seeker
isVerified=true
search=john
```

**Response (200):**
```json
{
  "success": true,
  "message": "Users fetched",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "seeker",
      "isVerified": true,
      "isBanned": false,
      "createdAt": "2026-03-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 245,
    "page": 1,
    "limit": 20,
    "totalPages": 13
  }
}
```

---

### 3. Ban User

**Endpoint:** `POST /api/v1/admin/users/:userId/ban`

**Request Body:**
```json
{
  "reason": "Inappropriate behavior towards other users"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User banned successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "isBanned": true,
    "banReason": "Inappropriate behavior towards other users"
  }
}
```

---

### 4. Approve Listing

**Endpoint:** `POST /api/v1/admin/listings/:listingId/approve`

**Response (200):**
```json
{
  "success": true,
  "message": "Listing approved",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "isVerified": true
  }
}
```

---

### 5. Reject Listing

**Endpoint:** `POST /api/v1/admin/listings/:listingId/reject`

**Request Body:**
```json
{
  "reason": "Photos are unclear, please reupload"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Listing rejected",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "isVerified": false,
    "rejectionReason": "Photos are unclear, please reupload"
  }
}
```

---

## Error Handling

### Error Response Format

All errors return standardized response:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "status": "fail"
}
```

### Common Error Codes

| Code | Scenario | Message |
|------|----------|---------|
| 400 | Bad Request | Missing or invalid fields |
| 401 | Unauthorized | Token missing, invalid, or expired |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry (email, username, etc.) |
| 422 | Validation Error | Input validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

### Rate Limiting

- **General endpoints:** 100 requests per 15 minutes
- **Auth endpoints:** 5 requests per 15 minutes
- **Admin endpoints:** 50 requests per 15 minutes

When rate limited, response includes:
```json
{
  "statusCode": 429,
  "message": "Too many requests, please try again later"
}
```

---

## WebSocket Events (Socket.io)

### Connection

```javascript
const socket = io('http://localhost:5000', {
  auth: {
    userId: user._id
  },
  transports: ['websocket', 'polling']
});
```

### Server Events (Listen)

```javascript
// User online/offline
socket.on('user_online', ({ userId, timestamp }) => { });
socket.on('user_offline', ({ userId, timestamp }) => { });

// Messages
socket.on('receive_message', ({ from, to, content, createdAt }) => { });

// Typing indicators
socket.on('user_typing', ({ userId }) => { });
socket.on('user_stop_typing', ({ userId }) => { });
```

### Client Events (Emit)

```javascript
// Join chat with another user
socket.emit('join_chat', otherUserId);

// Send message
socket.emit('send_message', {
  toUserId: otherUserId,
  content: 'Hello!'
});

// Typing
socket.emit('typing', otherUserId);
socket.emit('stop_typing', otherUserId);
```

---

## Example: Complete Workflow

### 1. Register & Login
```bash
POST /api/v1/auth/register
→ Receive access token + refresh token

POST /api/v1/auth/login
→ Receive access token
```

### 2. Search Listings
```bash
GET /api/v1/listings?city=Pune&minRent=10000&maxRent=20000
→ Browse available listings
```

### 3. View Details & Save
```bash
GET /api/v1/listings/:id
→ View listing details

POST /api/v1/users/me/saved/:listingId
→ Save listing for later
```

### 4. Create Visit Request
```bash
POST /api/v1/visit-requests
→ Request visit appointment

Host receives notification → Confirms/Declines
```

### 5. Message & Chat
```javascript
// Connect to Socket.io
const socket = io(...);
socket.emit('join_chat', hostUserId);

// Send message
socket.emit('send_message', {
  toUserId: hostUserId,
  content: "Interested in viewing tomorrow?"
});

socket.on('receive_message', (msg) => {
  // Display message in UI
});
```

### 6. Complete Visit & Review
```bash
POST /api/v1/visit-requests/:id/complete
→ Mark visit as complete

POST /api/v1/reviews
→ Leave rating & review
```

---

## Support

For issues or feature requests, please contact support@nestmate.com
