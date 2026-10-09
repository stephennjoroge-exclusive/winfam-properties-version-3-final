import React from 'react'
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import { TiArrowSortedUp } from "react-icons/ti";
import { FaSort } from "react-icons/fa6";
import { TiArrowSortedDown } from "react-icons/ti";
import NameColor from '../../components/NameColor'


const UtilitiesData = ({utility, sortField, sortDirection, handleSort, loading}) => {
    const {getInitials, getColorFromName} = NameColor()

    const arrow = (field) => {
        if (sortField !== field) return  <FaSort/>
        return sortDirection === 'asc' ? <TiArrowSortedUp className='text-gray-500 text-[15px]' /> : <TiArrowSortedDown className='text-gray-500 text-[15px]'/>
    }

    return (
        <div>
            <table className='w-full'>
                <thead>
                    <tr className='border-b border-white h-10 duration-300 transition-all dark:border-gray-800 text-gray-500 bg-blue-100 dark:bg-gray-800 dark:text-gray-300 shadow'>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('property_obj')}><span className='flex items-center gap-3'>Property {arrow('property_obj')}</span></th>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('unit__unit_number')}><span className='flex items-center gap-3'>Unit {arrow('unit__unit_number')}</span></th>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('item')}><span className='flex items-center gap-3'>Item {arrow('item')}</span></th>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('previous_reading')}><span className='flex items-center gap-3'>Previous Reading {arrow('previous_reading')}</span></th>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('current_reading')}><span className='flex items-center gap-3'>Current Reading {arrow('current_reading')}</span></th>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('current_reading')}><span className='flex items-center gap-3'>Total Cost{arrow('current_reading')}</span></th>
                        <th className='text-start px-2 py-1'>Operations</th>
                    </tr>
                </thead>

                <tbody>
                   { loading ? (
                        <tr>
                            <td colSpan={8} className='py-8 px-3 text-center'>
                                <div className='flex justify-center'>
                                    <div className='animate-spin border-2 border-t-transparent h-6 w-6 border-blue-500 rounded-full'></div>
                                </div>
                            </td>
                        </tr>
                        
                   ) : Array.isArray(utility) && utility.length > 0 ? (
                        utility.map((item, index) => (
                            <tr>
                                <td className={'flex items-center gap-3 py-4 px-3 border-b border-white capitalize dark:border-gray-800'}>
                                    <span className={`${getColorFromName(item.property_name)} text-white font-bold text-base w-9 h-9 rounded-full flex items-center justify-center`}>
                                        {getInitials(item.property_name)}
                                    </span>
                                    {item.property_name ?? '-'}
                                </td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>{item.unit_number ?? '-'}</td>
                                <td className='py-4 px-3 border-b capitalize border-white dark:border-gray-800'>{item.item}</td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>{item.previous_reading}</td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>{item.current_reading}</td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>Ksh. {item.unit_cost}</td>
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
                    <tr key={``} className='relative text-center'>
                        <td colSpan={9}>
                            <div className='flex justify-center mt-3'>
                                <div className='animate-spin border-2 border-t-transparent h-6 w-6 border-blue-500 rounded-full'></div>
                            </div>
                        </td>
                    </tr>
                   )}
                </tbody>
            </table>
        </div>
    )
}

export default UtilitiesData
