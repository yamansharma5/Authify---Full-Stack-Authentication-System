import React, { useContext } from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import { AppContext } from '../context/AppContext'

const Home = () => {
  const { isLoading } = useContext(AppContext)

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
          <p className='text-gray-600 font-medium'>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
      <Navbar />
      <Header />
    </div>
  )
}

export default Home