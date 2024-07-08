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
        <p>You can tag your items with the following tags:</p><br />
        <ul className='flex gap-2 w-[100%] flex-wrap justify-center'>
          {
            tags.map((tag: Tag) => (
              <li key={tag.id}>{tag.name}</li>
            ))
          }
        </ul>
      </main>
    </Container>
  )
}

export default TagsPage