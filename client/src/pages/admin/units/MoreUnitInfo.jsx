import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'

const MoreUnitInfo = ({id}) => {
    const [units, setUnits] = useState([])
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)

    useEffect(() => {
        const controller = new AbortController()

        const fetchData = async() => {
            setLoading(true)

            try{
                const res = await axios.get(`http://127.0.0.1:8000/api/units/${id}`, {
                    signal: controller.signal
                })
                setUnits(res.data.results ?? res.data)
            } catch(err) {
                if (axios.isCancel(err)) return;
                const message = err.message || 'something went wrong while fetching the data'
                setErrors(message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
        return () => {
            controller.abort()
        }
    }, [])

    if (loading) return <p className='px-3 py-2'>Loading...</p>
    if (errors) return <p className='px-3 py-2 text-red-600'>{errors}</p>
    if (!units) return null

    const initials = `${units?.unit_number?.[0]}`
    return (
        <div className='px-3 py-4'>
            <div className=''>
                <div className='flex gap-3 m-3'>
                    <span className='h-8 w-8 flex items-center justify-center rounded-full font-bold bg-blue-500 text-white'>{initials}</span>
                    <p className='font-semibold text-xl'>{units.tenant_name}</p>
                </div>

                <div className='flex justify-between'>
                    <div className='flex justify-around m-3 w-[60%] border-r border-gray-300'>
                        <span>
                            <p className='text-blue-400 font-bold'>Property Information</p>
                            <div className='ml-9 m-3 space-y-3'>
                                <p className='flex flex-col'>
                                    <span className='text-gray-400'>Property: </span> 
                                    <span className='font-bold text-base text-end'>{units.property_name}</span> 
                                </p>
                                <p className='flex flex-col'>
                                    <span className='text-gray-400'>Unit Number: </span> 
                                    <span className='font-bold text-base text-end'>{units.unit_number}</span> 
                                </p>
                            </div>
                        </span>

                        <span>
                            <p className='text-blue-400 font-bold'>Tenant Information</p>
                            <div className='ml-9 m-3 space-y-3'>
                                <p className='flex flex-col'>
                                    <span className='text-gray-400'>Balance(B/F): </span> 
                                    <span className='font-bold text-end'>Ksh. {units.balance_brought_forward}</span> 
                                </p>
                                <p className='flex flex-col'>
                                    <span className='text-gray-400'>Balance(C/F): </span> 
                                    <span className='font-bold text-end'>Ksh. {units.balance_carry_forward}</span> 
                                </p>
                                <p className='flex flex-col'>
                                    <span className='text-gray-400'>Deposit: </span> 
                                    <span className='font-bold text-end'>Ksh. {units.deposit}</span> 
                                </p>
                            </div>
                        </span>
                    </div>

                    <div className='w-[40%]'>
                        <span>
                            <p className='flex justify-between px-2 text-blue-400 font-bold'>
                                <span>Summary Information</span> 
                                <span className='text-gray-500'>Date: {new Date(units.created_at).toLocaleDateString()}</span>
                            </p>
                            <div className='ml-9 my-2 space-y-3'>
                                <p className='space-x-3'>
                                    <span className='font-semibold text-gray-400'>Rent Status: </span> 
                                    <span className={`font-bold
                                        ${
                                            units.rent_status === 'paid'
                                            ? 'bg-green-100 dark:bg-transparent dark:border dark:border-green-900 px-3 py-1 rounded text-green-500'
                                            : units.rent_status === 'overdue'
                                            ? 'bg-red-100 dark:bg-transparent dark:border dark:border-red-900 px-3 py-1 rounded text-red-500'
                                            : units.rent_status === 'pending'
                                            ? 'bg-amber-100 dark:bg-transparent dark:border dark:border-amber-900 px-3 py-1 rounded text-amber-500'
                                            : units.rent_status === 'vacant'
                                            ? 'bg-amber-100 dark:bg-transparent dark:border dark:border-amber-900 px-3 py-1 text-amber-500'
                                            : units.rent_status === 'caretaker'
                                            ? 'bg-blue-100 dark:bg-transparent dark:border dark:border-blue-900 px-3 py-1 text-blue-500'
                                            : ''
                                        }`}>{units.rent_status}</span> 
                                </p>
                                <p className='space-x-3'>
                                    <span className='font-semibold text-gray-400'>Rent Payable: </span> 
                                    <span className='font-bold'>Ksh. {units.rent_payable}</span> 
                                </p>
                                <p className='space-x-3'>
                                    <span className='font-semibold text-gray-400'>Rent: </span> 
                                    <span className='font-bold'>Ksh. {units.rent}</span> 
                                </p>
                                <p className='space-x-3'>
                                    <span className='font-semibold text-gray-400'>units Method: </span> 
                                    <span className='font-bold'>{units.units_method}</span> 
                                </p>
                                <p className='space-x-3'>
                                    <span className='font-semibold text-gray-400'>Completion: </span> 
                                    <span className={`font-bold
                                        ${
                                            units.completion === 'completed'
                                            ? 'bg-green-100 dark:bg-transparent dark:border dark:border-green-900 px-3 py-1 rounded text-green-500'
                                            : units.completion === 'pending'
                                            ? 'bg-amber-100 dark:bg-transparent dark:border dark:border-amber-900 px-3 py-1 rounded text-amber-500'
                                            : units.completion === 'vacant'
                                            ? 'bg-amber-200 dark:bg-transparent dark:border dark:border-amber-900 px-3 py-1 rounded text-amber-200'
                                            : units.completion === 'overdue'
                                            ? 'bg-red-100 dark:bg-transparent dark:border dark:border-red-900 px-3 py-1 rounded text-red-500'
                                            : ''
                                        }`}>{units.completion}</span> 
                                </p>
                                <p className='space-x-3'>
                                    <span className='font-semibold text-gray-400'>Water: </span> 
                                    <span className='font-bold'>Ksh. {units.water}</span> 
                                </p>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default MoreUnitInfo
