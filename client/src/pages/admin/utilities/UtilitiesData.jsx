import React from 'react'
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";

const UtilitiesData = ({utility}) => {

    return (
        <div>
            <table className='w-full'>
                <thead>
                    <tr className='border-b border-white h-10 duration-300 transition-all dark:border-gray-800 text-gray-500 bg-blue-100 dark:bg-gray-800 dark:text-gray-300 shadow'>
                        <th className='text-start px-2 py-1'>Property</th>
                        <th className='text-start px-2 py-1'>Unit</th>
                        <th className='text-start px-2 py-1'>Item</th>
                        <th className='text-start px-2 py-1'>Previous Reading</th>
                        <th className='text-start px-2 py-1'>Current Reading</th>
                        <th className='text-start px-2 py-1'>Operations</th>
                    </tr>
                </thead>

                <tbody>
                   {Array.isArray(utility) && utility.length > 0 ? (
                        utility.map((item, index) => (
                            <tr>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>{item.property_name ?? '-'}</td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>{item.unit_number ?? '-'}</td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>{item.item}</td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>{item.previous_reading}</td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>{item.current_reading}</td>
                                <td className='relative py-4 px-3 border-b border-white dark:border-gray-800'>
                                    <div className='flex gap-3 text-lg'>
                                        <span className='text-blue-500'><FiEdit/></span>
                                        <span className='text-red-500'><RiDeleteBin6Line/></span>
                                        <span><IoIosArrowDown/></span>
                                        <span><HiDotsHorizontal/></span>
                                    </div>
                                </td>
                            </tr>
                        ))
                   ) : (
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

export default UtilitiesData
