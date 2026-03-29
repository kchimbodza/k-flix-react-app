import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getUserWatchlists, updateWatchlist } from '../services/api'
import { useAuth } from '../context/AuthContext'
import MovieCard from '../components/MovieCard'

const WatchlistDetail = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [watchlist, setWatchlist] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const data = await getUserWatchlists(user.id)
                const found = data.find(w => w.id === id)
                if (!found) setError('Watchlist not found')
                setWatchlist(found)
            } catch {
                setError('Failed to load watchlist')
            } finally {
                setLoading(false)
            }
        }
        void fetchWatchlist()
    }, [id, user.id])

    const handleRemoveMovie = async (movieId) => {
        const updated = watchlist.movies.filter(m => m.id !== movieId)
        try {
            await updateWatchlist(id, { movies: updated })
            setWatchlist(prev => ({ ...prev, movies: updated }))
        } catch {
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
            await navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 3000)
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <p className="text-white text-xl">Loading...</p>
        </div>
    )
    if (error) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <p className="text-orange-400 text-xl">{error}</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-950 py-12 pt-48">
            {/* Header — centered */}
            <div className="max-w-5xl mx-auto px-6 mb-10">
                <div className="flex items-center justify-between mb-8">
                    <button
                        type="button"
                        onClick={() => navigate('/watchlists')}
                        className="text-gray-400 hover:text-orange-400 transition-colors text-sm"
                    >
                        ← Back to Watchlists
                    </button>
                    <button
                        type="button"
                        onClick={handleShare}
                        className="bg-white/10 border border-white/10 text-white px-5 py-2 rounded-xl hover:bg-orange-500/20 hover:border-orange-500/30 text-sm font-semibold transition-colors"
                    >
                        🔗 Share Watchlist
                    </button>
                </div>

                <h1 className="text-4xl font-bold text-white mb-2">{watchlist.name}</h1>
                <p className="text-gray-400">
                    {watchlist.movies?.length || 0} {watchlist.movies?.length === 1 ? 'movie' : 'movies'}
                </p>
            </div>

            {/* Movies grid — full width */}
            <div className="px-16">
                {watchlist.movies?.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg mb-6">No movies in this watchlist yet.</p>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="bg-orange-500 text-white px-8 py-3 rounded-xl hover:bg-orange-600 font-semibold transition-colors"
                        >
                            Browse Movies
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-10">
                        {watchlist.movies?.map(movie => (
                            <div key={movie.id}>
                                <MovieCard movie={movie} showHeartOnHover={true} />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        void handleRemoveMovie(movie.id)
                                    }}
                                    className="mt-4 w-full bg-white/10 text-white text-lg py-1.5 rounded-lg hover:bg-orange-500/20 hover:text-orange-400 transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Toast notification */}
            {copied && (
                <div className="fixed top-24 right-8 z-50 bg-gray-900 border border-orange-500/30 rounded-xl px-5 py-3 shadow-2xl flex items-center gap-3">
                    <span className="text-orange-500">🔗</span>
                    <p className="text-white text-sm font-medium">Link copied to clipboard!</p>
                </div>
            )}
        </div>
    )
}

export default WatchlistDetail