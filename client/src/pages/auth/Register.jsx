import React, { useState } from 'react'
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
import { CgProfile } from "react-icons/cg";
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import toast from 'react-hot-toast'

const Register = () => {
    const {profile} = useProfile()
    const navigate = useNavigate()
    const {getColorFromName, getInitials} = NameColor()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState(null)
    const [success, setSuccess] = useState('')
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password1: '',
        password2: ''
    })

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
        console.log({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async(e)  => {
        e.preventDefault()
        if (loading) {
            return;
        }

        setLoading(true)
        setErrors(null)
        setSuccess(null)

        try{
            const res = await axios.post('http://127.0.0.1:8000/api/accounts/register/', formData);
            toast.success('Registration Successful. Redirecting to login...', {
                style: {
                    background: '#3b8132',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '15px',
                    fontSize: '16px',
                },
                iconTheme: {
                    primary: '#fff',
                    secondary: '#3b8132',
                },
            })
            
            setFormData({  
                first_name: '',
                last_name: '',
                email: '',
                password1: '',
                password2: '',
            });

            setTimeout(() => {
                navigate('/')
            }, 2000)


        } catch (err) {
            toast.error('Something went wrong. Please try again.', {
                style: {
                    background: '#d1001f',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '15px',
                    fontSize: '16px',
                },
                iconTheme: {
                    primary: '#fff',
                    secondary: '#d1001f',
                },
            })

            if (err.response && err.response.data) {
                Object.keys(err.response.data).forEach(field => {
                    const errorMessages = err.response.data[field]
                    if (errorMessages && errorMessages.length > 0){
                        setErrors(errorMessages[0])
                    }
                })
            }
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className='flex h-screen text-gray-700 overflow-hidden bg-blue-50'>
            <div className="bg-[radial-gradient(120%_140%_at_15%_10%,_#1E74D0_0%,_#1259A8_46%,_#0F3D73_100%)] w-[60%] h-screen overflow-auto flex items-center text-gray-200">
                <div className='flex flex-col p-9 justify-between h-full'>
                    <div className='flex gap-2 items-center'>
                        <div className='bg-white/20 border border-gray-400 rounded-xl p-3'>
                            <FaHouseUser className='text-3xl text-orange-300'/>
                        </div>
                        
                        <div className=''>
                            <p className='font-semibold text-2xl'> Winfam<span className='text-orange-300'>Properties</span></p>
                        </div>
                    </div>

                    <div className='space-y-5'>
                        <div className='text-5xl font-bodoni'>
                            <p>Set up your portfolio in minutes, not weeks.</p>
                        </div>

                        <div className='text-xl'>
                            <p>Create an account to start tracking units, tenants</p>
                            <p>and rent status — all from one dashboard.</p>
                        </div>
                    </div>

                    <div className='space-y-5'>
                        <div className='flex gap-2 items-center'>
                            <div className='bg-white/20 border border-gray-400 rounded-xl p-2'>
                                <LuHousePlus className='text-3xl text-orange-300'/>
                            </div>

                            <p><span className='font-bold text-xl'>Unit-level detail</span> —  rent, status and balance for every property in one place.</p>
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

                            <p><span className='font-bold text-xl'>Clear balances </span> — know exactly who owes what, and when it's due.</p>
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
            
            <div className='flex relative flex-col overflow-auto h-full p-9 w-[50%] justify-center '>
                <div className='absolute min-h-full pointer-events-none flex items-center justify-center'>
                    <img src="/winfam.png" width={500} alt="" className='opacity-20 ' />
                </div>

                <div className='font-bold text-4xl font-bodoni mt-3 text-center'>
                    <p>Welcome Back</p>
                    <button className='font-sans text-xl text-gray-400 font-normal'>Already have an account? <Link to='/' className='cursor-pointer font-normal underline text-blue-500'>login</Link></button>
                </div>
               
                <form action="" onSubmit={handleSubmit} className='flex flex-col mt-6'>
                    <div className='space-y-5'>
                        <div className='flex items-center gap-2'>
                            <div className='text-xl'>
                                <label htmlFor="" className='font-semibold'>First Name</label>
                                <div className='flex relative w-full items-center px-3 h-12 py-1 border rounded-xl bg-white border-gray-200 dark:border-gray-700'>
                                    <div className='pr-3'>
                                        <CgProfile className='text-gray-400 text-3xl'/>
                                    </div>
                                    <input name='first_name' value={formData.first_name} onChange={handleChange} placeholder={`Full Name`} type="text" className='border:none w-full outline:none dark:text-gray-300 focus:outline-none'/>
                                </div>
                            </div>
                            <div className='text-xl'>
                                <label htmlFor="" className='font-semibold'>Last Name</label>
                                <div className='flex relative w-full items-center px-3 h-12 py-1 border rounded-xl bg-white border-gray-200 dark:border-gray-700'>
                                    <div className='pr-3'>
                                        <CgProfile className='text-gray-400 text-3xl'/>
                                    </div>
                                    <input  name='last_name' onChange={handleChange} value={formData.last_name} placeholder={`Full Name`} type="text" className='border:none w-full outline:none dark:text-gray-300 focus:outline-none'/>
                                </div>
                            </div>
                        </div>
           

                        <div className='text-xl '>
                            <label htmlFor="" className='font-semibold'>Email</label>
                            <div className='flex relative w-full items-center px-3 h-12 py-1 border rounded-xl bg-white border-gray-200 dark:border-gray-700'>
                                <div className='pr-3'>
                                    <MdOutlineMailOutline className='text-gray-400 text-3xl'/>
                                </div>
                                <input  name='email' onChange={handleChange} value={formData.email} placeholder={`Email Address`} type="email" className='border:none w-full outline:none dark:text-gray-300 focus:outline-none'/>
                            </div>
                        </div>

                        <div className='text-xl '>
                            <label htmlFor="" className='font-semibold'>Password</label>
                            <div className='flex relative w-full items-center px-3 h-12 py-1 border rounded-xl bg-white border-gray-200 dark:border-gray-700'>
                                <div className='pr-3'>
                                    <MdLockReset className='text-gray-400 text-3xl'/>
                                </div>
                                <input  name='password1' onChange={handleChange} value={formData.password1} placeholder={`************`} type={showPassword ? 'text' : 'password'} className='border:none w-full outline:none dark:text-gray-300 focus:outline-none'/>
                                <span onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaRegEye className='cursor-pointer'/> : <FaEyeSlash className='cursor-pointer'/>}</span>
                            </div>
                        </div>

                        <div className='text-xl '>
                            <label htmlFor="" className='font-semibold'>Rewrite Password</label>
                            <div className='flex relative w-full items-center px-3 h-12 py-1 border rounded-xl bg-white border-gray-200 dark:border-gray-700'>
                                <div className='pr-3'>
                                    <MdLockReset className='text-gray-400 text-3xl'/>
                                </div>
                                <input  name='password2' onChange={handleChange} value={formData.password2} placeholder={`************`} type={showPassword ? 'text' : 'password'} className='border:none w-full outline:none dark:text-gray-300 focus:outline-none'/>
                                <span onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaRegEye className='cursor-pointer'/> : <FaEyeSlash className='cursor-pointer'/>}</span>
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center gap-3 text-base my-3'>
                        <input type="checkbox" />
                        <p>I agree to the <span className='font-semibold text-blue-800'>Terms of Service and Privacy Policy</span> </p>
                    </div>

                    <div>
                        <button type='submit' disabled={loading} className='flex gap-3 cursor-pointer shadow-xl shadow-gray-400 outline-none border-none items-center rounded-xl text-xl font-semibold justify-center bg-blue-500 text-white h-12 w-full border'>
                            {loading 
                            ? <span className='animate-spin h-7 w-7 border-3 border-t-transparent border-white rounded-full'></span> 
                            : <span className='flex items-center gap-2'>
                                <span>Register</span> 
                                <FaArrowRightLong />
                            </span> }
                            
                        </button>

                        <div className='flex gap-3 items-center my-3'>
                            <p className='flex-1 bg-gray-400 h-px'></p>
                            <span>or sign with</span>
                            <p className='flex-1 bg-gray-400 h-px'></p>
                        </div>

                        <div className='text-xl flex gap-3'>
                            <button className='flex cursor-pointer items-center justify-center gap-3 border bg-white border-gray-300 rounded-xl px-3 w-full py-1'>
                                <FcGoogle className='text-3xl' />
                                <span>Google</span>
                            </button>

                            <button className='flex items-center cursor-pointer justify-center gap-3 border bg-white border-gray-300 rounded-xl px-3 w-full py-1'>
                                <FaFacebook className='text-3xl'/>
                                <span>Facebook</span>
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

export default Register
