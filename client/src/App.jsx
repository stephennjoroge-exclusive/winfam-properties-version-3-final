import React from 'react'
import { Toaster } from 'react-hot-toast'
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
import Logout from './pages/auth/Logout'
import ProtectedRoute from './pages/auth/ProtectedRoute'
import TenantForm from './pages/admin/tenants/TenantForm'
import PaymentForm from './pages/admin/financials/PaymentForm'
import PropertyForm from './pages/admin/properties/PropertyForm'

const App = () => {
    return (
        <>
            <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
            <Routes>
                <Route path='/' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/logout' element={<Logout/>}/>

                <Route element={
                    <ProtectedRoute>
                        <Layout/>
                    </ProtectedRoute>
                    
                }>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/tenants" element={<Tenants />} />
                    <Route path="/properties" element={<Properties />} />
                    <Route path="/units" element={<Unit />} />
                    <Route path="/financials" element={<Financials />} />
                    <Route path="/utilities" element={<Utilities />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/tenantform" element={<TenantForm />} />
                    <Route path="/paymentform" element={<PaymentForm />} />
                    <Route path="/propertyForm" element={<PropertyForm/>} />
                </Route>
            </Routes>
        
        </>
       
    )
}

export default App
