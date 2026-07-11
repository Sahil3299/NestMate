# FlatMate App — Dev Prompts

Two ways to use this doc:

- **Option A (below):** one big combined prompt — backend like flatmate.in + all the frontend fixes in a single paste. Best if your AI coding tool can handle a large multi-part task in one go (Claude Code, Cursor Agent, etc.).
- **Option B (further down):** the same work split into 4 smaller prompts, run one at a time. Better if your tool tends to lose track on long tasks, or you want to review/commit after each piece.

Paste whichever you pick into your AI coding tool while it's pointed at your actual project folder.

---

## Option A — Combined Prompt (Backend like flatmate.in + Frontend Fixes)

```
You are working in my existing FlatMate web app codebase — a flat/roommate-finding
platform similar to flatmate.in (broker-free listings, in-app chat, compatibility
matching between users). Before making any changes, inspect the current project
structure, frontend framework, and backend/API layer, and follow the conventions
already used in the code. Work through the parts below in order (A, then B, C, D, E),
and tell me what you found/changed after each part before moving to the next.

====================================================================
PART A — BACKEND: Core data model & API (flatmate.in-style)
====================================================================
Design or extend the backend around these entities (adapt to whatever DB is already
in use — SQL or NoSQL, keep it consistent with the existing schema style):

1. User
   - Fields: id, first_name, last_name, email, phone (hidden from other users by
     default), gender, profile_photo, city, bio/preferences (budget range, move-in
     date, lifestyle tags), is_verified, created_at.
   - Auth: signup/login, session/JWT (or whatever the app already uses), and
     authorization so only the owning user can edit their own profile.

2. Listing (a room / flat / "looking for a flatmate" post)
   - Fields: id, owner_id, type (room / flat / roommate-wanted), city, locality, rent,
     deposit, amenities[], photos[], description, gender_preference, available_from,
     is_brokerage_free (always true), status (active/inactive), created_at.
   - Endpoints: create, edit, delete (owner-only), get by id, and a search/list
     endpoint with filters — city, budget range, gender preference, locality, keyword.

3. Compatibility Match
   - A 0-100% score between the logged-in user and a listing/user, computed from
     overlapping preference fields (budget range, lifestyle tags, gender preference,
     city). Include this score in listing/search responses so cards can show "X% match."

4. Conversation & Message (chat)
   - Conversation: id, participant_ids[], related_listing_id (optional), created_at,
     last_message_at.
   - Message: id, conversation_id, sender_id, text, sent_at, read_at.
   - Endpoints: start/get a conversation between two users, list a user's
     conversations sorted by last_message_at, get paginated messages in a
     conversation, send a message.
   - Real-time: use websockets/socket.io if the stack already supports it; otherwise
     short-interval polling is fine — match whatever fits the existing codebase.

5. Privacy
   - Contact number stays hidden from other users by default; only revealed if the
     owner explicitly shares it, or after both sides opt in via chat.

====================================================================
PART B — FIX: Profile page (frontend + backend) must actually save
====================================================================
FRONTEND:
1. On load, fetch the logged-in user's profile and pre-fill First Name, Last Name,
   Contact Number, Gender.
2. Validate client-side: names required/letters only (2-50 chars); contact number
   required, valid 10-digit Indian mobile; gender required. Show inline errors.
3. On "Save Changes": disable the button + show a loading state while saving; on
   success show a "Profile updated successfully" toast and reflect the new values;
   on failure show a clear error message and re-enable the button.
4. Keep the current visual design (pill inputs, green toggle, green button) — logic
   only here, styling comes in Part E.

BACKEND:
1. PUT/PATCH endpoint (e.g. /api/users/:id/profile) using the User model from Part A:
   authenticate, validate server-side (never trust the frontend alone), update the
   record, return the updated profile + 200, or a clear 4xx error.
2. GET endpoint to fetch the current user's profile for pre-filling.
3. Handle: duplicate contact number, user not found, expired session.

Acceptance: refreshing after save shows the updated values (proves persistence);
bad input rejected both client- and server-side; errors are surfaced, not swallowed.

====================================================================
PART C — FIX: Chat icon does nothing when clicked
====================================================================
1. Find the chat button's click handler and trace what it should do (open a
   modal/drawer, navigate, etc.).
2. Check console/network on click for the usual culprits: chat component not
   actually mounted; a required prop/context (user, conversation id) missing so it
   silently bails; drawer rendered but hidden by z-index/overflow on a parent;
   failed API/socket call with no visible error; stale ref in the handler.
3. Fix the root cause so the icon reliably opens the chat UI — conversation list, or
   a specific conversation if opened from a listing/profile — using the
   Conversation/Message endpoints from Part A.
4. Add a visible error state ("Couldn't load chat, please try again") for when
   loading fails, instead of doing nothing.
5. Test across pages and after a full refresh.

====================================================================
PART D — Floating chat button, fixed bottom-right, on every page
====================================================================
1. Circular green button, position: fixed, bottom-right (~20-24px offset), high
   z-index, visible on scroll, present on every logged-in page.
2. Click opens a slide-in panel/drawer (not a blocking modal, not full navigation)
   showing the conversation list (name/photo/last message, most recent first) and,
   on selecting one, the message thread with send/receive — reuse the Part A/C chat
   system, don't build a second parallel one.
3. Unread-message badge (count or dot) on the button.
4. Closes on re-click or clicking outside.
5. Responsive: full width/height panel on mobile.

Acceptance: button present on every page after login; opens real conversation data
(not mock data); sent messages persist and the other user actually receives them.

====================================================================
PART E — Restyle UI to match flatmate.in
====================================================================
Direction: clean, minimal, card-based, lots of white space. Green accent (matches
the existing "Flat" + green "Mate" logo and Male/Female toggle) on white/light-gray,
used for CTAs and active states. Rounded pill buttons/inputs site-wide, consistent
with the current Profile page. Sticky top navbar (logo left, search/Add
Listing/profile menu right). Listing cards: photo, rent, location, short
description, "100% Brokerage-Free" badge, responsive grid. Prominent search/filter
bar (city, budget, gender preference) on listing pages. Trust elements: brokerage-
free messaging, verified badges, compatibility-match % on cards (from Part A).

Task: apply this consistently across [list your key pages: Home, Listings, Listing
Detail, Profile, My Team]. Extract shared styles (colors, spacing, radius, button
styles) into a theme file/CSS variables/Tailwind config rather than hardcoding per
page. This is a visual/CSS pass — don't break the functionality from Parts A-D.

Note: this direction is based on flatmate.in's publicly described features and
common patterns for this type of app, not a pixel-perfect screenshot match — attach
screenshots of specific flatmate.in pages if you want that level of fidelity.
```

---

## Option B — Same work, split into 4 separate prompts

Run in this order: **fix chat → profile save → floating button → restyle.**

### B1 — Fix: Chat Doesn't Open When Clicked
```
You are working in my existing FlatMate web app codebase. The chat icon/button
currently does nothing (or fails silently) when clicked — the chat system doesn't open.

1. Find the chat button's click handler and trace what it's supposed to do.
2. Check the browser console and network tab when clicking it. Common root causes:
   the chat component isn't actually mounted in the DOM; a required prop/context
   (logged-in user, conversation ID) is missing so it bails out silently; the
   modal/drawer renders but is hidden behind other elements (z-index or
   overflow:hidden on a parent); a websocket/API call fails silently; a stale ref
   in the click handler.
3. Fix the root cause so clicking the icon reliably opens the chat interface.
4. Add error handling: if chat fails to load, show "Couldn't load chat, please try
   again" instead of doing nothing.
5. Test from multiple pages and after a full page refresh.

Report back what the root cause was and what you changed.
```

### B2 — Profile Page: Frontend + Backend That Actually Saves
```
You are working in my existing FlatMate web app codebase. Make the "Your Profile"
page (First Name, Last Name, Contact Number, Gender, "Save Changes") fully
functional end-to-end.

FRONTEND: pre-fill from the backend on load; validate names/contact
number/gender client-side with inline errors; on Save, show a loading state, call
the update endpoint, show a success toast and updated values on success, or a clear
error message and a re-enabled button on failure. Keep the current visual design.

BACKEND: an authenticated update endpoint that re-validates server-side, updates
the DB, and returns the updated profile or a clear 4xx error; a GET endpoint to
fetch the profile for pre-filling; handle duplicate contact number / not
found / expired session.

Acceptance: refreshing after save shows the updated values; bad input rejected on
both ends; errors are shown, not swallowed.
```

### B3 — Fixed Floating Chat Button (Bottom-Right)
```
You are working in my existing FlatMate web app codebase. Add a floating chat
button fixed to the bottom-right corner on every page, like a support/chat widget,
for 1-on-1 chat with any user.

1. Circular green button, fixed bottom-right (~20-24px offset), high z-index,
   visible on scroll, present on all logged-in pages.
2. Click opens a slide-in panel with a conversation list (name/photo/last message)
   and, on selecting one, real-time (or polling) send/receive — reuse the existing
   chat system, don't build a second one.
3. Unread badge on the button.
4. Closes on re-click or clicking outside; not a blocking full-screen modal.
5. Responsive on mobile.

Acceptance: visible on every page; real conversation data, not mock; sent messages
persist and the other user receives them.
```

### B4 — Restyle UI to Match flatmate.in
```
You are working in my existing FlatMate web app codebase. Restyle the UI to match
the flatmate.in look and feel, keeping the current "Flat" (dark) + "Mate" (green)
branding.

Direction: clean, minimal, card-based, generous white space; green accent for CTAs
and active states on white/light-gray; rounded pill buttons/inputs site-wide; sticky
top navbar (logo left, actions right); listing cards with photo/rent/location/
description/"100% Brokerage-Free" badge in a responsive grid; prominent search/
filter bar (city, budget, gender preference); trust elements (verified badges,
compatibility-match %).

Task: apply consistently across [list key pages]. Extract shared styles into a
theme file/CSS variables/Tailwind config instead of hardcoding per page. Visual
pass only — don't break existing functionality.

Note: based on flatmate.in's general/public patterns, not a pixel-perfect
screenshot match — attach specific page screenshots for that level of fidelity.
```
