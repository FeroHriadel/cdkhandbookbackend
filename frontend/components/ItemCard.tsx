import React from 'react';
import { Item } from '@/models/models';
import { Card, CardContent, CardFooter } from './ui/card';
import Image from 'next/image';
import ItemCardCategory from './ItemCardCategory';
import ItemCardTags from './ItemCardTags';
import Link from 'next/link';
import { Button } from './ui/button';



interface Props {
  item: Item;
}



const ItemCard = ({ item }: Props) => {
  const src = item.images ? item.images[0] : '';

  return (
    <Card className='w-[260px] flex flex-col items-center'>

      <div className='w-[90%] h-[180px] bg-slate-100 relative rounded mb-2 mt-4'>
        {
          src
          &&
          <Image src={src} alt={item.name} fill sizes='33vw' className='rounded' style={{filter: 'grayscale(75%)'}}/>
        }
      </div>

      <h4 className='mt-2 font-semibold'>{item.name}</h4>

      <ItemCardCategory item={item} />

      <div className='h-[50px] flex justify-center items-center mb-2'>
        {
          item.description
          ?
          <p className='text-center'>{`${item.description.substring(0, 50)}...`}</p>
          :
          <p className='text-center'>No description provided</p>
        }
      </div>

      <div className='flex flex-col w-[100%] py-2'>
        <ItemCardTags item={item} />
        <Button asChild variant="link" className='mt-2'>
          <Link href={`/items/${item.id}`}>See details</Link>
        </Button>
      </div>
    </Card>
  )
}

export default ItemCard