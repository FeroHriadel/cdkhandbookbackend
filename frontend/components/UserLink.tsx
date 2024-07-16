'use client'

import React from 'react'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { useAuth } from '@/context/authContext'



const UserLink = () => {
  const { user } = useAuth();

  if (!user.email) return <></>

  if (user && !user?.isAdmin) return (
    <li>
      <Link href="/profile" className='text-sm hover:text-slate-500'>
        <p className='link'>Profile</p>
        <UserPlus className='icon' size={15} />
      </Link>
    </li>
  )

  return (
    <li>
      <Link href="/admin" className='text-sm hover:text-slate-500'>
        <p className='link'>Admin</p>
        <UserPlus className='icon' size={15} />
      </Link>
    </li>
  )
}

export default UserLink