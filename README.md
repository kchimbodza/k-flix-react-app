# K-Flix 🎬

A movie discovery and watchlist management app built with React 19 and Vite, powered by the TMDB API.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat&logo=tailwindcss)](https://tailwindcss.com)

---

## Features

- Browse trending movies updated daily from TMDB
- Search by keyword with advanced filters — genre, year, rating, language
- Full movie detail pages with overview, genres, and ratings
- User registration and login with protected routes
- Add movies to favourites and manage personal watchlists
- Share watchlists with other users
- Responsive design — mobile and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router v7 |
| Styling | Tailwind CSS v4 |
| State | Context API |
| Backend | JSON Server (local REST API) |
| Data | TMDB API |

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm
- Free [TMDB API key](https://www.themoviedb.org/settings/api)

### Installation

```bash
git clone https://github.com/kchimbodza/kflix-react-app.git
cd kflix-react-app
npm install
```

Create a `.env` file in the root:

```
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_URL=https://image.tmdb.org/t/p/w500
```

### Run

```bash
# Terminal 1 — start JSON Server (local backend)
npm run server

# Terminal 2 — start the app
npm start
```

Open [http://localhost:5173](http://localhost:5173)

---

## Notes

- JSON Server runs on port 3001 and must be started separately
- Passwords are stored in plain text in `db.json` — this is a development demo, not production-ready auth

---

## License

MIT
