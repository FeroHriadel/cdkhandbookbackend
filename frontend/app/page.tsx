import React from 'react';
import Container from '@/components/Container';
import Hero from '@/components/Hero';
import Logo from '@/components/Logo';
import ItemCard from '@/components/ItemCard';
import { Item } from '@/models/models';



export const dynamic = 'force-dynamic';



const getRecentItems = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/items?order=latest`, {cache: 'no-store'});
  const data = await res.json();
  return data;
}



const HomePage = async () => {
  const items = await getRecentItems();
  const last3Items = Array.isArray(items) ? items.slice(0, 3) : [];

  return (
    <div className='w-[100%]'>
      <Hero />

      <section className='my-10 py-10 flex flex-col items-center justify-center'>
        <div className='w-[90%] lg:w-[1000px] m-auto flex flex-col items-center'>
          <Logo className='mb-4' />
          <h4 className='text-center mb-10'>
            Welcome to ThisSite, your ultimate platform for showcasing your creativity and organizing your unique items. Whether you're a photographer, artist, or just want to share something of interest, our intuitive interface allows you to create, categorize, and share your personalized collections effortlessly.
          </h4>
        </div>
      </section>

      <section className='w-[100%] mb-10 py-10 flex flex-col items-center justify-center bg-slate-50'>
        <h4 className='mb-5 font-bold'>LATEST ITEMS</h4>
        <div className='flex justify-center gap-5 flex-wrap'>
          {
            last3Items.map((item: Item) => (
              <ItemCard key={item.id} item={item} />
            ))
          }
        </div>
      </section>

      <section className='my-10 py-10 flex flex-col items-center justify-center'>
        <div className='w-[90%] lg:w-[1000px] m-auto flex flex-col items-center'>
          <Logo className='mb-4' />
          <h4 className='text-center'>
            ThisSite empowers you to bring your vision to life. Create individual items with detailed descriptions, and organize them into categories for easy browsing. Add relevant tags to your items to enhance discoverability and streamline searches.
          </h4>
        </div>
      </section>


        {/* <Logo className='mb-2' />
        <p className='text-center'>ThisSite empowers you to bring your vision to life. Create individual items with detailed descriptions, and organize them into categories for easy browsing. Add relevant tags to your items to enhance discoverability and streamline searches.</p><br /><br />

        <Logo className='mb-2' />
        <p className='text-center'>Our robust search and filter functionality makes it simple to find exactly what you're looking for. Whether you're searching by category, tag, or specific keywords, you'll always be able to quickly locate the items that matter most to you.</p><br /><br />

        <Logo className='mb-2' />
        <p className='text-center'>Uploading images is a breeze with ThisSite. Showcase your items with single or multiple images, giving your audience a comprehensive view of your collection. Our platform supports high-resolution images to ensure your creations look their best.</p><br /><br />

        <Logo className='mb-2' />
        <p className='text-center'>Join our community of creators and start building your personalized showcase today. With ThisSite, the possibilities are endless, and your creativity knows no bounds. Sign up now and begin your journey of creation, organization, and discovery!</p><br /><br /> */}
    </div>
  )
}

export default HomePage

/**
<h1 className='mb-10'>Home Page</h1>

      <p>Welcome to ThisSite, your ultimate platform for showcasing your creativity and organizing your unique items. Whether you're a collector, artist, or enthusiast, our intuitive interface allows you to create, categorize, and share your personalized collections effortlessly.</p><br />

      <p>ThisSite empowers you to bring your vision to life. Create individual items with detailed descriptions, and organize them into categories for easy browsing. Add relevant tags to your items to enhance discoverability and streamline searches.</p><br />

      <p>Our robust search and filter functionality makes it simple to find exactly what you're looking for. Whether you're searching by category, tag, or specific keywords, you'll always be able to quickly locate the items that matter most to you.</p><br />

      <p>Uploading images is a breeze with ThisSite. Showcase your items with single or multiple images, giving your audience a comprehensive view of your collection. Our platform supports high-resolution images to ensure your creations look their best.</p><br />

      <p>Join our community of creators and start building your personalized showcase today. With ThisSite, the possibilities are endless, and your creativity knows no bounds. Sign up now and begin your journey of creation, organization, and discovery!</p><br />
 */