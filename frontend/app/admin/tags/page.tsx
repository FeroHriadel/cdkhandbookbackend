'use client'

import React from 'react';
import { useAppSelector } from "@/redux/store";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash, Plus, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { apiCalls } from '@/utils/apiCalls';
import { useToast } from '@/components/ui/use-toast';
import { useAppDispatch } from '@/redux/store';
import { removeTag } from '@/redux/slices/tagsSlice';
import Container from '@/components/Container';
import { useAuth } from '@/context/authContext';




export const dynamic = 'force-dynamic';



const TagsPage = () => {
  const tags = useAppSelector(state => state.tags);
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { user } = useAuth(); const { idToken } = user;


  const goToAddTagPage = () => router.push('/admin/tags/add');

  const deleteTagFromDB = async (id: string) => {
    toast({description: 'Deleting tag...'});
    const url = `/tags/${id}`; 
    const res = await apiCalls.del(url, idToken);
      if (res.id) { toast({description: 'Tag deleted'}); return res }
      else { toast({description: 'Deleting tag failed'}); return {error: true} }
  }

  const removeTagFromState = (id: string) => dispatch(removeTag(id));

  const deleteTag = async (id: string) => {
    const res = await deleteTagFromDB(id);
      if (!res.id) return
    removeTagFromState(id);
  }  

  
  return (
    <Container>
      <div className='flex items-center gap-4 mb-8'>
        <div className='translate-y-1'><Tag size={50} /></div>
        <h1 className='leading-none'>Tags</h1>
      </div>
      
      <Card className='w-[100%]'>
        <CardHeader>
          <CardTitle className='text-center'>
            <div className='flex w-100 justify-between items-center'>
              <p>Tag List</p>
              <Button size={'icon'} onClick={goToAddTagPage}> <Plus /> </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {
            tags
            &&
            tags.map(tag => (
              <div className='flex justify-between' key={tag.id}>
                <p key={tag.id} className='border-b-1'>{tag.name}</p>
                  <span className='flex'>
                    <Button size={'icon'} variant={'ghost'} onClick={() => router.push(`/admin/tags/edit?id=${tag.id}`)}> <Pencil size={18} /> </Button>
                    <Button size={'icon'} variant={'ghost'} onClick={() => deleteTag(tag.id)}> <Trash size={18} /> </Button>
                  </span>
              </div>
            ))
          }
        </CardContent>
      </Card>
    </Container>
  )
}

export default TagsPage