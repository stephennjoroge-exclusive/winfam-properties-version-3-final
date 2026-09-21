import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'

const useSuggestions = (search='') => {
    const [suggestions, setSuggestions] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (search.length < 2){
            setSuggestions([])
            return
        }

        const controller = new AbortController()

        const timer = setTimeout(async() => {
            setLoading(true)

            try{
                const res = await axios.get('http://127.0.0.1:8000/api/properties/suggestions/', {
                    signal: controller.signal,
                    params: {q: search}
                })
                setSuggestions(res.data.results ?? res.data)
            } catch(err) {
                if (axios.isCancel(err)) return;
                setSuggestions([])
            } finally {
                setLoading(false)
            }
        }, 300)

        return () => {
            clearTimeout(timer)
            controller.abort()
        }

    }, [search])

    return {suggestions}
}

export default useSuggestions
