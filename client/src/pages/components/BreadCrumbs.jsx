import React from 'react'
import {useLocation, Link, useLoaderData} from 'react-router-dom'

const BreadCrumbs = () => {
    const location = useLocation()
    const paths = location.pathname.split('/').filter(Boolean)

    return (
        <div className='flex items-center gap-2 text-[12px] text-gray-500 dark:text-gray-400 mb-3'>
            <Link to='/' className='hover:text-blue-500'>Dashboard</Link>
            {paths.map((item, i) => {
                const url = '/' + paths.slice(0, i + 1).join('/')
                const isLast = i === paths.length - 1
                const label = item.charAt(0).toUpperCase() + item.slice(1)

                return (
                    <React.Fragment>
                        <span className='text-gray-400 dark:text-gray-400'>/</span>
                        {isLast ? (
                            <span className='text-gray-800 dark:text-gray-400 font-medium'>{label}</span>
                        ): (
                            <Link to={url} className='hover:text-blue-500'>{label}</Link>
                        )}
                    </React.Fragment>
                )
            })}
        
        </div>
    )
}

export default BreadCrumbs
