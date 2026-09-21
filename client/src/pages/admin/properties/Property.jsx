import React from 'react'
import useProperty from './useProperty'
import { useOutletContext } from 'react-router-dom'
import {useState} from 'react'
import PropertyData from './propertyData'
import NameColor from '../../components/NameColor'
import PaginationFull from '../../components/PaginationFull'
import { GoDotFill } from "react-icons/go";
import useSuggestions from './useSuggestions'
import { GiHamburgerMenu } from "react-icons/gi";
import { IoSearchSharp } from "react-icons/io5";
import Stats from '../../components/Stats'
import { RiExportFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import FilterDropdown from '../../components/FilterDropdown'
import propertyFilter from '../../components/usePropertyFilter'
import Pagination from '../../components/Pagination'
import useReports from './useReports'
import { BsBuildingsFill } from "react-icons/bs";
import { FaBuildingUser } from "react-icons/fa6";
import { BsBuildingFillAdd } from "react-icons/bs";
import { HiBuildingOffice2 } from "react-icons/hi2";

const Property = () => {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [searchDropdown, setSearchDropdown] = useState(false)
    const [filter, setFilter] = useState({})
    const [resultId, setResultId] = useState(null)
    const {property, count} = useProperty(page, search, resultId)
    const {getColorFromName, getInitials} = NameColor()
    const {suggestions} = useSuggestions(search)
    const {reports} = useReports()

    const PAGE_SIZE = 10
    const totalPages = Math.ceil(count/PAGE_SIZE)

    const onPageChange = (set_page) => {
        setPage(set_page)
    }

    const propertyOptions = [
        {value: '', label: 'All Properties'},
        ...(Array.isArray(propertyFilter) ? propertyFilter : []).map(item =>({value: item.id, label: item.landlord_name}))
    ]

    return (
        <div>
            <section className='flex flex-col my-2 gap-3 w-full'>
                <div className='flex justify-between w-[95%]'>
                    <p className='flex items-center text-3xl gap-1 font-bold'>
                        <span className='text-2xl'><GiHamburgerMenu/></span>
                        <span>Properties</span> 
                    </p>

                    <div className='flex w-[37%] relative items-center px-3 h-9 py-1 border rounded border-gray-300 dark:border-gray-700'>
                        <IoSearchSharp className='mr-3 text-2xl text-gray-400'/>
                        <input value={search} onChange={(e) => {setSearch(e.target.value); setResultId(null); setSearchDropdown(true)}} placeholder='Search Property...' type="search" className='border:none w-full outline:none dark:text-gray-300 focus:outline-none'/>

                        {searchDropdown && suggestions.length > 0 && (
                            <ul className='absolute z-50 top-full max-h-[450px] overflow-auto left-0 mt-1 border shadow-2xl shadow-gray-400 dark:shadow-gray-800 dark:border-gray-700  dark:bg-gray-900 border-gray-300 w-[98%] rounded bg-blue-50'>
                                {suggestions.map((item, index) => (
                                    <li key={item.id} onClick={() => {setSearch(item.landlord_name); setResultId(item.id); setSearchDropdown(false)}}
                                        className='mx-2 px-2 py-1 my-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer text-xs'
                                    >
                                        <div className='border-b border-gray-100 dark:border-gray-700'>
                                            <div className="font-bold flex h-9 items-center text-sm text-blue-800 dark:text-blue-400 gap-2">
                                                Property: {item.landlord_name} <GoDotFill/>  Location: {item.location}
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
                        icon = {<BsBuildingsFill/>}
                        label = 'Total Properties'
                        stats_value = {reports.total_properties}
                        width={'w-56'}
                        stats_per=''
                    />
                    <Stats 
                        icon = {<FaBuildingUser/>}
                        label = 'Total Tenants'
                        stats_value = {'243'}
                        width={'w-56'}
                        stats_per=''
                    />
                    <Stats 
                        icon = {<BsBuildingFillAdd/>}
                        label = 'Total Tenants'
                        stats_value = {'243'}
                        width={'w-56'}
                        stats_per=''
                    />
                    <Stats 
                        icon = {<HiBuildingOffice2/>}
                        label = 'Total Tenants'
                        stats_value = {'243'}
                        width={'w-56'}
                        stats_per=''
                    />
                </div>

                <div className='flex justify-between'>
                    <div className='flex gap-3 z-50'>
                        <div className='flex gap-3 space-y-2'>
                            <FilterDropdown
                                label='All Properties'
                                options={propertyOptions}
                                value={filter.landlord__first_name}
                                onChange={(item) => setFilter(prev => ({ ...prev, landlord__first_name: item }))}
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
            <PropertyData property={property} getColorFromName={getColorFromName} getInitials={getInitials} />
            
            <div>
                <PaginationFull page={page} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
        </div>
    )
}

export default Property
