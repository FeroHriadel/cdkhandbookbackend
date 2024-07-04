'use client'

import React from 'react'
import { useAuth } from '@/context/authContext'



/**
 * 
 * implement rerouting
 * onPage reload:
 * CTX: isChecking = true. After answer false
 * HERE: if (!ctx.isChecking && !user.isAdmin) redirect
 * 
 */

const AdminRouteGuard = () => {
  const { user } = useAuth();

  if (user && user.isAdmin) return <></>

  return (
    <div className='fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center'>
      <p>Auth check...</p>
    </div>
  )
}

export default AdminRouteGuard