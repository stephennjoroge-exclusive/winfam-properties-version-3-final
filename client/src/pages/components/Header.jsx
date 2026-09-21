import React from 'react'
import { MdNotificationsNone } from "react-icons/md";
import { MdOutlineWbSunny } from "react-icons/md";
import { IoMoonOutline } from "react-icons/io5";
import { IoSearchSharp } from "react-icons/io5";
import BreadCrumbs from './BreadCrumbs';

const Header = ({showSidebar, setShowSidebar, theme, setTheme, toggleTheme }) => {
    return (
        <div className={`flex px-3 border-b border-white dark:border-gray-800 bg-blue-50 sticky items-center justify-between h-[50px] z-40 top-0 right-0 dark:bg-gray-900 dark:text-gray-300 ${showSidebar ? 'left-16 duration-300 transition-all': 'left-48 duration-300 transition-all'}`}>
            <div className=''>
               <BreadCrumbs/>
            </div>
            {/* <span className='text-gray-400'>make sure u add a useref for all those dropdowns including the filters that will make the dropdowns close when you open another dropdown </span> */}

            <div className='flex gap-3 items-center justify-between text-xl'>
                <div><MdNotificationsNone/></div>
                <div><MdNotificationsNone/></div>
                <button onClick={toggleTheme} className='flex transition-all duration-300 justify-center items-center cursor-pointer rounded-full p-2 shadow-md'>{theme === 'light' ? <IoMoonOutline/> : <MdOutlineWbSunny/>}</button>
            </div>
        
        </div>
    )
}

export default Header
