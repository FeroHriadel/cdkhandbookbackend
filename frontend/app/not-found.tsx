import Link from 'next/link'
import React from 'react'



const NotFoundPage = () => {
  return (
    <div className='w-[100vw] h-[90vh] bg-white flex flex-col justify-center items-center'>
      <h3>Sorry, this page was not found</h3>
      <br />
      <Link href="/">
        <p className='underline'>Go Home</p>
      </Link>
    </div>
  )
}

export default NotFoundPage