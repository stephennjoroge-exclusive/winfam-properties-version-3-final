import React from 'react'
import useLandlord from './useLandlord'
import { useOutletContext } from 'react-router-dom'
import { GiHamburgerMenu } from "react-icons/gi";

const Landlord = () => {
    const {landlord} = useLandlord()
    const {setShowSidebar } = useOutletContext()

    return (
        <div>
            {landlord.map((item, index) => (
                <div key={index}>
                    {item.first_name} {item.last_name}
                </div>
            ))}
        </div>
    )
}

export default Landlord
