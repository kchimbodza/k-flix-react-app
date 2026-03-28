import { Link } from 'react-router-dom'

const IMAGE_URL = import.meta.env.VITE_TMDB_IMAGE_URL

const MovieCard = ({ movie }) => {
    const year = movie.release_date?.split("-")[0]

    return (
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
                </div>
            </div>
        </Link>
    )
}

export default MovieCard