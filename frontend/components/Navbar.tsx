import Link from 'next/link';
import React from 'react';



const Navbar = () => {
  return (
    <div className='w-100 flex gap-5 mb-10 px-2'>
        <Link href="/" className='text-sm hover:text-orange-800'>Home</Link>
        <Link href="/admin/tags" className='text-sm hover:text-orange-800'>Tags</Link>
        <Link href="/admin/categories" className='text-sm hover:text-orange-800'>Categories</Link>
        <Link href="/admin/items" className='text-sm hover:text-orange-800'>Items</Link>
    </div>
  )
}

export default Navbar