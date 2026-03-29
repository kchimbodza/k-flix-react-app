import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useFavourites } from '../context/FavouritesContext'
import { Link } from 'react-router-dom'
import { getUserWatchlists } from '../services/api'
import MovieCard from '../components/MovieCard'

const Profile = () => {
    const { user } = useAuth()
    const { favourites } = useFavourites()
    const [watchlists, setWatchlists] = useState([])

    useEffect(() => {
        getUserWatchlists(user.id).then(setWatchlists)
    }, [user.id])

    return (

        <div className="min-h-screen bg-gray-950 py-12 pt-48">
            <div className="max-w-5xl mx-auto px-6">
                <h1 className="text-4xl font-bold text-white mb-8 text-center">My Profile</h1>
                {/* User Info */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-10 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">{user?.name}</h1>
                        <p className="text-gray-400">{user?.email}</p>
                    </div>
                </div>

                {/* Watchlists */}
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">My Watchlists</h2>
                        <Link to="/watchlists" className="text-orange-400 hover:text-orange-300 text-sm transition-colors">
                            Manage Watchlists →
                        </Link>
                    </div>
                    {watchlists.length === 0 ? (
                        <p className="text-gray-500">No watchlists yet —{' '}
                            <Link to="/watchlists" className="text-orange-400 hover:text-orange-300 transition-colors">
                                create one!
                            </Link>
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {watchlists.map(watchlist => (
                                <Link
                                    key={watchlist.id}
                                    to={`/watchlists/${watchlist.id}`}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-orange-500/30 hover:bg-orange-500/5 transition-colors"
                                >
                                    <h3 className="text-white font-semibold mb-1">{watchlist.name}</h3>
                                    <p className="text-gray-400 text-sm">
                                        {watchlist.movies?.length || 0} {watchlist.movies?.length === 1 ? 'movie' : 'movies'}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Favourites */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">My Favourites</h2>
                        <Link to="/favorites" className="text-orange-400 hover:text-orange-300 text-sm transition-colors">
                            See All →
                        </Link>
                    </div>
                    {favourites.length === 0 ? (
                        <p className="text-gray-500">No favourites yet — start adding some!</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {favourites.slice(0, 5).map(movie => (
                                <MovieCard key={movie.id} movie={movie} showHeartOnHover={true} />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default Profile