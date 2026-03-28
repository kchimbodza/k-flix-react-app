import { useFavourites } from '../context/FavouritesContext'
import MovieCard from '../components/MovieCard'

const Favourites = () => {
    const { favourites } = useFavourites()

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center text-white mb-6">My Favourites</h1>
            {favourites.length === 0 ? (
                <p className="text-center text-gray-400">
                    You haven't added any favourites yet!
                </p>
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