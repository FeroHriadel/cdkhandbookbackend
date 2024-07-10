import React from 'react'



interface Props {
  className?: string
}


const Logo = ({ className = '' }: Props) => {
  return (
    <div className='relative'>
      <div 
        className={`rounded-full w-[50px] h-[50px] ` + className}
        style={{background: 'url(/images/logo.jpg) no-repeat center center/cover'}}
      />

      <div 
        className='rounded-full w-[50px] h-[50px] bg-slate-700 opacity-40 absolute'
        style={{top: 0, left: 0}}
      />
    </div>
  )
}

export default Logo