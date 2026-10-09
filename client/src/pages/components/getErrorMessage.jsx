import React from 'react'

const getErrorMessage = (err, fallback='something went wrong while fetching the data') => {
    const data = err?.response?.data

    if (!data) return err.message || fallback
    if (typeof data === 'string') return data
    if (data.detail) return data.detail

    const first = Object.values(data)[0]
    if (Array.isArray(first)) return first[0]
    if (typeof first === 'string') return first

    return fallback

}

export default getErrorMessage
