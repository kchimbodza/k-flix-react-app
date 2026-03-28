import { useState } from 'react'
import { Link } from 'react-router-dom'
import { searchMovies } from '../services/tmdb'
import { useAuth } from '../context/AuthContext'
import MovieCard from '../components/MovieCard'

const Search = () => {
    const [query, setQuery] = useState('')
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { user } = useAuth()

    const handleSearch = async () => {
        if (!query.trim()) return
        setLoading(true)
        setError(null)
        try {
            const data = await searchMovies(query)
            if (data.length === 0) setError('No movies found')
            setMovies(data)
        } catch (err) {
            setError('Search failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSearch()
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center text-white mb-2">Search Movies</h1>
            {user && (
                <p className="text-center text-gray-400 mb-4">
                    Looking for more filters?{' '}
                    <Link to="/advanced-search" className="text-red-500 hover:underline">Try Advanced Search</Link>
                </p>
            )}
            <div className="flex gap-2 max-w-xl mx-auto mb-6">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search for a movie..."
                    className="flex-1 p-2 rounded bg-gray-700 text-white"
                />
                <button
                    onClick={handleSearch}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Search
                </button>
            </div>
            {loading && <p className="text-white text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    )
}

export default Search