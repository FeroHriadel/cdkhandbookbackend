import Link from 'next/link';
import React from 'react';
import SignInButton from './SignInButton';
import AdminLink from './AdminLink';



const Navbar = () => {
  return (
    <nav className='w-full flex justify-between items-center p-2'>
      <ul className='flex gap-5 px-2 h-[100%]'>
        <li><Link href="/" className='text-sm hover:text-slate-500'>Home</Link></li>
        <li><Link href="/tags" className='text-sm hover:text-slate-500'>Tags</Link></li>
        <li><Link href="/categories" className='text-sm hover:text-slate-500'>Categories</Link></li>
        <li><Link href="/items" className='text-sm hover:text-slate-500'>Items</Link></li>
        <AdminLink />
      </ul>

      <SignInButton />
    </nav>
  )
}

export default Navbar