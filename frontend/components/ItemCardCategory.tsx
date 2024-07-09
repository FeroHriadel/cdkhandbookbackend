'use client'

import { Item } from '@/models/models';
import React from 'react';
import { useAppSelector } from '@/redux/store';



interface Props {
  item: Item;
  className?: string;
}



const ItemCardCategory = ({ item, className = '' }: Props) => {
  const categories = useAppSelector(state => state.categories);
  const category = categories.find(category => category.id === item.category);

  if (category) return <p className={'text-slate-700 mb-2 text-sm ' + className}>{category.name}</p>
  return <p className='text-slate-700 mb-2 text-sm'>uncategorized</p>
}

export default ItemCardCategory