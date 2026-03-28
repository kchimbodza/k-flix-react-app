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
        <div className="p-6 max-w-5xl mx-auto">
            {/* User Info */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                <p className="text-gray-400">Name: <span className="text-white">{user?.name}</span></p>
                <p className="text-gray-400">Email: <span className="text-white">{user?.email}</span></p>
            </div>

            {/* Watchlists */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">My Watchlists</h2>
                    <Link to="/watchlists" className="text-red-500 hover:underline text-sm">
                        Manage Watchlists →
                    </Link>
                </div>
                {watchlists.length === 0 ? (
                    <p className="text-gray-400">No watchlists yet — <Link to="/watchlists" className="text-red-500 hover:underline">create one!</Link></p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {watchlists.map(watchlist => (
                            <Link
                                key={watchlist.id}
                                to={`/watchlists/${watchlist.id}`}
                                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700"
                            >
                                <h3 className="text-white font-semibold">{watchlist.name}</h3>
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
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">My Favourites</h2>
                    <Link to="/favorites" className="text-red-500 hover:underline text-sm">
                        See All →
                    </Link>
                </div>
                {favourites.length === 0 ? (
                    <p className="text-gray-400">No favourites yet — start adding some!</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {favourites.slice(0, 5).map(movie => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile