import Container from '@/components/Container';
import React from 'react'
import { Category } from '@/models/models';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import CenteredImage from '@/components/CenteredImage';
import './page.css';



export const dynamic = 'force-dynamic';



const fetchCategories = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/categories`, {cache: 'no-store'}); //{cache: 'no-store'} turns off caching in server-rendered components but I think `export const dynamic = 'force-dynamic'` is needed too
  const data = await res.json();
  return data;
}



const TagsPage = async () => {
  const categories = await fetchCategories();

  const areCategoriesOk = () => { if (!Array.isArray(categories)) return false; }

  if (!areCategoriesOk) return (
    <Container>
      <h1 className='mb-5'>ThisSite Categories</h1>
      <p>Failed to fetch categories</p>
    </Container>
  )

  return (
    <Container>
      <h1 className='mb-5'>ThisSite Categories</h1>

      {
        categories.map((category: Category) => (
          <section key={category.id} className='w-[100%] mb-10 flex gap-5 p-5 rounded category-section'>
            {
              category.image
              ?
              <CenteredImage src={category.image || ''} width={400} height={400} className='category-section-image' />
              :
              <div className='w-400px] min-w-[400px] h-[400px] bg-slate-100' />
            }
            <div className='category-section-description w-[100%] max-h-[400px] overflow-y-auto flex flex-col gap-5 items-center'>
              <p>{category.description || 'No description provided yet'}</p>
              <Button className='w-[100%]'>{`See ${category.name} items`}</Button>
            </div>
          </section>
        ))
      }
    </Container>
  )
}

export default TagsPage