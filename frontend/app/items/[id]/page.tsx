import React from 'react'
import Container from '@/components/Container';
import ItemCardTags from '@/components/ItemCardTags';
import ItemCardCategory from '@/components/ItemCardCategory';
import CenteredImage from '@/components/CenteredImage';
import './page.css';
import type { Metadata } from "next";



export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params;
  const item = await getItemById(id);
  if (!item.id) return ({title: 'Item not found'});
  return ({
    title: `ThisSite | ${item.name}`,
    description: item.description || "Showcase your items",
    openGraph: {
      title: `ThisSite | ${item.name}`,
      description: item.description || "Showcase your items",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/items/${id}`,
      siteName: "ThisSite",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: item.images[0] || `${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`,
          width: 300,
          height: 300,
          alt: 'ThisSite'
        }
      ]
    },
    icons: {
      icon: "/favicon.ico",
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/items/${id}`
    }
  });
}



async function getItemById (id: string) {
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
      <h1 className='text-center'>{item.name.toUpperCase()}</h1>

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

export default ItemPage;