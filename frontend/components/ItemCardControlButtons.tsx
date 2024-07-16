'use client'

import React from 'react';
import { Item } from '@/models/models';
import { useAuth } from '@/context/authContext';
import { FilePen, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiCalls } from '@/utils/apiCalls';
import { useToast } from './ui/use-toast';



interface Props {
  item: Item;
}



const ItemCardControlButtons = ({ item }: Props) => {
  const { user } = useAuth(); const { isAdmin, email, idToken } = user;
  const router = useRouter();
  const { toast } = useToast();


  function goToEditPage () {
    if (isAdmin) router.push(`/admin/items/edit?id=${item.id}`)
    else router.push(`/profile/edit?id=${item.id}`);
  }

  async function deleteItem(id: string) {
    toast({description: 'Deleting item...'});
    const res = await apiCalls.del(`/items/${id}`, idToken);
    if (!res.error) toast({description: 'Item deleted.'});
    else toast({description: 'Failed to delete item'});
    setTimeout(() => {  router.refresh(); }, 1000);
  }

  if (user?.isAdmin || user?.email === item.createdBy) return (
    <div className='flex flex-col gap-2 absolute right-4 bottom-4'>
      <FilePen size={20} className='cursor-pointer' onClick={goToEditPage} />
      {user?.isAdmin && <Trash size={20} className='cursor-pointer' onClick={() => deleteItem(item.id!)} />}
    </div>
  )

  return <></>
}

export default ItemCardControlButtons