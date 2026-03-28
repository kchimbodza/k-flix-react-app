import { useState, useEffect } from 'react'
import { discoverMovies, getGenres } from '../services/tmdb'
import MovieCard from '../components/MovieCard'

const AdvancedSearch = () => {
    const [genres, setGenres] = useState([])
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [filters, setFilters] = useState({
        genre: '',
        yearFrom: '',
        yearTo: '',
        rating: '',
        language: ''
    })

    useEffect(() => {
        const fetchGenres = async () => {
            const data = await getGenres()
            setGenres(data)
        }
        fetchGenres()
    }, [])

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }

    const handleSearch = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await discoverMovies(filters)
            if (data.length === 0) setError('No movies found')
            setMovies(data)
        } catch (err) {
            setError('Search failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center text-white mb-6">Advanced Search</h1>
            <div className="bg-gray-800 rounded-lg p-6 mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                    <label className="text-gray-400 text-sm mb-1 block">Genre</label>
                    <select
                        name="genre"
                        value={filters.genre}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    >
                        <option value="">All Genres</option>
                        {genres.map(genre => (
                            <option key={genre.id} value={genre.id}>{genre.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-gray-400 text-sm mb-1 block">Year From</label>
                    <input
                        type="number"
                        name="yearFrom"
                        value={filters.yearFrom}
                        onChange={handleChange}
                        placeholder="e.g. 2000"
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                </div>
                <div>
                    <label className="text-gray-400 text-sm mb-1 block">Year To</label>
                    <input
                        type="number"
                        name="yearTo"
                        value={filters.yearTo}
                        onChange={handleChange}
                        placeholder="e.g. 2024"
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                </div>
                <div>
                    <label className="text-gray-400 text-sm mb-1 block">Min Rating</label>
                    <input
                        type="number"
                        name="rating"
                        value={filters.rating}
                        onChange={handleChange}
                        placeholder="e.g. 7"
                        min="0"
                        max="10"
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    />
                </div>
                <div>
                    <label className="text-gray-400 text-sm mb-1 block">Language</label>
                    <select
                        name="language"
                        value={filters.language}
                        onChange={handleChange}
                        className="w-full p-2 rounded bg-gray-700 text-white"
                    >
                        <option value="">All Languages</option>
                        <option value="en">English</option>
                        <option value="fr">French</option>
                        <option value="es">Spanish</option>
                        <option value="de">German</option>
                        <option value="ja">Japanese</option>
                        <option value="ko">Korean</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        onClick={handleSearch}
                        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
                    >
                        Search
                    </button>
                </div>
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

export default AdvancedSearch