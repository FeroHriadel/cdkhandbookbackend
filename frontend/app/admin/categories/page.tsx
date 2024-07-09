'use client'

import React from 'react';
import { useAppSelector } from "@/redux/store";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash, Plus, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { apiCalls } from '@/utils/apiCalls';
import { useToast } from '@/components/ui/use-toast';
import { useAppDispatch } from '@/redux/store';
import { removeCategory } from '@/redux/slices/categoriesSlice';
import Container from '@/components/Container';
import { useAuth } from '@/context/authContext';



export const dynamic = 'force-dynamic';



const CategoriesPage = () => {
  const categories = useAppSelector(state => state.categories);
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { user } = useAuth(); const { idToken } = user;


  const goToAddCategoryPage = () => router.push('/admin/categories/add');

  const deleteCategoryFromDB = async (id: string) => {
    const url = `/categories/${id}`;
    const res = await apiCalls.del(url, idToken);
      if (res.id) { toast({description: 'Category deleted'}); return res }
      else { toast({description: 'Deleting Category failed'}); return {error: true} }
  }

  const removeCategoryFromState = (id: string) => dispatch(removeCategory(id));

  const deleteCategory = async (id: string) => {
    const res = await deleteCategoryFromDB(id);
      if (!res.id) return
    removeCategoryFromState(id);
  }  

  
  return (
    <Container>
      <div className='flex items-center gap-4 mb-8'>
        <div className='translate-y-1'><PackageOpen size={50} /></div>
        <h1 className='leading-none'>Tags</h1>
      </div>
      
      <Card className='w-[90%] lg:w-[50%] mb-8'>
        <CardHeader>
          <CardTitle className='text-center'>
            <div className='flex w-100 justify-between items-center'>
              <p>Category List</p>
              <Button size={'icon'} onClick={goToAddCategoryPage}> <Plus /> </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {
            categories
            &&
            categories.map(category => (
              <div className='flex justify-between mb-2' key={category.id}>
                <span className='flex items-center gap-2'>
                  <div
                    className={`w-[50px] h-[50px] rounded-full ${category.image ? '' : 'border-solid border-2'}`}
                    style={category.image ? {background: `url(${category.image}) no-repeat center center/cover`, filter: 'grayscale(75%)'} : {}}
                  />
                  <p key={category.id} className='border-b-1'>{category.name}</p>
                </span>
                <span className='flex'>
                  <Button size={'icon'} variant={'ghost'} onClick={() => router.push(`/admin/categories/edit?id=${category.id}`)}> <Pencil size={18} /> </Button>
                  <Button size={'icon'} variant={'ghost'} onClick={() => deleteCategory(category.id)}> <Trash size={18} /> </Button>
                </span>
              </div>
            ))
          }
        </CardContent>
      </Card>
    </Container>
  )
}

export default CategoriesPage