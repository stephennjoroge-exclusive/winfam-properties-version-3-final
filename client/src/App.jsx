import React from 'react'
import Landlords from './pages/admin/landlords/Landlord'
import Properties from './pages/admin/properties/Property'
import Tenants from './pages/admin/tenants/Tenant'
import { Routes, Route } from 'react-router-dom'
import Layout from './pages/components/Layout'
import Unit from './pages/admin/units/Unit'
import Financials from './pages/admin/financials/Financials'
import Settings from './pages/components/Settings'
import Dashboard from './pages/admin/dashboard/Dashboard'
import Login from './pages/auth/Login'
import Utilities from './pages/admin/utilities/Utilities'
import Register from './pages/auth/Register'

const App = () => {
    return (
        <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>

            <Route element={<Layout/>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tenants" element={<Tenants />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/landlords" element={<Landlords />} />
                <Route path="/units" element={<Unit />} />
                <Route path="/financials" element={<Financials />} />
                <Route path="/utilities" element={<Utilities />} />
                <Route path="/settings" element={<Settings />} />
            </Route>
        </Routes>
    )
}

export default App
