'use client'

import React, { useEffect, useState } from 'react';
import { useAppSelector } from "@/redux/store";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash, Plus, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { apiCalls } from '@/utils/apiCalls';
import { useToast } from '@/components/ui/use-toast';
import Container from '@/components/Container';
import { Item } from '@/models/models';
import { useAuth } from '@/context/authContext';



export const dynamic = 'force-dynamic';



const AdminItemsPage = () => {
  const [items, setItems] = useState<Item[]>();
  const categories = useAppSelector(state => state.categories);
  const tags = useAppSelector(state => state.tags);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth(); const { idToken } = user;


  const getItems = async () => {
    const res = await apiCalls.get('/items'); if (res.error) return toast({description: 'Failed to fetch items'});
    setItems(res);
  }

  const removeItemFromState = (id: string) => {
    const filteredItems = items?.filter(item => item.id !== id);
    setItems(filteredItems);
  }

  const removeItemFromDB = async (id: string) => {
    const res = await apiCalls.del(`/items/${id}`, idToken);
    return res;
  }

  const deleteItem = async (id: string) => {
    toast({description: 'Deleting item...'});
    const dbRes = await removeItemFromDB(id); if (dbRes.error) return toast({description: 'Failed to delete item'});
    removeItemFromState(id); 
    toast({description: 'Item deleted successfully'});
  }

  const goToAddItemPage = () => router.push('/admin/items/add');


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
              <Button size={'icon'} onClick={goToAddItemPage}> <Plus /> </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {
            items
            &&
            items.map(item => {
              const image = item.images && item.images.length ? item.images[0] : null;
              return (
              <div className='flex justify-between mb-2' key={item.id}>
                <span className='flex items-center gap-2'>
                  <div
                    className={`w-[50px] h-[50px] rounded-full ${image ? '' : 'border-solid border-2'}`}
                    style={image ? {background: `url(${image}) no-repeat center center/cover`, filter: 'grayscale(75%)'} : {}}
                  />
                  <p key={item.id} className='border-b-1'>{item.name}</p>
                </span>
                <span className='flex'>
                  <Button size={'icon'} variant={'ghost'} onClick={() => router.push(`/admin/items/edit?id=${item.id}`)}> <Pencil size={18} /> </Button>
                  <Button size={'icon'} variant={'ghost'} onClick={() => deleteItem(item.id!)}> <Trash size={18} /> </Button>
                </span>
              </div>
            )})
          }
        </CardContent>
      </Card>
    </Container>
  )
}

export default AdminItemsPage