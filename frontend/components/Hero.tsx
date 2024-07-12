import React from 'react';



const Hero = () => {
  return (
    <div 
      className='w-[100%] h-[600px] flex flex-col justify-center items-center relative'
      style={{
        background: `url('/images/background.png')`,
        backgroundRepeat: 'no-repeat',
        backgroundPositionX: 'center',
        backgroundPositionY: '75%',
        backgroundSize: 'cover',
        filter: 'brightness(100%)',
      }}
    >
      <div className='absolute top-0 left-0 w-[100%] h-[100%] bg-slate-700 opacity-40' />
      <div className='w-[90%] lg:w-[1000px] m-auto absolute top-[50%] left-[50%]' style={{transform: 'translate(-50%, -50%)'}}>
        <h1 
          className='font-bold py-0 my-0 text-center'
          style={{textShadow: '0 0 10px black', fontSize: '4rem', color: '#eee'}}
        >
          THIS SITE
        </h1>
        <h3 
          className='font-bold py-0 my-0 text-center' 
          style={{lineHeight: 1, textShadow: '0 0 10px black', fontSize: '3rem', color: '#eee'}}
        >
          ...is where you show them...
        </h3>
      </div>
    </div>
  )
}

export default Hero