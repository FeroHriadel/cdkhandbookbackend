'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { SearchX } from 'lucide-react';



interface Props {
  className?: string;
  style?: {[key: string]: any};
}


const GoBackButton = ({ className = '', style }: Props) => {
  const router = useRouter();

  return (
    <Button
    variant="outline"
      onClick={() => router.push('/search')}
      className={className}
      style={style}
    >
      <SearchX />
    </Button>
  )
}

export default GoBackButton