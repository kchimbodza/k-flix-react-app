import axios from 'axios'

const BASE_URL = 'http://localhost:3001'

// Users
export const registerUser = async (userData) => {
    const response = await axios.post(`${BASE_URL}/users`, userData)
    return response.data
}

export const loginUser = async (email, password) => {
    const response = await axios.get(`${BASE_URL}/users`)
    const user = response.data.find(
        (u) => u.email === email && u.password === password
    )
    return user
}

// Favourites
export const getUserFavourites = async (userId) => {
    const response = await axios.get(`${BASE_URL}/favourites?userId=${userId}`)
    return response.data
}

export const addUserFavourite = async (userId, movie) => {
    const response = await axios.post(`${BASE_URL}/favourites`, { userId, ...movie })
    return response.data
}

export const removeUserFavourite = async (id) => {
    await axios.delete(`${BASE_URL}/favourites/${id}`)
}