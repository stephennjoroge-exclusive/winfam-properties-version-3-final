import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'

const useLandlord = () => {
    const [landlord, setLandlord] = useState([])
    const [count, setCount] = useState(0)
    const [next, setNext] = useState(null)
    const [previous, setPrevious] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)

    useEffect(() => {
        const controller = new AbortController()

        const fetchData = async () => {
            setLoading(true)

            try{
                const res = await axios.get('http://127.0.0.1:8000/api/landlords/', {
                    signal: controller.signal
                })

                setLandlord(res.data.results ?? [])
                setCount(res.data.count ?? 0)
                setNext(res.data.next ?? null)
                setPrevious(res.data.previous ?? null)
            } catch(err) {
                if (axios.isCancel(err)) return 
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
    }, [])

    return {landlord, errors, next, previous, loading, count}
}

export default useLandlord
