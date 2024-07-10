import React from 'react'



interface Props {
  className?: string
}


const Logo = ({ className = '' }: Props) => {
  return (
    <div className='relative'>
      <div 
        className={`rounded-full w-[100px] h-[100px] ` + className}
        style={{background: 'url(/images/background.png) no-repeat center center/cover'}}
      />

      <div 
        className='rounded-full w-[100px] h-[100px] bg-slate-700 opacity-40 absolute'
        style={{top: 0, left: 0}}
      />
    </div>
  )
}

export default Logo