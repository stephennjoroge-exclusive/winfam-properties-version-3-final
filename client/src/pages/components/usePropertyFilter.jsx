import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'

const usePropertyFilter = () => {
    const [propertyFilter, setPropertyFilter] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const controller = new AbortController()

        const fetchData = async() => {
            setLoading(true)

            try{
                const res = await axios.get('http://127.0.0.1:8000/api/properties/filters/', {
                    signal: controller.signal
                })
                setPropertyFilter(res.data.results ?? res.data)
            } catch(err){
                if (axios.isCancel(err)) return;
                setPropertyFilter([])
            } finally {
                setLoading(false)
            }
        }

        fetchData()
        return () => {
            controller.abort()
        }
    }, [])

    return {propertyFilter}
}

export default usePropertyFilter
