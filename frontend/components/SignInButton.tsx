'use client'

import React from 'react';
import { useAuth } from '@/context/authContext';
import Link from 'next/link';
import { Button } from './ui/button';



const SignInButton = () => {
  const { user, logout } = useAuth();

  return (
    <div className='px-2'>
      {
        user?.email
        ?
        <Button variant='outline' onClick={logout}>Sign out</Button>
        :
        <Link href="/signin" className='text-sm hover:text-slate-500'>Sign In</Link>        
      }
    </div>
  )
}

export default SignInButton