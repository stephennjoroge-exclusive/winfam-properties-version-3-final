import React from 'react'
import { TiTick } from "react-icons/ti";

const stepIndicator = ({ step, totalSteps = 4, labels = [] }) => {
    return (
        <div className='flex justify-center items-center mb-2'>
            <div className='flex justify-center items-center w-[80%]'>
                {Array.from({length: totalSteps}, (_, i) => i + 1).map((num, i) => (
                   <React.Fragment key={num}>
                        <div className='flex flex-col items-center gap-2'>
                            <div className={`w-9 h-9 text-xl rounded-full flex justify-center items-center font-semibold
                                ${num < step
                                    ? 'bg-blue-900 text-white'
                                    : num === step
                                    ? 'bg-blue-900 text-white ring-3 ring-blue-400 dark:ring-blue-700'
                                    : 'bg-gray-300 dark:bg-gray-700 text-gray-400 '
                                }`}>
                                {num < step ? <TiTick className='text-2xl'/> : num}
                            </div>

                            <span className={`text-base font-medium whitespace-nowrap
                                ${num <= step ? 'text-blue-900 dark:text-blue-500' : 'text-gray-400'}`}>
                                {labels[i]}
                            </span>
                        </div>

                        {i < totalSteps - 1 && (
                            <div className={`flex-1 h-[2px] mx-3 self-start mt-4 ${num < step ? 'bg-blue-900 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                        )}
                   </React.Fragment>
                ))}
            </div>
        </div>
    )
}

export default stepIndicator