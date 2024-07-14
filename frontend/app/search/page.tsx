'use client'

import Container from '@/components/Container';
import React, { useEffect, useState} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiCalls } from '@/utils/apiCalls';
import { Item } from '@/models/models';
import { useToast } from '@/components/ui/use-toast';
import ItemCard from '@/components/ItemCard';
import CategoriesSelect from '@/components/CategoriesSelect';



export const dynamic = 'force-dynamic';



const SearchPage = () => {
  const params = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  

  async function getItems(queryString: string) {
    const items = await apiCalls.get(`/items${queryString}`); if (!Array.isArray(items)) return toast({description: 'Failed to get Items'});
    setItems(items);
  }


  function getQueryString() {
    const queryString = `?${params.toString()}`;
    return queryString;
  }

  function setSearchParam(key: string, value: string) {
    const newParams = new URLSearchParams(params);
    newParams.set(key, value);
    router.push(`?${newParams.toString()}`);
  }

  function changeCategory(id: string) {
    setSearchParam('category', id);
  }


  useEffect(() => {
    getItems(getQueryString())
  }, [params])





  return (
    <Container>
      <h1 className='mb-5'>Search Page</h1>

      <CategoriesSelect onValueChange={changeCategory} />

      <div className='w-[100%] flex justify-center gap-2 flex-wrap mb-5'>
        {
          items.map((item: Item) => (
            <ItemCard key={item.id} item={item} />
          ))
        }
      </div>
    </Container>
  )
}

export default SearchPage