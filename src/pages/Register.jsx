import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

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
        } catch (err) {
            setError('Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h1>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="text-gray-400 text-sm mb-1 block">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 rounded bg-gray-700 text-white"
                            placeholder="Your name"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-gray-400 text-sm mb-1 block">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded bg-gray-700 text-white"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="text-gray-400 text-sm mb-1 block">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded bg-gray-700 text-white"
                            placeholder="Min 6 characters"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 font-semibold"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                <p className="text-gray-400 text-center mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-red-500 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Register