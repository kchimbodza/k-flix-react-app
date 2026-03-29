import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/api'
import { useAuth } from '../context/AuthContext'
import PosterBackground from '../components/PosterBackground'

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        setError(null)

        if (!name || !email || !password) {
            setError('All fields are required')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)
        try {
            const newUser = await registerUser({ name, email, password })
            login(newUser)
            navigate('/')
        } catch {
            setError('Registration failed. Please try again.')
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
                    <p className="text-gray-400 mt-2">Create your account</p>
                </div>

                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-6">
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleRegister}>
                        <div className="mb-5">
                            <label className="text-gray-400 text-sm mb-2 block">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                                placeholder="Your name"
                            />
                        </div>
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
                                placeholder="Min 6 characters"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 text-white py-3 rounded-full font-bold hover:bg-orange-600 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-gray-400 text-center mt-6 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-orange-500 hover:text-orange-400 font-semibold">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register