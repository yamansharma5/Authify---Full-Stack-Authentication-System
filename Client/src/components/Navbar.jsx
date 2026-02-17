import React from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import login from '../pages/Login'

const Navbar = () => {
    const navigate = useNavigate()
  return (
    <div className='w-full flex justify-between items-center py-4 px-6 absolute top-0 left-0'>
        <img src={assets.logo} alt="Logo" className='w-28 ' />
        <button
        onClick={() => navigate('/login')} 
        className='bg-blue-500 text-white px-4 py-2 font-bold rounded-3xl hover:bg-blue-600 hover:scale-105 cursor-pointer transition duration-300'>
            Login
        </button>
    </div>
  )
}

export default Navbar