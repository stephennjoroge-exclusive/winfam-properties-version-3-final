import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'

const useUtility = (search='', page, filter, sortField, sortDirection) => {
    const [utility, setUtility] = useState([])
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)
    const [count, setCount] = useState(0)
    const [next, setNext] = useState(null)
    const [previous, setPrevious] = useState(null)

    useEffect(() => {
        const controller = new AbortController()

        const fetchData = async() => {
            setLoading(true)

            const ordering = sortDirection === 'desc' ? `-${sortField}` : sortField

            try{
                const res = await axios.get('http://127.0.0.1:8000/api/utilities/', {
                    signal: controller.signal,
                    params: {search, page, ordering, ...filter}
                })
                setUtility(res.data.results ?? res.data ?? [])
                setCount(res.data.count ?? 0)
                setNext(res.data.next ?? null)
                setPrevious(res.data.previous ?? null)
            } catch(err) {
                if (axios.isCancel(err)) return;
                const message = err.message || 'something went wrong while fetching the data'
                setErrors(message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
        return () => {
            controller.abort()
        }
    }, [search, page, sortField, sortDirection, filter])

    return {utility, loading, errors, count, next, previous}
    
}

export default useUtility
