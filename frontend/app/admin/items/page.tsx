'use client'

import React, { useEffect, useState } from 'react';
import { useAppSelector } from "@/redux/store";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash, Plus, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { apiCalls } from '@/utils/apiCalls';
import { useToast } from '@/components/ui/use-toast';
import { useAppDispatch } from '@/redux/store';
import Container from '@/components/Container';
import { Item } from '@/models/models';



export const dynamic = 'force-dynamic';



const ItemsPage = () => {
  const [items, setIteems] = useState<Item[]>();
  const categories = useAppSelector(state => state.categories);
  const tags = useAppSelector(state => state.tags);
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();


  const getItems = async () => {
    const res = await apiCalls.get('/items'); if (res.error) return toast({description: 'Failed to fetch items'});
    setIteems(res);
  }

  useEffect(() => {
    getItems();
  }, [])

  
  return (
    <Container>
      <div className='flex items-center gap-4 mb-8'>
        <div className='translate-y-1'><PackageOpen size={50} /></div>
        <h1 className='leading-none'>Items</h1>
      </div>
      
      <Card className='w-[90%] lg:w-[50%] mb-8'>
        <CardHeader>
          <CardTitle className='text-center'>
            <div className='flex w-100 justify-between items-center'>
              <p>Item List</p>
              <Button size={'icon'}> <Plus /> </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {
            items
            &&
            items.map(Item => {
              const image = Item.images && Item.images.length ? Item.images[0] : null;
              return (
              <div className='flex justify-between' key={Item.id}>
                <span className='flex items-center gap-2'>
                  <div
                    className='w-[30px] h-[30px] rounded border-solid border-gray-500 border-2'
                    style={image ? {background: `url(${image}) no-repeat center center/cover`} : {}}
                  />
                  <p key={Item.id} className='border-b-1'>{Item.name}</p>
                </span>
                <span className='flex'>
                  <Button size={'icon'} variant={'ghost'}> <Pencil size={18} /> </Button>
                  <Button size={'icon'} variant={'ghost'}> <Trash size={18} /> </Button>
                </span>
              </div>
            )})
          }
        </CardContent>
      </Card>
    </Container>
  )
}

export default ItemsPage