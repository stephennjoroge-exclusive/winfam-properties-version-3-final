import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'

const useUnit = (page=1, filter={}, search='', resultId, sortField='unit_number', sortDirection='asc' ) => {
    const [units, setUnits] = useState([])
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(false)
    const [next, setNext] = useState(null)
    const [previous, setPrevious] = useState(null)
    const [count, setCount] = useState(0)

    useEffect(() => {
        const controller = new AbortController()

        const fetchData = async() => {
            setLoading(true)
            
            const ordering = sortDirection === 'desc' ? `-${sortField}` : sortField

            const params = resultId ? {id : resultId} : {page, ...filter, search, ordering}

            try{
                const res = await axios.get('http://127.0.0.1:8000/api/units/', {
                    signal: controller.signal,
                    params
                })
                setUnits(res.data.results ?? [])
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
    }, [page, filter, search, resultId, sortField, sortDirection])

    const deleteRecord = async(id) => {
        try{
            await axios.delete(`http://127.0.0.1:8000/api/units/${id}/`)
            setUnits(prev => prev.filter(item => item.id !== id))
            setCount(prev => prev - 1)
        } catch(err) {
            setErrors(err.message || 'failed to delete record')
            throw err
        }
    }

    return {units, loading, deleteRecord, count}
    
}

export default useUnit
