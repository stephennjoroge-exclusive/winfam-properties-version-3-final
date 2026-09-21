import React from 'react'
import {useState, useEffect, useRef} from 'react'

const useCloseRef = ({refValue, handleStateClose}) => {

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (refValue.current && !refValue.current.contains(e.target)){
                handleStateClose(false)
            }
        }

        document.addEventListener('mousedown',handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }

    }, [refValue, handleStateClose])
}

export default useCloseRef
