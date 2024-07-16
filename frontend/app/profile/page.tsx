'use client'

import React from 'react';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';


const ProfilePage = () => {
  return (
    <Container>
      <h1 className='text-center mb-5'>Profile Page</h1>
      <Button className='w-[260px]'>Add Item</Button>
    </Container>
  )
}

export default ProfilePage