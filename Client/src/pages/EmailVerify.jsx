import React, { useState, useContext, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const EmailVerify = () => {
  const navigate = useNavigate()
  const { sendVerifyOtp, verifyEmail, isLoggedIn, userData } = useContext(AppContext)
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
    } else if (userData?.isAccountVerified) {
      navigate('/')
    }
  }, [isLoggedIn, userData, navigate])

  const handleSendOtp = async () => {
    setLoading(true)
    const result = await sendVerifyOtp()
    if (result.success) {
      setOtpSent(true)
      inputRefs.current[0]?.focus()
    }
    setLoading(false)
  }

  const handleInputChange = (index, value) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char
    })
    setOtp(newOtp)
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus()
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')
    if (otpString.length !== 6) return

    setLoading(true)
    const result = await verifyEmail(otpString)
    if (result.success) {
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
      <img 
        src={assets.logo} 
        alt="Logo" 
        onClick={() => navigate('/')}
        className='absolute left-5 top-5 cursor-pointer w-28 hover:scale-105 transition-transform' 
      />

      <div className='bg-gray-800/90 backdrop-blur-sm p-10 rounded-2xl shadow-2xl w-full max-w-md mx-4 text-center'>
        <div className='w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center'>
          <img src={assets.mail_icon} alt="" className='w-8 filter brightness-0 invert' />
        </div>
        
        <h2 className='text-2xl font-semibold text-white mb-2'>Verify Your Email</h2>
        <p className='text-gray-300 mb-6 text-sm'>
          {otpSent 
            ? 'Enter the 6-digit OTP sent to your email'
            : 'Click the button below to receive a verification code'
          }
        </p>

        {!otpSent ? (
          <button
            onClick={handleSendOtp}
            disabled={loading}
            className='w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 font-semibold rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 cursor-pointer disabled:opacity-50 shadow-lg'
          >
            {loading ? 'Sending...' : 'Send Verification Code'}
          </button>
        ) : (
          <form onSubmit={handleVerify}>
            <div className='flex justify-center gap-2 mb-6'>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className='w-12 h-14 text-center text-2xl font-bold bg-gray-700/50 text-white border border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all'
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className='w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 font-semibold rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 cursor-pointer disabled:opacity-50 shadow-lg'
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            <p className='text-gray-400 mt-4 text-sm'>
              Didn't receive the code?{' '}
              <span 
                onClick={handleSendOtp} 
                className='text-blue-400 cursor-pointer hover:text-blue-300'
              >
                Resend
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default EmailVerify