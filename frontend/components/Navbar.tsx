import Link from 'next/link';
import React from 'react';
import SignInButton from './SignInButton';



const Navbar = () => {
  return (
    <nav className='w-full flex justify-between items-center p-2 z-[1] fixed left-0 top-0'>
      <ul className='flex gap-5 px-2 h-[100%]'>
        <li><Link href="/" className='text-sm hover:text-orange-800'>Home</Link></li>
        <li><Link href="/admin/tags" className='text-sm hover:text-orange-800'>Tags</Link></li>
        <li><Link href="/admin/categories" className='text-sm hover:text-orange-800'>Categories</Link></li>
        <li><Link href="/admin/items" className='text-sm hover:text-orange-800'>Items</Link></li>
      </ul>

      <SignInButton />
    </nav>
  )
}

export default Navbar