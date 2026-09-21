import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'

const useProperty = (page=1, search='', resultId) => {
    const [property, setProperty] = useState([])
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)
    const [next, setNext] = useState(null)
    const [previous, setPrevious] = useState(null)
    const [count, setCount] = useState(0)

    useEffect(() => {
        const controller = new AbortController()

        const fetchData = async() => {
            setLoading(true)

            const params = resultId ? {id: resultId} : {page, search, resultId}

            try{
                const res = await axios.get('http://127.0.0.1:8000/api/properties/', {
                    signal: controller.signal,
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

        fetchData()

        return () => {
            controller.abort()
        }
    }, [page, search, resultId])

    return {property, count}
}

export default useProperty
