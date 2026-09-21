import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { CgCloseO } from "react-icons/cg";
import { GoDotFill } from "react-icons/go";
import { IoSearchSharp } from "react-icons/io5";
import { TiArrowSortedUp } from "react-icons/ti";
import { FaSort } from "react-icons/fa6";
import { FaSortDown } from "react-icons/fa6";

const ViewAllPayments = ({setAllPayments, tenant}) => {
    const [sortField, setSortField] = useState('date')
    const [sortDirection, setSortDirection] = useState('asc')

    const handleSortSinglePayments = (field) => {
        if (sortField === field){
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
        } else {
            setSortDirection('asc')
            setSortField(field)
        }
    }

    const arrow = (field) => {
        if (sortField !== field) return <FaSort className='text-gray-500'/>
        return sortDirection === 'asc' ? <TiArrowSortedUp className='text-gray-500 text-[15px]'/> : <FaSortDown className='text-gray-500 text-[15px]'/>
    }

    const sortedPayments = [...(tenant?.tenant_payment ?? [])].sort((a, b) => {
        const dir = sortDirection === 'asc' ? 1 : -1
        if (a[sortField] < b[sortField]) return -1 * dir
        if (a[sortField] > b[sortField]) return 1 * dir
        return 0
    })

    return (
        <div className='fixed flex justify-end inset-0 bg-black/40'>
           <div className='flex relative text-gray-700 dark:text-gray-300 bg-blue-50 border-l-3 border-blue-200 flex-col shadow-xl shadow-gray-500 dark:shadow-gray-900 dark:border dark:border-gray-600 py-3 px-3 space-y-3 pb-3 rounded-l-xl dark:bg-gray-900 w-[85%]'>
                <CgCloseO onClick={() => {setAllPayments(false)}} className='absolute cursor-pointer right-2 top-0 text-2xl text-red-500 dark:text-red-800'/>
                <div className='flex border-b border-gray-300 justify-between items-center w-[95%]'>
                    <div className='flex gap-3 items-center'>
                        <img src="/winfam.png" alt="" />
                        <div>
                            <p className='text-3xl font-bold'>Winfam Properties</p>
                            <div className='flex items-center gap-3 border border-gray-300 dark:border-gray-700 px-1 py-1 rounded h-9'>
                                <IoSearchSharp className='text-gray-400 dark:text-gray-300 text-2xl'/>
                                <input type="search" placeholder='Search record...' className='border-none outline-none w-full' />
                            </div>
                        </div>
                       
                    </div>

                    <div className='text-base text-end font-semibold'>
                        <p>Macharia road, next to Webtech cyber cafe</p>
                        <p>P.O. Box 45873 – 00100, Nairobi</p>
                        <p>Website: <span className='text-blue-500 underline'> www.winfamproperties.com</span></p>
                    </div>
                </div>

                <div className='text-center justify-center'>
                    <p>Payment Statement for: </p>
                    <p className='font-bold text-2xl text-blue-500'>{tenant.tenant_snapshot}</p>
                    <div className='flex font-semibold text-xl items-center text-center justify-center gap-2'>
                        <p>{tenant.property_obj}</p>
                        <GoDotFill/>
                        <p>Unit({tenant.unit_number})</p>
                    </div>
                    <div className='flex gap-3 justify-center'>
                        <p>Email: <span className='text-blue-500 text-base underline'>winfamprop@gmail.com</span></p>
                        <p>Phone: <span className='text-base font-semibold'>0721 991 394, 0780392899</span></p>
                    </div>
                </div>

                <table className='w-full'>
                    <thead>
                        <tr className='border-b border-white bg-blue-100 duration-300 transition-all dark:border-gray-800 text-gray-700 dark:bg-gray-800 dark:text-gray-300 shadow'>
                            <th className='text-start px-2 py-1' onClick={() => handleSortSinglePayments('date')}><span className='flex items-center gap-3'>Date {arrow('date')}</span></th>
                            <th className='text-start px-2 py-1' onClick={() => handleSortSinglePayments('rent_payable')}><span className='flex items-center gap-3'>Rent Payable {arrow('rent_payable')}</span></th>
                            <th className='text-start px-2 py-1' onClick={() => handleSortSinglePayments('rent')}><span className='flex items-center gap-3'>rent {arrow('rent')}</span></th>
                            <th className='text-start px-2 py-1' onClick={() => handleSortSinglePayments('balance')}><span className='flex items-center gap-3'>Balance {arrow('balance')}</span></th>
                            <th className='text-start py-3 px-3'>Payment Method</th>
                            <th className='text-start py-3 px-3'>Rent Status</th>
                        </tr>
                    </thead>
                    <tbody>
                       {Array.isArray(sortedPayments) && sortedPayments.length > 0 ? (
                            sortedPayments.map(item => (
                                <tr key={item.id}>
                                    <td className='py-2 px-3 border-b border-white dark:border-gray-800'><strong>{item.date}</strong></td>
                                    <td className='py-2 px-3 border-b border-white dark:border-gray-800'>{item.rent_payable}</td>
                                    <td className='py-2 px-3 border-b border-white dark:border-gray-800'>{item.rent}</td>
                                    <td className='py-2 px-3 border-b border-white dark:border-gray-800'>{item.balance}</td>
                                    <td className='py-2 px-3 border-b border-white dark:border-gray-800'>{item.payment_method}</td>
                                    <td className='py-2 px-3 border-b border-white dark:border-gray-800'>
                                        <span className={`inline-flex  rounded py-1 px-3 ${
                                            item.rent_status === 'paid'
                                            ? 'bg-green-100 text-green-500 dark:border border-green-900 dark:bg-transparent'
                                            : item.rent_status === 'overdue'
                                            ? 'bg-red-100 text-red-500 dark:border border-red-900 dark:bg-transparent'
                                            : item.rent_status === 'vacant'
                                            ? 'bg-amber-100 text-amber-500 dark:border border-amber-900 dark:bg-transparent'
                                            : item.rent_status === 'caretaker'
                                            ? 'bg-blue-100 text-blue-500 dark:text-blue-400 dark:border border-blue-900 dark:bg-transparent'
                                            : item.rent_status === 'pending'
                                            ? 'bg-amber-100 text-amber-500 dark:border border-amber-900 dark:bg-transparent'
                                            : ''
                                        }`}> {item.rent_status}</span>
                                        
                                    </td>
                                </tr>
                            ))
                       ) : (
                            <tr>
                                <td colSpan={5}>no records found</td>
                            </tr>
                       )}
                    </tbody>
                </table>
           </div>
        </div>
    )
}


export default ViewAllPayments