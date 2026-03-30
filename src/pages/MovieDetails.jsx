import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getMovieDetails, getSimilarMovies } from '../services/tmdb'
import { useFavourites } from '../context/FavouritesContext'
import { useAuth } from '../context/AuthContext'
import { getUserWatchlists, updateWatchlist } from '../services/api'
import MovieCard from '../components/MovieCard'

// noinspection JSUnresolvedVariable
const IMAGE_URL = import.meta.env.VITE_TMDB_IMAGE_URL
// noinspection JSUnresolvedVariable
const BACKDROP_URL = 'https://image.tmdb.org/t/p/original'

const MovieDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [movie, setMovie] = useState({
        poster_path: '',
        backdrop_path: '',
        title: '',
        release_date: '',
        vote_average: 0,
        vote_count: 0,
        genres: [],
        overview: '',
        runtime: 0,
        original_language: ''
    })
    const [similar, setSimilar] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showPopup, setShowPopup] = useState(false)
    const [watchlists, setWatchlists] = useState([])
    const [showWatchlistMenu, setShowWatchlistMenu] = useState(false)
    const [watchlistMessage, setWatchlistMessage] = useState(null)
    const { isFavourite, addFavourite, removeFavourite } = useFavourites()
    const { user } = useAuth()
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const [data, similarData] = await Promise.all([
                    getMovieDetails(id),
                    getSimilarMovies(id)
                ])
                setMovie(data)
                setSimilar(similarData.slice(0, 8))
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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
            <div className="text-white text-xl animate-pulse">Loading...</div>
        </div>
    )
    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
            <div className="text-red-500 text-xl">{error}</div>
        </div>
    )

    const favourited = isFavourite(movie.id)
    const ratingColor = movie.vote_average >= 7 ? '#4ade80' : movie.vote_average >= 5 ? '#facc15' : '#f87171'
    const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : ''
    const year = movie.release_date?.split('-')[0]

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
            setCopied(true)
            setTimeout(() => setCopied(false), 3000)
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
        <div className="min-h-screen bg-gray-950">
            {/* Sign up popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl">
                        <h2 className="text-white text-2xl font-bold mb-2">Join K-Flix!</h2>
                        <p className="text-gray-400 mb-6">Create an account to save your favourite movies permanently.</p>
                        <div className="flex gap-3 justify-center">
                            <Link to="/register" className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 font-semibold">Sign Up</Link>
                            <Link to="/login" className="bg-white/10 text-white px-6 py-2 rounded-full hover:bg-white/20">Login</Link>
                        </div>
                        <button type="button" onClick={() => setShowPopup(false)} className="mt-5 text-gray-500 text-sm hover:text-white">
                            Maybe later
                        </button>
                    </div>
                </div>
            )}

            {/* Hero section with backdrop */}
            <div className="relative min-h-[85vh] flex items-center">
                {/* Backdrop image */}
                {movie.backdrop_path && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={`${BACKDROP_URL}${movie.backdrop_path}`}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-gray-950/40" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/60" />
                    </div>
                )}

                {/* Content */}
                <div className="relative z-10 w-full px-16 py-16 flex flex-col md:flex-row gap-10 items-start pt-32">

                    {/* Poster */}
                    <div className="flex-shrink-0">
                        <img
                            src={`${IMAGE_URL}${movie.poster_path}`}
                            alt={movie.title}
                            className="w-96 lg:w-[480px] rounded-4xl shadow-2xl shadow-black/60 border border-white/10"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-white flex flex-col justify-between" style={{ minHeight: '720px' }}>
                        <div>
                            {/* Genre pills */}
                            <div className="flex gap-2 flex-wrap mb-4">
                                {movie.genres?.map(genre => (
                                    <span key={genre.id} className="px-4 py-1 rounded-full text-sm font-medium bg-white/10 backdrop-blur border border-white/20 text-gray-200">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>

                            {/* Title */}
                            <h1 className="text-5xl md:text-6xl font-black mb-3 leading-tight tracking-tight">
                                {movie.title}
                            </h1>

                            {/* Metadata */}
                            <p className="text-gray-400 text-lg mb-5 flex items-center gap-2 flex-wrap">
                                {movie.original_language?.toUpperCase()}
                                {year && <><span className="text-gray-600">•</span> {year}</>}
                                {runtime && <><span className="text-gray-600">•</span> {runtime}</>}
                            </p>

                            {/* Overview */}
                            <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
                                {movie.overview}
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-3 flex-wrap mt-6">
                            <button
                                type="button"
                                onClick={handleFavourite}
                                className="flex items-center gap-2 bg-white text-gray-950 px-7 py-3 rounded-full font-bold hover:bg-gray-200 transition-all whitespace-nowrap"
                            >
                                {favourited ? '❤️ Remove Favourite' : '🤍 Add to Favourites'}
                            </button>

                            {user && (
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowWatchlistMenu(!showWatchlistMenu)}
                                        className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-7 py-3 rounded-full font-semibold hover:bg-white/20 transition-all whitespace-nowrap"
                                    >
                                        ☰ Add to Watchlist
                                    </button>
                                    {showWatchlistMenu && (
                                        <div className="absolute top-16 left-0 bg-gray-900 border border-white/10 rounded-xl shadow-2xl z-10 w-52 overflow-hidden">
                                            {watchlists.length === 0 ? (
                                                <p className="text-gray-400 text-sm p-4">No watchlists yet!</p>
                                            ) : (
                                                watchlists.map(w => (
                                                    <button
                                                        type="button"
                                                        key={w.id}
                                                        onClick={() => handleAddToWatchlist(w)}
                                                        className="block w-full text-left px-4 py-3 text-white hover:bg-orange-500 text-lg transition-colors border-b border-white/5 last:border-0"
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
                                className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-5 py-3 rounded-full hover:bg-white/20 transition-all whitespace-nowrap"
                            >
                                🔗 Share
                            </button>

                            {watchlistMessage && (
                                <span className="text-green-400 text-sm font-medium">✅ {watchlistMessage}</span>
                            )}
                        </div>
                    </div>

                    {/* Rating card */}
                    <div className="flex-shrink-0 bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-12 text-center min-w-32">
                        <p style={{ color: ratingColor }} className="text-8xl font-black leading-none">
                            {movie.vote_average?.toFixed(1)}
                        </p>
                        <p className="text-white text-xl mt-1">/10</p>
                        <p className="text-white text-lg mt-2">{movie.vote_count?.toLocaleString()} reviews</p>
                    </div>
                </div>
            </div>

            {/* Similar movies */}
            {similar.length > 0 && (
                <div className="px-16 pb-16">
                    <h2 className="text-white text-2xl font-bold mb-5">Similar Movies</h2>
                    <div className="flex gap-10 overflow-x-auto pb-4 custom-scrollbar py-4 pl-2">
                        {similar.map(m => (
                            <div key={m.id} className="flex-shrink-0 w-56">
                                <MovieCard movie={m} showHeartOnHover={true} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* Copy toast */}
            {copied && (
                <div className="fixed top-24 right-8 z-50 bg-gray-800 border border-orange-500 rounded-xl px-5 py-3 shadow-2xl flex items-center gap-3">
                    <span className="text-orange-500">🔗</span>
                    <p className="text-white text-sm font-medium">Link copied to clipboard!</p>
                </div>
            )}
        </div>
    )
}

export default MovieDetails