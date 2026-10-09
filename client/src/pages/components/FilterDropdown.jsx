import React from 'react'
import {useState, useRef, useEffect} from 'react'
import { IoFilter } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import useCloseRef from './useCloseRef';

const FilterDropdown = ({options, label, value, onChange, width={}}) => {
    const [open, setOpen] = useState(false)
    const closeRef = useRef(null)

    useCloseRef({
        refValue: closeRef,
        handleStateClose: setOpen
    })

    const activeLabel = options.find(item => item.value === (value ?? ''))?.label ?? label
    return (
        <div ref={closeRef} className={`${width} border relative cursor-pointer rounded px-3 border-gray-300 dark:border-gray-700 flex items-center`}>
            <div className='flex gap-3 w-full items-center' onClick={(e) => {setOpen(prev => !prev); e.stopPropagation()}}>
                <IoFilter className='font-bold'/>
                <div className='flex flex-1 justify-between capitalize items-center mr-2'>
                    {activeLabel}
                </div>
                <IoIosArrowDown className={`${open ? 'rotate-180 cursor-pointer duration-300 transition-all' : 'rotate-0 cursor-pointer duration-300'}`}/>
            </div>

            {open && (
                <div className='absolute top-full left-0 z-50 px-2 py-1 bg-blue-50 dark:bg-gray-900 max-h-[450px] overflow-auto border-2 shadow-2xl rounded border-gray-300 dark:border-gray-700 w-full'>
                    {options.map(item => (
                        <div key={item.value}
                            onClick={() => {onChange(item.value || undefined); setOpen(false)}}
                            className='text-left capitalize rounded px-2 py-1 hover:bg-blue-200 dark:hover:bg-gray-700  text-sm cursor-pointer'
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            )}
        
        </div>
    )
}

export default FilterDropdown
