import React from 'react'
import useUtility from './useUtility'
import UtilitiesData from './UtilitiesData'
import { GiHamburgerMenu } from "react-icons/gi";
import { IoSearchSharp } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import { useState } from 'react';
import Stats from '../../components/Stats';
import useSuggestions from './useSuggestions'
import PaginationFull from '../../components/PaginationFull';
import FilterDropdown from '../../components/FilterDropdown';
import Pagination from '../../components/Pagination';
import { RiExportFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import usePropertyFilter from '../../components/usePropertyFilter'

const Utilities = () => {
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [searchDropdown, setSearchDropdown] = useState(false)
    const {utility, count} = useUtility(search, page)
    const {propertyFilter} = usePropertyFilter()
    const {suggestions} = useSuggestions(search)

    const PAGE_SIZE = 10
    const totalPages = Math.ceil(count / PAGE_SIZE)

    const propertyOptions = [
        {value: '', label: 'All Properties'},
        ...(Array.isArray(propertyFilter) ? propertyFilter : []).map(item =>({value: item.id, label: item.landlord_name}))
    ]

    const onPageChange = (set_page) => {
        setPage(set_page)
    }

    return (
        <div>
            <section>
                <div className='flex justify-between w-[95%]'>
                    <p className='flex items-center text-3xl gap-1 font-bold'>
                        <span className='text-2xl'><GiHamburgerMenu/></span>
                        <span>Utilities</span> 
                    </p>

                    <div className='flex w-[37%] relative items-center px-3 h-9 py-1 border rounded border-gray-300 dark:border-gray-700'>
                        <IoSearchSharp className='mr-3 text-2xl text-gray-400'/>
                        <input value={search} onChange={(e) => {setSearch(e.target.value); setSearchDropdown(true)}} placeholder='Search Property, Units, Tenant...' type="search" className='border:none w-full outline:none dark:text-gray-300 focus:outline-none'/>

                        {searchDropdown && suggestions.length > 0 && (
                            <ul className='absolute z-50 top-full max-h-[450px] overflow-auto left-0 mt-1 border shadow-2xl shadow-gray-400 dark:shadow-gray-800 dark:border-gray-700  dark:bg-gray-900 border-gray-300 w-[98%] rounded bg-blue-50'>
                                {suggestions.map((item, index) => (
                                    <li key={item.id} onClick={() => {setSearch(item.item); setSearchDropdown(false)}}
                                        className='mx-2 px-2 py-1 my-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer text-xs'
                                    >
                                        <div className='border-b border-gray-100 dark:border-gray-700'>
                                            <div className="font-bold flex items-center text-sm text-blue-600 dark:text-blue-400 gap-1">
                                                Property: {item.property_name} <GoDotFill/>  Unit: {item.unit_number} <GoDotFill/>  Item: {item.item}
                                            </div>

                                            <div className="flex items-center gap-1 fold-semibold text-sm text-gray-400">
                                                Previous Reading: <span className='font-bold text-gray-500'>{item.previous_reading}</span> <GoDotFill/>  Current Reading: <span className='font-bold text-gray-500'>{item.current_reading}</span>
                                            </div>
                                        </div> 
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className='flex gap-3 my-3'>
                    <Stats 
                        icon = {<GoDotFill/>}
                        label = 'Total Tenants'
                        stats_value = {`gkdfkdf`}
                        width={'w-56'}
                        stats_per=''
                    />
                    <Stats 
                        icon = {<GoDotFill/>}
                        label = 'Total Tenants'
                        stats_value = {`gkdfkdf`}
                        width={'w-56'}
                        stats_per=''
                    />
                    <Stats 
                        icon = {<GoDotFill/>}
                        label = 'Total Tenants'
                        stats_value = {`gkdfkdf`}
                        width={'w-56'}
                        stats_per=''
                    />
                    <Stats 
                        icon = {<GoDotFill/>}
                        label = 'Total Tenants'
                        stats_value = {`gkdfkdf`}
                        width={'w-56'}
                        stats_per=''
                    />
                </div>

                <div className='flex justify-between'>
                    <div className='flex gap-3 z-80'>
                        <div className='flex gap-3 space-y-2'>
                            <FilterDropdown
                                label='All Properties'
                                options={propertyOptions}
                                value={'kkkj'}
                                onChange={(item) => setFilter(prev => ({ ...prev, property_obj: item }))}
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

            <UtilitiesData utility={utility} />

            <div>
                <PaginationFull page={page} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
        </div>
    )
}

export default Utilities
