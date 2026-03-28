import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getMovieDetails } from '../services/tmdb'
import { useFavourites } from '../context/FavouritesContext'
import { useAuth } from '../context/AuthContext'
import { getUserWatchlists, updateWatchlist } from '../services/api'

const MovieDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [movie, setMovie] = useState({
        poster_path: '',
        title: '',
        release_date: '',
        vote_average: 0,
        genres: [],
        overview: ''
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showPopup, setShowPopup] = useState(false)
    const [watchlists, setWatchlists] = useState([])
    const [showWatchlistMenu, setShowWatchlistMenu] = useState(false)
    const [watchlistMessage, setWatchlistMessage] = useState(null)
    const { isFavourite, addFavourite, removeFavourite } = useFavourites()
    const { user } = useAuth()
    // noinspection JSUnresolvedVariable
    const IMAGE_URL = import.meta.env.VITE_TMDB_IMAGE_URL

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const data = await getMovieDetails(id)
                setMovie(data)
            } catch {
                setError('Failed to fetch movie details')
            } finally {
                setLoading(false)
            }
        }
        void fetchMovie()
    }, [id])

    useEffect(() => {
        if (user && watchlists.length === 0) {
            getUserWatchlists(user.id).then(setWatchlists)
        }
    }, [user, watchlists.length])

    if (loading) return <div className="text-white text-center mt-10">Loading...</div>
    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>

    const favourited = isFavourite(movie.id)

    const handleFavourite = () => {
        if (!user) { setShowPopup(true); return }
        favourited ? removeFavourite(movie.id) : addFavourite(movie)
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: movie.title,
                    text: `Check out ${movie.title} on K-Flix!`,
                    url: window.location.href
                })
            } catch {
                // user canceled share
            }
        } else {
            await navigator.clipboard.writeText(window.location.href)
            alert('Link copied to clipboard!')
        }
    }

    const handleAddToWatchlist = async (watchlist) => {
        const alreadyAdded = watchlist.movies?.some(m => m.id === movie.id)
        setShowWatchlistMenu(false)
        if (alreadyAdded) {
            setWatchlistMessage(`Already in "${watchlist.name}"`)
            setTimeout(() => setWatchlistMessage(null), 3000)
            return
        }
        const updatedMovies = [...(watchlist.movies || []), movie]
        await updateWatchlist(watchlist.id, { movies: updatedMovies })
        navigate(`/watchlists/${watchlist.id}`)
    }

    return (
        <>
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 text-center max-w-sm mx-4">
                        <h2 className="text-white text-xl font-bold mb-2">Join K-Flix!</h2>
                        <p className="text-gray-400 mb-4">Create an account to save your favourite movies permanently.</p>
                        <div className="flex gap-3 justify-center">
                            <Link to="/register" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Sign Up</Link>
                            <Link to="/login" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Login</Link>
                        </div>
                        <button type="button" onClick={() => setShowPopup(false)} className="mt-4 text-gray-500 text-sm hover:text-white">
                            Maybe later
                        </button>
                    </div>
                </div>
            )}
            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8">
                    <img
                        src={`${IMAGE_URL}${movie.poster_path}`}
                        alt={movie.title}
                        className="w-64 rounded-lg"
                    />
                    <div className="text-white">
                        <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                        <p className="text-gray-400 mb-2">{movie.release_date}</p>
                        <p className="text-yellow-400 mb-4">⭐ {movie.vote_average?.toFixed(1)}</p>
                        <div className="flex gap-2 mb-4 flex-wrap">
                            {movie.genres?.map(genre => (
                                <span key={genre.id} className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-6">{movie.overview}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                            <button
                                type="button"
                                onClick={handleFavourite}
                                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                            >
                                {favourited ? '❤️ Remove from Favourites' : '🤍 Add to Favourites'}
                            </button>
                            {user && (
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowWatchlistMenu(!showWatchlistMenu)}
                                        className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-600"
                                    >
                                        + Add to Watchlist
                                    </button>
                                    {showWatchlistMenu && (
                                        <div className="absolute top-10 left-0 bg-gray-800 rounded-lg shadow-lg z-10 w-48">
                                            {watchlists.length === 0 ? (
                                                <p className="text-gray-400 text-sm p-3">No watchlist yet!</p>
                                            ) : (
                                                watchlists.map(w => (
                                                    <button
                                                        type="button"
                                                        key={w.id}
                                                        onClick={() => handleAddToWatchlist(w)}
                                                        className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 text-sm"
                                                    >
                                                        {w.name}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={handleShare}
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                            >
                                🔗 Share
                            </button>
                            {watchlistMessage && (
                                <span className="text-green-400 text-sm font-medium">
                                    ✅ {watchlistMessage}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MovieDetails