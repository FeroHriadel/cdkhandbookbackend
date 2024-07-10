'use client'

import React from 'react';
import { useAuth } from '@/context/authContext';
import Link from 'next/link';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import './SignInButton.css';



const SignInButton = () => {
  const { user, logout } = useAuth();

  return (
    <div className='px-2'>
      {
        user?.email
        ?
        <Button variant='outline' onClick={logout}>
          <p className='logout-text'>Log out</p>
          <LogOut className='logout-icon' size={15} />
        </Button>
        :
        <Link href="/signin" className='text-sm hover:text-slate-500'>Sign In</Link>        
      }
    </div>
  )
}

export default SignInButton