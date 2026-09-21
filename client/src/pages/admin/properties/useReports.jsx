import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'

const useReports = () => {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)

    useEffect(() => {
        const controller = new AbortController()

        const fetchData = async() => {
            setLoading(true)

            try{
                const res = await axios.get('http://127.0.0.1:8000/api/properties/reports/', {
                    signal: controller.signal
                })
                setReports(res.data ?? [])
            } catch(err) {
                if (axios.isCancel(err)) return;
                const message = err.message || 'something went wrong while fetching the data'
                setErrors(message)
            } finally{
                setLoading(false)
            }
        }

        fetchData()

        return() => {
            controller.abort()
        }
    }, [])
    
   return {reports, errors, loading}
}

export default useReports
