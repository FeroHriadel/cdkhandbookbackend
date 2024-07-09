'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/authContext'



const AdminLink = () => {
  const { user } = useAuth();

  if (!user?.isAdmin) return <></>

  return (
    <li><Link href="/admin" className='text-sm hover:text-slate-500'>Admin</Link></li>
  )
}

export default AdminLink