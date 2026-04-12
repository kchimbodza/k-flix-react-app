---
name: k-flix
description: "Use this skill to build, reproduce, extend, or maintain K-Flix — a Netflix-style movie discovery and watchlist management web application. Use when asked to: build a K-Flix page or component, reproduce the K-Flix app from scratch, add a feature to K-Flix, debug K-Flix code, or generate any code that follows the K-Flix design system and architecture. Covers React 19, Vite, Tailwind CSS v4, React Router v7, Context API, Axios, TMDB API, and JSON Server. Do NOT use for unrelated React projects or generic movie app templates."
author: Kudzayi Chimbodza
project: K-Flix
version: "2.0"
---

# K-Flix — Full Skill Reference & Reproduction Guide

K-Flix is a Netflix-style movie discovery and watchlist management web application. It uses The Movie Database (TMDB) API for live movie data and JSON Server as a local backend for user accounts, favourites, and watchlists. The app implements all features up to and including A-grade tier on a React course rubric.

This document is the single source of truth for reproducing, extending, or maintaining K-Flix. Read it fully before writing any code.

---

## 1. Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React (Functional only) | 19 | UI framework — no class components permitted |
| Vite | 8+ | Build tool and dev server |
| React Router | v7 | Client-side routing and protected routes |
| Tailwind CSS | v4 | Utility-first styling |
| Axios | 1.x | HTTP requests to TMDB and JSON Server |
| JSON Server | 1.x (beta) | Local REST backend on port 3001 |
| TMDB API | v3 | Movie data, images, search, discover |

### npm Scripts
```json
{
  "start": "vite",
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "server": "json-server --watch db.json --port 3001"
}
```

### Running the App — Two Terminals Required
| Terminal | Command | Result |
|---|---|---|
| 1 | `npm run server` | JSON Server on http://localhost:3001 |
| 2 | `npm start` | React app on http://localhost:5173 |

---

## 2. Environment Variables

Create `.env` in the project root. **Never commit this file — it is gitignored.**

```
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_URL=https://image.tmdb.org/t/p/w500
```

Access pattern in all files:
```js
const API_KEY    = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL   = import.meta.env.VITE_TMDB_BASE_URL
const IMAGE_URL  = import.meta.env.VITE_TMDB_IMAGE_URL
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original'
```

---

## 3. Folder Structure

```
k-flix/
├── public/
├── src/
│   ├── components/          # Reusable UI — one file per component
│   │   ├── Navbar.jsx       # Scroll-aware, responsive, hamburger on mobile
│   │   ├── MovieCard.jsx    # Poster, title, rating, year + heart overlay
│   │   ├── ProtectedRoute.jsx  # Redirects unauthenticated users to /login
│   │   └── Footer.jsx       # Dark footer, TMDB attribution, copyright
│   ├── context/             # Global state — Context API only
│   │   ├── AuthContext.jsx  # user, login(), logout() — persisted to localStorage
│   │   └── FavouritesContext.jsx # favourites, add, remove, isFavourite
│   ├── pages/               # One file per route
│   │   ├── Home.jsx         # Cinematic hero + trending row
│   │   ├── Search.jsx       # Keyword search with pagination
│   │   ├── MovieDetails.jsx # Full detail layout, similar movies, share
│   │   ├── Login.jsx        # Email + password form
│   │   ├── Register.jsx     # Name + email + password + validation
│   │   ├── Profile.jsx      # User info, favourites, watchlist links
│   │   ├── Favourites.jsx   # DB-backed favourite movies grid
│   │   ├── AdvancedSearch.jsx # Genre, year, rating, language filters
│   │   ├── Watchlists.jsx   # List + create named watchlists
│   │   └── WatchlistDetail.jsx # Movies in a watchlist, remove controls
│   ├── services/            # All API logic — never inline in components
│   │   ├── tmdb.js          # All TMDB API calls
│   │   └── api.js           # All JSON Server API calls
│   ├── App.jsx              # Router setup and route declarations
│   ├── main.jsx             # Entry point — wraps App in context providers
│   └── index.css            # Tailwind v4 import + custom scrollbar
├── db.json                  # JSON Server data file
├── .env                     # API keys (gitignored)
├── .gitignore
├── vite.config.js
└── README.md
```

---

## 4. Routes & Access Control

| Route | Page | Access Level |
|---|---|---|
| `/` | Home | All users |
| `/search` | Search | All users |
| `/movies/:id` | MovieDetails | All users |
| `/login` | Login | Unauthenticated only |
| `/register` | Register | Unauthenticated only |
| `/profile` | Profile | Authenticated only |
| `/favorites` | Favourites | Authenticated only |
| `/advanced-search` | AdvancedSearch | Authenticated only |
| `/watchlists` | Watchlists | Authenticated only |
| `/watchlists/:id` | WatchlistDetail | Authenticated only |

`<ProtectedRoute>` wraps authenticated pages. It reads `user` from `AuthContext` — if null, redirects to `/login`.

---

## 5. Design System

### 5.1 Color Palette
```
Page Background:    bg-gray-950  (#030712)
Card/Surface:       bg-white/5   (glassmorphism — dark translucent)
Card Border:        border-white/10
Brand / Accent:     orange-500   (#f97316)
Hover Accent:       orange-400 (lighter) / orange-600 (darker)
Text Primary:       white
Text Secondary:     text-gray-400
Text Muted:         text-gray-500
Rating — High ≥7:   green-400
Rating — Mid 5–7:   yellow-400
Rating — Low <5:    red-400
```

### 5.2 Typography
```
Primary font:       DM Sans (sans-serif)
Display / Hero:     Playfair Display (serif) — used for movie titles
Fallback chain:     'DM Sans', 'Segoe UI', system-ui, sans-serif
Eyebrow labels:     text-orange-500 text-sm font-semibold uppercase tracking-widest
```
Eyebrow labels appear above section headers (e.g. "WATCHLIST", "LIBRARY", "TRENDING").

### 5.3 Spacing & Layout
```
Desktop page padding:   px-16 py-12
Mobile page padding:    px-6
Section gap:            space-y-12 or gap-8
Standard grid:          grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4
Watchlist/Profile grid: grid grid-cols-1 sm:grid-cols-2 gap-4
```

### 5.4 Card Pattern (Glassmorphism)
All cards use:
```
bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm
```

### 5.5 Button Styles
```jsx
{/* Primary CTA */}
<button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors">

{/* Secondary / Ghost */}
<button className="border border-white/20 hover:bg-white/10 text-white font-semibold px-6 py-2 rounded-lg transition-colors">

{/* Danger */}
<button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">

{/* Icon button */}
<button className="p-2 rounded-full hover:bg-white/10 transition-colors">
```

### 5.6 Input Styles
```jsx
<input className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors" />
```

### 5.7 Custom Scrollbar (index.css)
```css
@import "tailwindcss";

::-webkit-scrollbar        { height: 6px; width: 6px; }
::-webkit-scrollbar-track  { background: rgba(255,255,255,0.05); }
::-webkit-scrollbar-thumb  { background: #f97316; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #ea580c; }
```

---

## 6. Navbar — Feature Specification

**Behaviour:**
- Transparent at top of page
- Transitions to `bg-gray-900/95 backdrop-blur-md` on scroll (via `useEffect` + `window.scrollY`)
- Sticky, `z-40`, full width

**Logo:** "K-Flix" — "K" in `text-orange-500 font-bold`, "Flix" in `text-white font-bold`. Links to `/`.

**Desktop navigation links (hidden on mobile):**
- Home → `/`
- Search → `/search`
- Advanced Search → `/advanced-search` (authenticated only)
- Watchlists → `/watchlists` (authenticated only)
- Profile → `/profile` (authenticated only)
- Favourites → `/favorites` (authenticated only)

**Right side:**
- Unauthenticated: Login button (`bg-orange-500`)
- Authenticated: Username display + Logout button

**Mobile:** Hamburger icon (`md:hidden`) toggles a stacked dropdown. Closes on link click.

---

## 7. Home Page — Feature Specification

**Hero Section:**
- Full-screen backdrop of a randomly selected trending movie
- `bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent` overlay
- Bottom-left: genre pills, movie title (Playfair Display, large), metadata (year • runtime • language), short overview (2 lines max)
- Two action buttons: "Add to Favourites" (toggles) + "More Info" → `/movies/:id`
- Rating circle (colour-coded) in the bottom-right area
- Mobile: simplified layout, poster hidden, compact inline rating

**Trending Section:**
- Eyebrow label: "TRENDING TODAY"
- Horizontal scroll row of up to 20 MovieCards
- Custom orange scrollbar

**Footer:** Dark background, TMDB attribution, "© {year} K-Flix. Designed by Kudzayi Chimbodza. Powered by TMDB."

---

## 8. MovieCard Component — Feature Specification

```
Props:   movie = { id, poster_path, title, vote_average, release_date }
Output:  Clickable card → navigates to /movies/:id
Layout:
  - Poster image (full card height, object-cover)
  - On hover: dark overlay appears
  - On hover: heart icon (filled if favourite, outline if not)
  - Bottom: title, star rating (★), release year
Style:   bg-white/5 border border-white/10 rounded-2xl overflow-hidden
         Hover: scale-105 transition-transform duration-200
```

---

## 9. Movie Details Page — Feature Specification

**Layout (Desktop):**
- Full-page backdrop at original resolution with dark gradient overlay
- Left column: Movie poster (`hidden md:block`)
- Centre column: Genre pills → Title (Playfair Display) → Metadata (year • runtime • language) → Overview → Action buttons
- Right column: Large rating circle (colour-coded), vote count

**Mobile:** Compact inline rating row replaces right column and poster.

**Action Buttons:**
1. "Add to Favourites" / "Remove from Favourites" — `FavouritesContext`
2. "Add to Watchlist" — dropdown of user's watchlists (authenticated only); shows `watchlistMessage` inline on success
3. "Share" — `navigator.share()` with clipboard fallback; toast notification on success

**Similar Movies Section:**
- Eyebrow label: "YOU MIGHT ALSO LIKE"
- Horizontal scroll row, up to 8 cards
- Fetched from TMDB `/movie/:id/similar`

**Loading:** Full-screen pulse on `bg-gray-950`. **Error:** Centred message on `bg-gray-950`.

---

## 10. Search Page — Feature Specification

- Full-width styled search input at the top
- Results grid: `grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4`
- "Load More" button for pagination (TMDB `page` param)
- Empty state message when no results
- Link to Advanced Search for authenticated users

---

## 11. Advanced Search Page — Feature Specification

All filters optional, combined via TMDB `/discover/movie`:

| Filter | Input Type | TMDB Param |
|---|---|---|
| Genre | Multi-select (from `getGenres()`) | `with_genres` |
| Release year from | Number input | `primary_release_date.gte` |
| Release year to | Number input | `primary_release_date.lte` |
| Minimum rating | Number 0–10 | `vote_average.gte` |
| Language | Select dropdown | `with_original_language` |

- Results grid + "Load More" pagination (same as Search)
- Protected route — redirects unauthenticated users to `/login`

---

## 12. Watchlist Feature — Full Specification

**Watchlists Page (`/watchlists`):**
- Eyebrow label: "MY WATCHLISTS"
- All user's watchlists as glassmorphism cards (name, movie count)
- "Create New Watchlist" — text input + submit (`type="button"`)
- Delete button on each card (danger style, permanent)

**WatchlistDetail Page (`/watchlists/:id`):**
- Watchlist name as page heading (Playfair Display)
- Movie grid: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4`
- Each movie card has "Remove" button
- "Delete Watchlist" danger button at top
- Empty state message if watchlist has no movies

**Adding Movies (from MovieDetails):**
- "Add to Watchlist" opens dropdown of all user's watchlists
- Selecting one: `PATCH /watchlists/:id` with updated `movies` array
- Inline `watchlistMessage` confirmation: "Added to [name]"

**Profile Integration:** `/profile` lists all watchlists with click-through links.

---

## 13. Favourites Feature — Full Specification

**Guest users:**
- Stored in `localStorage` key `kflix_guest_favourites`
- Registration prompts shown contextually

**Authenticated users:**
- Stored in JSON Server `/favourites` collection
- Optimistic UI: state updates immediately, API call follows
- On login: merge guest localStorage favourites into DB (ignore duplicates)
- Filtered client-side by `userId`

---

## 14. Authentication Feature — Full Specification

**Register (`/register`):**
- Fields: name, email, password
- Client-side validation: all required, email format, min 6 chars password
- `POST /users`, auto-login on success, redirect to `/`
- Duplicate email check

**Login (`/login`):**
- Fields: email, password
- Fetch all users, match client-side
- On success: store user to `localStorage` key `kflix_user`, update `AuthContext`
- On fail: display error message

**Logout:** Clear `localStorage` key `kflix_user`, clear `AuthContext`, redirect to `/`.

**Session persistence:** `AuthContext` reads `localStorage` on app load to restore session.

---

## 15. Context API — Patterns

### AuthContext
```jsx
const { user, login, logout } = useAuth()
```

### FavouritesContext
```jsx
const { favourites, addFavourite, removeFavourite, isFavourite } = useFavourites()
```

### Provider Setup (main.jsx)
```jsx
<AuthProvider>
  <FavouritesProvider>
    <App />
  </FavouritesProvider>
</AuthProvider>
```

---

## 16. TMDB Service Layer (`src/services/tmdb.js`)

| Function | Endpoint | Used By |
|---|---|---|
| `getTrending()` | `GET /trending/movie/day` | Home |
| `searchMovies(query, page)` | `GET /search/movie` | Search |
| `getMovieDetails(id)` | `GET /movie/:id` | MovieDetails |
| `getSimilarMovies(id)` | `GET /movie/:id/similar` | MovieDetails |
| `discoverMovies(filters)` | `GET /discover/movie` | AdvancedSearch |
| `getGenres()` | `GET /genre/movie/list` | AdvancedSearch |

Standard pattern:
```js
export const getTrending = async () => {
  const res = await axios.get(`${BASE_URL}/trending/movie/day`, {
    params: { api_key: API_KEY }
  })
  return res.data.results
}
```

---

## 17. JSON Server (`src/services/api.js`)

**Base URL:** `http://localhost:3001`

### db.json Structure
```json
{ "users": [], "favourites": [], "watchlists": [] }
```

### Critical: ID Conflict Fix
JSON Server (beta) overwrites numeric `id` fields. Store TMDB ID as `movieId`:
```js
// Store
await axios.post(`${API_URL}/favourites`, {
  userId: user.id,
  movieId: movie.id,   // TMDB numeric ID
  title: movie.title,
  poster_path: movie.poster_path,
  vote_average: movie.vote_average
})

// Fetch + remap
const mine = res.data
  .filter(f => String(f.userId) === String(userId))
  .map(f => ({ ...f, id: f.movieId, dbId: f.id }))
```

### Critical: Query Parameter Workaround
`?userId=` params are unreliable in JSON Server beta. Always filter client-side:
```js
// ❌ Unreliable
GET /favourites?userId=1

// ✅ Correct
const all = await axios.get(`${API_URL}/favourites`)
const mine = all.data.filter(f => String(f.userId) === String(userId))
```

### Watchlist Schema
```json
{
  "id": "auto",
  "userId": "1",
  "name": "Action Movies",
  "movies": [{ "id": 123, "title": "...", "poster_path": "...", "vote_average": 7.5 }]
}
```
Update movies via: `PATCH /watchlists/:id  { movies: updatedArray }`

---

## 18. Coding Conventions

```jsx
// Tight useEffect dependency arrays
useEffect(() => { void load() }, [id])

// Async inside useEffect
useEffect(() => {
  const load = async () => {
    try { setData(await service()) }
    catch { setError('Failed') }
    finally { setLoading(false) }
  }
  void load()
}, [id])

// Buttons in forms always need explicit type
<button type="button">Cancel</button>
<button type="submit">Save</button>

// Always handle loading and error states
const [loading, setLoading] = useState(true)
const [error, setError]     = useState(null)

// API calls in services only — never inline in components
```

---

## 19. Responsive Design Rules

| Rule | Implementation |
|---|---|
| Page padding | `px-6 md:px-16` — never hardcode `px-16` alone |
| Movie grids | `grid-cols-2 md:grid-cols-4 lg:grid-cols-5` |
| Profile/Watchlist grids | `grid-cols-1 sm:grid-cols-2` |
| Navbar mobile | Hamburger `md:hidden`, stacked dropdown |
| MovieDetails poster | `hidden md:block`, inline rating shown on mobile |
| Footer | `text-center md:text-left`, stacks vertically on mobile |

---

## 20. Git Conventions

```
feat: add MovieCard with poster, title, rating, year
feat: implement protected routes and login redirect
feat: DB-backed favourites with localStorage merge on login
feat: advanced search with genre, year, rating, language filters
feat: watchlist create, delete, add/remove movies
fix: JSON Server ID conflict in favourites
fix: lint warnings across all components
style: orange brand theme applied throughout
style: mobile responsive layout across all pages
docs: README with setup instructions and feature list
```

Minimum 10 meaningful commits across the development period.

---

## 21. Build Order

1. Vite + React setup, install all deps
2. Tailwind v4 config, `index.css` with custom scrollbar
3. Folder structure — create all empty files
4. `services/tmdb.js` — all TMDB functions
5. `services/api.js` — all JSON Server functions + `db.json`
6. `AuthContext` + `FavouritesContext`
7. `App.jsx` — router + all routes + `ProtectedRoute`
8. `Navbar.jsx` + `Footer.jsx` + `MovieCard.jsx`
9. `Home.jsx` → `Search.jsx` → `MovieDetails.jsx`
10. `Login.jsx` + `Register.jsx`
11. `Profile.jsx` + `Favourites.jsx`
12. `AdvancedSearch.jsx`
13. `Watchlists.jsx` + `WatchlistDetail.jsx`
14. Mobile responsive pass (Section 19)
15. `npm run lint` → zero errors
16. Commit review → 10+ meaningful commits
17. README

---

## 22. API Alternatives (If TMDB Is Inaccessible)

| Use Case | Primary | Fallback 1 | Fallback 2 |
|---|---|---|---|
| Movie data & details | TMDB | Trakt API | OMDB API |
| Posters / images | TMDB | Fanart.tv | OMDB API |

Trakt does not provide images. Fanart.tv specialises in user-generated artwork. OMDB has strict free-tier rate limits.

---

## 23. Known Limitations

- Passwords stored in plain text in JSON Server — acceptable for a course project; documented in README
- JSON Server beta query params unreliable — client-side filtering applied as workaround
- JSON Server is local only — not suitable for production deployment
- TMDB rate limits apply — no retry logic (not required at this scale)

---

*K-Flix — Designed by Kudzayi Chimbodza. Powered by TMDB.*
