import React from 'react'
import axios from 'axios'
import {useState, useEffect} from 'react'
import toast from 'react-hot-toast'
import { GiHamburgerMenu } from "react-icons/gi"
import { PiHouseLineBold } from "react-icons/pi"
import { IoLocationOutline } from "react-icons/io5";
import { IoWaterOutline } from "react-icons/io5";
import { SlPeople } from "react-icons/sl";
import StepIndicator from '../../components/stepIndicator'
import {Link} from 'react-router-dom'
import getErrorMessage from '../../components/getErrorMessage'
import { IoIosArrowDown } from "react-icons/io"

const PropertyForm = ({fetchData}) => {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)
    const [openDropdown, setOpenDropdown] = useState(null)
    const [landlord, setLandlord] = useState([])
    const [query, setQuery] = useState('')
    const [formData, setFormData] = useState({
        landlord: '',
        managers: '',
        location: '',
        water_rate: ''
    })

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/landlords/?page_size=1000/')

            .then(res => { 
                setLandlord(res.data.results ?? res.data)
            })
            .catch(err => {
                console.error('landlords error:', err.response?.status, err.response?.data ?? err.message)
                setErrors(err)
            })
    }, [])

    const selectedLandlord = landlord.find(item => item.id === Number(formData.landlord))

    const handleSubmit = async() => {
        setLoading(true)

        try{
            await axios.post('http://127.0.0.1:8000/api/properties/', formData)
            await fetchData?.()
            toast.success('Properties Added Successfully! ', {
                style: {
                    background: '#3b8132',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '15px',
                    fontSize: '16px',
                },
                iconTheme: {
                    primary: '#fff', 
                    secondary: '#3b8132'
                }
            })

            setFormData({
                landlord: '',
                managers: '',
                location: '',
                water_rate: ''
            })

            setStep(1)

        } catch(err) {
            if (axios.isCancel(err)) return;
            console.log(err.response ?? err.response.data, 'Error Response')
            const message = getErrorMessage(err)
            
            toast.error(message , {
                style: {
                    background: '#d1001f',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '15px',
                    fontSize: '16px',
                },
                iconTheme: { primary: '#fff', secondary: '#d1001f' },
            })
        } finally {
            setLoading(false)
        }
    } 

    const update = (field, value) => {
        setFormData(prev => ({...prev, [field]: value}))
    }

    const getName = item =>
        `${item?.first_name ?? ''} ${item?.last_name ?? ''}`.trim()

    const canContinue = () => {
        if (step === 1) return formData.landlord && formData.managers && formData.water_rate
        return true
    }

    const filteredLandlords = landlord.filter(item =>
        String(getName(item) ?? '').toLowerCase().includes(query.toLowerCase())
    )

    const next = () => canContinue() && setStep(item => item + 1)
    const previous = () => setStep(item => item - 1)

    const propertyData = [
        ['landlord', getName(selectedLandlord)],
        ['managers', formData.managers],
        ['location', formData.location],
        ['water rate', formData.water_rate]
    ]

    return (
        <div className='flex flex-col p-3 text-gray-700  dark:text-gray-300'>
            <span className='flex items-center gap-1'>
                <GiHamburgerMenu className='text-2xl' />
                <p className='font-bold text-2xl'>Add Property</p>
            </span>
            <span className='flex items-center text-gray-400 text-base font-mono mb-3'>
                <p>Add a property</p>
            </span>

            <StepIndicator step={step} totalSteps={2} labels={['Property', 'Confirm']} />

            {step === 1 && (
                <div className='flex justify-center capitalize items-center'>
                    <div className='w-[70%] text-base'>   
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className='flex-1 my-3 relative' >
                                <label htmlFor='property' className='block text-lg font-semibold mb-1'>Landlord</label>

                                <div
                                    className='border border-gray-300 dark:border-gray-700 h-11 px-3 flex items-center justify-between cursor-pointer rounded-xl'
                                    onClick={() => setOpenDropdown(openDropdown === 'landlord' ? null : 'landlord')}>
                                    
                                    <span className='flex items-center gap-3'>
                                        <PiHouseLineBold className='text-2xl text-gray-400' />
                                        {selectedLandlord ? getName(selectedLandlord) : 'Select Landlord'}
                                    </span>

                                    <IoIosArrowDown
                                        className={`transition-transform text-2xl text-gray-400 ${openDropdown === 'landlord' ? 'rotate-180' : ''}`}
                                    />

                                    
                                </div>

                                {openDropdown === 'landlord' && (
                                   <div className='absolute top-full px-3 py-2 left-0 mt-1 w-full rounded-xl bg-blue-50  dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-xl z-10 max-h-60 overflow-y-auto'>
                                        {filteredLandlords.length === 0 && (
                                            <p className='px-3 py-2 text-gray-400'>Nothing to show</p>
                                        )}

                                        <input
                                            autoFocus
                                            id='landlord'
                                            type='text'
                                            placeholder='Select Landlord'
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            className='border border-gray-300 bg-white dark:border-gray-700 w-full h-11 outline-none rounded-xl pl-10 pr-3 placeholder:text-gray-400'
                                        />

                                        {filteredLandlords.map(item => (
                                            <div key={item.id} 
                                                onClick={() => {
                                                    update('landlord', item.id)
                                                    setOpenDropdown(null)
                                                    setQuery('')
                                                }} 
                                                className='px-3 py-2 hover:bg-blue-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer'
                                                >
                                                
                                                    {getName(item)}
                                            </div>
                                        ))}
                                         
                                   </div> 
                                )}
                            </div>
                            
                            <div className='flex-1 my-3'>
                                <label htmlFor='property' className='block text-lg font-semibold mb-1'>Managers</label>

                                <div className='relative'>
                                    <SlPeople className='absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 pointer-events-none'/>

                                    <input
                                        id='property'
                                        type='text'
                                        placeholder='Add Managers'
                                        value={formData.managers}
                                        onChange={(e) => update('managers', e.target.value)}
                                        className='border border-gray-300 dark:border-gray-700 w-full h-11 outline-none rounded-xl pl-10 pr-3 bg-transparent placeholder:text-gray-400'
                                    />
                                </div>
                                
                            </div>

                            <div className='flex-1 my-3'>
                                <label htmlFor='property' className='block text-lg font-semibold mb-1'>Location</label>

                                <div className='relative'>
                                    <IoLocationOutline className='absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 pointer-events-none'/>

                                    <input
                                        id='property'
                                        type='text'
                                        placeholder='Add Location'
                                        value={formData.location}
                                        onChange={(e) => update('location', e.target.value)}
                                        className='border border-gray-300 dark:border-gray-700 w-full h-11 outline-none rounded-xl pl-10 pr-3 bg-transparent placeholder:text-gray-400'
                                    />
                                </div>
                                
                            </div>

                            <div className='flex-1 my-3'>
                                <label htmlFor='property' className='block text-lg font-semibold mb-1'>Water Rate</label>

                                <div className='relative'>
                                    <IoWaterOutline className='absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 pointer-events-none'/>

                                    <input
                                        id='property'
                                        type='text'
                                        placeholder='Enter Water Rate'
                                        value={formData.water_rate}
                                        onChange={(e) => update('water_rate', e.target.value)}
                                        className='border border-gray-300 dark:border-gray-700 w-full h-11 outline-none rounded-xl pl-10 pr-3 bg-transparent placeholder:text-gray-400'
                                    />
                                </div>
                                
                            </div>

                        </form>

                        
                    </div>
                    
                </div>
            )}

            {step === 2 && (
                <div className='flex items-center capitalize justify-center'>
                    <table className='w-[70%] mt-4'>
                        <tbody>
                            {propertyData.map(([label, value]) => (
                                <tr key={label} className='text-base border-b border-gray-200 dark:border-gray-700 flex justify-between px-4'>
                                    <td className='py-3 px-3 font-semibold'>{label}</td>
                                    <td className='py-3 px-3'>{value || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
            )}

            <div className='flex items-center justify-center'>
                <div className='w-[70%]'>
                    {step === 1 && (
                        <div className='flex justify-between mt-5'>
                            <Link to='/properties' className='px-3 py-2 rounded bg-gray-300 text-black cursor-pointer font-bold'> 
                                cancel
                            </Link>

                            <button  onClick={next} disabled={!canContinue()} className='px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed rounded bg-blue-600 text-white  cursor-pointer font-bold'> 
                                Next
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className='flex justify-between mt-5'>
                            <button onClick={previous} className='px-3 py-2 rounded bg-gray-300 text-black cursor-pointer font-bold'> 
                                previous
                            </button>

                            <button disabled={loading} onClick={handleSubmit} className='px-3 py-2 disabled:pointer-none rounded bg-red-600 text-white  cursor-pointer font-bold'> 
                                {loading
                                    ? <span className='animate-spin inline-block h-6 w-6 border-2 border-t-transparent border-white rounded-full'></span>
                                    : 'Submit'}
                            </button>
                        </div>
                    )}

                   
                </div>
            </div> 
        </div>
    )
}

export default PropertyForm
