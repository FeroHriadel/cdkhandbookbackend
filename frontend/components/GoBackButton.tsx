'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { ArrowBigLeft } from 'lucide-react';



interface Props {
  className?: string;
  style?: {[key: string]: any};
}


const GoBackButton = ({ className = '', style }: Props) => {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      onClick={() => router.back()}
      className={className}
      style={style}
    >
      <ArrowBigLeft />
    </Button>
  )
}

export default GoBackButton