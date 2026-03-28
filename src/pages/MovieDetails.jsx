import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getMovieDetails } from '../services/tmdb'
import { useFavourites } from '../context/FavouritesContext'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const MovieDetails = () => {
    const { id } = useParams()
    const [movie, setMovie] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showPopup, setShowPopup] = useState(false)
    const { isFavourite, addFavourite, removeFavourite } = useFavourites()
    const { user } = useAuth()
    const IMAGE_URL = import.meta.env.VITE_TMDB_IMAGE_URL

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const data = await getMovieDetails(id)
                setMovie(data)
            } catch (err) {
                setError('Failed to fetch movie details')
            } finally {
                setLoading(false)
            }
        }
        fetchMovie()
    }, [id])

    if (loading) return <div className="text-white text-center mt-10">Loading...</div>
    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>

    const favourited = isFavourite(movie.id)

    const handleFavourite = () => {
        if (!user) {
            setShowPopup(true)
            return
        }
        favourited ? removeFavourite(movie.id) : addFavourite(movie)
    }

    return (
        <>
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 text-center max-w-sm mx-4">
                        <h2 className="text-white text-xl font-bold mb-2">Join K-Flix!</h2>
                        <p className="text-gray-400 mb-4">Create an account to save your favourite movies permanently.</p>
                        <div className="flex gap-3 justify-center">
                            <Link to="/register" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                                Sign Up
                            </Link>
                            <Link to="/login" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                                Login
                            </Link>
                        </div>
                        <button
                            onClick={() => setShowPopup(false)}
                            className="mt-4 text-gray-500 text-sm hover:text-white"
                        >
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
                        <button
                            onClick={handleFavourite}
                            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                        >
                            {favourited ? '❤️ Remove from Favourites' : '🤍 Add to Favourites'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MovieDetails