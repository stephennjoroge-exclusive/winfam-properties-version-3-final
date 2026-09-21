import React from 'react'
import useProfile from './useProfile'
import { FaHouseUser } from "react-icons/fa";
import NameColor from '../components/NameColor';
import { LuHousePlus } from "react-icons/lu";
import { RiAccountPinCircleLine } from "react-icons/ri";
import { MdAttachMoney } from "react-icons/md";
import { MdOutlineMailOutline } from "react-icons/md";
import { MdLockReset } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const Login = () => {
    const {profile} = useProfile()
    const {getColorFromName, getInitials} = NameColor()


    return (
        <div className='flex items-center text-gray-700 bg-blue-50'>
            <div className="bg-[radial-gradient(120%_140%_at_15%_10%,_#1E74D0_0%,_#1259A8_46%,_#0F3D73_100%)] w-[60%] h-screen flex items-center text-gray-200">
                <div className='flex flex-col p-9 justify-between h-full'>
                    <div className='flex gap-2 items-center'>
                        <div className='bg-white/20 border border-gray-400 rounded-xl p-3'>
                            <FaHouseUser className='text-3xl text-orange-300'/>
                        </div>
                        
                        <div>
                            <p className='font-semibold text-2xl'> Winfam<span className='text-orange-300'>Properties</span></p>
                        </div>
                    </div>

                    <div className='space-y-5'>
                        <div className='text-5xl font-bodoni'>
                            <p>Every unit, tenant and shilling — one clear view.</p>
                        </div>

                        <div className='text-xl'>
                            <p>Sign in to manage properties, track rent status and</p>
                            <p>keep your portfolio's balance sheet current.</p>
                        </div>
                    </div>

                    <div className='space-y-5'>
                        <div className='flex gap-2 items-center'>
                            <div className='bg-white/20 border border-gray-400 rounded-xl p-2'>
                                <LuHousePlus className='text-3xl text-orange-300'/>
                            </div>

                            <p><span className='font-bold text-xl'>Unit-level detail</span> — rent, status and balance for every property in one place.</p>
                        </div>

                        <div className='flex gap-2 items-center'>
                            <div className='bg-white/20 border border-gray-400 rounded-xl p-2'>
                                <RiAccountPinCircleLine className='text-3xl text-orange-300'/>
                            </div>

                            <p><span className='font-bold text-xl'>Tenant records</span> — kept current, with payment history at a glance.</p>
                        </div>

                        <div className='flex gap-2 items-center'>
                            <div className='bg-white/20 border border-gray-400 rounded-xl p-2'>
                                <MdAttachMoney className='text-3xl text-orange-300'/>
                            </div>

                            <p><span className='font-bold text-xl'>Clear balances </span> — now exactly who owes what, and when it's due.</p>
                        </div>
                    </div>
                    
                    <div className='flex gap-2 items-center'>
                        <div className='flex'>
                            {Array.isArray(profile) && profile.length > 0 && (
                                profile.map((item, index) => (
                                    <div key={item.id} className='-ml-3 first:ml-0'>
                                        <div className='flex'>
                                            <span className={`${getColorFromName(item.name)} h-12 w-12 rounded-full border-5 border-[#1259A8] flex justify-center font-bold text-xl items-center`}>
                                                {getInitials(item.name)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className='text-xl'>
                            <p className='text-gray-400'><span className='font-bold text-gray-50'>Trusted by landlords</span> managing over 40 properties across the city</p>
                        </div>
                    </div>
                   
                </div>      
            </div>
            
            <div className='flex flex-col p-9  w-[50%] h-full justify-center items-center'>
                <div className='absolute min-h-full flex items-center justify-center'>
                    <img src="/winfam.png" width={500} alt="" className='opacity-20 ' />
                </div>

                <div className='font-bold text-center text-4xl font-bodoni my-3'>
                    <p>Welcome Back</p>
                    <p className='font-sans text-xl'>Login</p>
                </div>
               
               

                <form action="" className='w-full'>
                    <div className='space-y-5'>
                        <div className='text-xl'>
                            <label htmlFor="" className='font-semibold'>Email Address</label>
                            <div className='flex relative w-full items-center px-3 h-15 py-1 border rounded-xl bg-white border-gray-200 dark:border-gray-700'>
                                <div className='pr-3'>
                                    <MdOutlineMailOutline className='text-gray-400 text-2xl'/>
                                </div>
                                <input placeholder={`Email Address`} type="search" className='border:none w-full outline:none dark:text-gray-300 focus:outline-none'/>
                            </div>
                        </div>

                        <div className='text-xl '>
                            <label htmlFor="" className='font-semibold'>Password</label>
                            <div className='flex relative w-full items-center px-3 h-15 py-1 border rounded-xl bg-white border-gray-200 dark:border-gray-700'>
                                <div className='pr-3'>
                                    <MdLockReset className='text-gray-400 text-3xl'/>
                                </div>
                                <input placeholder={`************`} type="search" className='border:none w-full outline:none dark:text-gray-300 focus:outline-none'/>
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center justify-between text-xl my-3'>
                        <div className='flex gap-3'>
                             <input type="checkbox" />
                             <p>Remember me</p>
                        </div>
                        <div>
                            <p className='underline text-blue-500'>Forgot password?</p>
                        </div>
                    </div>

                    <div>
                        <button className='flex gap-3 cursor-pointer shadow-xl shadow-gray-400 outline-none border-none items-center rounded-xl text-xl font-semibold justify-center bg-blue-500 text-white h-12 w-full border'>
                            <span>Login</span>
                            <FaArrowRightLong />
                        </button>

                        <div className='flex gap-3 items-center my-3'>
                            <p className='flex-1 bg-gray-300 h-px'></p>
                            <span>or continue with</span>
                            <p className='flex-1 bg-gray-300 h-px'></p>
                        </div>

                        <div className='text-xl flex gap-3'>
                            <button className='flex items-center cursor-pointer justify-center gap-3 border bg-white border-gray-300 rounded-xl px-3 w-full py-1'>
                                <FcGoogle className='text-3xl' />
                                <span>Google</span>
                            </button>

                            <button className='flex items-center cursor-pointer justify-center gap-3 border bg-white border-gray-300 rounded-xl px-3 w-full py-1'>
                                <FaFacebook className='text-3xl'/>
                                <span>Google</span>
                            </button>
                        </div>

                        <div className='text-gray-400 flex items-center justify-center my-3'>
                            <p>&copy; Winfam Properties. All rights reserved. </p>
                        </div>


                    </div>
                   
                </form> 
            </div>
            
        </div>
    )
}

export default Login
