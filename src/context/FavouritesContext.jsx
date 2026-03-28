import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const FavouritesContext = createContext()

export const FavouritesProvider = ({ children }) => {
    const { user } = useAuth()

    const [favourites, setFavourites] = useState(() => {
        if (!user) return []
        const saved = localStorage.getItem(`favourites_${user.id}`)
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        if (!user) {
            setFavourites([])
            return
        }
        const saved = localStorage.getItem(`favourites_${user.id}`)
        setFavourites(saved ? JSON.parse(saved) : [])
    }, [user])

    useEffect(() => {
        if (user) {
            localStorage.setItem(`favourites_${user.id}`, JSON.stringify(favourites))
        }
    }, [favourites, user])

    const addFavourite = (movie) => {
        setFavourites(prev => [...prev, movie])
    }

    const removeFavourite = (movieId) => {
        setFavourites(prev => prev.filter(m => m.id !== movieId))
    }

    const isFavourite = (movieId) => {
        return favourites.some(m => m.id === movieId)
    }

    return (
        <FavouritesContext.Provider value={{ favourites, addFavourite, removeFavourite, isFavourite }}>
            {children}
        </FavouritesContext.Provider>
    )
}

export const useFavourites = () => useContext(FavouritesContext)