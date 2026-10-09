import React from 'react'
import { NavLink } from 'react-router-dom'
import { BsBuildings } from "react-icons/bs";
import { SlPeople } from "react-icons/sl";
import { LuHousePlus } from "react-icons/lu";
import { LiaMoneyBillWaveAltSolid } from "react-icons/lia";
import { FiSettings } from "react-icons/fi";
import { BsPersonBoundingBox } from "react-icons/bs";
import { IoIosArrowDropleft } from "react-icons/io";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { HiMiniArrowRightOnRectangle } from "react-icons/hi2";
import { GiTakeMyMoney } from "react-icons/gi";
import { RxDashboard } from "react-icons/rx";

const Sidebar = ({showSidebar, setShowSidebar,theme, setTheme, toggleTheme}) => {
    return (
        <div className={`bg-blue-50 relative flex h-screen text-sm dark:bg-gray-900 p-3 z-50 dark:text-gray-300 border-r transition-color ease-in-out duration-300 border-white dark:border-gray-800 ${showSidebar ? 'w-20 justify-center' : 'w-48'}`}>
            <div className='absolute -right-3 cursor-pointer top-4'>
                <IoIosArrowDropleft className={`text-2xl bg-white rounded-full text-gray-500 dark:bg-gray-900 ${showSidebar ? 'rotate-180' : 'rotate-0'}`} onClick={() => setShowSidebar(prev => !prev)}/>
            </div>

            <div className='flex flex-col min-h-full justify-between'>
                <div>
                    <div className=''>
                        <img src={`${showSidebar ? '/sidebar.png' : '/winfam.png'}`} alt="" className={`${showSidebar ? 'dark:invert h-16 w-16' : ''}`} />
                    </div>

                    <div className='space-y-1'>
                        <div className='space-y-1'>
                            {!showSidebar && (
                                <div className='flex items-center text-gray-400'>
                                    <p className='font-semibold'>Dashboard</p>
                                </div>
                            )}
                            <div className='space-y-1'>
                                <NavLink to='/dashboard' className={({isActive}) => `flex px-3 py-1 border rounded items-center gap-3 ${
                                    isActive ? 'border-l-5 border-blue-400 text-blue-400'
                                    : 'border-transparent hover:border-b-2 hover:border-gray-400 dark:hover:border-gray-500'
                                }`}>
                                    <RxDashboard className='text-xl'/> {showSidebar ? '' : 'Dashboard'}
                                </NavLink>
                            </div>
                        </div>

                        <div className='space-y-1'>
                            {!showSidebar && (
                                <div className='flex items-center text-gray-400'>
                                    <p className='font-semibold'>Financial</p> 
                                </div>
                            )}

                            <div className='space-y-1'>
                                <NavLink to='/financials' className={({isActive}) => `flex border px-3 py-1 rounded items-center gap-3 ${
                                    isActive ? 'border-l-5 border-blue-400 text-blue-400'
                                    : 'border-transparent hover:border-b-2 hover:border-gray-400 dark:hover:border-gray-500'
                                }`}>
                                    <LiaMoneyBillWaveAltSolid className='text-xl'/> {showSidebar ? '' : 'Financials'}
                                </NavLink>

                                <NavLink to='/utilities' className={({isActive}) => `flex border px-3 py-1 rounded items-center gap-3 ${
                                    isActive ? 'border-l-5 border-blue-400 text-blue-400'
                                    : 'border-transparent hover:border-b-2 hover:border-gray-400 dark:hover:border-gray-500'
                                }`}>
                                    <GiTakeMyMoney className='text-xl'/> {showSidebar ? '' : 'Utilities'}
                                </NavLink>
                            </div>
                        </div>

                        <div className='space-y-1'>
                            {!showSidebar && (
                                <div className='flex items-center text-gray-400'>
                                    <p className='font-semibold'>Property</p>
                                </div>
                            )}
                            <div className='space-y-1'>
                                <NavLink to='/properties' className={({isActive}) => `flex px-3 py-1 border rounded items-center gap-3 ${
                                    isActive ? 'border-l-5 border-blue-400 text-blue-400'
                                    : 'border-transparent hover:border-b-2 hover:border-gray-400 dark:hover:border-gray-500'
                                }`}>
                                    <BsBuildings className='text-xl'/> {showSidebar ? '' : 'Properties'}
                                </NavLink>

                                <NavLink to='/units' className={({isActive}) => `flex border px-3 py-1 rounded items-center gap-3 ${
                                    isActive ? 'border-l-5 border-blue-400 text-blue-400'
                                    : 'border-transparent hover:border-b-2 hover:border-gray-400 dark:hover:border-gray-500'
                                }`}>
                                    <LuHousePlus className='text-xl'/> {showSidebar ? '' : 'Unit'}
                                </NavLink>
                                
                            </div>
                        </div>

                        <div className='space-y-1'>
                            {!showSidebar && (
                                <div className='flex items-center text-gray-400'>
                                    <p className='font-semibold'>Tenant</p>
                                </div>
                            )}

                            <div>
                                <NavLink to='/tenants' className={({isActive}) => `flex border px-3 py-1 rounded items-center gap-3 ${
                                    isActive ? 'border-l-5 border-blue-400 text-blue-400'
                                    : 'border-transparent hover:border-b-2 hover:border-gray-400 dark:hover:border-gray-500'
                                }`}>
                                    <SlPeople className='text-xl'/> {showSidebar ? '' : 'Tenants'}
                                </NavLink>
                            </div>
                        </div>

                        <div className='space-y-1'>
                            {!showSidebar && (
                                <div className='flex items-center text-gray-400'>
                                    <p className='font-semibold'>Reports</p> 
                                </div>
                            )}

                            <div>
                                <NavLink to='/settings' className={({isActive}) => `flex border px-3 py-1 rounded items-center gap-3 ${
                                    isActive ? 'border-l-5 border-blue-400 text-blue-400'
                                    : 'border-transparent hover:border-b-2 hover:border-gray-400 dark:hover:border-gray-500'
                                }`}>
                                    <HiOutlineClipboardDocumentList className='text-xl'/> {showSidebar ? '' : 'Reports'}
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='space-y-1'>
                    {!showSidebar && (
                        <div className='flex items-center text-gray-400'>
                            <p className='font-semibold'>Settings</p> 
                        </div>
                    )}

                    <div className='space-y-1'>
                        <NavLink to='/settings' className={({isActive}) => `flex border px-3 py-1 rounded items-center gap-3 ${
                            isActive ? 'border-l-5 border-blue-400 text-blue-400'
                            : 'border-transparent hover:border-b-2 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}>
                            <FiSettings className='text-xl'/> {showSidebar ? '' : 'Settings'}
                        </NavLink>
                        <NavLink to='/logout' className={({isActive}) => `flex border text-red-500 dark:text-red-700 px-3 py-1 rounded items-center gap-3 ${
                            isActive ? 'border-l-5 border-red-600 text-red-600'
                            : 'border-transparent hover:border-red-600 hover:text-red-600'
                        }`}>
                            <HiMiniArrowRightOnRectangle className='text-xl'/> {showSidebar ? '' : 'Logout'}
                        </NavLink>
                    </div>
                </div>
            </div>
        
        </div>
    )
}

export default Sidebar
