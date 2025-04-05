import React, { useEffect } from 'react'
import Login from './Pages/Login/Login'
import Sign from './Pages/Sign/Sign'
import { Routes, Route } from "react-router"
import Dashboard from './Pages/Dashboard/Dashboard'
import Profile from './Pages/Profile/Profile'
import StoreRegister from './Pages/Store Register/StoreRegister'
import AdministratorDashboard from './Pages/Dashboard/AdministratorDashboard'
import My404Component from './Pages/My404Component'

const App = () => {







  return (
    <div>
      <Routes>
        <Route path='/sign' element={<Sign />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Dashboard />} />
        <Route path='/System Administrator' element={<AdministratorDashboard />} />


        <Route path='/profile' element={<Profile />} />
        <Route path='/StoreRegister/:user_id' element={<StoreRegister />} />

        <Route path='*' exact={true} element={<My404Component/>} />


      </Routes>
    </div>
  )
}

export default App