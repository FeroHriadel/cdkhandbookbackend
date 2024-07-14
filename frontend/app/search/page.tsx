'use client'

import Container from '@/components/Container';
import React, { useEffect, useState} from 'react';
import { useSearchParams } from 'next/navigation';
import { apiCalls } from '@/utils/apiCalls';
import { Item } from '@/models/models';
import { useToast } from '@/components/ui/use-toast';
import ItemCard from '@/components/ItemCard';



export const dynamic = 'force-dynamic';



const SearchPage = () => {
  const params = useSearchParams();
  const searchParams = {category: '', tag: ''}; populateSearchParams();
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  

  function populateSearchParams() {
    const category = params.get('category'); if (category) searchParams.category = category;
    const tag = params.get('tag'); if (tag) searchParams.tag = tag;
  }

  function getQueryString() {
    const { category, tag } = searchParams;
    let queryString = '';
    Object.values(searchParams).forEach(value => { if (value) queryString = '?' });
    if (category) queryString += `category=${category}`;
    if (tag) queryString += `&tag=${tag}`;
    return queryString;
  }

  async function getItems(params: string) {
    const items = await apiCalls.get(`/items${params}`); if (!Array.isArray(items)) return toast({description: 'Failed to get Items'});
    setItems(items);
  }


  useEffect(() => {
    const queryString = getQueryString();
    getItems(queryString);
    
  }, [searchParams]);


  return (
    <Container>
      <h1 className='mb-5'>Search Page</h1>

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