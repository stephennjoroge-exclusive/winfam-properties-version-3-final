import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'

const useProperty = (page=1, search='', filter, resultId, sortField, sortDirection) => {
    const [property, setProperty] = useState([])
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)
    const [next, setNext] = useState(null)
    const [previous, setPrevious] = useState(null)
    const [count, setCount] = useState(0)


    const fetchData = async(signal) => {
        setLoading(true)

        const ordering = sortDirection === 'desc' ? `-${sortField}` : sortField

        const params = resultId ? {id: resultId} : {page, ...filter, search, resultId, ordering}

        try{
            const res = await axios.get('http://127.0.0.1:8000/api/properties/', {
                signal,
                params
            })
            setProperty(res.data.results ?? [])
            setNext(res.data.next ?? null)
            setPrevious(res.data.previous ?? null)
            setCount(res.data.count ?? 0)
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
    }, [page, filter, search, resultId, sortField, sortDirection])

    const deleteRecord = async(id) => {
        try{
            await axios.delete(`http://127.0.0.1:8000/api/properties/${id}/`)
            setProperty(prev => prev.filter(item => item.id !== id))
            setCount(prev => prev - 1)
            await fetchData()
        }catch(err){
            setErrors(err.message || 'failed to delete record')
            throw err
        }
    }

    return {property, loading, deleteRecord, fetchData, count}
}

export default useProperty
