import React from 'react'
import {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import NameColor from '../../components/NameColor'
import ViewAllPayments from './ViewAllPayments'
import useCloseRef from '../../components/useCloseRef'

const MorePaymentInfo = ({id}) => {
    const [payment, setPayment] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)
    const {getInitials, getColorFromName} = NameColor()
    const [allPayments, setAllPayments] = useState(false)
    const closeRef = useRef(null)

    useCloseRef({
        refValue: closeRef,
        handleStateClose: setAllPayments
    })

    useEffect(() => {
        if (!id) return;

        const controller = new AbortController()

        const fetchData = async() => {
            setLoading(true)

            try{
                const res = await axios.get(`http://127.0.0.1:8000/api/financials/${id}`, {
                    signal: controller.signal
                })
                setPayment(res.data)
            } catch(err) {
                if (axios.isCancel(err)) return;
                setErrors(err.message || 'something went wrong fetching the data')
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
    if (!payment) return null

    return (
        <div ref={closeRef} className='h-full bg-blue-50 dark:bg-gray-900'>
            <div className='px-3 py-4'>
                <div className='flex gap-3 m-3 justify-between' >
                    <div className='flex items-center gap-3 '>
                        <span className={`${getColorFromName(payment.tenant_snapshot)} h-8 w-8 flex items-center justify-center rounded-full font-bold bg-blue-500 text-white`}>
                            {getInitials(payment.tenant_snapshot)} 
                        </span>
                        <p className='font-semibold text-xl'>{payment.tenant_snapshot}</p>
                    </div>
                    <div className='text-blue-500 dark:hover:text-blue-300 dark:text-blue-400 underline hover:text-blue-600'>
                        <span onClick={() => {setAllPayments(true)}} className='cursor-pointer'>View Payments</span>

                        {allPayments && (
                            <div>
                                <ViewAllPayments setAllPayments={setAllPayments} tenant={payment}/>
                            </div>
                        )}
                    </div>
                </div>

                <div className='flex justify-between'>
                    <div className='flex justify-around m-3 w-[60%] border-r border-gray-200'>
                        <span>
                            <p className='text-blue-400 font-bold'>Property Information</p>
                            <div className='ml-9 m-3 space-y-3'>
                                <p className='flex flex-col'>
                                    <span className='text-gray-500'>Property: </span> 
                                    <span className='font-bold text-base text-end'>{payment.property_obj}</span> 
                                </p>
                                <p className='flex flex-col'>
                                    <span className='text-gray-400'>Unit Number: </span> 
                                    <span className='font-bold text-base text-end'>{payment.unit_number}</span> 
                                </p>
                            </div>
                        </span>

                        <span>
                            <p className='text-blue-400 font-bold'>Tenant Information</p>
                            <div className='ml-9 m-3 space-y-3'>
                                <p className='flex flex-col'>
                                    <span className='text-gray-400'>Balance(B/F): </span> 
                                    <span className='font-bold text-end'>Ksh. {payment.balance_brought_forward}</span> 
                                </p>
                                <p className='flex flex-col'>
                                    <span className='text-gray-400'>Balance(C/F): </span> 
                                    <span className='font-bold text-end'>Ksh. {payment.balance_carry_forward}</span> 
                                </p>
                                <p className='flex flex-col'>
                                    <span className='text-gray-400'>Deposit: </span> 
                                    <span className='font-bold text-end'>Ksh. {payment.deposit}</span> 
                                </p>
                            </div>
                        </span>
                    </div>

                    <div className='w-[40%]'>
                        <span>
                            <p className='flex justify-between px-2 text-blue-400 font-bold'>
                                <span>Summary Information</span> 
                                <span className='text-gray-500'>Date: {new Date(payment.date).toLocaleDateString()}</span>
                            </p>
                            <div className='ml-9 my-2 space-y-3'>
                                <p className='space-x-3'>
                                    <span className='font-semibold text-gray-400'>Rent Status: </span> 
                                    <span className={`font-bold
                                        ${
                                            payment.rent_status === 'paid'
                                            ? 'bg-green-100 dark:bg-transparent border border-green-200 dark:border-green-900 px-3 py-1 rounded text-green-500'
                                            : payment.rent_status === 'overdue'
                                            ? 'bg-red-100 dark:bg-transparent dark:border dark:border-red-900 px-3 py-1 rounded text-red-500'
                                            : payment.rent_status === 'pending'
                                            ? 'bg-amber-100 dark:bg-transparent border border-amber-300 dark:border-amber-900 px-3 py-1 rounded text-amber-500'
                                            : payment.rent_status === 'vacant'
                                            ? 'bg-amber-100 dark:bg-transparent dark:border dark:border-amber-900 px-3 py-1 text-amber-500'
                                            : payment.rent_status === 'caretaker'
                                            ? 'bg-blue-100 dark:bg-transparent dark:border dark:border-blue-900 px-3 py-1 text-blue-500'
                                            : ''
                                        }`}>{payment.rent_status}</span> 
                                </p>
                                <p className='space-x-3'>
                                    <span className='font-semibold text-gray-400'>Rent Payable: </span> 
                                    <span className='font-bold'>Ksh. {payment.rent_payable}</span> 
                                </p>
                                <p className='space-x-3'>
                                    <span className='font-semibold text-gray-400'>Rent: </span> 
                                    <span className='font-bold'>Ksh. {payment.rent}</span> 
                                </p>
                                <p className='space-x-3'>
                                    <span className='font-semibold text-gray-400'>Balance: </span> 
                                    <span className='font-bold'>Ksh. {payment.balance}</span> 
                                </p>
                                <p className='space-x-3'>
                                    <span className='font-semibold text-gray-400'>Payment Method: </span> 
                                    <span className='font-bold'>{payment.payment_method}</span> 
                                </p>
                                <p className='space-x-3'>
                                    <span className='font-semibold text-gray-400'>Completion: </span> 
                                    <span className={`font-bold
                                        ${
                                            payment.completion === 'completed'
                                            ? 'bg-green-100 dark:bg-transparent dark:border dark:border-green-900 px-3 py-1 rounded text-green-500'
                                            : payment.completion === 'pending'
                                            ? 'bg-amber-100 dark:bg-transparent dark:border dark:border-amber-900 px-3 py-1 rounded text-amber-500'
                                            : payment.completion === 'vacant'
                                            ? 'bg-amber-200 dark:bg-transparent dark:border dark:border-amber-900 px-3 py-1 rounded text-amber-200'
                                            : payment.completion === 'overdue'
                                            ? 'bg-red-100 dark:bg-transparent dark:border dark:border-red-900 px-3 py-1 rounded text-red-500'
                                            : ''
                                        }`}>{payment.completion}</span> 
                                </p>
                                <p className='space-x-3'>
                                    <span className='font-semibold text-gray-400'>Water: </span> 
                                    <span className='font-bold'>Ksh. {payment.water}</span> 
                                </p>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default MorePaymentInfo
