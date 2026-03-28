import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Search from './pages/Search'
import MovieDetails from './pages/MovieDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Favourites from './pages/Favourites'
import AdvancedSearch from './pages/AdvancedSearch'
import Watchlists from './pages/Watchlists'
import WatchlistDetail from './pages/WatchlistDetail'

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favourites />} />
          <Route path="/advanced-search" element={<AdvancedSearch />} />
          <Route path="/watchlists" element={<Watchlists />} />
          <Route path="/watchlists/:id" element={<WatchlistDetail />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App