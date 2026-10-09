import React from 'react'
import {useState, useRef} from 'react'
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";
import DeleteModal from '../../components/DeleteModal';
import MorePaymentInfo from './MorePaymentInfo';
import { FaSortDown } from "react-icons/fa6";
import { TiArrowSortedUp } from "react-icons/ti";
import { FaSort } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";
import PaginationFull from '../../components/PaginationFull';
import NameColor from '../../components/NameColor';
import useCloseRef from '../../components/useCloseRef';

const FinancialData = ({count, financials, page, setPage, loading, totalPages, onPageChange, deleteRecord, sortField, sortDirection, handleSort}) => {
    const [openRowId, setOpenRowId] = useState(null)
    const [selectedIds, setSelectedIds] = useState([])
    const [deleteModal, setDeleteModal] = useState(false)
    const {getInitials, getColorFromName} = NameColor()
    const [moreOptions, setMoreOptions] = useState(false)
    const closeMoreOption = useRef(null)

    useCloseRef({
        refValue: closeMoreOption,
        handleStateClose: setMoreOptions
    })


    const progress = (value, rentStatus) => {
        if (rentStatus === 'vacant') return 'bg-amber-500';
        if (value === 100) return 'bg-green-500';
        if (value === 0) return 'bg-red-500'
        if (value < 100 && value > 50) return 'bg-amber-500'
        return 'bg-red-500'
    }

    const allIds = Array.isArray(financials) ? financials.map((item) => item.id) : []
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
        <div className=''>
            <table className='w-full'>
                <thead>
                    <tr className='border-b border-white bg-blue-100 duration-300 transition-all dark:border-gray-800 text-gray-700 dark:bg-gray-800 dark:text-gray-300 shadow'>
                        <th className='text-start py-3 px-3'><input checked={allSelected} onChange={toggleAllRows} type="checkbox" /></th>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('property_obj')}><span className='flex items-center gap-3'>Property {arrow('property_obj')}</span></th>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('unit')}><span className='flex items-center gap-3'>Unit {arrow('unit')}</span></th>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('tenant')}><span className='flex items-center gap-3'>Tenant Name{arrow('tenant')}</span></th>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('rent_payable')}><span className='flex items-center gap-3'>Rent Payable {arrow('rent_payable')}</span></th>
                        <th className='text-start px-2 py-1' onClick={() => handleSort('rent')}><span className='flex items-center gap-3'>Rent {arrow('rent')}</span></th>
                        <th className='text-start py-3 px-3'>Progress</th>
                        <th className='text-start py-3 px-3'>Operations</th>
                    </tr>
                </thead>
                
                <tbody className=''>
                   {loading ? (
                        <tr>
                            <td colSpan={8} className='py-8 px-3 text-center'>
                                <div className='flex justify-center'>
                                    <div className='animate-spin border-2 border-t-transparent h-6 w-6 border-blue-500 rounded-full'></div>
                                </div>
                            </td>
                        </tr>
                   ):Array.isArray(financials) && financials.length > 0 ? (
                        financials.map((item) => (
                            <tr key={item.id} className={`relative py-4 capitalize px-3 ${selectedIds.includes(item.id)
                                ? 'bg-blue-200 border-l-4 border-blue-500 dark:border-teal-600 dark:bg-teal-900'
                                : openRowId === item.id
                                ? item.rent_status === 'overdue'
                                    ? 'bg-red-100 border-l-4 border-red-500 dark:bg-gray-800'
                                    : item.rent_status === 'paid'
                                    ? 'bg-green-100 border-l-4 border-green-500 dark:bg-gray-800'
                                    : item.rent_status === 'pending'
                                    ? 'bg-amber-100 border-l-4 border-amber-500 dark:bg-gray-800'
                                    : item.rent_status === 'vacant'
                                    ? 'bg-orange-100 border-l-4 border-orange-500 dark:bg-gray-800'
                                    : ''
                                : item.rent_status === 'overdue'
                                ? 'border-l-4 border-red-500 bg-red-50 dark:bg-transparent'
                                : item.rent_status === 'pending'
                                ? 'border-l-4 border-amber-500 bg-amber-50 dark:bg-transparent'
                                : item.rent_status === 'vacant'
                                ? 'border-l-4 border-orange-300 bg-orange-50 dark:bg-transparent'
                                : ''
                            }`}>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'><input  
                                    onChange={() => {toggleRow(item.id)}} checked={selectedIds.includes(item.id)} 
                                    type="checkbox"/>
                                </td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>
                                    <div className='flex items-center gap-3'>
                                        <span className={`${getColorFromName(item.property_name)} h-8 w-8 flex items-center justify-center rounded-full font-bold bg-blue-500 text-white`}>
                                            {getInitials(item.property_name)} 
                                        </span>
                                        {item.property_name}
                                    </div>
                                </td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>{item.unit_number}</td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>
                                    <div className='flex items-center gap-3'>
                                        <span className={`${getColorFromName(item.tenant_name)} h-8 w-8 flex items-center justify-center rounded-full font-bold bg-blue-500 text-white`}>
                                            {getInitials(item.tenant_name)} 
                                        </span>
                                        {item.tenant_name || '-'}
                                    </div>
                                </td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>Ksh. {item.rent_payable}</td>
                                <td className='py-4 px-3 border-b border-white dark:border-gray-800'>Ksh. {item.rent}</td>
                                <td className='py-4 px-3 w-48 border-b border-white dark:border-gray-800'>
                                    <div className='gap-3'>
                                        <div className='flex items-center justify-between'>
                                            <p>Completeness</p>
                                            <span className='text-xs whitespace-nowrap'>{item.completion_progress}%</span>
                                        </div>
                                        <div className=' flex-1 h-1.5 bg-gray-300 rounded-full overflow-hidden'>
                                            <div className={`${progress(item.completion_progress)} h-full rounded-full`}
                                                style={{width: item.completion_progress === 0 ? '4px' : `${item.completion_progress}%`}}>

                                            </div>
                                        </div>
                                       
                                    </div>
                                   
                                </td>
                                <td className='py-4 relative px-3 border-b border-white dark:border-gray-800'>
                                    <div className='flex items-center text-lg gap-4'>
                                        <span className='text-blue-600 cursor-pointer'><FiEdit/></span>
                                        <span onClick={() => {setDeleteModal(item.id)}} className='text-red-600 cursor-pointer'><RiDeleteBin6Line/>
                                        
                                            {deleteModal === item.id && (
                                                <div>
                                                    <DeleteModal deleteRecord={() => deleteRecord(item.id)} deleteModal={deleteModal} entity={item.tenant_snapshot} setDeleteModal={setDeleteModal}/>
                                                </div>
                                            )}
                                        </span>
                                        <span onClick={() => {setOpenRowId(openRowId === item.id ? null : item.id)}}><IoIosArrowDown className={`${openRowId === item.id ? 'rotate-180 duration-300 transition-300 cursor-pointer' : 'rotate-0 duration-300 cursor-pointer transition-all'}`}/></span>
                                        <span  onClick={() => {setMoreOptions(item.id)}} className='cursor-pointer'>
                                            <span><HiDotsHorizontal/></span>

                                            {moreOptions === item.id && (
                                                <div ref={closeMoreOption} className='absolute top-full right-0 w-48 h-56 bg-blue-50 shadow-2xl border-2 px-3 py-1 border-blue-300 z-50 rounded'>
                                                    <p>This is a test</p>
                                                </div>
                                            )}
                                        </span>
                                    </div>
                                 
                                </td>
                                {openRowId === item.id && (
                                    <td className='shadow-lg dark:shadow-gray-800 border rounded border-gray-300 dark:border-gray-700 shadow-gray-400 left-0 right-0 absolute z-50 top-full'>
                                        <div ref={closeMoreOption} className='bg-white dark:bg-gray-900 h-80 w-full '>
                                            <MorePaymentInfo id={item.id}/>
                                        </div>
                                    </td>
                                )}
                                    
                            </tr>
                        ))
                        
                    ): (
                        <tr className='relative text-center'>
                            <td colSpan={9}>
                                <div className='flex justify-center mt-3'>
                                    <div className='animate-spin border-2 border-t-transparent h-6 w-6 border-blue-500 rounded-full'></div>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>

            <div className=''>
                <PaginationFull page={page} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
        </div>
    )
}

export default FinancialData
