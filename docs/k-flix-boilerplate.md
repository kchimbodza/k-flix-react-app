# K-Flix React App — Boilerplate & Reproduction Guide

This document captures every design decision, architectural pattern, and convention used in K-Flix so that another Claude instance (or developer) can reproduce the same app from scratch.

---

## 1. Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React (Functional only) | 19 | UI framework — no class components |
| Vite | 8+ | Build tool and dev server |
| React Router | v7 | Client-side routing |
| Tailwind CSS | v4 | Utility-first styling |
| Axios | 1.x | HTTP requests |
| JSON Server | 1.x (beta) | Local REST backend on port 3001 |
| TMDB API | v3 | Movie data and images |

**package.json scripts:**
```json
{
  "scripts": {
    "start": "vite",
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "server": "json-server --watch db.json --port 3001"
  }
}
```

---

## 2. Folder Structure

```
k-flix/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── MovieCard.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Footer.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── FavouritesContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Search.jsx
│   │   ├── MovieDetails.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── Favourites.jsx
│   │   ├── AdvancedSearch.jsx
│   │   ├── Watchlists.jsx
│   │   └── WatchlistDetail.jsx
│   ├── services/
│   │   ├── tmdb.js
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── db.json
├── .env
├── .gitignore
├── vite.config.js
└── README.md
```

---

## 3. Environment Variables

`.env` file in project root (never commit):
```
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_URL=https://image.tmdb.org/t/p/w500
```

Access in code:
```js
const API_KEY    = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL   = import.meta.env.VITE_TMDB_BASE_URL
const IMAGE_URL  = import.meta.env.VITE_TMDB_IMAGE_URL
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original'
```

---

## 4. JSON Server — db.json

```json
{
  "users": [],
  "favourites": [],
  "watchlists": []
}
```

Base URL: `http://localhost:3001`

---

## 5. UI Design System

### Colors
```
Page background:    bg-gray-950  (#030712)
Card surface:       bg-white/5   (glassmorphism)
Card border:        border-white/10
Brand accent:       orange-500   (#f97316)
Hover accent:       orange-400 / orange-600
Text primary:       white
Text secondary:     text-gray-400
Text muted:         text-gray-500
Rating high ≥7:     green-400
Rating mid 5–7:     yellow-400
Rating low <5:      red-400
```

### Typography
```
Primary:      DM Sans (sans-serif)
Display/Hero: Playfair Display (serif)
Fallbacks:    'DM Sans', 'Segoe UI', system-ui, sans-serif
Eyebrow:      text-orange-500 text-sm font-semibold uppercase tracking-widest
```

### Spacing
```
Desktop padding: px-16 py-12
Mobile padding:  px-6
Section gap:     space-y-12 / gap-8
```

### Card (Glassmorphism)
```
bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm
```

### Buttons
```jsx
{/* Primary */}
<button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors">

{/* Ghost */}
<button className="border border-white/20 hover:bg-white/10 text-white font-semibold px-6 py-2 rounded-lg transition-colors">

{/* Danger */}
<button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
```

### Inputs
```jsx
<input className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors" />
```

### Movie Grids
```jsx
{/* Standard */}
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">

{/* Profile / Watchlist */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
```

---

## 6. Navbar

- Transparent at top → `bg-gray-900/95 backdrop-blur-md` on scroll
- Detected via `useEffect` + `window.scrollY > 0`
- Sticky, `z-40`
- Logo: "K" in `text-orange-500`, "Flix" in white, both bold
- Desktop: nav links centered, search + avatar/login on right
- Mobile: hamburger (`md:hidden`) → stacked dropdown, closes on link click
- Authenticated links: Watchlists, Advanced Search, Profile, Favourites
- Unauthenticated: Login button (`bg-orange-500`)

---

## 7. Routes (App.jsx)

```jsx
<Routes>
  <Route path="/"                element={<Home />} />
  <Route path="/search"          element={<Search />} />
  <Route path="/movies/:id"      element={<MovieDetails />} />
  <Route path="/login"           element={<Login />} />
  <Route path="/register"        element={<Register />} />
  <Route path="/profile"         element={<ProtectedRoute><Profile /></ProtectedRoute>} />
  <Route path="/favorites"       element={<ProtectedRoute><Favourites /></ProtectedRoute>} />
  <Route path="/advanced-search" element={<ProtectedRoute><AdvancedSearch /></ProtectedRoute>} />
  <Route path="/watchlists"      element={<ProtectedRoute><Watchlists /></ProtectedRoute>} />
  <Route path="/watchlists/:id"  element={<ProtectedRoute><WatchlistDetail /></ProtectedRoute>} />
</Routes>
```

`<ProtectedRoute>` reads `user` from `AuthContext` — redirects to `/login` if null.

---

## 8. Context Patterns

### main.jsx — Provider Wrapping
```jsx
<AuthProvider>
  <FavouritesProvider>
    <App />
  </FavouritesProvider>
</AuthProvider>
```

### AuthContext
```jsx
const { user, login, logout } = useAuth()
// user stored in localStorage key: 'kflix_user'
// login(userData) — sets user + localStorage
// logout() — clears user + localStorage + redirects to /
```

### FavouritesContext
```jsx
const { favourites, addFavourite, removeFavourite, isFavourite } = useFavourites()
// Guest: localStorage key 'kflix_guest_favourites'
// Authenticated: JSON Server /favourites, filtered by userId client-side
// On login: merge guest localStorage into DB, ignore duplicates
// Optimistic UI: state updates immediately, API follows
```

---

## 9. TMDB Service Layer (src/services/tmdb.js)

| Function | Endpoint | Used By |
|---|---|---|
| `getTrending()` | `/trending/movie/day` | Home |
| `searchMovies(query, page)` | `/search/movie` | Search |
| `getMovieDetails(id)` | `/movie/:id` | MovieDetails |
| `getSimilarMovies(id)` | `/movie/:id/similar` | MovieDetails |
| `discoverMovies(filters)` | `/discover/movie` | AdvancedSearch |
| `getGenres()` | `/genre/movie/list` | AdvancedSearch |

Pattern:
```js
export const getTrending = async () => {
  const res = await axios.get(`${BASE_URL}/trending/movie/day`, {
    params: { api_key: API_KEY }
  })
  return res.data.results
}
```

AdvancedSearch filters: `genre`, `release year range`, `min rating`, `language` → passed as query params to `/discover/movie`.

---

## 10. JSON Server Service Layer (src/services/api.js)

### Key Patterns

**Favourites — ID Conflict Fix:**
JSON Server (beta) overwrites numeric `id` fields with its own string IDs. Solution:
```js
// Store with separate movieId field
await axios.post(`${API_URL}/favourites`, {
  userId,
  movieId: movie.id,     // preserve TMDB numeric ID
  title: movie.title,
  poster_path: movie.poster_path,
  vote_average: movie.vote_average,
  release_date: movie.release_date
})

// Remap on fetch
const mapped = data
  .filter(f => String(f.userId) === String(userId))
  .map(f => ({ ...f, id: f.movieId, dbId: f.id }))
```

**Query param workaround:**
`?userId=` params are unreliable in JSON Server beta — always filter client-side:
```js
// ❌ Don't rely on this
GET /favourites?userId=1

// ✅ Correct approach
const all = await axios.get(`${API_URL}/favourites`)
const mine = all.data.filter(f => String(f.userId) === String(userId))
```

**Watchlist Structure:**
```json
{
  "id": "auto",
  "userId": "1",
  "name": "My List",
  "movies": [
    { "id": 123, "title": "...", "poster_path": "...", "vote_average": 7.5 }
  ]
}
```
Add/remove movies via: `PATCH /watchlists/:id  { movies: updatedArray }`

---

## 11. Coding Conventions

```jsx
// useEffect — tight dependency arrays only
useEffect(() => { void load() }, [id])
useEffect(() => { void load() }, [])    // mount-only

// Async inside useEffect — always wrap
useEffect(() => {
  const load = async () => {
    try {
      const data = await service()
      setState(data)
    } catch {
      setError('Failed to load')
    } finally {
      setLoading(false)
    }
  }
  void load()
}, [id])

// Buttons in forms — always explicit type
<button type="button">Cancel</button>
<button type="submit">Save</button>

// Always loading + error states
const [loading, setLoading] = useState(true)
const [error, setError]     = useState(null)

// API calls in services only — never inline in components
```

---

## 12. MovieCard Component

```
Props:   movie = { id, poster_path, title, vote_average, release_date }
Click:   navigates to /movies/:id
Layout:
  - Full-height poster image (object-cover)
  - Hover: dark overlay + heart icon (filled = favourite, outline = not)
  - Bottom: title, ★ rating, release year
Style:   bg-white/5 border border-white/10 rounded-2xl overflow-hidden
         hover:scale-105 transition-transform duration-200
```

---

## 13. Page-by-Page Layout

| Page | Key Layout |
|---|---|
| Home | Full-screen backdrop hero (gradient overlay, title, buttons, rating) + horizontal trending scroll row |
| Search | Full-width search input + results grid + Load More button |
| MovieDetails | Backdrop bg + 3-col layout (poster / details / rating) + similar movies row + share button |
| Login | Centred glassmorphism card, email + password fields |
| Register | Centred glassmorphism card, name + email + password + validation |
| Profile | User info card + favourites grid + watchlist links |
| Favourites | Eyebrow label + `grid-cols-2 md:grid-cols-4 lg:grid-cols-5` of favourite MovieCards |
| AdvancedSearch | Filter panel (genre, year range, rating, language) + results grid |
| Watchlists | Eyebrow label + watchlist cards + create input |
| WatchlistDetail | Watchlist name heading + `grid-cols-1 sm:grid-cols-2 md:grid-cols-3` + remove controls |

**MovieDetails — specific layout:**
- Left: poster (`hidden md:block`)
- Centre: genre pills → title (Playfair Display) → metadata (year • runtime • language) → overview → action buttons
- Right: rating circle (colour-coded green/yellow/red), vote count
- Mobile: poster hidden, compact inline rating shown
- Action buttons: Add to Favourites, Add to Watchlist (dropdown picker), Share (`navigator.share()` + clipboard fallback + toast)
- Similar movies: eyebrow label "YOU MIGHT ALSO LIKE" + horizontal scroll row of up to 8 cards

---

## 14. Responsive Design Rules

| Rule | Implementation |
|---|---|
| Page padding | `px-6 md:px-16` — never hardcode `px-16` alone |
| Movie grids | `grid-cols-2 md:grid-cols-4 lg:grid-cols-5` |
| Profile/Watchlist grids | `grid-cols-1 sm:grid-cols-2` |
| Navbar | Hamburger `md:hidden`, stacked dropdown on mobile |
| MovieDetails poster | `hidden md:block`, inline rating on mobile |
| Footer | `text-center md:text-left`, stacks on mobile |

---

## 15. Custom Scrollbar (index.css)

```css
@import "tailwindcss";

/* Custom orange scrollbar — apply class 'custom-scrollbar' to horizontal scroll containers */
.custom-scrollbar::-webkit-scrollbar {
    height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #f97316;
    border-radius: 999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #ea580c;
}
```

Apply to scroll rows:
```jsx
<div className="flex gap-4 overflow-x-auto custom-scrollbar py-4 pl-2">
```

Used on: trending row (Home), similar movies row (MovieDetails).

---

## 16. Beginner Quickstart

Follow these steps in order to set up K-Flix from scratch.

### Step 1 — Create the project
```bash
npm create vite@latest k-flix -- --template react
cd k-flix
npm install
```

### Step 2 — Install dependencies
```bash
npm install react-router-dom axios json-server
npm install tailwindcss @tailwindcss/vite
```

### Step 3 — Configure Vite
Replace `vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### Step 4 — Configure index.css
Replace `src/index.css` with the custom scrollbar CSS from Section 15.

### Step 5 — Create folders
```bash
mkdir src/pages src/components src/context src/services
```

### Step 6 — Create .env
```
VITE_TMDB_API_KEY=your_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_URL=https://image.tmdb.org/t/p/w500
```
Get a free key at https://www.themoviedb.org/settings/api

### Step 7 — Create db.json
```json
{ "users": [], "favourites": [], "watchlists": [] }
```

### Step 8 — Update package.json scripts
Add `"start": "vite"` and `"server": "json-server --watch db.json --port 3001"`.

### Step 9 — Add .gitignore
```
node_modules/
.env
dist/
```

### Step 10 — Run the app (two terminals)
```bash
# Terminal 1
npm run server

# Terminal 2
npm start
```

Open http://localhost:5173

### Recommended Build Order
1. Navbar + Router
2. `services/tmdb.js`
3. Home page + MovieCard
4. Search page
5. MovieDetails page
6. `AuthContext` + `services/api.js`
7. Login + Register
8. `FavouritesContext`
9. Profile + Favourites
10. AdvancedSearch
11. Watchlists + WatchlistDetail
12. Mobile responsive pass
13. Lint pass → zero errors
14. README

---

## 17. API Alternatives (If TMDB Is Inaccessible)

| Use Case | Primary | Fallback 1 | Fallback 2 |
|---|---|---|---|
| Movie data/details | TMDB | Trakt API | OMDB API |
| Posters/images | TMDB | Fanart.tv | OMDB API |

Trakt: no images. Fanart.tv: user-generated artwork. OMDB: strict free-tier rate limits.

---

## 18. Git Conventions

```
feat: add MovieCard with poster, title, rating, year
feat: implement protected routes and login redirect
feat: DB-backed favourites with localStorage merge
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

*K-Flix — Designed by Kudzayi Chimbodza. Powered by TMDB.*
