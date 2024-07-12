import Container from '@/components/Container';
import React from 'react'
import { Item } from '@/models/models';
import ItemCard from '@/components/ItemCard';



export const dynamic = 'force-dynamic';


const fetchItems = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/items`, {cache: 'no-store'}); //{cache: 'no-store'} turns off caching in server-rendered components
  const data = await res.json();
  return data;
}



const TagsPage = async () => {
  let items = await fetchItems();

  const areItemsOk = () => { if (!Array.isArray(items)) return false; }

  if (!areItemsOk) return (
    <Container>
      <h1 className='mb-5'>Items Page</h1>
      <p>Failed to fetch Items</p>
    </Container>
  )

  return (
    <Container className='mb-5'>
      <h1 className='mb-5'>Items Page</h1>
      <main className='w-[100%] flex gap-5 flex-wrap justify-center'>
        {
          items.map((item: Item) => (
            <ItemCard key={item.id} item={item} />
          ))
        }
      </main>
    </Container>
  )
}

export default TagsPage