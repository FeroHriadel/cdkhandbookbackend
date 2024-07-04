import React from 'react';



interface Props {
    children: React.ReactNode;
}

const Container = ({ children }: Props) => {
  return (
    <div className='w-[90%] lg:w-[1000px] m-auto flex flex-col items-center mt-20'>
        {children}
    </div>
  )
}

export default Container