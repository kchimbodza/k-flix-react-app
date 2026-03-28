import { createContext, useContext, useState, useEffect } from 'react'

const FavouritesContext = createContext()

export const FavouritesProvider = ({ children }) => {
    const [favourites, setFavourites] = useState(() => {
        const saved = localStorage.getItem('favourites')
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem('favourites', JSON.stringify(favourites))
    }, [favourites])

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

// eslint-disable-next-line react-refresh/only-export-components
export const useFavourites = () => useContext(FavouritesContext)