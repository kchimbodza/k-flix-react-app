import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
    const { user, logout } = useAuth()

    return (
        <nav className="bg-gray-900 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
            <Link to="/" className="text-red-500 font-bold text-2xl">K-Flix</Link>
            <div className="flex items-center gap-4">
                <Link to="/" className="text-gray-300 hover:text-white text-sm">Home</Link>
                <Link to="/search" className="text-gray-300 hover:text-white text-sm">Search</Link>
                {user ? (
                    <>
                        <Link to="/favorites" className="text-gray-300 hover:text-white text-sm">Favourites</Link>
                        <Link to="/watchlists" className="text-gray-300 hover:text-white text-sm">Watchlists</Link>
                        <Link to="/profile" className="text-gray-300 hover:text-white text-sm">Profile</Link>
                        <button onClick={logout} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-300 hover:text-white text-sm">Login</Link>
                        <Link to="/register" className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar