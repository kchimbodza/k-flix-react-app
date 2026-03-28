import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getMovieDetails } from '../services/tmdb'

const MovieDetails = () => {
    const { id } = useParams()
    const [movie, setMovie] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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

    if (loading) return <div className="text-white text-center mt-10">Searching...Please wait!</div>
    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>

    return (
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
                    <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
                </div>
            </div>
        </div>
    )
}

export default MovieDetails