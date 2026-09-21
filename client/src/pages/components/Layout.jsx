import React from 'react'
import {Outlet} from 'react-router-dom'
import Sidebar from './Sidebar'
import {useState, useEffect} from 'react'
import Header from './Header'

const Layout = () => {
    const [showSidebar, setShowSidebar] = useState(false)
    const [theme, setTheme] = useState('light')

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [theme])
    
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
    }
    
    return (
        <div className='flex text-gray-700 h-screen overflow-hidden'>
            <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} theme={theme} toggleTheme={toggleTheme} />
             <main className='flex-1 bg-blue-50 min-w-0 h-full text-sm overflow-y-auto transition-colors ease-in-out duration-300 no-scrollbar dark:bg-gray-900 dark:text-gray-300'>
                <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} theme={theme} toggleTheme={toggleTheme} />
                <div className='p-3'>
                    <Outlet context={{ showSidebar, setShowSidebar, theme, setTheme, toggleTheme }} />
                </div>
            </main>  
        </div>
    )
}

export default Layout
