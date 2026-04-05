# 🔧 Integration Guide - How to Wire Up New Features

## Add New Routes to App.jsx

Update `frontend/src/App.jsx` to include the new pages:

```jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Existing pages
import LoginPage from "./pages/LoginPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import MatchesPage from "./pages/MatchesPage";
import ChatPage from "./pages/ChatPage";
import ProfileViewPage from "./pages/ProfileViewPage";
import ProfileDetailPage from "./pages/ProfileDetailPage";
import RoommateDetailPage from "./pages/RoommateDetailPage";

// NEW pages
import CreateListingPage from "./pages/CreateListingPage";
import ListingsPage from "./pages/ListingsPage";
import RoomDetailPage from "./pages/RoomDetailPage";

import Header from "./components/Header";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfileSetupPage />} />
          <Route path="/profile/:uid" element={<ProfileViewPage />} />
          <Route path="/profile-detail/:uid" element={<ProfileDetailPage />} />
          
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/roommate/:uid" element={<RoommateDetailPage />} />
          <Route path="/chat/:uid" element={<ChatPage />} />
          
          {/* NEW ROUTES */}
          <Route path="/create-listing" element={<CreateListingPage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/listings/:id" element={<RoomDetailPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/matches" />} />
      </Routes>
    </Router>
  );
}
```

## Update Header Navigation

Add navigation links in `frontend/src/components/Header.jsx`:

```jsx
// Add these links to your navigation menu:
<Link to="/listings" className="text-gray-600 hover:text-gray-900">
  Browse Rooms
</Link>

<Link to="/create-listing" className="text-gray-600 hover:text-gray-900">
  Post Room
</Link>
```

## Update MatchesPage to Show Rooms Tab

The MatchesPage should have a tab switcher between **Roommates** and **Rooms**:

```jsx
// In MatchesPage.jsx, add a second tab that shows listings instead:
const [activeTab, setActiveTab] = useState("roommates"); // or "rooms"

// Then conditionally render:
{activeTab === "roommates" && <RoommateCarousel {...props} />}
{activeTab === "rooms" && <RoomBrowser />}
```

## How to Initialize Socket.io on App Load

Update your `App.jsx` or a new `useSocket` hook:

```jsx
import { useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { initSocket } from "./lib/socket";

// In App.jsx useEffect:
useEffect(() => {
  const { user } = useAuth();
  if (user) {
    initSocket(user.uid);
  }
}, [user]);
```

## Database Indexes to Create

The models already have indexes defined. After deployment, verify MongoDB has created:

```javascript
// RoomListing indexes:
- location.coordinates (2dsphere) - for geospatial queries
- location.city - for city filtering
- rent - for price sorting
- postedBy - for user's listings query
- isActive, createdAt - for listing discovery

// Review indexes:
- reviewerId + targetId + targetType (unique) - prevents duplicates
- targetId, targetType - for finding reviews
```

## Test Socket.io Connection

Add this to your browser console to test:

```javascript
// Check if socket is working:
const { getSocket } = await import('/src/lib/socket.js');
const socket = getSocket();
console.log('Socket connected:', socket.connected);
console.log('Socket ID:', socket.id);
```

## Environment Variables Needed

Ensure these are set in your `.env` files:

**Backend (`backend/.env`):**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nestmate
JWT_SECRET=your_jwt_secret_key
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

**Frontend (`frontend/.env.local`):**
```
VITE_API_BASE_URL=http://localhost:5000
```

## Common Integration Issues & Solutions

### Issue: Socket.io connection fails
**Solution:** Ensure backend is running with `npm run dev` and Socket.io is initialized in index.js

### Issue: Images don't upload
**Solution:** Ensure backend has `/uploads` directory writable
```bash
mkdir -p backend/src/uploads
```

### Issue: Reviews not showing
**Solution:** Verify MongoDB Review model indexes are created:
```javascript
db.reviews.createIndex({ reviewerId: 1, targetId: 1, targetType: 1 }, { unique: true })
```

### Issue: Geospatial search returns empty
**Solution:** Ensure coordinates are in [longitude, latitude] format (not latitude, longitude)

## Migration from Old Chat to New Socket.io Chat

The new ChatPage maintains backward compatibility:
1. Loads existing messages from REST API
2. Real-time updates via Socket.io
3. Both REST and Socket messages are saved to DB

No data migration needed!

## Performance Optimizations Already Implemented

✅ Debounced search (0.5s delay)
✅ Lazy loading with pagination
✅ Indexed database queries
✅ Geospatial indexing for location queries
✅ Socket.io room scoping (prevents broadcast storms)
✅ Error boundaries and graceful fallbacks

## Next: Extend the System

### Add to Favorites
```jsx
// In RoomCard, add:
const [favorites, setFavorites] = useLocalStorage('favorites', []);
const toggleFavorite = (id) => {
  setFavorites(prev => 
    prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
  );
};
```

### Add Messaging to RoomDetail
```jsx
// In RoomDetailPage, add:
<Button onClick={() => navigate(`/chat/${listing.postedBy}`)}>
  Message Landlord
</Button>
```

### Show User Reviews on Profile
```jsx
// In ProfileViewPage, add:
const { data: reviews } = await reviewAPI.getForTarget("user", uid);
// Display with ReviewCard component
```

---

**You're all set! 🚀 All four phases are now ready for integration.**
