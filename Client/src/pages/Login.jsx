import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Login = () => {
  const navigate = useNavigate()
  const { login, register } = useContext(AppContext)

  const [state, setState] = useState("signup")
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (state === "signup") {
        const result = await register(name, email, password)
        if (result.success) {
          navigate('/email-verify')
        }
      } else {
        const result = await login(email, password)
        if (result.success) {
          navigate('/')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
      <img 
        src={assets.logo} 
        alt="Logo" 
        onClick={() => navigate('/')}
        className='absolute left-5 top-5 cursor-pointer w-28 hover:scale-105 transition-transform' 
      />
      
      <div className='bg-gray-800/90 backdrop-blur-sm p-10 rounded-2xl shadow-2xl w-full max-w-md mx-4'>
        <h2 className='text-3xl font-semibold text-white text-center mb-2'>
          {state === "signup" ? "Create Account" : "Welcome Back"}
        </h2>
        <p className='text-gray-300 text-center mb-6 text-sm'>
          {state === "signup" ? "Sign up to get started" : "Login to your account"}
        </p>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {state === "signup" && (
            <div className='relative'>
              <img src={assets.person_icon} alt="" className='absolute left-4 top-1/2 -translate-y-1/2 w-4 opacity-60' />
              <input 
                type="text" 
                placeholder='Full Name' 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required
                className='w-full px-10 py-3 rounded-full bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all' 
              />
            </div>
          )}
          
          <div className='relative'>
            <img src={assets.mail_icon} alt="" className='absolute left-4 top-1/2 -translate-y-1/2 w-4 opacity-60' />
            <input 
              type="email" 
              placeholder='Email Address' 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              className='w-full px-10 py-3 rounded-full bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all' 
            />
          </div>
          
          <div className='relative'>
            <img src={assets.lock_icon} alt="" className='absolute left-4 top-1/2 -translate-y-1/2 w-4 opacity-60' />
            <input 
              type="password" 
              placeholder='Password' 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              className='w-full px-10 py-3 rounded-full bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all' 
            />
          </div>
          
          {state === "login" && (
            <p 
              onClick={() => navigate('/reset-password')}
              className='text-right text-blue-400 text-sm cursor-pointer hover:text-blue-300 transition-colors'
            >
              Forgot Password?
            </p>
          )}
          
          <button 
            type="submit"
            disabled={loading}
            className='w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 font-semibold rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25'
          >
            {loading ? 'Please wait...' : (state === "signup" ? "Sign Up" : "Login")}
          </button>
          
          <p className='text-gray-300 text-center mt-4'>
            {state === "signup" ? (
              <>Already have an account? <span onClick={() => setState("login")} className='text-blue-400 cursor-pointer hover:text-blue-300 underline transition-colors'>Login</span></>
            ) : (
              <>Don't have an account? <span onClick={() => setState("signup")} className='text-blue-400 cursor-pointer hover:text-blue-300 underline transition-colors'>Sign Up</span></>
            )}
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login