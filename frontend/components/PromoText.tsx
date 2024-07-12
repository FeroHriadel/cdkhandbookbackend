import React from 'react'



interface Props {
  text: string;
  className?: string;
}

const PromoText = ({ text, className = '' }: Props) => {
  return (
    <section className={`my-10 py-10 flex flex-col items-center justify-center ` + className}>
        <div className='w-[90%] lg:w-[1000px] m-auto flex flex-col items-center'>
          <h4 className='text-center mb-10'>
            {text}
          </h4>
        </div>
      </section>
  )
}

export default PromoText