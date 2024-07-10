import React from 'react'
import Container from '@/components/Container';
import Image from 'next/image';
import ItemCardTags from '@/components/ItemCardTags';
import ItemCardCategory from '@/components/ItemCardCategory';



export const dynamic = 'force-dynamic';



const getItemById = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/items?item=${id}`, {cache: 'no-store'});
  const data = await res.json();
  return data;
}



const ItemPage = async ({ params }: {params: {id: string}}) => {
  const { id } = params;
  const item = await getItemById(id);
  const firstImage = item.images[0] ? item.images[0] : '';


  if (!item.id) return <Container> <p>Item not found</p> </Container>

  return (
    <Container>    
      <h1>{item.name.toUpperCase()}</h1>

      <ItemCardCategory item={item} className="mb-5" />

      <ItemCardTags item={item} className="mb-5" />

      {
        firstImage
        &&
        <img src={firstImage} style={{width: '100%'}} className='mb-2' />
      }

      <p className='mb-5'>{item.description}</p>

      {
        item.images.length > 1
        &&
        <aside className='w-[100%] flex gap-2'>
          {
            item.images.slice(1).map((image: string) => (
              <img key={image} src={image} style={{width: `${100 / item.images.slice(1).length - 1}%`}} className='mb-2' />
            ))
          }
        </aside>
      }

    </Container>
  )
}

export default ItemPage