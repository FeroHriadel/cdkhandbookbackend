import Container from '@/components/Container';
import React from 'react'
import { Category } from '@/models/models';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import CenteredImage from '@/components/CenteredImage';
import './page.css';
import Link from 'next/link';
import { Metadata } from 'next';



export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
  title: "ThisSite | Categories",
  description: "Showcase your items",
  openGraph: {
    title: "ThisSite | Categories",
    description: "Showcase your items",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/categories`,
    siteName: "ThisSite",
    locale: "en_US",
    type: "website",
    images: [{url: `${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`, width: 300, height: 300, alt: 'ThisSite'}]
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL
  }
};

const fetchCategories = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/categories`, {cache: 'no-store'}); //{cache: 'no-store'} turns off caching in server-rendered components but I think `export const dynamic = 'force-dynamic'` is needed too
  const data = await res.json();
  return data;
}



const CategoresPage = async () => {
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
              <CenteredImage src={category.image || ''} width={400} height={400} className='min-w-[400px] category-section-image' style={{filter: 'grayscale(75%)'}} />
              :
              <div className='w-[400px] min-w-[400px] h-[400px] bg-slate-100 category-section-image' />
            }
            <div className='category-section-description w-[100%] max-h-[400px] overflow-y-auto flex flex-col gap-5 items-center'>
              <p>{category.description || 'No description provided yet'}</p>
              <Button className='w-[100%]' asChild>
                <Link href={`/search?category=${category.id}`}>
                  {`See ${category.name} items`}
                </Link>
              </Button>
            </div>
          </section>
        ))
      }
    </Container>
  )
}

export default CategoresPage