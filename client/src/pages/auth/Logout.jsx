import React from 'react'
import { useEffect } from "react";
import {useNavigate} from 'react-router-dom'

const Logout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        navigate('/')
    }, [])

    return null
}

export default Logout


