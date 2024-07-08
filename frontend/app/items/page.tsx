import Container from '@/components/Container';
import React from 'react'
import { Category } from '@/models/models';



export const dynamic = 'force-dynamic';


const fetchItems = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/items`, {cache: 'no-store'}); //{cache: 'no-store'} turns off caching in server-rendered components
  const data = await res.json();
  return data;
}



const TagsPage = async () => {
  const items = await fetchItems();

  const areItemsOk = () => { if (!Array.isArray(items)) return false; }

  if (!areItemsOk) return (
    <Container>
      <h1 className='mb-5'>Items Page</h1>
      <p>Failed to fetch Items</p>
    </Container>
  )

  return (
    <Container>
      <h1 className='mb-5'>Items Page</h1>
      <main>
        <p>Check out the following items: </p><br />

      </main>
    </Container>
  )
}

export default TagsPage