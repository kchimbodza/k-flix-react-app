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
            } catch (err) {
                setError('Failed to fetch movies')
            } finally {
                setLoading(false)
            }
        }
        fetchMovies()
    }, [])

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>

    return (
        <div>
            <h1>Trending Movies</h1>
            <div>
                {movies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    )
}

export default Home