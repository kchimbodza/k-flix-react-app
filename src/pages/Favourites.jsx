import { Link } from 'react-router-dom'
import { useFavourites } from '../context/FavouritesContext'
import MovieCard from '../components/MovieCard'

const Favourites = () => {
    const { favourites } = useFavourites()

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center text-white mb-6">My Favourites</h1>
            {favourites.length === 0 ? (
                <div className="text-center">
                    <p className="text-gray-400 mb-4">
                        You haven't added any favourites yet!
                    </p>
                    <p className="text-gray-500 mb-4">
                        Create an account to save favourites permanently across devices!
                    </p>
                    <Link to="/register" className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
                        Create Account
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {favourites.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Favourites