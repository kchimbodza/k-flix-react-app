import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFavourites } from '../context/FavouritesContext'
import { useAuth } from '../context/AuthContext'

const IMAGE_URL = import.meta.env.VITE_TMDB_IMAGE_URL

const MovieCard = ({ movie }) => {
    const year = movie.release_date?.split("-")[0]
    const { isFavourite, addFavourite, removeFavourite } = useFavourites()
    const { user } = useAuth()
    const favourited = isFavourite(movie.id)
    const [showPopup, setShowPopup] = useState(false)

    const handleFavourite = (e) => {
        e.preventDefault()
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
            <Link to={`/movies/${movie.id}`}>
                <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
                    <img
                        src={`${IMAGE_URL}${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-72 object-cover"
                    />
                    <div className="p-3">
                        <h3 className="text-white font-semibold text-sm truncate">{movie.title}</h3>
                        <div className="flex justify-between mt-1">
                            <p className="text-yellow-400 text-sm">⭐ {movie.vote_average?.toFixed(1)}</p>
                            <p className="text-gray-400 text-sm">{year}</p>
                        </div>
                        <button
                            onClick={handleFavourite}
                            className="mt-2 w-full text-sm py-1 rounded bg-gray-700 text-white hover:bg-red-600"
                        >
                            {favourited ? '❤️ Remove' : '🤍 Favourite'}
                        </button>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default MovieCard