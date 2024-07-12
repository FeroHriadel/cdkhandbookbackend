import React from 'react'
import Container from '@/components/Container';
import ItemCardTags from '@/components/ItemCardTags';
import ItemCardCategory from '@/components/ItemCardCategory';
import CenteredImage from '@/components/CenteredImage';
import './page.css';



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
    <div className='page-wrapper'>
      <Container className='mt-10'>    
      <h1>{item.name.toUpperCase()}</h1>

      <ItemCardCategory item={item} className="mb-5" />

      <ItemCardTags item={item} className="mb-5" />

      {item.description && <p className='mb-5'>{item.description}</p>}

      {
        firstImage
        &&
        <CenteredImage src={firstImage} width="100%" height="750px" className='first-image mb-5' />
      }

      {
        item.images.length > 1
        &&
        <aside className='w-[100%] flex gap-5 mb-10 flex-wrap justify-center'>
          {
            item.images.slice(1).map((image: string) => (
              <CenteredImage 
                key={image} 
                src={image} 
                width="49%"
                height="500px"
                className='small-image'
              />
            ))
          }
        </aside>
      }
    </Container>
    </div>
  )
}

export default ItemPage