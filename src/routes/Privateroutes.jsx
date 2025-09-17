import React from 'react'
import { Outlet } from 'react-router-dom'

const Privateroutes = ({allowedRoles}) => {
  return (
    <Outlet/>
  )
}

export default Privateroutes