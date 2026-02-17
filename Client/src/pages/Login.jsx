import React from 'react'
import { useState } from 'react'
import { assets } from '../assets/assets'

const Login = () => {

  const [state, setState] = useState("signup")//signup or login
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
      <img src={assets.logo} alt="Login" className='absolute left-5 top-5 cursor-pointer' />
      {/* /** 1. State to toggle between login and signup
       * 2. Form with input fields for email and password
       * 3. Button to submit the form */}
      <div className='bg-gray-800 bg-opacity-80 p-10 rounded-lg shadow-md w-full max-w-md'>
      <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === "signup" ? "Create Account" : "Login to Account"}</h2> 
      <p className='text-white text-center mb-3 text-sm'>{state === "signup" ? "Create Your Account" : "Login into Your Account"}</p>

       <form className='flex flex-col gap-4 mt-6'>
        {state === "signup" && (
          <input type="text" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} className='px-4 py-2 rounded-4xl border bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white ' />
        )}
        <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} className='px-4 py-2 rounded-4xl border bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white ' />
        <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} className='px-4 py-2 rounded-4xl border bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white' />
        {state === "login" && (
          <p className='text-center text-blue-500 cursor-pointer'>Forgot Password?</p>
        )}
        <button className='bg-blue-500 text-white px-4 py-2 font-bold rounded-4xl hover:bg-blue-600 transition duration-300 cursor-pointer'>{state === "signup" ? "Sign Up" : "Login"}</button>
        {state === "signup" ? (
          <p className='text-white text-center mt-3'>Already Have Account? <span onClick={() => setState("login")} className='text-blue-500 cursor-pointer underline'>Login</span></p>
        ) : (
          <p className='text-white text-center mt-3'>Don't Have an Account? <span onClick={() => setState("signup")} className='text-blue-500 cursor-pointer underline'>Sign Up</span></p>
        )}
      </form>

      
      
      </div>

     
    </div>
  )
}

export default Login