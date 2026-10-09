import React from 'react'
import {useState} from 'react'
import UnitData from './UnitData'
import useUnit from './useUnit'
import { FaPlus } from "react-icons/fa6";
import useSuggestions from './useSuggestions'
import { IoSearchSharp } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import { RiExportFill } from "react-icons/ri";
import FilterDropdown from '../../components/FilterDropdown'
import usePropertyFilter from '../../components/usePropertyFilter'
import { GiHamburgerMenu } from "react-icons/gi";
import Stats from '../../components/Stats'
import Pagination from '../../components/Pagination'
import PaginationFull from '../../components/PaginationFull'
import useReports from './useReports';
import { MdAddHomeWork } from "react-icons/md";
import { SiHomeadvisor } from "react-icons/si";
import { BsHouseSlashFill } from "react-icons/bs";
import { MdOtherHouses } from "react-icons/md";

const Unit = () => {
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [sortField, setSortField] = useState('')
    const [sortDirection, setSortDirection] = useState('asc')
    const [filter, setFilter] = useState({})
    const {reports} = useReports()
    const [resultId, setResultId] = useState(null)
    const [searchDropdown, setSearchDropdown] = useState(false)
    const {propertyFilter} = usePropertyFilter()

    const {units, count, loading, deleteRecord} = useUnit(page, filter, search, resultId, sortField, sortDirection)
    const {suggestions} = useSuggestions(search)

    const PAGE_SIZE = 10
    const totalPages = Math.ceil(count/ PAGE_SIZE)

    const propertyOptions = [
        {value: '', label: 'All Properties'},
        ...(Array.isArray(propertyFilter) ? propertyFilter : []).map(item =>({value: item.id, label: item.landlord_name}))
    ]

    const unitOptions = [
        { value: '', label: 'All Unit Status' },
        { value: 'occupied', label: 'Occupied' },
        { value: 'vacant', label: 'Vacant' }, 
        { value: 'maintenance', label: 'Maintenance' },
    ]

    const rentOptions = [
        { value: '', label: 'All Rent Status' },
        { value: 'paid', label: 'Paid' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'pending', label: 'Pending' },
        { value: 'vacant', label: 'Vacant' },
        { value: 'caretaker', label: 'Caretaker' },
    ]

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
        } else {
            setSortDirection('asc')
            setSortField(field)
        }
    }

    const onPageChange = (set_page) => {
        setPage(set_page)
    }

    return (
        <div>
            <section className='flex flex-col my-2 gap-3 w-full'>
                <div className='flex justify-between mx-9 w-[95%]'>
                    <p className='flex items-center gap-1 text-2xl font-bold'>
                        <span><GiHamburgerMenu/></span>
                        <span>Unit</span> 
                    </p>
                    <div className='flex relative items-center px-3 h-9 py-1 w-[37%] border rounded border-gray-300 dark:border-gray-700'>
                        <IoSearchSharp className='mr-3 text-2xl text-gray-400'/>
                        <input value={search} onChange={(e) => {setSearch(e.target.value); setResultId(null); setSearchDropdown(true)}} placeholder='Search Property, Units, Tenant...' type="search" className='border:none w-full outline:none dark:text-gray-300 focus:outline-none'/>

                        {searchDropdown && suggestions.length > 0 && (
                            <ul className='absolute z-50 top-full max-h-[450px] overflow-auto left-0 mt-1 border shadow-2xl shadow-gray-400 dark:shadow-gray-800 dark:border-gray-700  dark:bg-gray-900 border-gray-300 w-[98%] rounded bg-white'>
                                {suggestions.map((item, index) => (
                                    <li key={index} onClick={() => {setSearch(item.unit_number); setResultId(item.id); setSearchDropdown(false)}}
                                        className='mx-2 px-2 py-1 my-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer text-xs'
                                    >
                                        <div className='border-b border-gray-100 dark:border-gray-700'>
                                            <div className="font-bold flex items-center text-sm text-blue-600 dark:text-blue-500 gap-1">
                                                Unit Number: {item.unit_number} <GoDotFill/>  Property: {item.property_name}
                                            </div>

                                            <div className="flex items-center gap-1 fold-semibold text-sm text-gray-400">
                                                Unit Status: {item.unit_status} <GoDotFill/> Rent Status: {item.rent_status}
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
                        icon={<MdAddHomeWork/>}
                        label={`Total Number of units`}
                        stats_value={reports.total_units}
                        stats_per={`89`}
                        width={'w-56'}
                    />
                    <Stats 
                        icon={<SiHomeadvisor/>}
                        label={`Total Units Occupied`}
                        stats_value={reports.total_occupied}
                        stats_per={`89`}
                        width={'w-56'}
                    />
                    <Stats 
                        icon={<MdOtherHouses/>}
                        label={`this is a test`}
                        stats_value={`23454`}
                        stats_per={`89`}
                        width={'w-56'}
                    />
                    <Stats 
                        icon={<BsHouseSlashFill/>}
                        label={`Total vacant Units`}
                        stats_value={`23454`}
                        stats_per={`89`}
                        width={'w-56'}
                    />
                </div>

                <div className='flex justify-between'>
                    <div className='flex gap-3 z-30'>
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
                                label='All Unit Status'
                                options={unitOptions}
                                value={filter.unit_status}
                                onChange={(item) => setFilter(prev => ({ ...prev, unit_status: item }))}
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
                    
                    <div className='flex items-center justify-center gap-3'>
                        <div>
                            <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
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

            <UnitData units={units} count={count} deleteRecord={deleteRecord}
                sortField={sortField} loading={loading} sortDirection={sortDirection} handleSort={handleSort} />
            <div>
                <PaginationFull page={page} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
        </div>
    )
}

export default Unit
