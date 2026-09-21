import React from 'react'
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import {useState} from 'react'
import MorePropertyInfo from './MorePropertyInfo';

const propertyData = ({property, getColorFromName, getInitials}) => {
    const [openRowId, setOpenRowId] = useState(null)

    return (
        <div>
            <table className='w-full'>
                <thead>
                    <tr className='border-b border-white h-10 duration-300 transition-all dark:border-gray-800 text-gray-500 bg-blue-100 dark:bg-gray-800 dark:text-gray-300 shadow'>
                        <th className='text-start px-2 py-1'>Property</th>
                        <th className='text-start px-2 py-1'>Managers</th>
                        <th className='text-start px-2 py-1'>Location</th>
                        <th className='text-start px-2 py-1'>Total Units</th>
                        <th className='text-start px-2 py-1'>Water Rate</th>
                        <th className='text-start px-2 py-1'>Operations</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(property) && property.length > 0 ? (
                        property.map((item, index) => (
                            <tr className='relative'>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>
                                    <div className='flex items-center gap-3'>
                                        <span className={`${getColorFromName(item.landlord_name)} h-8 w-8 items-center flex justify-center rounded-full font-semibold text-white`}>
                                            {getInitials(item.landlord_name)}
                                        </span>
                                        {item.landlord_name || '-'}
                                    </div>
                                </td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>
                                    <div className='flex items-center gap-3'>
                                        <span className={`${getColorFromName(item.managers)} h-8 w-8 items-center flex justify-center rounded-full font-semibold text-white`}>
                                            {getInitials(item.managers)}
                                        </span>
                                        {item.managers}
                                    </div>
                                    
                                </td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>{item.location}</td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>{item.computed_total_units || '-'}</td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>{`Ksh. ${item.water_rate.toFixed(2)}`}</td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>
                                    <div className='flex gap-3 text-lg'>
                                        <span className='text-blue-500'><FiEdit/></span>
                                        <span className='text-red-500'><RiDeleteBin6Line/></span>
                                        <span className='' onClick={() => {setOpenRowId(openRowId === item.id ? null : item.id)}}>
                                            <IoIosArrowDown className={`${openRowId === item.id ? 'rotate-180 duration-300 transition-300 cursor-pointer' : 'rotate-0 duration-300 cursor-pointer transition-all'}`}/>
                                        </span>
                                        <span><HiDotsHorizontal/></span>
                                    </div>
                                </td>
                                {openRowId === item.id && (
                                    <td className='absolute shadow-lg dark:shadow-gray-800 border bg-blue-50 dark:bg-gray-900 rounded border-gray-300 dark:border-gray-700 shadow-gray-400 left-0 right-0  z-50 top-full'>
                                        <div className='bg-blue-50 dark:bg-gray-900 h-90 w-full '>
                                            <MorePropertyInfo id={item.id}/>
                                        </div>
                                    </td>
                                )}
                            </tr>

                        ))
                    ): (
                        <tr>
                            <td colSpan={9}>

                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default propertyData
