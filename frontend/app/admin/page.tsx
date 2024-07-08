'use client'

import React from 'react'
import Container from '@/components/Container'
import { Button } from '@/components/ui/button'
import Link from 'next/link'



const AdminPage = () => {
  return (
    <Container>
      <h1 className='mb-10'>Admin Page</h1>

      <Button asChild className='w-[260px] mb-2'>
        <Link href="/admin/tags">Manage Tags</Link> 
      </Button>
      
      <Button asChild className='w-[260px] mb-2'>
        <Link href="/admin/categories">Manage Categories</Link>
      </Button>

      <Button asChild className='w-[260px] mb-2'>
        <Link href="/admin/items">Manage Items</Link>
      </Button>
    </Container>
  )
}

export default AdminPage