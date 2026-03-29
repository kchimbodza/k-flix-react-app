import { Link } from 'react-router-dom'
import { useFavourites } from '../context/FavouritesContext'
import { useAuth } from '../context/AuthContext'
import MovieCard from '../components/MovieCard'

const Favourites = () => {
    const { favourites } = useFavourites()
    const { user } = useAuth()

    return (
        <div className="min-h-screen bg-gray-950 px-16 pt-48 pb-12">
            {/* Header */}
            <div className="mb-10 flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-4xl font-black text-white mb-1">My Favourites</h1>
                    <p className="text-gray-400 text-sm">
                        {favourites.length > 0 ? `${favourites.length} movie${favourites.length === 1 ? '' : 's'} saved` : ''}
                    </p>
                </div>
            </div>

            {favourites.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-32 text-center">
                    <p className="text-7xl mb-6">❤️</p>
                    <h2 className="text-2xl font-bold text-white mb-3">No favourites yet</h2>
                    {user ? (
                        <>
                            <p className="text-gray-400 mb-8 max-w-md">
                                Browse movies and click the heart icon to save them here.
                            </p>
                            <Link
                                to="/"
                                className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-all"
                            >
                                Browse Movies
                            </Link>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-400 mb-8 max-w-md">
                                Create an account to save favourites permanently across devices!
                            </p>
                            <Link
                                to="/register"
                                className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-all"
                            >
                                Create Account
                            </Link>
                        </>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-10">
                    {favourites.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Favourites