import axios from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

export const getTrending = async () => {
    const response = await axios.get(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`)
    return response.data.results
}

export const searchMovies = async (query) => {
    const response = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`)
    return response.data.results
}

export const getMovieDetails = async (id) => {
    const response = await axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`)
    return response.data
}