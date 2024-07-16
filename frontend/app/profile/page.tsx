'use client'

import React, { useEffect, useState } from 'react';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Item } from '@/models/models';
import { apiCalls } from '@/utils/apiCalls';
import { useAuth } from '@/context/authContext';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import ItemCard from '@/components/ItemCard';


const ProfilePage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const { user } = useAuth(); const { email } = user;
  const { toast } = useToast();


  async function getUsersItems() {
    const res = await apiCalls.get(`/items?createdby=${email}`); if (!Array.isArray(res)) return toast({description: `Failed to get user's items`});
    setItems(res);
  }


  useEffect(() => { if (email) getUsersItems(); }, [email]);


  return (
    <Container>
      <h1 className='text-center mb-5'>Profile Page</h1>

      <Button className='w-[260px] mb-20' asChild>
        <Link href="/profile/add">Add Item</Link>
      </Button>

      <p className='text-center mb-5'>Your items:</p>

      <div className='w-[100%] flex gap-5 flex-wrap justify-center'>
        {items.map((item) => (<ItemCard key={item.id} item={item} />))}
      </div>
    </Container>
  )
}

export default ProfilePage