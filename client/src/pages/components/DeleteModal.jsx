import React from 'react'
import { FiAlertTriangle } from "react-icons/fi";
import {useState} from 'react'

const DeleteModal = ({deleteModal, deleteRecord, setDeleteModal, entity}) => {
    return (
        <div className='fixed flex items-center justify-center inset-0 bg-black/40 z-80'>
           <div className='flex bg-blue-50 border-3 border-blue-200 flex-col shadow-xl shadow-gray-500 dark:shadow-gray-900 dark:border dark:border-gray-600 py-3 px-3 space-y-3 pb-3 rounded-xl items-center justify-center dark:bg-gray-900 w-96'>
                <FiAlertTriangle className='text-5xl text-red-500 dark:text-red-900'/>
                <div className='flex flex-col space-y-2 mb-3 text-red-500 text-center items-center justify-center'>
                    <p className='text-xl font-semibold dark:text-red-900'>Delete Record!</p>
                    <p className='text-gray-700 dark:text-gray-400'><span>Are you sure you want to Delete<br/> <strong>{entity}'s</strong> Record?</span></p>
                </div>
                <div className='flex justify-between text-gray-700 dark:text-gray-300 w-full'>
                    <button className='px-3 py-2 rounded bg-blue-50 border dark:border-transparent border-blue-200 dark:bg-gray-600 cursor-pointer' onClick={(e) => {e.stopPropagation(), setDeleteModal(null)}}>No, Keep it </button>
                    <button className='px-3 py-2 rounded bg-red-500 dark:bg-red-900 dark:text-gray-300 text-white cursor-pointer' onClick={() => {setDeleteModal(null), deleteRecord()}}>Yes, Delete!</button>
                </div>
           </div>
        </div>
    )
}

export default DeleteModal
