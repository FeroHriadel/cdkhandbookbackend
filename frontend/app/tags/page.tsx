import Container from '@/components/Container';
import React from 'react'
import { Tag } from '@/models/models';



export const dynamic = 'force-dynamic';



const fetchTags = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/tags`, {cache: 'no-store'}); //{cache: 'no-store'} turns off caching in server-rendered components
  const data = await res.json();
  return data;
}



const TagsPage = async () => {
  const tags = await fetchTags();

  const areTagsOk = () => { if (!Array.isArray(tags)) return false; }

  if (!areTagsOk) return (
    <Container>
      <h1 className='mb-5'>Tags Page</h1>
      <p>Failed to fetch tags</p>
    </Container>
  )

  return (
    <Container>
      <h1 className='mb-5'>Tags Page</h1>
      <main>
        <p className='text-center'>Search items by tag:</p><br />
        <ul className='w-[100%] flex gap-5 justify-center flex-wrap items-center'>
          {
            tags.map((tag: Tag) => (
              <li 
                className='rounded-full w-[100px] min-w-[100px] h-[100px] flex justify-center items-center overflow-hidden bg-slate-400 cursor-pointer' 
                key={tag.id}>
                <p className='text-sm text-wrap break-words text-white text-center -rotate-45'>{tag.name}</p>
              </li>
            ))
          }
        </ul>
      </main>
    </Container>
  )
}

export default TagsPage