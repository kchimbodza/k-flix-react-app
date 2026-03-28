import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getUserWatchlists, updateWatchlist } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useFavourites } from '../context/FavouritesContext'

const WatchlistDetail = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const { isFavourite } = useFavourites()
    const navigate = useNavigate()
    const [watchlist, setWatchlist] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const IMAGE_URL = import.meta.env.VITE_TMDB_IMAGE_URL

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const data = await getUserWatchlists(user.id)
                const found = data.find(w => w.id === id)
                if (!found) setError('Watchlist not found')
                setWatchlist(found)
            } catch (err) {
                setError('Failed to load watchlist')
            } finally {
                setLoading(false)
            }
        }
        fetchWatchlist()
    }, [id])

    const handleRemoveMovie = async (movieId) => {
        const updated = watchlist.movies.filter(m => m.id !== movieId)
        try {
            await updateWatchlist(id, { movies: updated })
            setWatchlist(prev => ({ ...prev, movies: updated }))
        } catch (err) {
            setError('Failed to remove movie')
        }
    }

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: watchlist.name,
                text: `Check out my "${watchlist.name}" watchlist on K-Flix!`,
                url: window.location.href
            })
        } else {
            navigator.clipboard.writeText(window.location.href)
            alert('Link copied to clipboard!')
        }
    }

    if (loading) return <div className="text-white text-center mt-10">Loading...</div>
    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button
                    type="button"
                    onClick={() => navigate('/watchlists')}
                    className="text-gray-400 hover:text-white text-sm"
                >
                    ← Back to Watchlists
                </button>
                <button
                    type="button"
                    onClick={handleShare}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                >
                    🔗 Share Watchlist
                </button>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">{watchlist.name}</h1>
            <p className="text-gray-400 mb-6">
                {watchlist.movies?.length || 0} {watchlist.movies?.length === 1 ? 'movie' : 'movies'}
            </p>

            {watchlist.movies?.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-400 mb-4">No movies in this watchlist yet.</p>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                    >
                        Browse Movies
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {watchlist.movies?.map(movie => (
                        <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden">
                            <div className="relative">
                                <img
                                    src={`${IMAGE_URL}${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-full h-48 object-cover cursor-pointer hover:opacity-80"
                                    onClick={() => navigate(`/movies/${movie.id}`)}
                                />
                                {isFavourite(movie.id) && (
                                    <span className="absolute top-2 right-2 text-lg">❤️</span>
                                )}
                            </div>
                            <div className="p-2">
                                <p className="text-white text-xs truncate mb-1">{movie.title}</p>
                                <p className="text-yellow-400 text-xs mb-2">⭐ {movie.vote_average?.toFixed(1)}</p>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveMovie(movie.id)}
                                    className="w-full bg-red-600 text-white text-xs py-1 rounded hover:bg-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default WatchlistDetail