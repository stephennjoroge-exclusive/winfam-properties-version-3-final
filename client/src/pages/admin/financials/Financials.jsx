import React from 'react'
import {useState, useRef, useEffect} from 'react'
import useFinancials from './useFinancials'
import useSuggestions from './useSuggestions'
import FinancialData from './FinancialData'
import { IoSearchSharp } from "react-icons/io5";
import { RiExportFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import FilterDropdown from '../../components/FilterDropdown'
import usePropertyFilter from '../../components/usePropertyFilter'
import Stats from '../../components/Stats'
import Pagination from '../../components/Pagination'
import { GiCash } from "react-icons/gi";
import { GiHamburgerMenu } from "react-icons/gi";
import useReports from './useReports'
import { MdAttachMoney } from "react-icons/md";
import { GiTakeMyMoney } from "react-icons/gi";
import { GiReceiveMoney } from "react-icons/gi";

const Financials = () => {
    const [page, setPage] = useState(1)
    const [sortField, setSortField] = useState('property_obj')
    const [sortDirection, setSortDirection] = useState('asc')
    const [search, setSearch] = useState('')
    const [searchDropdown, setSearchDropdown] = useState(false)
    const [filter, setFilter] = useState({})
    const [resultId, setResultId] = useState(null)
    const {financials, count, errors, previous, deleteRecord} = useFinancials(page, filter, search, resultId, sortField, sortDirection)
    const {suggestions} = useSuggestions(search)
    const {propertyFilter} = usePropertyFilter()
    const closeRef = useRef(null)
    const {reports} = useReports()

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
    
    const PAGE_SIZE = 10
    const totalPages = Math.ceil(count/ PAGE_SIZE)

    const onPageChange = (set_page) => {
        setPage(set_page)
    }

    const YEARS = [2025, 2026, 2027, 2028]

    const YEAR_OPTIONS = [
        { value: '', label: 'Year' },
        ...YEARS.map(year => ({ value: year, label: String(year) })),
    ]

    const MONTHS = [
        { name: 'January', value: 1 },
        { name: 'February', value: 2 },
        { name: 'March', value: 3 },
        { name: 'April', value: 4 },
        { name: 'May', value: 5 },
        { name: 'June', value: 6 },
        { name: 'July', value: 7 },
        { name: 'August', value: 8 },
        { name: 'September', value: 9 },
        { name: 'October', value: 10 },
        { name: 'November', value: 11 },
        { name: 'December', value: 12 },
    ]

    const MONTH_OPTIONS = [
        { value: '', label: 'Month' },
        ...MONTHS.map(month => ({ value: month.value, label: month.name })),
    ]

    const rentOptions = [
        { value: '', label: 'All Rent Status' },
        { value: 'paid', label: 'Paid' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'pending', label: 'Pending' },
        { value: 'vacant', label: 'Vacant' },
    ]

    const propertyOptions = [
        {value: '', label: 'All Properties'},
        ...(Array.isArray(propertyFilter) ? propertyFilter : []).map(item =>({value: item.id, label: item.landlord_name}))
    ]

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
                        <span>Payment</span> 
                    </p>

                    <div ref={closeRef} className='flex w-[40%] relative items-center px-3 h-9 py-1 border rounded border-gray-300 dark:border-gray-700'>
                        <IoSearchSharp className='mr-3 text-2xl text-gray-400'/>
                        <input value={search} onChange={(e) => {setSearch(e.target.value); setResultId(null); setSearchDropdown(true)}} placeholder='Search Property, Units, Tenant...' type="search" className='border:none w-full outline:none dark:text-gray-300 focus:outline-none'/>

                        {searchDropdown && suggestions.length > 0 && (
                            <ul className='absolute z-50 top-full max-h-[450px] overflow-auto left-0 mt-1 border shadow-2xl shadow-gray-400 dark:shadow-gray-800 dark:border-gray-700  dark:bg-gray-900 border-gray-300 w-[98%] rounded bg-blue-50'>
                                {suggestions.map((item, index) => (
                                    <li key={index} onClick={() => {setSearch(item.tenant_snapshot); setResultId(item.id); setSearchDropdown(false)}}
                                        className='mx-2 px-2 py-1 my-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer text-xs'
                                    >
                                        <div className='border-b border-gray-100 dark:border-gray-700'>
                                            <div className="font-bold flex items-center text-sm text-blue-600 dark:text-blue-400 gap-1">
                                                Tenant: {item.tenant_snapshot} <GoDotFill/>  Unit: {item.unit_number}
                                            </div>

                                            <div className="flex items-center gap-1 fold-semibold text-sm text-gray-400">
                                                Property: {item.property_obj} <GoDotFill/> Date: <span className='font-bold'>{item.date}</span>
                                            </div>

                                            <div className="flex items-center gap-1 text-gray-400 text-[12px]">
                                                Rent Payable: {item.rent_payable} <GoDotFill/> Rent: {item.rent} <GoDotFill/> Status: <span className='font-bold'>{item.rent_status}</span> 
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
                        icon = {<GiCash/>}
                        label = 'Total Payments'
                        stats_value = {`${reports.total_payments}`}
                        stats_per = '100'
                        width={'w-56'}
                    />
                    <Stats 
                        icon = {<GiTakeMyMoney/>}
                        label = 'Total Rent_payable'
                        stats_value = {`Ksh. ${reports.total_rent_payable}`}
                        stats_per = {reports.rent_payable_percentage}
                        width={'w-68'}

                    />
                    <Stats 
                        icon = {<GiReceiveMoney/>}
                        label = 'Total Rent'
                        stats_value = {`Ksh. ${reports.total_rent}`}
                        stats_per = {reports.rent_percentage}
                        width={'w-56'}
                    />
                    <Stats 
                        icon = {<MdAttachMoney/>}
                        label = 'Overdue Payments'
                        stats_value = {`Ksh. ${reports.total_overdue}`}
                        stats_per = {reports.overdue_percentage}
                        width={'w-56'}
                    />
                </div>
               
                <div className='flex justify-between'>
                    <div className='flex gap-3'>
                        <div className='flex gap-3 space-y-2'>
                            <FilterDropdown
                                label='All Properties'
                                options={propertyOptions}
                                value={filter.property_obj}
                                onChange={(item) => setFilter(prev => ({ ...prev, property_obj: item }))}
                                width={`min-w-[200px]`}
                            />
                        </div>
                        <div className='flex gap-3'>
                            <FilterDropdown
                                label='All Rent Status'
                                options={rentOptions}
                                value={filter.rent_status}
                                onChange={(item) => setFilter(prev => ({ ...prev, rent_status: item }))}
                                width={`min-w-[180px]`}
                            />
                        </div>

                        <div className='flex gap-3'>
                            <FilterDropdown
                                label="Month"
                                options={MONTH_OPTIONS}
                                value={filter.month}
                                onChange={(value) => setFilter(prev => ({ ...prev, month: value ?? '' }))}
                                width={`min-w-[80px]`}
                            />
                            <FilterDropdown
                                label="Year"
                                options={YEAR_OPTIONS}
                                value={filter.year}
                                onChange={(value) => setFilter(prev => ({ ...prev, year: value ?? '' }))}
                                width={`min-w-[80px]`}
                            />
                        </div>
                    </div>
                    
                    <div className='flex gap-3'>
                        <div>
                           <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange}/>
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
            <FinancialData count={count} onPageChange={onPageChange} handleSort={handleSort} sortField={sortField} sortDirection={sortDirection} financials={financials} deleteRecord={deleteRecord} page={page} setPage={setPage}
                totalPages={totalPages} />
        </div>
    )
}

export default Financials

