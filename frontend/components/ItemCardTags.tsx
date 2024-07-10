'use client'

import { Item } from '@/models/models';
import React from 'react';
import { useAppSelector } from '@/redux/store';



interface Props {
  item: Item;
  className?: string;
}



const ItemCardTags = ({ item, className = '' }: Props) => {
  const tags = useAppSelector(state => state.tags);
  const itemTags = tags.filter(tag => item.tags?.includes(tag.id)).slice(0, 4);

  return (
    <div className={'w-[100%] h-[50px] flex gap-2 justify-center items-center ' + className}>
      {
        itemTags.length > 0
        ?
        itemTags.map(tag => (
          <div className='rounded-full w-[50px] h-[50px] flex justify-center items-center overflow-hidden bg-slate-400' key={tag.id}>
            <p className='text-xs text-wrap break-words text-white text-center -rotate-45'>{tag.name}</p>
          </div>
        ))
        :
        <p className='text-slate-500'>untagged</p>
      }
    </div>
  )
}

export default ItemCardTags