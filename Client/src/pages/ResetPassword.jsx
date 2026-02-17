import React, { useState, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const ResetPassword = () => {
  const navigate = useNavigate()
  const { sendResetOtp, resetPassword } = useContext(AppContext)

  const [step, setStep] = useState(1) // 1: email, 2: OTP, 3: new password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRefs = useRef([])

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await sendResetOtp(email)
    if (result.success) {
      setStep(2)
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

  const handleVerifyOtp = (e) => {
    e.preventDefault()
    if (otp.join('').length === 6) {
      setStep(3)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      return
    }
    setLoading(true)
    const result = await resetPassword(email, otp.join(''), newPassword)
    if (result.success) {
      navigate('/login')
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

      <div className='bg-gray-800/90 backdrop-blur-sm p-10 rounded-2xl shadow-2xl w-full max-w-md mx-4'>
        {/* Progress Steps */}
        <div className='flex justify-center gap-2 mb-8'>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                step >= s ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <>
            <div className='w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center'>
              <img src={assets.mail_icon} alt="" className='w-8 filter brightness-0 invert' />
            </div>
            <h2 className='text-2xl font-semibold text-white text-center mb-2'>Reset Password</h2>
            <p className='text-gray-300 text-center mb-6 text-sm'>Enter your email to receive a reset code</p>
            
            <form onSubmit={handleSendOtp}>
              <div className='relative mb-4'>
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
              <button
                type="submit"
                disabled={loading}
                className='w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 font-semibold rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 cursor-pointer disabled:opacity-50 shadow-lg'
              >
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>
          </>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <>
            <div className='w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center'>
              <img src={assets.lock_icon} alt="" className='w-8 filter brightness-0 invert' />
            </div>
            <h2 className='text-2xl font-semibold text-white text-center mb-2'>Enter OTP</h2>
            <p className='text-gray-300 text-center mb-6 text-sm'>We sent a 6-digit code to {email}</p>
            
            <form onSubmit={handleVerifyOtp}>
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
                disabled={otp.join('').length !== 6}
                className='w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 font-semibold rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 cursor-pointer disabled:opacity-50 shadow-lg'
              >
                Continue
              </button>
              <p className='text-gray-400 mt-4 text-sm text-center'>
                Didn't receive code?{' '}
                <span onClick={() => handleSendOtp({ preventDefault: () => {} })} className='text-blue-400 cursor-pointer hover:text-blue-300'>Resend</span>
              </p>
            </form>
          </>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <>
            <div className='w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center'>
              <img src={assets.lock_icon} alt="" className='w-8 filter brightness-0 invert' />
            </div>
            <h2 className='text-2xl font-semibold text-white text-center mb-2'>New Password</h2>
            <p className='text-gray-300 text-center mb-6 text-sm'>Create a strong new password</p>
            
            <form onSubmit={handleResetPassword} className='flex flex-col gap-4'>
              <div className='relative'>
                <img src={assets.lock_icon} alt="" className='absolute left-4 top-1/2 -translate-y-1/2 w-4 opacity-60' />
                <input
                  type="password"
                  placeholder='New Password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className='w-full px-10 py-3 rounded-full bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all'
                />
              </div>
              <div className='relative'>
                <img src={assets.lock_icon} alt="" className='absolute left-4 top-1/2 -translate-y-1/2 w-4 opacity-60' />
                <input
                  type="password"
                  placeholder='Confirm Password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className='w-full px-10 py-3 rounded-full bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all'
                />
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className='text-red-400 text-sm'>Passwords do not match</p>
              )}
              <button
                type="submit"
                disabled={loading || newPassword !== confirmPassword || !newPassword}
                className='w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 font-semibold rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 cursor-pointer disabled:opacity-50 shadow-lg'
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}

        <p 
          onClick={() => navigate('/login')} 
          className='text-gray-400 text-center mt-6 text-sm cursor-pointer hover:text-gray-300'
        >
          Back to Login
        </p>
      </div>
    </div>
  )
}

export default ResetPassword