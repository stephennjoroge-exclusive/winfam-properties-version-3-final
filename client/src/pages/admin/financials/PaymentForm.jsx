import React from 'react'
import axios from 'axios'
import {useState, useMemo} from 'react'
import useTenant from '../tenants/useTenant'
import useProperty from '../properties/useProperty'
import useUnit from '../units/useUnit'
import getErrorMessage from '../../components/getErrorMessage'
import { GiHamburgerMenu } from "react-icons/gi"
import { LuDot } from "react-icons/lu"
import StepIndicator from '../../components/stepIndicator'
import { PiHouseLineBold } from "react-icons/pi"
import { BiBuildingHouse } from "react-icons/bi"
import { GoPersonAdd } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io"
import { GiTakeMyMoney } from "react-icons/gi";
import { GiReceiveMoney } from "react-icons/gi";
import { GiPayMoney } from "react-icons/gi";
import { GiMoneyStack } from "react-icons/gi";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { MdOutlineAttachMoney } from "react-icons/md";
import { MdOutlineWaterDrop } from "react-icons/md";
import toast from 'react-hot-toast'


const STEP_TITLES = {
    1: 'Assign a Property, Unit and Tenant',
    2: 'Payment Details',
    3: 'Review and Confirm',
}

const PaymentForm = ({fetchData}) => {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)
    const [openDropdown, setOpenDropdown] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState(false)
    const [query, setQuery] = useState('')
    const [formData, setFormData] = useState({
        property_obj: '',
        unit: '',
        tenant: '',
        rent_payable: '',
        balance_carry_forward: '',
        rent: '',
        balance_brought_forward: '',
        payment_method: '',
        deposit: '',
        water: ''
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

    const tenantFilter = useMemo(
        () => formData.unit
            ? {unit: formData.unit, page_size: 1000}
            : {},
        [formData.unit]
    )
    const {tenant} = useTenant(1, tenantFilter)

    const selectFields = [
        { name: 'property_obj', label: 'Property', type: 'select' },
        { name: 'unit', label: 'Unit', type: 'select' },
        { name: 'tenant', label: 'Tenant', type: 'select' },
    ]

    const update = (name, value) => {
        setFormData(prev => ({...prev, [name]: value}))
    }

    const canContinue = () => {
        if (step === 1) return formData.property_obj && formData.unit && formData.tenant
        if (step === 2) return formData.rent !== 0 && formData.rent_payable !== 0
    }

    const next = () => canContinue() && setStep(item => item + 1)
    const previous = () => setStep(item => item - 1)

    const handleSubmit = async() => {
        setLoading(true)

        try{
            await axios.post('http://127.0.0.1:8000/api/financials/', formData);
            await fetchData?.()

            toast.success('Payment Saved Successfully...', {
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
                tenant: '',
                rent_payable: '',
                balance_carry_forward: '',
                rent: '',
                balance_brought_forward: '',
                payment_method: '',
                deposit: '',
                water: ''
            })

            setStep(1)

        } catch(err) {
            if (axios.isCancel(err)) return;
            const message = getErrorMessage(err)
            setErrors(message)

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
        const textGetters = {
            property_obj: item => item.landlord_name,
            unit: item => item.unit_number,
            tenant: item => item.full_name
        }

        const getText = item => textGetters[name]?.(item) ?? (() => '')

        const allOptions = name === 'property_obj'
            ? (property ?? [])
            : name === 'unit'
            ? (units ?? []).filter(item => item.property_obj === Number(formData.property_obj))
            : (tenant ?? []).filter(item => item.unit === Number(formData.unit))

        const options = allOptions.filter(item => 
            String(getText(item) ?? '').toLowerCase().includes(query.toLowerCase())
        )

        const selected = allOptions.find(item => item.id === Number(formData[name]))
        const isOpen = openDropdown === name

        return (
            <div key={name} className='w-full text-base mb-4'>
                <label htmlFor={label} className='flex h-9 text-lg font-semibold'>{label}</label>

                <div onClick={() => setOpenDropdown(isOpen ? null : name)}
                    className='border flex border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-700 relative h-12 px-3 items-center justify-between cursor-pointer rounded-xl'
                >
                    <span className='flex items-center gap-3'>
                        {name === 'property_obj'
                            ? <BiBuildingHouse className='text-2xl text-gray-400'/>
                            : name === 'unit'
                            ? <PiHouseLineBold className='text-2xl text-gray-400'/>
                            : <GoPersonAdd className='text-2xl text-gray-400'/>
                        }
                        {selected ? getText(selected) : `Select ${label}`}
                    </span>

                    <IoIosArrowDown
                        className={`transition-transform text-2xl text-gray-400 ${isOpen ? 'rotate-180' : ''}`}
                    />

                    {isOpen && (
                        <div className='absolute top-full max-h-[300px] left-0 w-full px-3 rounded bg-blue-50 dark:bg-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-700 shodow-xl z-10 overflow-y-auto'>
                            {options.length === 0 && (
                            <p className='px-3 py-2 text-gray-400 text-base'>
                                {name === 'unit' && !formData.property_obj
                                    ? 'Select a property first'
                                    : name === 'unit'
                                    ? 'Select a unit first'
                                    : 'Nothing to show'
                                }
                            </p>
                            )}

                            <input
                                autoFocus
                                type='text'
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={`Search ${label}`}
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
    const tenantName = (tenant ?? []).find(item => item.id === Number(formData.tenant))?.full_name

    const inputClass = 'border border-gray-300 dark:border-gray-700 w-full h-11 outline-none rounded-xl px-3'
    
    const paymentOptions = [
        { value: 'mpesa',  label: 'Mpesa' },
        { value: 'cash',   label: 'Cash' },
        { value: 'equity', label: 'Equity' },
        { value: 'no_pay', label: 'No pay' },   
    ];

    const paymentLabel = (e) => paymentOptions.find(item => item.value === e)?.label ?? ''

    const paymentData = [
        ['property', propertyName],
        ['unit', unitName],
        ['tenant', tenantName],
        ['Rent Payable', formData.rent_payable],
        ['Rent', formData.rent],
        ['Balance Carry Forward', formData.balance_carry_forward],
        ['Balance Brought Forward', formData.balance_brought_forward],
        ['Payment Method', formData.payment_method],
        ['Deposit', formData.deposit],
        ['Water', formData.water],
    ]

    return (
        <div className='flex flex-col text-gray-700 dark_text-gray-300'>
            <span className='flex items-center gap-1'>
                <GiHamburgerMenu className='text-2xl'/>
                <p className='font-bold text-2xl'>Add Payment</p>
            </span>

            <div className='w-full'>
                <div className='w-full max-w-4xl mx-auto'>
                    <span className='flex items-center text-gray-400 text-base font-mono mb-3'>
                        <p>{step} of 3</p>
                        <LuDot className='text-2xl' />
                        <p>{STEP_TITLES[step]}</p>
                    </span>

                    <StepIndicator step={step} totalSteps={3} labels={["Property", "Payment Info", "Confirm"]} />

                    {step === 1 && (
                        <div className='mt-4 capitalize'>
                            {selectFields.map(renderSelect)}
                        </div>
                    )}

                    {step === 2 && (
                        <div className='flex flex-col gap-4 mt-4 capitalize'>
                            <div className='flex gap-3'>
                                <div className='w-full'>
                                    <label htmlFor="rent_payable" className='block text-base font-semibold mb-1'>Rent Payable</label>

                                    <div className='relative'>
                                        <GiTakeMyMoney className='absolute text-2xl left-3 top-1/2 -translate-y-1/2' />

                                        <input 
                                            id='rent_payable'
                                            type="text" 
                                            placeholder={'Rent Payable'}
                                            value={formData.rent_payable}
                                            onChange={(e) => update('rent_payable', e.target.value)}
                                            className={`${inputClass} pl-10`}
                                        />
                                    </div>
                                </div>

                                <div className='w-full'>
                                    <label htmlFor="rent" className='block text-base font-semibold mb-1'>Rent</label>

                                    <div className='relative'>
                                        <GiReceiveMoney className='absolute text-2xl left-3 top-1/2 -translate-y-1/2' />

                                        <input 
                                            id='rent'
                                            type="text" 
                                            placeholder={'Rent'}
                                            value={formData.rent}
                                            onChange={(e) => update('rent', e.target.value)}
                                            className={`${inputClass} pl-10`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='flex gap-3'>
                                <div className='w-full'>
                                    <label htmlFor="balance_carry_forward" className='block text-base font-semibold mb-1'>Balance Carry Forward</label>

                                    <div className='relative'>
                                        <GiMoneyStack className='absolute text-2xl left-3 top-1/2 -translate-y-1/2' />

                                        <input 
                                            id='balance_carry_forward'
                                            type="text" 
                                            placeholder={'Balance Carry Forward'}
                                            value={formData.balance_carry_forward}
                                            onChange={(e) => update('balance_carry_forward', e.target.value)}
                                            className={`${inputClass} pl-10`}
                                        />
                                    </div>
                                </div>

                                <div className='w-full'>
                                    <label htmlFor="balance_brought_forward" className='block text-base font-semibold mb-1'>Balance Brought Forward</label>

                                    <div className='relative'>
                                        <GiPayMoney className='absolute text-2xl left-3 top-1/2 -translate-y-1/2' />

                                        <input 
                                            id='balance_brought_forward'
                                            type="text" 
                                            placeholder={'Balance Brought Forward'}
                                            value={formData.balance_brought_forward}
                                            onChange={(e) => update('balance_brought_forward', e.target.value)}
                                            className={`${inputClass} pl-10`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='w-full cursor-pointer' onClick={() => {setPaymentMethod(prev => !prev)}}>
                                <label htmlFor="payment_method" className='block text-base font-semibold mb-1'>Payment Method</label>

                                <div className='relative '>
                                    <FaMoneyBillTransfer className='absolute text-2xl left-3 top-1/2 -translate-y-1/2' />

                                    <input 
                                        id='payment_method'
                                        type="text" 
                                        readOnly
                                        placeholder={'Payment Method'}
                                        value={paymentLabel(formData.payment_method)}
                                        onClick={() => {prev => !prev}}
                                        className={`${inputClass} pl-10 cursor-pointer`}
                                    />

                                    <IoIosArrowDown className={`absolute right-3 top-1/2 -translate-y-1/2 text-xl
                                        ${paymentMethod ? 'rotate-180 duration-300' : 'rotate-0 duration-300'}`}/>

                                    {paymentMethod && (
                                        <div className='absolute z-10 w-full border mt-1 border-gray-300 rounded'>
                                            {paymentOptions.map(({ value, label }) => (
                                                <div key={value}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        update('payment_method', value);
                                                        setPaymentMethod(false)
                                                    }
                                                        
                                                }
                                                   
                                                className={`bg-blue-50 px-4 py-2 hover:bg-blue-100`}
                                                >

                                                    {label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className='flex gap-3'>
                                <div className='w-full'>
                                    <label htmlFor="deposit" className='block text-base font-semibold mb-1'>Deposit</label>

                                    <div className='relative'>
                                        <MdOutlineAttachMoney className='absolute text-2xl left-3 top-1/2 -translate-y-1/2' />

                                        <input 
                                            id='deposit'
                                            type="text" 
                                            placeholder={'Deposit'}
                                            value={formData.deposit}
                                            onChange={(e) => update('deposit', e.target.value)}
                                            className={`${inputClass} pl-10`}
                                        />
                                    </div>
                                </div>

                                <div className='w-full'>
                                    <label htmlFor="water" className='block text-base font-semibold mb-1'>Water</label>

                                    <div className='relative'>
                                        <MdOutlineWaterDrop className='absolute text-2xl left-3 top-1/2 -translate-y-1/2' />

                                        <input 
                                            id='water'
                                            type="text" 
                                            placeholder={'Water'}
                                            value={formData.water}
                                            onChange={(e) => update('water', e.target.value)}
                                            className={`${inputClass} pl-10`}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                    {step === 3 && (
                        <table className='w-full mt-4 capitalize'>
                            <tbody className='flex flex-col justify-between'>
                                {paymentData.map(([label, value]) => (
                                    <tr key={label} className='text-base border-b border-gray-200 dark: dark:border-gray-700 flex jusify-between px-4'>
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
                                className='ml-auto bg-red-500 text-white rounded px-3 py-2 font-bold text-base cursor-pointer disabled:opacity-50 items-center justify-center min-w-24'
                            >
                                {loading 
                                    ? <span className='animate-spin inline-block rounded-full h-9 w-9 border-2 border-t-transparent border-white'></span>
                                    : 'Submit'
                                }
                            </button>
                        )}
                    </div>

                </div>

            </div>
        </div>
    )
}

export default PaymentForm
