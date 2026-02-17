import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
        <img src={assets.header_img} alt="Logo" className='w-40 h-40 rounded-full mb-6 hover:scale-110 transition-transform duration-400' />
        <h1 className='flex items-center gap-3 text-xl font-medium mb-2'> Hey User<img className='w-8 aspect-square' src={assets.hand_wave} alt="" /></h1>
        <h2 className='text-3xl font-semibold mb-4'>Welcome to my App</h2>
        <p className=' mb-4'>This is a Authentication System which have </p>

        <button className='border-2 px-6 py-2 rounded-full mt-4 hover:bg-gray-400 hover:scale-105 cursor-pointer active:bg-gray-600'>Get Started</button>
        <h5 className='mt-60 '>Made by Yaman Sharma</h5>
    </div>
  )
}

export default Header