import React from 'react'
import { FiAlertTriangle } from "react-icons/fi";
import {useState} from 'react'
import toast from 'react-hot-toast';

const DeleteModal = ({deleteModal, deleteRecord, setDeleteModal, entity}) => {
     const handleDelete = async(e) => {
        e.stopPropagation()

        try{
            await deleteRecord()
            toast.success(`${entity}'s Record Deleted!`, {
                icon: '🗑️',
                 style: {
                    background: '#b91c1c',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '15px',
                    fontSize: '16px',
                },
            })
            setDeleteModal(false)

        } catch(err) {
            toast.error(`${entity}'s Record could not be deleted!`, {
                style: {
                    background: '#d1001f',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '15px',
                    fontSize: '16px',
                },
                iconTheme: { primary: '#fff', secondary: '#d1001f' },
            })
        }

     }

    return (
        <div className='fixed flex items-center justify-center text-gray-700 dark:text-gray-300 inset-0 bg-black/40 z-80'>
           <div className='flex bg-blue-50 border-3 border-blue-200 flex-col shadow-xl shadow-gray-500 dark:shadow-gray-900 dark:border dark:border-gray-600 py-3 px-3 space-y-3 pb-3 rounded-xl items-center justify-center dark:bg-gray-900 w-96'>
                <FiAlertTriangle className='text-5xl text-red-500 dark:text-red-900'/>
                <div className='flex flex-col space-y-2 mb-3 text-red-500 text-center items-center justify-center'>
                    <p className='text-xl font-semibold dark:text-red-900'>Delete Record!</p>
                    <p className='text-gray-700 dark:text-gray-400'><span>Are you sure you want to Delete<br/> <strong>{entity}'s</strong> Record?</span></p>
                </div>
                <div className='flex justify-between text-gray-700 dark:text-gray-300 w-full'>
                    <button className='px-3 py-2 rounded bg-blue-50 border dark:border-transparent border-blue-200 dark:bg-gray-600 cursor-pointer' onClick={(e) => {e.stopPropagation(), setDeleteModal(null)}}>No, Keep it </button>
                    <button className='px-3 py-2 rounded bg-red-500 dark:bg-red-900 dark:text-gray-300 text-white cursor-pointer' onClick={handleDelete}>Yes, Delete!</button>
                </div>
           </div>
        </div>
    )
}

export default DeleteModal
