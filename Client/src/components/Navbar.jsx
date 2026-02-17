import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { isLoggedIn, userData, logout } = useContext(AppContext)
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className='w-full flex justify-between items-center py-4 px-6 absolute top-0 left-0'>
      <img 
        src={assets.logo} 
        alt="Logo" 
        onClick={() => navigate('/')}
        className='w-28 cursor-pointer hover:scale-105 transition-transform' 
      />
      
      {isLoggedIn ? (
        <div className='relative'>
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            className='w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center cursor-pointer text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all'
          >
            {getInitials(userData?.name)}
          </div>
          
          {showDropdown && (
            <div className='absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50'>
              <div className='px-4 py-3 border-b border-gray-700'>
                <p className='text-white font-medium truncate'>{userData?.name || 'User'}</p>
                <p className='text-gray-400 text-sm truncate'>{userData?.email}</p>
              </div>
              
              {!userData?.isAccountVerified && (
                <button
                  onClick={() => { navigate('/email-verify'); setShowDropdown(false) }}
                  className='w-full px-4 py-2 text-left text-yellow-400 hover:bg-gray-700/50 transition-colors flex items-center gap-2'
                >
                  <span className='w-2 h-2 bg-yellow-400 rounded-full animate-pulse'></span>
                  Verify Email
                </button>
              )}
              
              <button
                onClick={handleLogout}
                className='w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700/50 transition-colors'
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')} 
          className='bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 font-semibold rounded-full hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/25 cursor-pointer transition-all duration-300'
        >
          Login
        </button>
      )}
    </div>
  )
}

export default Navbar