import React from 'react'
import { MdArrowOutward } from "react-icons/md";
import { GoArrowDownLeft } from "react-icons/go";

const Stats = ({icon, label, stats_value, stats_per, width={}}) => {
    return (
        <div className='text-gray-600 border border-gray-200 dark:border-gray-800 dark:text-gray-300'>
            <div className={`flex gap-3 ${width} items-center justify-between px-1 py-1`}>
                <div>
                    {label}
                </div>
                <div className='text-2xl border px-1 py-1 rounded-full bg-blue-100 dark:bg-blue-800 dark:border-gray-800 border-blue-200'>
                    {icon}
                </div>
            </div>

            <div className='flex justify-between gap-3 items-center px-1 py-1'>
                <span className='text-2xl text-teal-800 dark:text-teal-700 font-semibold'>
                    {stats_value}
                </span>
            </div>
            <div className='flex text-xs justify-between items-center px-1 py-1'>
                <span className='w-[50%]'>Compared to last month</span>
                <span className={`flex items-center rounded text-xs font-bold ${stats_per > 0 ? 'bg-green-100 dark:bg-green-800 dark:text-white text-green-700 px-1 py-1' : 'bg-red-100 dark:bg-red-900 dark:text-white text-red-700 px-1 py-1'}`}>
                    {stats_per >= '0' ? <MdArrowOutward className='text-xl'/> : <GoArrowDownLeft className='text-xl'/>}
                    {stats_per}%
                </span>
            </div>
        </div>
    )
}

export default Stats
