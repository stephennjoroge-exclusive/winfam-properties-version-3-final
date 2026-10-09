import React from 'react'
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import {useState} from 'react'
import MorePropertyInfo from './MorePropertyInfo';
import { TiArrowSortedUp } from "react-icons/ti";
import { FaSort } from "react-icons/fa6";
import { FaSortDown } from "react-icons/fa6";
import DeleteModal from '../../components/DeleteModal';

const propertyData = ({property, getColorFromName, loading, getInitials, deleteRecord,  sortField, sortDirection, handleSort}) => {
    const [openRowId, setOpenRowId] = useState(null)
    const [deleteModel, setDeleteModel] = useState(false)

    const arrow = (field) => {
        if (sortField !== field) return <FaSort className='text-gray-500'/>
        return sortDirection === 'asc' ? <TiArrowSortedUp className='text-gray-500 text-[15px]'/> : <FaSortDown className='text-gray-500 text-[15px]'/>
    }

    return (
        <div>
            <table className='w-full'>
                <thead>
                    <tr className='border-b border-white h-10 duration-300 transition-all dark:border-gray-800 text-gray-500 bg-blue-100 dark:bg-gray-800 dark:text-gray-300 shadow'>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('landlord__first_name')}><span className='flex items-center gap-3'>Property {arrow('landlord__first_name')}</span></th>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('managers')}><span className='flex items-center gap-3'>Managers {arrow('managers')}</span></th>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('location')}><span className='flex items-center gap-3'>Location {arrow('location')}</span></th>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('total_units')}><span className='flex items-center gap-3'>Total Units {arrow('total_units')}</span></th>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('water_rate')}><span className='flex items-center gap-3'>Water Rate {arrow('water_rate')}</span></th>
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
                    ): Array.isArray(property) && property.length > 0 ? (
                        property.map((item, index) => (
                            <tr key={item.id} className='relative capitalize'>
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
                                        <span className='text-red-500 cursor-pointer' onClick={() => setDeleteModel(item.id)}>
                                            <RiDeleteBin6Line/>

                                            {deleteModel === item.id && (
                                                <DeleteModal deleteRecord={() => deleteRecord(item.id)} deleteModal={deleteModel} entity={item.landlord_name} setDeleteModal={setDeleteModel} />
                                            )}
                                        </span>
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

export default propertyData
