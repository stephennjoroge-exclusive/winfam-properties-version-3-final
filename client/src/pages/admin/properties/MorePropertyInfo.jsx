import React from 'react'
import {useState, useEffect} from 'react'
import NameColor from '../../components/NameColor'
import axios from 'axios'
import { RiArrowRightUpFill } from "react-icons/ri";
import { GoDotFill } from "react-icons/go";
import { MdOutlineWaterDrop } from "react-icons/md";
import { TbBrandCashapp } from "react-icons/tb";
import { GiReceiveMoney } from "react-icons/gi";
import PropertyDetails from './PropertyDetails';

const MorePropertyInfo = ({id}) => {
    const [property, setProperty] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)
    const {getInitials, getColorFromName} = NameColor()
    const [openProperty, setOpenProperty] = useState(false)

    useEffect(() => {
        const controller = new AbortController()

        const fetchData = async() => {
            setLoading(true)

            try{
                const res = await axios.get(`http://127.0.0.1:8000/api/properties/info/${id}`,  {
                    signal: controller.signal
                })
                setProperty(res.data.total_units_per_property ?? res.data)
            } catch(err) {
                if (axios.isCancel(err)) return;
                const message = err.message || 'something went wrong fetching the data'
                setErrors(message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()

        return () => {
            controller.abort()
        }
    }, [id])

    if (loading) return <p className='px-3 py-2'>Loading...</p>
    if (errors) return <p className='px-3 py-2 text-red-600'>{errors}</p>
    if (!property) return null

    return (
        <div className='px-3 py-3'>
            <div>
                <div className='flex justify-between mx-3 py-2 border-b border-gray-200 dark:border-gray-800'>
                    <div className='flex items-center gap-3 '>
                        <span className={`${getColorFromName(property.full_name)} h-8 w-8 flex items-center justify-center rounded-full font-bold bg-blue-500 text-gray-300`}>
                            {getInitials(property.full_name)} 
                        </span>
                        <span>
                            <p className='font-semibold text-xl'>{property.full_name}</p>
                            <p className='font-semibold text-base text-gray-400'>
                                <div className='flex items-center gap-2'>
                                    <span>Landlord</span>
                                    <span><GoDotFill/></span>
                                    <span>Property ID {property.id}</span>
                                </div>
                            </p>
                        </span>
                        
                    </div>

                    <div onClick={() => setOpenProperty(true)} className='flex text-base text-blue-500 underline cursor-pointer items-center'>
                        <p className=''>View Property</p>
                        <RiArrowRightUpFill className='text-xl'/>

                        {openProperty && (
                            <div>
                                <PropertyDetails setOpenProperty={setOpenProperty} id={property.id}/>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className='flex justify-center gap-5 text-gray-500 my-2'>
                <div className='w-50 bg-blue-100 dark:bg-gray-800 h-20 rounded-xl px-3 py-1'>
                    <p className='text-base font-semibold'>Units</p>
                    <p className='text-4xl font-bold'>{property.computed_units_per_property || 0}</p>
                </div>
                <div className='w-50 bg-blue-100 dark:bg-gray-800 h-20 rounded-xl px-3 py-1'>
                    <p className='text-base font-semibold'>Tenants</p>
                    <p className='text-4xl font-bold'>{property.computed_tenants_per_property || 0}</p>
                </div>
                <div className='w-50 bg-blue-100 dark:bg-gray-800 h-20 rounded-xl px-3 py-1'>
                    <p className='text-base font-semibold'>Vacant</p>
                    <p className='text-4xl font-bold'>{property.total_vacant_per_property || 0}</p>
                </div>
                <div className='w-50 bg-blue-100 dark:bg-gray-800 h-20 rounded-xl px-3 py-1'>
                    <p className='text-base font-semibold'>Overdue</p>
                    <p className='text-4xl font-bold'>{property.total_overdue_per_property || 0}</p>
                </div>
            </div>

            <div className='mt-5'>
                <div className=' flex text-base my-5 justify-between mx-9 border-b border-gray-200 dark:border-gray-800'>
                    <p className='flex items-center gap-1'>
                        <TbBrandCashapp className='text-xl'/> 
                        <span>Total Rent Payable</span>
                    </p>
                    <p>Ksh. {property.computed_total_rent_payable_per_property}</p>
                </div>
                <div className=' flex text-base my-5 justify-between mx-9 border-b border-gray-200 dark:border-gray-800'>
                    <p className='flex items-center gap-1'>
                        <GiReceiveMoney className='text-xl'/> 
                        <span>Total Rent</span>
                    </p>
                    <p>Ksh. {property.computed_total_rent_per_property}</p>
                </div>
                <div className=' flex text-base my-5 justify-between mx-9 border-b border-gray-200 dark:border-gray-800'>
                    <p className='flex items-center gap-1'>
                        <MdOutlineWaterDrop className='text-xl'/> 
                        <span>Water Bill</span>
                    </p>
                    <p>Ksh. {property.total_water_bill}</p>
                </div>
            </div>
        </div>
    )
}

export default MorePropertyInfo
