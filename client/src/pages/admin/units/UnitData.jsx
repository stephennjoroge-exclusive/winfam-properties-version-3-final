import React from 'react'
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import {useState} from 'react'
import DeleteModal from '../../components/DeleteModal';
import MoreUnitInfo from './MoreUnitInfo'
import { HiDotsHorizontal } from "react-icons/hi";
import NameColor from '../../components/NameColor'
import { TiArrowSortedUp } from "react-icons/ti";
import { FaSort } from "react-icons/fa6";
import { FaSortDown } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";

const UnitData = ({units, deleteRecord, sortField, sortDirection, handleSort}) => {
    const [openRowId, setOpenRowId] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [selectedIds, setSelectedIds] = useState([])
    const {getInitials, getColorFromName} = NameColor()

    const allIds = Array.isArray(units) ? units.map((item) => item.id) : []
    const allSelected = allIds.length > 0 && selectedIds.length === allIds.length

    const toggleAllRows = () => {
        setSelectedIds(allSelected ? [] : allIds)
    }

    const toggleRow = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id): [...prev, id])
    }

    const arrow = (field) => {
        if (sortField !== field) return <FaSort className='text-gray-500'/>
        return sortDirection === 'asc' ? <TiArrowSortedUp className='text-gray-500 text-[15px]'/> : <FaSortDown className='text-gray-500 text-[15px]'/>
    }

    return (
        <div>
            <table className='w-full '>
                <thead>
                    <tr className='border-b border-white h-10 duration-300 transition-all dark:border-gray-800 text-gray-500 bg-blue-100 dark:bg-gray-800 dark:text-gray-300 shadow'>
                        <th className='text-start py-3 px-3'><input checked={allSelected} onChange={toggleAllRows} type="checkbox" /></th>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('property_obj__landlord__first_name')}><span className='flex items-center gap-3'>Property {arrow('property_obj__landlord__first_name')}</span></th>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('unit_number')}><span className='flex items-center gap-3'>Unit Number {arrow('unit_number')}</span></th>
                        <th className='text-start px-2 py-1'>Unit Status</th>
                        <th className='text-start px-2 py-1'>Rent Payable</th>
                        <th className='text-start px-2 py-1'>Rent Status</th>
                        <th className='text-start px-2 py-1'>Operations</th>
                    </tr>
                </thead>
                <thead>
                    {Array.isArray(units) && units.length > 0 ? (
                        units.map((item, index) => (
                            <tr key={item.id} className={`relative dark:bg-gray-900 ${selectedIds.includes(item.id) 
                                ? 'bg-blue-200 border-l-4 border-blue-500 dark:border-teal-600 dark:bg-teal-950'
                                : openRowId === item.id
                                ? item.rent_status === 'overdue'
                                    ? 'bg-red-100 border-l-4 border-red-500'
                                    : item.rent_status === 'paid'
                                    ? 'bg-green-100 border-l-4 border-green-500'
                                    : item.rent_status === 'caretaker'
                                    ? 'bg-blue-200 border-l-4 border-blue-500'
                                    : item.rent_status === 'pending'
                                    ? 'bg-amber-100'
                                    : 'bg-blue-100'
                                : item.rent_status === 'overdue'
                                ? 'bg-red-50 border-l-4 border-red-500'
                                : item.rent_status === 'pending'
                                ? 'bg-amber-50 border-l-4 border-amber-500'
                                : item.rent_status && item.unit_status === 'vacant'
                                ? 'bg-amber-50 border-l-4 border-amber-500'
                                : 'bg-blue-50'
                            }`}>
                                <td className='py-4 px-3 border-b border-gray-200 dark:border-gray-800'><input  
                                    onChange={() => {toggleRow(item.id)}} checked={selectedIds.includes(item.id)} 
                                    type="checkbox"/>
                                </td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>
                                    <div className='flex items-center gap-3'>
                                        <span className={`${getColorFromName(item.property_name)} h-8 w-8 flex items-center justify-center rounded-full font-bold bg-blue-500 text-white`}>
                                            {getInitials(item.property_name)} 
                                        </span>
                                        {item.property_name || '-'}
                                    </div>
                                </td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>{item.unit_number || '-'}</td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>
                                    <span className={`inline-flex rounded px-3 py-1 ${
                                            item.unit_status === 'occupied'
                                            ? 'bg-green-50 text-green-500 dark:bg-transparent border border-green-100 dark:border-green-950'
                                            : item.unit_status === 'maintenance'
                                            ? 'bg-red-100 text-red-500 dark:bg-transparent border border-red-100 dark:border-red-950'
                                            : item.unit_status === 'vacant'
                                            ? 'bg-amber-100 text-amber-500 dark:bg-transparent border border-amber-200 dark:border-amber-950'
                                            : item.unit_status === 'maintenance'
                                            ? 'bg-amber-100 text-amber-500 dark:bg-transparent border border-amber-200 dark:border-amber-950'
                                            : ''
                                    }`}>
                                
                                        <div className='flex items-center gap-1'>
                                            {item.unit_status === 'occupied' && <GoDotFill/>}
                                            {item.unit_status === 'vacant' && <GoDotFill/>}
                                            {item.unit_status === 'maintenance' && <GoDotFill/>}
                                            {item.unit_status || '-'}
                                        </div>
                                    </span>

                                </td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>Ksh. {item.rent_amount || '-'}</td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>
                                    <span className={`inline-flex rounded px-3 py-1 ${
                                        item.rent_status === 'paid'
                                        ? 'bg-green-50 text-green-500 dark:bg-transparent border border-green-100 dark:border-green-950'
                                        : item.rent_status === 'overdue'
                                        ? 'bg-red-100 text-red-500 dark:bg-transparent border border-red-200 dark:border-red-950'
                                        : item.rent_status === 'vacant'
                                        ? 'bg-amber-100 text-amber-500 dark:bg-transparent border border-amber-200 dark:border-amber-950'
                                        : item.rent_status === 'pending'
                                        ? 'bg-amber-100 text-amber-500 dark:bg-transparent border border-amber-100 dark:border-amber-950'
                                        : item.rent_status === 'caretaker'
                                        ? 'bg-blue-100 text-blue-500 dark:bg-transparent border border-blue-200 dark:border-blue-950'
                                        : ''
                                    }`}>
                                        <div className='flex items-center gap-1'>
                                            {item.rent_status === 'paid' && <GoDotFill/>}
                                            {item.rent_status === 'vacant' && <GoDotFill/>}
                                            {item.rent_status === 'overdue' && <GoDotFill/>}
                                            {item.rent_status === 'pending' && <GoDotFill/>}
                                            {item.rent_status === 'caretaker' && <GoDotFill/>}
                                            {item.rent_status}
                                        </div> 
                                    </span>
                                </td>
                                <td className='relative py-4 px-3 border-b border-white dark:border-gray-800'>
                                    <div className='flex items-center text-lg gap-4'>
                                        <span className='text-blue-600 cursor-pointer'><FiEdit/></span>
                                        <span onClick={() => {setDeleteModal(item.id)}} className='text-red-600 cursor-pointer'><RiDeleteBin6Line/>
                                        
                                            {deleteModal === item.id && (
                                                <div>
                                                    <DeleteModal deleteRecord={() => deleteRecord(item.id)} entity={`(Unit: ${item.unit_number})`} deleteModal={deleteModal} setDeleteModal={setDeleteModal}/>
                                                </div>
                                            )}
                                        </span>
                                        <span onClick={() => {setOpenRowId(openRowId === item.id ? null : item.id)}}><IoIosArrowDown className={`${openRowId === item.id ? 'rotate-180 duration-300 transition-300 cursor-pointer' : 'rotate-0 duration-300 cursor-pointer transition-all'}`}/></span>
                                        <span className='cursor-pointer'><HiDotsHorizontal/></span>
                                    </div>
                                 
                                </td>
                                {openRowId === item.id && (
                                   <td className='shadow-lg dark:shadow-gray-800 border bg-blue-50 dark:bg-gray-900 rounded border-gray-300 dark:border-gray-700 shadow-gray-400 left-0 right-0 absolute z-50 top-full'>
                                        <div>
                                            <MoreUnitInfo id={item.id}/>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                        
                    ) : (
                        <tr key={``} className='relative text-center'>
                            <td colSpan={6} className='py-4 px-3 text-center text-gray-500'>
                                No records found
                            </td>
                        </tr>
                    )}
                </thead>
            </table>
        </div>
    )
}

export default UnitData
