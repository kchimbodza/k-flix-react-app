import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../services/api'
import { useAuth } from '../context/AuthContext'
import PosterBackground from '../components/PosterBackground'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const user = await loginUser(email, password)
            if (!user) {
                setError('Invalid email or password')
                return
            }
            login(user)
            navigate('/')
        } catch {
            setError('Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <PosterBackground />

            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="text-center mb-8">
                    <Link to="/" className="text-4xl font-black tracking-tight">
                        <span className="text-orange-500">K</span>
                        <span className="text-white">-Flix</span>
                    </Link>
                    <p className="text-gray-400 mt-2">Welcome back</p>
                </div>

                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-6">
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="mb-5">
                            <label className="text-gray-400 text-sm mb-2 block">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div className="mb-8">
                            <label className="text-gray-400 text-sm mb-2 block">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                                placeholder="Your password"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 text-white py-3 rounded-full font-bold hover:bg-orange-600 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p className="text-gray-400 text-center mt-6 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-orange-500 hover:text-orange-400 font-semibold">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login