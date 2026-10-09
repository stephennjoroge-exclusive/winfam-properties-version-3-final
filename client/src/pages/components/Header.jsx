import React from 'react'
import { MdNotificationsNone } from "react-icons/md";
import { MdOutlineWbSunny } from "react-icons/md";
import { IoMoonOutline } from "react-icons/io5";
import BreadCrumbs from './BreadCrumbs';
import NameColor from './NameColor';
import { IoIosArrowDown } from "react-icons/io";

const Header = ({showSidebar, setShowSidebar, theme, setTheme, toggleTheme }) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const {getColorFromName, getInitials} = NameColor()
    
    return (
       <div className='border-b border-white dark:border-gray-800 w-full bg-blue-50 dark:bg-gray-900 dark:text-gray-300 flex px-3 sticky top-0 z-40 items-center justify-between h-[60px]'>
            <div className='mt-5'>
               <BreadCrumbs/>
            </div>

            <div className='flex gap-3 items-center justify-between text-xl'>
                <div className='flex items-center gap-3'>
                    <div className='shadow-md rounded-full p-2'>
                        <div className='relative'>
                            <span className='absolute top-0 right-0 h-1.5 w-1.5 bg-red-500 rounded-full'></span>
                            <MdNotificationsNone className='text-xl text-gray-500 dark:text-gray-400 cursor-pointer' />
                        </div>
                    </div>
                    <button onClick={toggleTheme} className='flex transition-all duration-300 justify-center text-xl items-center cursor-pointer rounded-full p-2 shadow-md'>{theme === 'light' ? <IoMoonOutline/> : <MdOutlineWbSunny/>}</button>
                </div>
              
                <div className='flex items-center border-l px-3 border-gray-300 dark:border-gray-700 gap-2'>
                    <div className={`${getColorFromName(`${user?.first_name} ${user?.last_name}`)} flex justify-center rounded-full w-9 h-9 items-center text-white font-bold`}>
                        {getInitials(`${user?.first_name} ${user?.last_name}`)}
                    </div>

                    <div className='flex flex-col'>
                        <span className='font-bold text-sm capitalize'>{`${user?.first_name} ${user?.last_name ?? ''}`}</span>
                        <span className='text-gray-500 dark:text-gray-400 font-light text-xs capitalize'>{user?.role}</span>
                    </div>

                    <div className='cursor-pointer'>
                        <IoIosArrowDown/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
