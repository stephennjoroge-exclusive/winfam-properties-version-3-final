import React from 'react'
import {useState, useMemo} from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import useProperty from '../properties/useProperty'
import useUnit from '../units/useUnit'
import { PiHouseLineBold } from "react-icons/pi"
import { BiBuildingHouse } from "react-icons/bi"
import { IoIosArrowDown } from "react-icons/io"
import { GiHamburgerMenu } from "react-icons/gi"
import { LuDot } from "react-icons/lu"
import StepIndicator from '../../components/stepIndicator'
import { IoPersonOutline } from "react-icons/io5";
import { FaRegAddressCard } from "react-icons/fa6";
import { MdOutlineSettingsPhone } from "react-icons/md";
import { IoCalendarNumberOutline } from "react-icons/io5";
import {PhoneInput} from 'react-international-phone'
import 'react-international-phone/style.css'
import getErrorMessage from '../../components/getErrorMessage'

const STEP_TITLES = {
    1: 'Assign a Property and Unit',
    2: 'Tenant Details',
    3: 'Review and Confirm',
}

const inputClass = 'border border-gray-300 dark:border-gray-700 w-full h-11 outline-none rounded-xl px-3'

const TenantForm = ({ fetchData }) => {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState('')
    const [openDropdown, setOpenDropdown] = useState(null)
    const [formData, setFormData] = useState({
        property_obj: '',
        unit: '',
        first_name: '',
        last_name: '',
        id_number: '',
        phone: '',
        move_in_date: ''
    })

    const propertyFilter = useMemo(() => ({page_size: 1000}), [])
    const {property} = useProperty(1, '', propertyFilter)

    const unitFilter = useMemo(
        () => formData.property_obj
            ? {property_obj: formData.property_obj, page_size: 1000}
            : {},
        [formData.property_obj]
    )

    const {units} = useUnit(1, unitFilter)

    const selectFields = [
        { name: 'property_obj', label: 'Property', type: 'select' },
        { name: 'unit', label: 'Unit', type: 'select' },
    ]

    const update = (field, value) => 
        setFormData(prev => ({...prev, [field]: value}))

    const canContinue = () => {
        if (step === 1) return formData.property_obj && formData.unit;
        if (step === 2) return formData.first_name !== ''
        return true
    }

    const next = () => canContinue() && setStep(item => item + 1)
    const previous = () => setStep(item => item - 1)

    const handleSubmit = async() => {
        setLoading(true)

        try{
            await axios.post('http://127.0.0.1:8000/api/tenants/', formData);
            await fetchData?.()

            toast.success('Tenant Saved Successfully...', {
                style: {
                    background: '#3b8132',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '15px',
                    fontSize: '16px',
                },
                iconTheme: {
                    primary: '#fff', 
                    secondary: '#3b8132'
                }
            })

            setFormData({
                property_obj: '',
                unit: '',
                first_name: '',
                last_name: '',
                id_number: '',
                phone: '',
                move_in_date: ''
            })

            setStep(1)
        } catch(err) {
            if (axios.isCancel(err)) return;
            console.log(err.response ?? err.response.data, 'Error Response')
            const message = getErrorMessage(err)
            
            toast.error(message , {
                style: {
                    background: '#d1001f',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '15px',
                    fontSize: '16px',
                },
                iconTheme: { primary: '#fff', secondary: '#d1001f' },
            })
        } finally {
            setLoading(false)
        }
    }

    const renderSelect = ({name, label}) => {
        const getText = item => name === 'property_obj' ? item.landlord_name : item.unit_number

        const allOptions = name === 'property_obj'
            ? (property ?? [])
            : (units ?? []).filter(item => item.property_obj === Number(formData.property_obj))

        const options = allOptions.filter(item =>
            String(getText(item) ?? '').toLowerCase().includes(query.toLowerCase())
        )

        const selected = allOptions.find(item => item.id === Number(formData[name]))
        const isOpen = openDropdown === name
        

        return (
            <div key={name} className='w-full text-base mb-4'>
                <label htmlFor={name} className='flex h-9 text-lg font-semibold'>{label}</label>
                <div 
                    onClick={() => setOpenDropdown(isOpen ? null : name)}
                    className='border border-gray-300 dark:border-gray-700 relative h-12 px-3 flex items-center justify-between cursor-pointer rounded-xl'
                >
                    <span className='flex items-center gap-3'>
                        {name === 'property_obj'
                            ? <BiBuildingHouse className='text-2xl text-gray-400' />
                            : <PiHouseLineBold className='text-2xl text-gray-400' />
                        }

                        {selected ? getText(selected) : `Select ${label}`}
                    </span>
                    <IoIosArrowDown
                        className={`transition-transform text-2xl text-gray-400 ${isOpen ? 'rotate-180' : ''}`}
                    />

                    {isOpen && (
                        <div className='absolute top-full capitalize left-0 w-full px-3 rounded bg-blue-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-xl z-10 max-h-73 overflow-y-auto'>
                            {options.length === 0 && (
                                <p className='px-3 py-2 text-gray-400 text-base'>
                                    {name === 'unit' && !formData.property_obj
                                        ? 'Select a property first'
                                        : 'Nothing to show'
                                    }
                                </p>
                            )}

                            <input
                                autoFocus
                                type='text'
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={`Search ${label}...`}
                                className='w-full my-2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl outline-none bg-gray-50 dark:bg-gray-900'
                            />

                            {options.map(item => (
                                <div key={item.id} 
                                    onClick={() => {
                                        update(name, item.id)
                                        if (name === 'property_obj') update('unit', '')
                                        setOpenDropdown(null)
                                        setQuery('')
                                    }}
                                    className='px-3 py-2 hover:bg-blue-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer'
                                    >
                                        {getText(item)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    const propertyName = (property ?? []).find(item => item.id === Number(formData.property_obj))?.landlord_name
    const unitName = (units ?? []).find(item => item.id === Number(formData.unit))?.unit_number

    const tenantData = [
        ['Property', propertyName],
        ['Unit', unitName],
        ['First Name', formData.first_name],
        ['Last Name', formData.last_name],
        ['Id Number', formData.id_number],
        ['Phone', formData.phone],
        ['Move in Date', formData.move_in_date],
    ]
    

    return (
        <div className='flex flex-col text-gray-700 dark:text-gray-300'>
            <span className='flex items-center gap-1'>
                <GiHamburgerMenu className='text-2xl' />
                <p className='font-bold text-2xl'>Add Tenant</p>
            </span>

            <div className='w-full'>
                <div className='w-full max-w-4xl mx-auto'>
                    <span className='flex items-center text-gray-400 text-base font-mono mb-3'>
                        <p>{step} of 3</p>
                        <LuDot className='text-2xl' />
                        <p>{STEP_TITLES[step]}</p>
                    </span>

                    <StepIndicator step={step} totalSteps={3} labels={["Property", "Tenant Info", "Confirm"]} />

                    {step === 1 && (
                        <div className='mt-4'>
                            {selectFields.map(renderSelect)}
                        </div>
                    )}

                    {step === 2 && (
                        <div className='flex flex-col gap-4 mt-4'>
                            <div className='flex gap-4'>
                                <div className='flex-1'>
                                    <label htmlFor='first_name' className='block text-base font-semibold mb-1'>First Name</label>

                                    <div className='relative'>
                                        <IoPersonOutline className='absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 pointer-events-none'/>

                                        <input
                                            id='first_name'
                                            type='text'
                                            placeholder='First Name'
                                            value={formData.first_name}
                                            onChange={(e) => update('first_name', e.target.value)}
                                            className={`${inputClass} pl-10`}
                                        />
                                    </div>
                                   
                                </div>
                                <div className='flex-1'>
                                    <label htmlFor='last_name' className='block text-base font-semibold mb-1'>Last Name</label>

                                    <div className='relative'>
                                        <IoPersonOutline className='absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 pointer-events-none'/>

                                        <input
                                            id='last_name'
                                            type='text'
                                            placeholder='Last Name'
                                            value={formData.last_name}
                                            onChange={(e) => update('last_name', e.target.value)}
                                            className={`${inputClass} pl-10`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor='id_number' className='block text-base font-semibold mb-1'>Id Number</label>

                                <div className='relative'>
                                    <FaRegAddressCard className='absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 pointer-events-none'/>

                                    <input
                                        id='id_number'
                                        type='number'
                                        placeholder='Id Number'
                                        value={formData.id_number}
                                        onChange={(e) => update('id_number', e.target.value)}
                                        className={`${inputClass} pl-10`}
                                    />
                                </div>
                                
                            </div>

                            <div>
                                <label htmlFor='phone' className='block text-base font-semibold mb-1'>Phone</label>

                                <div className='relative'>
                                    <MdOutlineSettingsPhone className='absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 pointer-events-none'/>

                                    <PhoneInput
                                        defaultCountry='ke'
                                        value={formData.phone}
                                        onChange={(phone) => update('phone', phone)}
                                        inputClassName='!w-full !h-11 !rounded-r-xl !bg-blue-50 dark:!border-gray-700 dark:!bg-gray-900 dark:!text-gray-400'
                                        countrySelectorStyleProps={{ buttonClassName: '!h-11 !rounded-l-xl dark:!border-gray-700 !bg-blue-50 dark:!bg-gray-900' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor='move_in_date' className='block text-base font-semibold mb-1'>Move in Date</label>

                                <div className='relative'>
                                    <IoCalendarNumberOutline className='absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 pointer-events-none'/>

                                    <input
                                        id='move_in_date'
                                        type='date'
                                        value={formData.move_in_date}
                                        onChange={(e) => update('move_in_date', e.target.value)}
                                        className={`${inputClass} pl-10`}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <table className='w-full mt-4'>
                            <tbody className='flex flex-col justify-center'>
                                {tenantData.map(([label, value]) => (
                                    <tr key={label} className='text-base border-b border-gray-200 dark:border-gray-700 flex justify-between px-4'>
                                        <td className='py-3 px-3 font-semibold'>{label}</td>
                                        <td className='py-3 px-3'>{value || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <div className='flex justify-between mt-6'>
                        {step > 1 && (
                            <button
                                type='button'
                                onClick={previous}
                                className='bg-gray-300 dark:bg-transparent dark:border dark:border-gray-600 px-3 py-2 font-bold text-base rounded cursor-pointer'
                            >
                                Previous
                            </button>
                        )}

                        {step < 3 && (
                            <button
                                type='button'
                                disabled={!canContinue()}
                                onClick={next}
                                className='ml-auto bg-blue-900 dark:bg-blue-700 text-white px-3 py-2 font-bold text-base rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                Next
                            </button>
                        )}

                        {step === 3 && (
                            <button
                                type='button'
                                disabled={loading}
                                onClick={handleSubmit}
                                className='ml-auto bg-red-500 text-white rounded px-3 py-2 font-bold text-base cursor-pointer disabled:opacity-50 flex items-center justify-center min-w-24'
                            >
                                {loading
                                    ? <span className='animate-spin inline-block h-6 w-6 border-2 border-t-transparent border-white rounded-full'></span>
                                    : 'Submit'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TenantForm
