# 🏠 Nestmate — Roommate Matching & Room Listing Platform

Nestmate is a full-stack web application that helps users find compatible roommates and discover available rooms based on preferences like budget, location, and lifestyle.

It combines **roommate matching + room listing + chat system** into a single platform, making it easier to find the right living situation.

---

# 🚀 Features

## 🔐 Authentication

* Secure login/signup using Firebase Authentication
* Google login support
* Persistent user sessions

---

## 👤 User Profile System

* Create and update profile
* Upload profile image or choose avatar
* Store preferences:

  * Budget
  * City
  * Sleep schedule
  * Lifestyle habits (smoking, drinking, pets)
* View other users' profiles

---

## 🧠 Roommate Matching

* Smart matching based on:

  * Budget overlap
  * Same city
  * Lifestyle compatibility
* Displays best matches with compatibility score

---

## 🏠 Room Listing System

* Post available rooms/flats
* Upload multiple images
* Add:

  * Rent
  * Location
  * Occupancy
  * Amenities
* Browse and filter room listings

---

## 💬 Chat System

* One-to-one messaging between users
* Message history stored in database
* REST-based communication (extendable to real-time)

---

## 🔍 Search & Filters

* Filter by:

  * City
  * Budget
  * Preferences
* Find both roommates and rooms

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Tailwind CSS

## Backend

* Node.js
* Express.js

## Database

* MongoDB

## Authentication

* Firebase Authentication

## File Upload

* Multer (local storage)

---

# 🧱 Project Structure

## Frontend

```
src/
 ├── components/
 ├── pages/
 │    ├── Login.jsx
 │    ├── Dashboard.jsx
 │    ├── Profile.jsx
 │    ├── Matches.jsx
 │    ├── Rooms.jsx
 │    ├── PostRoom.jsx
 │    └── Chat.jsx
 ├── firebase.js
 └── App.jsx
```

---

## Backend

```
server/
 ├── models/
 │    ├── User.js
 │    ├── Room.js
 │    └── Message.js
 ├── routes/
 ├── controllers/
 ├── middleware/
 └── server.js
```

---

# 🔄 Application Flow

## 1. User Authentication

* User logs in via Firebase
* Unique UID is generated

## 2. Profile Setup

* User creates profile with preferences
* Profile stored in MongoDB

## 3. Matching System

* Backend compares users
* Returns best matches

## 4. Room Listings

* Users can post rooms
* Other users can browse listings

## 5. Chat

* Users can connect and communicate

---

# 📸 Image Upload

* Profile images and room images are uploaded using Multer
* Stored locally in `/uploads` folder
* Served via Express static middleware

---

# ⚠️ Limitations

* Images stored locally (not cloud-based)
* No real-time chat (REST only)
* Matching logic is basic (rule-based)

---

# 🚀 Future Improvements

* Real-time chat using WebSockets (Socket.IO)
* Cloud storage (AWS S3 / Cloudinary)
* AI-based roommate recommendations
* Map-based room discovery
* User verification system

---

# 🧠 Key Concepts Used

* REST API
* Authentication & Authorization
* File Upload Handling
* Matching Algorithm
* Component-Based UI Design

---

# ⚙️ Installation & Setup

## 1. Clone Repository

```
git clone https://github.com/your-username/nestmate.git
cd nestmate
```

## 2. Install Dependencies

```
npm install
```

## 3. Run Frontend

```
npm run dev
```

## 4. Run Backend

```
cd server
npm install
npm start
```

---

# 📌 Conclusion

Nestmate is a scalable and modular platform that demonstrates how modern web applications can combine **user matching, listings, and communication systems** into a unified solution.

---

# 👨‍💻 Author

Sahil
B.Tech Student | Aspiring Full Stack Developer

