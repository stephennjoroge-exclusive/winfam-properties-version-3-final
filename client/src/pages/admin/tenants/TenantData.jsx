import React from 'react'
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import { GoDotFill } from "react-icons/go";
import {useState} from 'react'
import { TiArrowSortedUp } from "react-icons/ti";
import { FaSort } from "react-icons/fa6";
import { FaSortDown } from "react-icons/fa6";
import DeleteModal from '../../components/DeleteModal';
import MoreTenantInfo from './MoreTenantInfo';

const TenantData = ({tenant, loading, getColorFromName, deleteRecord, getInitials, sortField, sortDirection, handleSort}) => {
    const [selectedIds, setSelectedIds] = useState([])
    const [deleteModal, setDeleteModal] = useState(false)
    const [openRowId, setOpenRowId] = useState(null)

    const allIds = Array.isArray(tenant) ? tenant.map((item) => item.id) : []
    const allSelected = allIds.length > 0 && selectedIds.length === allIds.length

    const toggleAllRows = () => {
        setSelectedIds(allSelected ? [] : allIds)
    }

    const toggleRow = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
    }

    const arrow = (field) => {
        if (sortField !== field) return <FaSort className='text-gray-500'/>
        return sortDirection === 'asc' ? <TiArrowSortedUp className='text-gray-500 text-[15px]'/> : <FaSortDown className='text-gray-500 text-[15px]'/>
    }
   
    return (
        <div>
            <table className='w-full'>
                <thead>
                    <tr className='border-b border-white h-10 duration-300 transition-all dark:border-gray-800 text-gray-500 bg-blue-100 dark:bg-gray-800 dark:text-gray-300 shadow'>
                        <th className='text-start py-3 px-3'><input checked={allSelected} onChange={toggleAllRows} type="checkbox" /></th>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('first_name')}><span className='flex items-center gap-3'>Tenant Name {arrow('first_name')}</span></th>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('property_obj__landlord__first_name')}><span className='flex items-center gap-3'>Property {arrow('property_obj__landlord__first_name')}</span></th>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('unit__unit_number')}><span className='flex items-center gap-3'>Unit Number {arrow('unit__unit_number')}</span></th>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('payments__rent')}><span className='flex items-center gap-3'>Rent {arrow('payments__rent')}</span></th>
                        <th className='text-start px-2 py-1'>Rent Status</th>
                        <th className='text-start px-2 py-1'>Balance</th>
                        <th className='text-start px-2 py-1'>Operations</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={8} className='py-8 px-3 text-center'>
                                <div className='flex justify-center'>
                                    <div className='animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full'></div>
                                </div>
                            </td>
                        </tr>

                    ): Array.isArray(tenant) && tenant.length > 0 ? (
                        tenant.map((item, index) => (
                            <tr key={item.id} className={`relative ${selectedIds.includes(item.id) 
                                ? 'bg-blue-200 border-l-4 border-blue-500 dark:bg-teal-900 dark:border-teal-600'
                                : item.rent_status === 'pending'
                                    ? 'bg-amber-50 border-l-4 border-amber-500 dark:bg-transparent'
                                    : item.rent_status === 'overdue'
                                    ? 'bg-red-50 border-l-4 border-red-500 dark:bg-transparent'
                                    : item.rent_status === 'vacant'
                                    ? 'bg-amber-50 border-l-4 border-amber-500 dark:bg-transparent'
                                    : ''
                            }`}> 
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'><input  
                                    onChange={() => {toggleRow(item.id)}} checked={selectedIds.includes(item.id)} 
                                    type="checkbox"/>
                                </td>  
                                <td className='py-4 px-3 border-b border-white capitalize dark:border-gray-800'>
                                        <div className='flex items-center gap-3'>
                                            <span className={`${getColorFromName(item.property_name)} h-8 w-8 flex items-center justify-center rounded-full font-bold bg-blue-500 text-white`}>
                                                {getInitials(item.full_name)} 
                                            </span>
                                            {item.full_name || '-'}
                                    </div>
                                </td>                    
                                <td className='py-4 px-3 border-b border-white capitalize dark:border-gray-800'>
                                    <div className='flex items-center gap-3'>
                                        <span className={`${getColorFromName(item.property_name)} h-8 w-8 flex items-center justify-center rounded-full font-bold bg-blue-500 text-white`}>
                                            {getInitials(item.property_name)} 
                                        </span>
                                        {item.property_name || '-'}
                                    </div> 
                                </td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>{item.unit_number}</td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>{`Ksh. ${item.rent || '0'}`}</td>
                                <td className='border-b font-bold border-white dark:border-gray-800'>
                                    <span className={`inline-flex rounded py-1 px-3  ${
                                        item.rent_status === 'paid'
                                        ? `text-green-500 ${selectedIds.includes(item.id) ? 'bg-transparent' : 'bg-green-50'} dark:border dark:bg-transparent dark:text-green-600 dark:border-green-950`
                                        : item.rent_status === 'vacant'
                                        ? `text-amber-500 ${selectedIds.includes(item.id) ? 'bg-transparent' : 'bg-amber-50'} dark:border dark:bg-transparent dark:text-amber-600 dark:border-amber-950`
                                        : item.rent_status === 'overdue'
                                        ? `text-red-500 ${selectedIds.includes(item.id) ? 'bg-transparent' : 'bg-red-50'} dark:border dark:bg-transparent dark:text-red-500 dark:border-red-950`
                                        : item.rent_status === 'caretaker'
                                        ? `text-blue-500 ${selectedIds.includes(item.id) ? 'bg-transparent' : 'bg-blue-100'} dark:border dark:bg-transparent dark:text-blue-600 dark:border-blue-950`
                                        : item.rent_status === 'pending'
                                        ? `text-amber-500 ${selectedIds.includes(item.id) ? 'bg-transparent' : 'bg-amber-50'} dark:border  dark:bg-transparent dark:text-amber-600 dark:border-amber-950`
                                        : ''
                                    }`}>
                                        <div className='flex items-center gap-1'>
                                            {item.rent_status === 'paid' && <GoDotFill/>}
                                            {item.rent_status === 'vacant' && <GoDotFill/>}
                                            {item.rent_status === 'pending' && <GoDotFill/>}
                                            {item.rent_status === 'caretaker' && <GoDotFill/>}
                                            {item.rent_status === 'overdue' && <GoDotFill/>}
                                            {item.rent_status || '-'}
                                        </div>
                                    
                                    </span>
                                </td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>Ksh. {item.balance}</td>
                                <td className='relative py-4 px-3 border-b border-white dark:border-gray-800'>
                                    <div className='flex gap-3 text-lg'>
                                        <span className='text-blue-500'><FiEdit/></span>
                                        <span onClick={() => {setDeleteModal(item.id)}} className='text-red-600 cursor-pointer'><RiDeleteBin6Line/>
                                        
                                            {deleteModal === item.id && (
                                                <div>
                                                    <DeleteModal deleteRecord={() => deleteRecord(item.id)} deleteModal={deleteModal} entity={item.full_name} setDeleteModal={setDeleteModal}/>
                                                </div>
                                            )}
                                        </span>

                                       <span onClick={() => {setOpenRowId(openRowId === item.id ? null : item.id)}}><IoIosArrowDown className={`${openRowId === item.id ? 'rotate-180 duration-300 transition-300 cursor-pointer' : 'rotate-0 duration-300 cursor-pointer transition-all'}`}/></span>
                                        <span><HiDotsHorizontal/></span>
                                    </div>
                                </td>

                                {openRowId === item.id && (
                                    <td className='shadow-lg dark:shadow-gray-800 border rounded border-gray-300 dark:border-gray-700 shadow-gray-400 left-0 right-0 absolute z-50 top-full'>
                                        <div className='bg-blue-50 px-3 py-2 dark:bg-gray-900 h-80 w-full '>
                                            <MoreTenantInfo id={item.id}/>
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

export default TenantData
