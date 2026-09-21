import React from 'react'
import useTenant from './useTenant'
import TenantData from './TenantData'
import {useState, useRef, useEffect} from 'react'
import Stats from '../../components/Stats';
import { FaPeopleGroup } from "react-icons/fa6";
import { SlGraph } from "react-icons/sl";
import Pagination from '../../components/Pagination';
import NameColor from '../../components/NameColor';
import FilterDropdown from '../../components/FilterDropdown';
import { RiExportFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import usePropertyFilter from '../../components/usePropertyFilter';
import { GiHamburgerMenu } from "react-icons/gi";
import { IoSearchSharp } from "react-icons/io5";
import useSuggestions from './useSuggestions'
import { GoDotFill } from "react-icons/go";
import PaginationFull from '../../components/PaginationFull'
import useReports from './useReports';
import { FaArrowsDownToPeople } from "react-icons/fa6";
import { TbBrandCashapp } from "react-icons/tb";
import { FaPeopleRoof } from "react-icons/fa6";

const Tenant = () => {
    const [search, setSearch] = useState('')
    const [searchDropdown, setSearchDropdown] = useState(false)
    const [page, setPage] = useState(1)
    const [sortField, setSortField] = useState('')
    const [sortDirection, setSortDirection] = useState('asc')
    const {getInitials, getColorFromName} = NameColor()
    const [filter, setFilter] = useState({})
    const [resultId, setResultId] = useState(null)
    const {tenant, errors, count, next, previous} = useTenant(page, filter, search, resultId, sortField, sortDirection )
    const {propertyFilter} = usePropertyFilter()
    const closeRef = useRef(null)
    const {suggestions} = useSuggestions(search)
    const {reports} = useReports()

    const PAGE_SIZE = 10
    const totalPages = Math.ceil(count / PAGE_SIZE)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (closeRef.current && !closeRef.current.contains(e.target)){
                setSearchDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }

    }, [])

    const rentOptions = [
        { value: '', label: 'All Rent Status' },
        { value: 'paid', label: 'Paid' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'vacant', label: 'Vacant' },
        { value: 'caretaker', label: 'Caretaker' },
    ]

    const propertyOptions = [
        {value: '', label: 'All Properties'},
        ...(Array.isArray(propertyFilter) ? propertyFilter : []).map(item =>({value: item.id, label: item.landlord_name}))
    ]

    const onPageChange = (newPage) => {
        setPage(newPage)
    }

    const handleSort = (field) => {
        if (sortField === field){
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    return (
        <div>
            <section className='flex flex-col my-2 gap-3 w-full'>
                <div className='flex justify-between w-[95%]'>
                    <p className='flex items-center text-3xl gap-1 font-bold'>
                        <span className='text-2xl'><GiHamburgerMenu/></span>
                        <span>Tenant</span> 
                    </p>

                    <div ref={closeRef} className='flex w-[37%] relative items-center px-3 h-9 py-1 border rounded border-gray-300 dark:border-gray-700'>
                        <IoSearchSharp className='mr-3 text-2xl text-gray-400'/>
                        <input value={search} onChange={(e) => {setSearch(e.target.value); setResultId(null); setSearchDropdown(true)}} placeholder='Search Property, Units, Tenant...' type="search" className='border:none w-full outline:none dark:text-gray-300 focus:outline-none'/>

                        {searchDropdown && suggestions.length > 0 && (
                            <ul className='absolute z-50 top-full max-h-[450px] overflow-auto left-0 mt-1 border shadow-2xl shadow-gray-400 dark:shadow-gray-800 dark:border-gray-700  dark:bg-gray-900 border-gray-300 w-[98%] rounded bg-blue-50'>
                                {suggestions.map((item, index) => (
                                    <li key={item.id} onClick={() => {setSearch(item.full_name); setResultId(item.id); setSearchDropdown(false)}}
                                        className='mx-2 px-2 py-1 my-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer text-xs'
                                    >
                                        <div className='border-b border-gray-100 dark:border-gray-700'>
                                            <div className="font-bold flex items-center text-sm text-blue-600 dark:text-blue-400 gap-1">
                                                Tenant: {item.full_name} <GoDotFill/>  Unit: {item.unit_number}
                                            </div>

                                            <div className="flex items-center gap-1 fold-semibold text-sm text-gray-400">
                                                Property: {item.property_name}  <GoDotFill/>  rent_status: <span className={`
                                                    ${item.rent_status === 'paid'
                                                        ? 'font-bold text-green-500'
                                                        : item.rent_status === 'overdue'
                                                        ? 'font-bold text-red-400'
                                                        : item.rent_status === 'vacant'
                                                        ? 'font-bold text-amber-500'
                                                        : item.rent_status === 'pending'
                                                        ? 'font-bold text-amber-500'
                                                        : ''
                                                    }
                                                    `}>{item.rent_status}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className='flex gap-3'>
                    <Stats 
                        icon = {<FaPeopleGroup/>}
                        label = 'Total Tenants'
                        stats_value = {reports.total_tenants}
                        width={'w-56'}
                        stats_per=''
                    />
                    <Stats 
                        icon = {<FaArrowsDownToPeople/>}
                        label = 'Total Tenants with Balance'
                        stats_value = {reports.tenant_balance}
                        width={'w-56'}
                    />
                    <Stats 
                        icon = {<TbBrandCashapp/>}
                        label = 'Total Balance'
                        stats_value = {`Ksh. ${reports.total_outstanding_balance}`}
                        width={'w-56'}
                    />
                    <Stats 
                        icon = {<FaPeopleRoof/>}
                        label = 'Total Occupancy'
                        stats_value = {reports.total_occupied}
                        stats_per = {reports.occupied_percentage}
                        width={'w-56'}
                    />
                </div>

                <div className='flex justify-between'>
                    <div className='flex gap-3 z-80'>
                        <div className='flex gap-3 space-y-2'>
                            <FilterDropdown
                                label='All Properties'
                                options={propertyOptions}
                                value={filter.property_obj}
                                onChange={(item) => setFilter(prev => ({ ...prev, property_obj: item }))}
                                width={`min-w-[180px]`}
                            />
                        </div>
                        <div className='flex gap-3'>
                            <FilterDropdown
                                label='All Rent Status'
                                options={rentOptions}
                                value={filter.payments__rent_status}
                                onChange={(item) => setFilter(prev => ({ ...prev, payments__rent_status: item }))}
                                width={`min-w-[180px]`}
                            />
                        </div>
                    </div>
                    
                    <div className='flex gap-3'>
                        <div>
                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                onPageChange={onPageChange}
                            />
                        </div>

                        <span className='rounded px-3 cursor-pointer py-1 border-2 border-blue-600 text-blue-600 dark:text-blue-500 dark:border-blue-500 font-semibold'>
                            <span className='flex items-center gap-2'>
                                <RiExportFill className='text-xl'/>
                                <p>Export</p>
                            </span>
                        </span>
                        <span className='rounded px-3 py-1 cursor-pointer bg-blue-600 text-white font-semibold'>
                            <span className='flex items-center gap-2'>
                                <FaPlus className='text-xl'/>
                                <p>Create</p>
                            </span>
                        </span>
                    </div>
                    
                </div>
            </section>
            
            <TenantData tenant={tenant} sortField={sortField} sortDirection={sortDirection} handleSort={handleSort} getColorFromName={getColorFromName} getInitials={getInitials} errors={errors} previous={previous} />

            <div>
                <PaginationFull page={page} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
        </div>
    )
}

export default Tenant
