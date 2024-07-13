import React from 'react';
import Hero from '@/components/Hero';
import PromoText from '@/components/PromoText';
import ItemCard from '@/components/ItemCard';
import { Item, Tag } from '@/models/models';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Container from '@/components/Container';
import './page.css';




export const dynamic = 'force-dynamic';



const getRecentItems = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/items?order=latest`, {cache: 'no-store'});
  const data = await res.json();
  return data;
}

const sampleTags = [
  {id: 'kfmewok', name: 'affordable'},
  {id: 'orjfiof', name: 'romantic'},
  {id: 'dmwkmdk', name: 'fun'},
  {id: 'mmxmxxx', name: 'remote'}
]



const HomePage = async () => {
  const items = await getRecentItems();
  const last3Items = Array.isArray(items) ? items.slice(0, 3) : [];

  return (
    <div className='w-[100%]'>
      <Hero />


      <PromoText text={`Welcome to ThisSite, your ultimate platform for showcasing your creativity and organizing your unique items. Whether you're a photographer, artist, or just want to share something of interest, our intuitive interface allows you to create, categorize, and share your personalized collections effortlessly.`} />


      <section className='w-[100%] mb-10 py-10 flex flex-col items-center justify-center bg-slate-200'>
        <h4 className='mb-5 font-bold'>LATEST ITEMS</h4>
        <div className='flex justify-center gap-5 flex-wrap'>
          {
            last3Items.map((item: Item) => (
              <ItemCard key={item.id} item={item} />
            ))
          }
        </div>
      </section>


      <PromoText text={`ThisSite empowers you to bring your vision to life. Create individual items with detailed descriptions, and organize them into categories for easy browsing. Add relevant tags to your items to enhance discoverability and streamline searches.`} />


      <section className='w-[100%] mb-10 py-10 flex flex-col items-center justify-center bg-slate-200'>
        <h4 className='mb-5 font-bold'>CATEGORIES</h4>
        <Container style={{marginTop: '0'}}>
          <div className='w-[100%] flex gap-5 categories-image-and-text-wrapper'>
            <div className='rounded relative min-w-[49%] categories-image'>
              <Image 
                width={260} 
                height={260} 
                alt="Categories" 
                src="/images/files.png" 
                className='w-[100%] rounded' 
              />
              <div className='absolute top-0 left-0 w-[100%] h-[100%] bg-slate-700 opacity-40 rounded' />
            </div>

            <div className='h-[100%]'>
              <p className=''>
                As a creator, you can assign your items to relevant categories, ensuring they are easily found by those who are most interested. This not only increases the visibility of your creations but also connects you with an audience that truly appreciates your work. By categorizing your items, you help potential admirers and buyers to navigate through a vast array of content and find exactly what they’re looking for with just a few clicks.
                <br /><br />
                For users, our category-based search functionality is a game-changer. No more endless scrolling or guesswork – simply select a category that interests you, and explore a curated list of items that match your preferences. Whether you're searching for unique art pieces, innovative gadgets, fashion items, or collectibles, our category filters make it quick and easy to find the perfect items.
              </p>
              <Button asChild className='w-[100%] mt-5'>
                <Link href="/categories">See Categories</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>


      <PromoText text={`Our robust search and filter functionality makes it simple to find exactly what you're looking for. Whether you're searching by category, tag, or specific keywords, you'll always be able to quickly locate the items that matter most to you.`} />


      <section className='w-[100%] mb-10 py-10 flex flex-col items-center justify-center bg-slate-200'>
        <h4 className='mb-5 font-bold'>TAGS</h4>
        <Container style={{marginTop: '0'}}>
          <ul className='w-[100%] flex gap-5 justify-center flex-wrap items-center mb-5'>
            {
              sampleTags.map((tag: Tag) => (
                <li 
                  className='rounded-full w-[75px] min-w-[75px] h-[75px] flex justify-center items-center overflow-hidden bg-slate-400 cursor-pointer' 
                  key={tag.id}>
                  <p className='text-sm text-wrap break-words text-white text-center -rotate-45'>{tag.name}</p>
                </li>
              ))
            }
          </ul>
          <p className='text-center'>
            Discover items tailored to your needs with our advanced tag-based search feature. Each item is associated with multiple tags, allowing you to filter by nearly any criterion you can think of, such as "romance," "affordable," or "remote." Simply enter your desired tags to find the perfect items. Whether you're looking for a specific style, price range, or location, our comprehensive tagging system makes it easy to find exactly what you want. Start your search today!
          </p>
          <Button asChild className='w-[50%] mt-5 tags-button'>
            <Link href="/tags">See Tags</Link>
          </Button>
        </Container>
      </section>


      <PromoText text={`Uploading images is a breeze with ThisSite. Showcase your items with single or multiple images, giving your audience a comprehensive view of your collection. Our platform supports high-resolution images to ensure your creations look their best.`} />


      <section className='w-[100%] mb-10 py-10 flex flex-col items-center justify-center bg-slate-200'>
        <h4 className='mb-5 font-bold'>SEARCH ITEMS</h4>
        <Container style={{marginTop: '0'}}>
          <div className='w-[100%] flex gap-5 categories-image-and-text-wrapper'>
            <div className='rounded relative min-w-[49%] categories-image'>
              <Image 
                width={260} 
                height={260} 
                alt="Categories" 
                src="/images/detective.png" 
                className='w-[100%] rounded' 
              />
              <div className='absolute top-0 left-0 w-[100%] h-[100%] bg-slate-700 opacity-40 rounded' />
            </div>

            <div className='h-[100%]'>
              <p className=''>
                Discover the power of our advanced search feature, designed to help you find almost anything with ease. Whether you're looking for specific items, unique art pieces, or innovative gadgets, our search functionality allows you to filter by tags, categories, keywords, and dates. With a wide range of tags like "romance," "affordable," or "remote," you can easily narrow down your search to match your exact criteria. Our category-based filters eliminate endless scrolling, presenting you with a curated list of items tailored to your preferences. Explore by keywords or set date ranges to find the latest or most relevant items. Start your search today and experience a seamless way to discover exactly what you’re looking for, no matter how specific your criteria!
              </p>
              <Button asChild className='w-[100%] mt-5'>
                <Link href="/search">Search Items</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      
      <PromoText text={`Join our community of creators and start building your personalized showcase today. With ThisSite, the possibilities are endless, and your creativity knows no bounds. Sign up now and begin your journey of creation, organization, and discovery!`} />
    </div>
  )
}

export default HomePage