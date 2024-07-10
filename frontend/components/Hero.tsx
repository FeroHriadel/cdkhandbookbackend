import React from 'react';



const Hero = () => {
  return (
    <div 
      className='w-[100%] h-[500px] flex flex-col justify-center items-center relative'
      style={{background: `url('/images/posters.jpg') no-repeat center center/cover`}}
    >
      <div className='absolute top-0 left-0 w-[100%] h-[100%] bg-slate-700 opacity-85' />
      <div className='w-[90%] lg:w-[1000px] m-auto absolute top-[50%] left-[50%]' style={{transform: 'translate(-50%, -50%)'}}>
        <h1 className='text-white font-bold py-0 my-0 text-center'>ThisSite</h1>
        <h3 className='text-white py-0 my-0 text-center' style={{lineHeight: 1}}>Where you show 'em...</h3>
      </div>
    </div>
  )
}

export default Hero