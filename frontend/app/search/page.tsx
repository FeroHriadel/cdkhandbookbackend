'use client'

import Container from '@/components/Container';
import React, { useEffect, useState} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiCalls } from '@/utils/apiCalls';
import { Item } from '@/models/models';
import { useToast } from '@/components/ui/use-toast';
import ItemCard from '@/components/ItemCard';
import { TagsCombobox } from '@/components/TagsCombobox';
import { CategoriesCombobox } from '@/components/CategoriesCombobox';
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox"



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

  //used by `tag`, `category`, and `order` which can co-exist. Not used by `namesearch` - which must be the only query if used. `Namesearch` clears `t`, `c`, `o`.
  function setSearchParam(key: string, value: string) { 
    const newParams = new URLSearchParams(params);
    newParams.set(key, value);
    if (newParams.get('namesearch')) newParams.delete('namesearch'); //setting `tag`, `category`, or `order` clears `namesearch`
    router.push(`?${newParams.toString()}`)
  }

  function deleteSearchParam(key: string) {
    const newParams = new URLSearchParams(params);
    newParams.delete(key);
    newParams.toString() ? router.push(`?${newParams.toString()}`) : router.push(window.location.pathname);
  }

  function changeCategory(id: string) {
    if (id === 'clearcategory') return deleteSearchParam('category');
    setSearchParam('category', id);
  }

  function changeTag(id: string) {
    if (id === 'cleartag') return deleteSearchParam('tag');
    setSearchParam('tag', id);
  }

  function changeNamesearch(value: string) {
    if (value === '') return deleteSearchParam('namesearch');
    const newParams = new URLSearchParams();
    newParams.set('namesearch', value);
    router.push(`?${newParams.toString()}`);
  }

  function changeOrder(value: boolean) {
    value ? setSearchParam('order', 'latest') : deleteSearchParam('order');
  }


  useEffect(() => {
    getItems(getQueryString())
  }, [params])





  return (
    <Container>
      <h1 className='mb-5 text-center'>Search Page</h1>

      <div className='flex flex-col items-center mb-10'>
        <div className='flex gap-2 items-center justify-center flex-wrap mb-5'>
          <CategoriesCombobox onValueChange={changeCategory} defaultValue={params.get('category') || ''} key={'categorykey' + params.get('category')} />
          <TagsCombobox onValueChange={changeTag} defaultValue={params.get('tag') || ''} key={'tagkey'+ params.get('tag')} />
          <span className='w-[200px] flex gap-1 items-center justify-center sm:justify-start'>
            <Checkbox checked={params.get('order') === 'latest'} id="order-by-latest" onCheckedChange={(v: boolean) => changeOrder(v)}/>
            <label htmlFor="order-by-latest">order by latest</label>
          </span>
        </div>

        <p className='text-sm'>or search by name</p>

        <Input type='text' placeholder='Search...' value={params.get('namesearch') || ''} onChange={(e) => changeNamesearch(e.target.value)} />
      </div>

      <div className='w-[100%] flex justify-center gap-5 flex-wrap mb-5'>
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