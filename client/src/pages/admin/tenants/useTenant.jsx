import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'

const useTenant = (page=1, filter={}, search='', resultId, sortField, sortDirection) => {
    const [tenant, setTenant] = useState([])
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)
    const [next, setNext] = useState(null)
    const [previous, setPrevious] = useState(null)
    const [count, setCount] = useState(0)

    useEffect(() => {
        const controller = new AbortController()

        const fetchData = async ()  => {
            setLoading(true)

            const ordering = sortDirection === 'desc' ? `-${sortField}` : sortField

            const params = resultId ? {id: resultId} : {page, ...filter, search, ordering}

            try{
                const res = await axios.get('http://127.0.0.1:8000/api/tenants/', {
                    signal: controller.signal,
                    params
                })

                setTenant(res.data.results ?? [])
                setNext(res.data.next ?? null)
                setPrevious(res.data.previous ?? null)
                setCount(res.data.count ?? 0)
            } catch(err) {
                if (axios.isCancel(err)) return;
                const message = err.message || 'something went wrong fetching the data'
                setErrors(message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
        return () => {
            controller.abort()
        }
    }, [page, filter, search, resultId, sortField, sortDirection])

    return {tenant, loading, errors, count, next, previous}
}

export default useTenant
