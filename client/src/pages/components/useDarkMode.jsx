import React from 'react'
import {useState, useEffect} from 'react'

const useDarkMode = () => {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme')
        if (saved) return saved === 'dark'
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    useEffect (() => {
        document.documentElement.classList.toggle('dark', darkMode)
        localStorage.setItem('theme', darkMode ? 'dark' : 'light')
    }, [darkMode])

    return [darkMode, setDarkMode]
}

export default useDarkMode
