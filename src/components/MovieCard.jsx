import { Link } from 'react-router-dom'

const IMAGE_URL = import.meta.env.VITE_TMDB_IMAGE_URL

const MovieCard = ({ movie }) => {
    const year = movie.release_date?.split("-")[0]

    return (
        <Link to={`/movies/${movie.id}`}>
            <div>
                <img
                    src={`${IMAGE_URL}${movie.poster_path}`}
                    alt={movie.title}
                />
                <h3>{movie.title}</h3>
                <p>⭐ {movie.vote_average?.toFixed(1)}</p>
                <p>{year}</p>
            </div>
        </Link>
    )
}

export default MovieCard