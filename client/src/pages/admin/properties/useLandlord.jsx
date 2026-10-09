import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'

const useLandlord = () => {
    const [landlord, setLandlord] = useState([])
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)


    const fetchData = async(signal) => {
        setLoading(true)

        try{
            const res = await axios.get('http://127.0.0.1:8000/api/landlords/', {
                signal
            })
            setLandlord(res.data.results ?? [])
        } catch(err) {
            if (axios.isCancel(err)) return;
            const message = err.message || 'something went wrong while fetching the data'
            setErrors(message)
        } finally{
            setLoading(false)
        }
    }


    useEffect(() => {
        const controller = new AbortController()
        fetchData(controller.signal)

        return () => {
            controller.abort()
        }
    }, [])

    return {landlord}
}

export default useLandlord
