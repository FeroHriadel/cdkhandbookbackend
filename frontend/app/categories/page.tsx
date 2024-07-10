import Container from '@/components/Container';
import React from 'react'
import { Category } from '@/models/models';
import { Button } from '@/components/ui/button';



export const dynamic = 'force-dynamic';


const fetchCategories = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/categories`, {cache: 'no-store'}); //{cache: 'no-store'} turns off caching in server-rendered components
  const data = await res.json();
  return data;
}



const TagsPage = async () => {
  const categories = await fetchCategories();

  const areCategoriesOk = () => { if (!Array.isArray(categories)) return false; }

  if (!areCategoriesOk) return (
    <Container>
      <h1 className='mb-5'>Categories Page</h1>
      <p>Failed to fetch categories</p>
    </Container>
  )

  return (
    <Container>
      <h1 className='mb-5'>Categories Page</h1>
      <main>
        <p className='text-center'>Search Items by Category: </p><br />
        <ul className='flex  flex-col gap-2 w-[100%] flex-wrap items-center'>
          {
            categories.map((category: Category) => (
              <li key={category.id}>
                <Button className='w-[260px]'>{category.name}</Button>
              </li>
            ))
          }
        </ul>
      </main>
    </Container>
  )
}

export default TagsPage