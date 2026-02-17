import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Header = () => {
  const navigate = useNavigate()
  const { isLoggedIn, userData } = useContext(AppContext)

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
      <div className='relative'>
        <img 
          src={assets.header_img} 
          alt="User" 
          className='w-36 h-36 rounded-full mb-6 hover:scale-110 transition-transform duration-400 shadow-2xl ring-4 ring-white/20' 
        />
        {isLoggedIn && userData?.isAccountVerified && (
          <div className='absolute bottom-6 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center'>
            <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='3' d='M5 13l4 4L19 7'/>
            </svg>
          </div>
        )}
      </div>
      
      <h1 className='flex items-center gap-3 text-xl font-medium mb-2'>
        Hey {isLoggedIn ? userData?.name?.split(' ')[0] || 'User' : 'Developer'}
        <img className='w-8 aspect-square' src={assets.hand_wave} alt="" />
      </h1>
      
      <h2 className='text-3xl sm:text-4xl font-semibold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
        Welcome to Auth App
      </h2>
      
      <p className='text-gray-600 mb-6 max-w-md'>
        {isLoggedIn 
          ? userData?.isAccountVerified 
            ? 'Your account is verified and ready to use. Explore the secure features of our authentication system.'
            : 'Please verify your email to unlock all features of your account.'
          : 'A complete authentication system with email verification, secure login, and password recovery.'
        }
      </p>

      {!isLoggedIn ? (
        <button 
          onClick={() => navigate('/login')}
          className='bg-gradient-to-r from-gray-800 to-gray-700 text-white px-8 py-3 rounded-full font-semibold hover:from-gray-700 hover:to-gray-600 hover:shadow-lg cursor-pointer transition-all duration-300 flex items-center gap-2'
        >
          Get Started
          <img src={assets.arrow_icon} alt="" className='w-4 filter brightness-0 invert' />
        </button>
      ) : !userData?.isAccountVerified ? (
        <button 
          onClick={() => navigate('/email-verify')}
          className='bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:from-yellow-600 hover:to-orange-600 hover:shadow-lg cursor-pointer transition-all duration-300 flex items-center gap-2'
        >
          Verify Email
          <img src={assets.mail_icon} alt="" className='w-4 filter brightness-0 invert' />
        </button>
      ) : (
        <div className='flex items-center gap-2 text-green-600 font-medium'>
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'/>
          </svg>
          Account Verified
        </div>
      )}

      <footer className='fixed bottom-4 text-gray-500 text-sm'>
        Made with love by Yaman Sharma
      </footer>
    </div>
  )
}

export default Header