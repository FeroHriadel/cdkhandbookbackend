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
        <p>There are currently these tags to choose from: </p><br />
        <ul className='w-[100%] h-[50px] flex gap-2 justify-center items-center'>
          {
            tags.map((tag: Tag) => (
              <li className='rounded-full w-[50px] h-[50px] flex justify-center items-center overflow-hidden bg-slate-400' key={tag.id}>
                <p className='text-xs text-wrap break-words text-white text-center -rotate-45'>{tag.name}</p>
              </li>
            ))
          }
        </ul>
      </main>
    </Container>
  )
}

export default TagsPage