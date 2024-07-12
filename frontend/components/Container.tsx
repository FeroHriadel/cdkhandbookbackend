import React from 'react';



interface Props {
    children: React.ReactNode;
    className?: string;
    style?: {[key: string]: string};
}



const Container = ({ children, className = '', style = {} }: Props) => {
  return (
    <div className={'w-[90%] lg:w-[1000px] m-auto flex flex-col items-center mt-20 ' + className} style={{...style}}>
        {children}
    </div>
  )
}

export default Container