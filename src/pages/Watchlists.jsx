import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFavourites } from '../context/FavouritesContext'
import { getUserWatchlists, createWatchlist, deleteWatchlist } from '../services/api'

// noinspection JSUnresolvedVariable
const IMAGE_URL = import.meta.env.VITE_TMDB_IMAGE_URL

const Watchlists = () => {
    const { user } = useAuth()
    const { isFavourite } = useFavourites()
    const [watchlists, setWatchlists] = useState([])
    const [newName, setNewName] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchWatchlists = async () => {
            try {
                const data = await getUserWatchlists(user.id)
                setWatchlists(data)
            } catch {
                setError('Failed to load watchlists')
            } finally {
                setLoading(false)
            }
        }
        void fetchWatchlists()
    }, [user.id])

    const handleCreate = async () => {
        if (!newName.trim()) return
        try {
            const created = await createWatchlist(user.id, newName)
            setWatchlists(prev => [...prev, created])
            setNewName('')
        } catch {
            setError('Failed to create watchlist')
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteWatchlist(id)
            setWatchlists(prev => prev.filter(w => w.id !== id))
        } catch {
            setError('Failed to delete watchlist')
        }
    }

    if (loading) return <div className="text-white text-center mt-10">Loading...</div>

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">My Watchlists</h1>

            {/* Create new watchlist */}
            <div className="bg-gray-800 rounded-lg p-4 mb-8">
                <h2 className="text-white font-semibold mb-3">Create New Watchlist</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && void handleCreate()}
                        placeholder="Watchlist name..."
                        className="flex-1 p-2 rounded bg-gray-700 text-white"
                    />
                    <button
                        type="button"
                        onClick={handleCreate}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Create
                    </button>
                </div>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Watchlist grid */}
            {watchlists.length === 0 ? (
                <p className="text-gray-400">No watchlists yet — create one above!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {watchlists.map(watchlist => (
                        <div key={watchlist.id} className="bg-gray-800 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h2 className="text-white font-semibold text-lg">{watchlist.name}</h2>
                                    <p className="text-gray-400 text-sm">
                                        {watchlist.movies?.length || 0} {watchlist.movies?.length === 1 ? 'movie' : 'movies'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(watchlist.id)}
                                    className="text-red-500 hover:text-red-400 text-sm"
                                >
                                    🗑 Delete
                                </button>
                            </div>

                            {/* Movie poster previews with favourite indicator */}
                            {watchlist.movies?.length > 0 && (
                                <div className="flex gap-1 mb-3">
                                    {watchlist.movies.slice(0, 3).map(movie => (
                                        <div key={movie.id} className="relative">
                                            <img
                                                src={`${IMAGE_URL}${movie.poster_path}`}
                                                alt={movie.title}
                                                className="w-16 h-24 object-cover rounded"
                                            />
                                            {isFavourite(movie.id) && (
                                                <span className="absolute top-1 right-1 text-xs">❤️</span>
                                            )}
                                        </div>
                                    ))}
                                    {watchlist.movies.length > 3 && (
                                        <div className="w-16 h-24 bg-gray-700 rounded flex items-center justify-center text-gray-400 text-sm">
                                            +{watchlist.movies.length - 3}
                                        </div>
                                    )}
                                </div>
                            )}

                            <Link
                                to={`/watchlists/${watchlist.id}`}
                                className="block w-full text-center bg-gray-700 text-white py-2 rounded hover:bg-gray-600 text-sm"
                            >
                                View Watchlist →
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Watchlists