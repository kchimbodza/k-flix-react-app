import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav>
            <Link to="/">K-Flix</Link>
            <Link to="/search">Search</Link>
            <Link to="/advanced-search">Advanced Search</Link>
            <Link to="/favorites">Favourites</Link>
            <Link to="/watchlists">Watchlists</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
        </nav>
    )
}

export default Navbar