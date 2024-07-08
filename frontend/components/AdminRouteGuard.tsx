'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/context/authContext'
import { useRouter } from 'next/navigation'



const AdminRouteGuard = () => {
  const { user, checkingAuth } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (!checkingAuth && !user.isAdmin) { router.push('/signin'); };
  }, [user, checkingAuth])


  if (checkingAuth) return (
    <div className='fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center'>
      <p>Checking auth...</p>
    </div>
  )

  if (user.isAdmin && !checkingAuth) return <></>
}

export default AdminRouteGuard