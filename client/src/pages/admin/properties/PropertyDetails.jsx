import React from 'react'
import { IoMdCloseCircleOutline } from "react-icons/io";
import {useState, useEffect} from 'react'
import axios from 'axios'
import { RiExportFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { FaHouseChimneyUser } from "react-icons/fa6";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdOutlineMoneyOff } from "react-icons/md";
import { FaSort } from "react-icons/fa6";
import { FaSortDown } from "react-icons/fa6";
import { TiArrowSortedUp } from "react-icons/ti";
import NameColor from '../../components/NameColor'
import useReports from './useReports'
import { IoSearchSharp } from "react-icons/io5";

const PropertyDetails = ({id, setOpenProperty}) => {
    const [details, setDetails] = useState([])
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)
    const [openSearch, setOpenSearch] = useState(false)
    const {reports} = useReports()
    const {getInitials, getColorFromName} = NameColor()
    const [sortField, setSortField] = useState('unit_number')
    const [sortDirection, setSortDirection] = useState('asc')

    const date_year = (value) => {
        if (!value) return;

        const date = new Date(value)
        const month = date.toLocaleString('en-US',{ month: 'long' }).toUpperCase();
        const year = date.getFullYear();
        
        return `${month} ${year}`;
    }

    useEffect(() => {
        const controller = new AbortController()

        const fetchData = async() => {
            setLoading(true)

            const ordering = sortDirection === 'desc' ? `-${sortField}` : sortField

            try{
                const res = await axios.get(`http://127.0.0.1:8000/api/financials/property-detail/${id}`, {
                    signal: controller.signal,
                    params: {ordering}
                })
                setDetails(res.data ?? [])
            } catch (err){
                if (axios.isCancel(err)) return;
                const message = err.message || 'something went wrong while fetching the data'
                setErrors(message)
            } finally{
                setLoading(false)
            }
        }

        fetchData()

        return () => {
            controller.abort()
        }
    }, [id, sortField, sortDirection])

    const arrow = (field) => {
        if (sortField !== field) return <FaSort className='text-gray-500'/>
        return sortDirection === 'asc' ? <TiArrowSortedUp className='text-gray-500 text-[15px]'/> : <FaSortDown className='text-gray-500 text-[15px]'/>
    }

    const handleSort = (field) => {
        if (sortField === field){
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
            return
        } else {
            setSortDirection('asc')
            setSortField(field)
        }
    }



    return (
        <div className='inset-0 flex bg-black/20 fixed justify-end z-90'>
            <div className='relative shadow-xl shadow-gray-700 text-gray-700 bg-blue-50 dark:text-gray-300 dark:border-l dark:border-gray-700 dark:bg-gray-900 rounded-l-xl w-[90%] px-3 py-1'>
                <header className='flex border-b border-gray-300 pb-3 justify-between w-full items-center mt-4'>
                        <IoMdCloseCircleOutline  onClick={(e) => {e.stopPropagation(); setOpenProperty(false)}} className='absolute cursor-pointer right-2 top-0 text-2xl text-red-500 dark:text-red-600'/>
                        <div className='flex items-center'>
                            <img src="/winfam.png" width={100} alt="" />
                            <div>
                                <p className='font-semibold text-2xl'> Winfam Property</p>
                                <p className='font-semibold text-gray-400'>Property Statement</p>
                            </div>
                        </div>

                        <div className='text-center text-gray-700 dark:text-gray-300'>
                            <p className='font-semibold'> {details.length > 0 && details[0].property_obj}</p>
                            <p className="text-xl font-semibold">{details.length > 0 ? date_year(details[0].date) : '...'}</p>
                            <p className='font-semibold text-gray-400'>Generated: {details.length > 0 ? new Date(details[0].date).toLocaleDateString('en-GB') : '...'}</p>
                        </div>

                        <div className='text-end text-sm'>
                            <p>Macharia Road, next to Webtech Cyber Cafe</p>
                            <p>P.O. Box 45873 - 00100, Nairobi</p>
                            <p> 0721 991 394 · 078 039 2899</p>
                            <p><span className='text-blue-500 underline'>winfamprop@gmail.com</span></p>
                        </div>

                </header>

                <div className='flex items-center justify-between mx-3 my-3'>
                    <div className='relative'>
                        <div className='flex  items-center px-2 py-1 border rounded border-gray-300 dark:border-gray-700'>
                            <IoSearchSharp onClick={() => {setOpenSearch(prev => !prev)}} className='text-2xl text-gray-500'/>
                        </div>

                        <div className={`absolute origin-left transition ease-in-out left-full flex items-center px-3 top-0 w-96 h-9 rounded shadow-xl z-60 bg-blue-50 border border-gray-300
                            ${openSearch 
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-0'
                            }`}>
                            <input placeholder='Search tenant...' type="search" className='border:none w-full outline:none dark:text-gray-300 focus:outline-none' />
                        </div>   
                    </div>
                    

                    <div className='flex justify-center items-center gap-2'>
                        <div className='flex gap-1 px-2 py-1 font-semibold bg-blue-100 text-blue-700 dark:text-blue-300 dark:border border-blue-700 rounded dark:bg-transparent '>
                            <FaHouseChimneyUser className='text-blue-700 dark:text-blue-400 text-xl'/>
                            <p>Units: 350</p>
                        </div>
                        <div className='flex gap-1 px-2 py-1 font-semibold bg-amber-100 rounded dark:border text-amber-700 dark:text-amber-300  border-green-700 dark:bg-transparent'>
                            <GiTakeMyMoney className='text-amber-700 dark:text-amber-400 text-xl'/>
                            <p>Ksh. {reports.computed_total_rent_payable_per_property} Rent Payable</p>
                        </div>
                        <div className='flex gap-1 px-2 py-1 font-semibold bg-green-100 rounded dark:border text-green-700 dark:text-green-300  border-green-700 dark:bg-transparent'>
                            <GiTakeMyMoney className='text-green-700 dark:text-green-400 text-xl'/>
                            <p>Ksh. 45,000 Rent Collected</p>
                        </div>
                        <div className=' gap-1 flex px-2 py-1 font-semibold bg-red-100 rounded dark:border text-red-700 dark:text-red-400  border-red-700 dark:bg-transparent'>
                            <MdOutlineMoneyOff className='text-red-700 dark:text-red-400 text-xl'/>
                            <p>Overdue: 50,000</p>
                        </div>
                    </div>

                    <div className='flex gap-3'>
                        <span className='rounded px-3 py-1 cursor-pointer bg-blue-600 text-white font-semibold'>
                            <span className='flex items-center gap-2'>
                                <RiExportFill className='text-xl'/>
                                <p>Export</p>
                            </span>
                        </span>
                    </div>
                </div>

                <section className='w-full min-w-0 text-sm'>
                    <div className='overflow-y-auto max-h-[500px] md:max-h-[600px] lg:max-h-[680px] xl:max-h-[950px]'>
                        <table className='w-full'>
                            <thead className='top-0 sticky'>
                                <tr className='border-b border-white h-10 duration-300 transition-all dark:border-gray-800 text-gray-500 bg-blue-100 dark:bg-gray-800 dark:text-gray-400 shadow'>
                                    <th className='text-start px-2 py-1' onClick={() => handleSort('unit_number')}><span className='flex items-center gap-3'>Unit No {arrow('unit_number')}</span></th>
                                    <th className='text-start px-2 py-1' onClick={() => handleSort('rent_payable')}>
                                        <span className='flex items-center gap-3'>
                                            Tenant Name {arrow('tenant')}
                                        </span>
                                    </th>
                                    <th className='text-start px-2 py-1' onClick={() => handleSort('tenant')}><span className='flex items-center gap-3'>Rent Payable {arrow('rent_payable')}</span></th>
                                    <th className='text-start px-2 py-1' onClick={() => handleSort('balance_brought_forward')}><span className='flex items-center gap-3'>Balance (B/F) {arrow('balance_brought_forward')}</span></th>
                                    <th className='text-start px-2 py-1' onClick={() => handleSort('rent')}><span className='flex items-center gap-3'>Rent {arrow('rent')}</span></th>
                                    <th className='text-start px-2 py-1' onClick={() => handleSort('balance_carry_forward')}><span className='flex items-center gap-3'>Balance (C/F) {arrow('balance_carry_forward')}</span></th>
                                    <th className='text-start px-2 py-1' onClick={() => handleSort('deposit')}><span className='flex items-center gap-3'>Deposit {arrow('deposit')}</span></th>
                                    <th className='text-start px-2 py-1' onClick={() => handleSort('water')}><span className='flex items-center gap-3'>Water {arrow('water')}</span></th>
                                </tr>
                            </thead>

                            <tbody>
                                {Array.isArray(details) && details.length > 0 ? (
                                    details.map((item, index) => (
                                        <tr key={item.id}>
                                            <td className='py-4 px-3 border-b border-white capitalize dark:border-gray-800'>
                                                <div className='flex items-center gap-3'>
                                                    <span className={`${getColorFromName(item.tenant_name)} h-9 w-9 text-white font-bold rounded-full flex items-center justify-center`}>
                                                        {getInitials(item.tenant_name)}
                                                    </span>
                                                    {item.tenant_name}
                                                </div>
                                            </td>
                                            <td className='py-4 px-3 border-b border-white dark:border-gray-800'>{item.unit_number_unit}</td>
                                            <td className='py-4 px-3 border-b border-white dark:border-gray-800'><span className='text-sm'>Ksh.</span> {item.rent_payable}</td>
                                            <td className='py-4 px-3 border-b border-white dark:border-gray-800'><span className='text-sm'>Ksh.</span>{item.balance_brought_forward}</td>
                                            <td className='py-4 px-3 border-b border-white dark:border-gray-800'><span className='text-sm'>Ksh.</span>{item.rent}</td>
                                            <td className='py-4 px-3 border-b border-white dark:border-gray-800'><span className='text-sm'>Ksh.</span>{item.balance_carry_forward}</td>
                                            <td className='py-4 px-3 border-b border-white dark:border-gray-800'><span className='text-sm'>Ksh.</span>{item.deposit}</td>
                                            <td className='py-4 px-3 border-b border-white dark:border-gray-800'><span className='text-sm'>Ksh.</span>{item.water}</td>
                                        </tr>
                                    ))
                                ): (
                                    <tr>
                                        <td></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                   
                </section>
            </div>
            
        </div>
    )
}

export default PropertyDetails
