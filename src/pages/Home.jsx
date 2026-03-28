import { useState, useEffect } from 'react'
import { getTrending } from '../services/tmdb'
import MovieCard from '../components/MovieCard'

const Home = () => {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await getTrending()
                setMovies(data)
            } catch {
                setError('Failed to fetch movies')
            } finally {
                setLoading(false)
            }
        }
        void fetchMovies()
    }, [])

    if (loading) return <div className="text-white text-center mt-10">Loading...</div>
    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center text-white mb-6">Trending Movies</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} showHeartOnHover={true} />
                ))}
            </div>
        </div>
    )
}

export default Home