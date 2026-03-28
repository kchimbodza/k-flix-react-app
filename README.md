# K-Flix 🎬
A full-featured movie discovery and watchlist management application built with React.

## Prerequisites
- Node.js v18+
- npm

## Installation

1. Clone the repository:
```
git clone https://github.com/YOUR_USERNAME/k-flix.git
cd k-flix
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the root directory:
```
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_URL=https://image.tmdb.org/t/p/w500
```

4. Start JSON Server (in a separate terminal):
```
npm run server
```

5. Start the app:
```
npm start
```

## Features
- Browse trending movies updated daily
- Search movies by keyword
- Advanced search with genre, year, rating and language filters
- Full movie detail pages with genres, ratings and overview
- User registration and login
- Personal profile page
- Add movies to favourites with heart overlay
- Create and manage custom watchlists
- Add and remove movies from watchlists
- Share watchlists
- Protected routes for authenticated users
- Responsive design for mobile and desktop

## Tech Stack
- React 19 + Vite
- React Router v7
- Context API for global state
- Tailwind CSS v4
- JSON Server for local backend
- TMDB API for movie data

## Known Issues
- JSON Server must be running separately on port 3001
- Passwords are stored in plain text in db.json (not for production use)
