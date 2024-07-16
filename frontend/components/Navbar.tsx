import Link from 'next/link';
import React from 'react';
import SignInButton from './SignInButton';
import UserLink from './UserLink';
import './Navbar.css';
import { Home, Tag, LibraryBig, Package } from 'lucide-react';



const Navbar = () => {
  return (
    <nav className='w-full flex justify-between items-center p-2 relative'>
      <ul className='flex gap-5 px-2 h-[100%]'>
        <li>
          <Link href="/" className='text-sm hover:text-slate-500'>
            <p className='link'>Home</p>
            <Home className='icon' size={15}/>
          </Link>
        </li>

        <li>
          <Link href="/tags" className='text-sm hover:text-slate-500'>
            <p className='link'>Tags</p>
            <Tag className='icon' size={15}/>
          </Link>
        </li>

        <li>
          <Link href="/categories" className='text-sm hover:text-slate-500'>
            <p className='link'>Categories</p>
            <LibraryBig className='icon' size={15}/>
          </Link>
        </li>
        <li>
          <Link href="/items" className='text-sm hover:text-slate-500'>
            <p className='link'>Items</p>
            <Package className='icon' size={15}/>
          </Link>
        </li>
        <UserLink />
      </ul>

      <SignInButton />
    </nav>
  )
}

export default Navbar