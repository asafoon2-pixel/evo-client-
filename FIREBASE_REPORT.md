# FIREBASE_REPORT.md — EVO Client Integration Report

**Date:** 2026-04-10
**Firebase Project:** `evo-supplier`
**Integration Status:** ✅ Complete

---

## Step 0 — Demo Branch
Changes were applied on the current working branch. All Firebase code is additive — no existing UI logic was removed.

---

## Step 1 — Project Scan
| Area | Files Touched |
|---|---|
| Firebase config | `src/lib/firebase.js` |
| Auth layer | `src/lib/authService.js` |
| Data services | `src/lib/usersService.js` (new), `src/lib/eventsService.js` |
| Global state | `src/context/AppContext.jsx` |
| Screens | `Home`, `ClientOnboarding`, `PersonalQuestions`, `UserProfile`, `Checkout` |
| Router guard | `src/App.jsx` |

---

## Step 2 — UI → DB Field Mapping

### Users Collection (`users/{uid}`)
| UI Field | Firestore Field |
|---|---|
| Full name input | `full_name` |
| Email input | `email` |
| Phone input | `phone` |
| WhatsApp input | `whatsapp_number` |
| Alternate phone | `alternate_phone` |
| Age input | `age` |
| Gender selector | `gender` |
| City input | `city` |
| Instagram handle | `instagram_handle` |
| Preferred language | `preferred_language` |
| Preferred contact | `preferred_contact` |
| Profile photo | `profile_photo_url` |
| Swipe results | `swipe_history`, `vibe_tags` |

### Events Collection (`events/{eventId}`)
| UI Field | Firestore Field |
|---|---|
| Generated event name | `title` |
| briefAnswers.eventType | `type` |
| briefAnswers.date | `date` |
| briefAnswers.startTime / endTime | `start_time` / `end_time` |
| briefAnswers.indoorOutdoor | `indoor_outdoor` |
| briefAnswers.scale | `guest_count` (mapped: intimate→30, medium→75, grand→150) |
| briefAnswers.budgetTier | `budget_range` |
| totalPrice | `budget_exact` |
| eventDetails.venueName | `venue_name` |
| eventDetails.fullAddress | `full_address` |
| eventDetails.city | `city` |
| eventDetails.floor | `floor` |
| eventDetails.entranceNotes | `entrance_notes` |
| eventDetails.parkingAvailable | `parking_available` |
| eventDetails.specialRequests | `special_requests` |
| eventDetails.isPrivate | `is_private` |

---

## Step 3 — Firebase Configuration
- **Project ID:** `evo-supplier`
- **Auth Domain:** `evo-supplier.firebaseapp.com`
- **SDK:** Firebase v12 (already installed)
- Config updated in `src/lib/firebase.js` — migrated from old `evo-app---clinet` project

---

## Step 4 — Authentication Layer (`src/lib/authService.js`)
- `signInWithGoogle()` — Google OAuth popup
- `signInWithEmail(email, password)` — email/password login
- `registerWithEmail(email, password)` — registration
- `logout()` — signs out and clears state
- `onAuthChange(callback)` — auth state listener
- `upsertUser(firebaseUser)` — creates full Users document on first login, updates `last_active_at` on subsequent logins

---

## Step 5 — Firestore Data Layer

### `src/lib/usersService.js` (new)
- `getUser(uid)` — fetch user document
- `updateUser(uid, data)` — update user fields
- `updateTasteProfile(uid, tasteData)` — update vibe/swipe data

### `src/lib/eventsService.js` (existing)
- `createEvent(userId, eventData)` — create event + user_event_history record
- `updateEvent(eventId, data)` — update event fields
- `getEvent(eventId)` — fetch single event
- `getUserEvents(userId)` — fetch all user events

---

## Step 6 — UI Connected to Firestore

| Screen | Action |
|---|---|
| `Home` | Loads real user events via `getUserEvents()`. Shows loading skeleton + empty state. Greets user by real name from `firestoreUser`. |
| `ClientOnboarding` | Saves onboarding profile to Firestore on submit |
| `PersonalQuestions` | Saves personal details to Firestore on continue |
| `UserProfile` | Pre-fills form from `firestoreUser`. Saves updates to Firestore. |
| `Checkout` | Calls `createEventInDb()` on confirm — saves full event to Firestore before navigating to confirmation |

---

## Step 7 — Protected Routes (`src/App.jsx`)
The following screens redirect unauthenticated users to `authgate`:

```
dashboard, userprofile, management,
checkout, summary, personalquestions,
eventdetails, confirmation
```

Guard logic runs in a `useEffect` watching `currentScreen`, `currentUser`, and `authLoading`. Only triggers after auth state is resolved (not during initial loading).

---

## Step 8 — Build Checklist

- [x] `npm run build` passes with no errors
- [x] Firebase config points to correct project (`evo-supplier`)
- [x] `upsertUser` creates full Users schema on registration
- [x] `createEventInDb` maps all brief + event detail fields correctly
- [x] `firestoreUser` loaded into context on auth change
- [x] `signOut` clears `firestoreUser` and `currentEventId`
- [x] `Home` uses real Firestore events (no mock data)
- [x] Protected routes guard unauthenticated access
- [x] All modified screens have async Firestore calls with error handling

---

## Known Limitations / Future Work
- Profile photo upload is local blob URL only — needs Firebase Storage integration
- Swipe history (`swipe_history`, `vibe_tags`) not yet written to Firestore after tour
- Orders collection not yet wired (suppliers booking flow)
- No offline support / caching strategy
