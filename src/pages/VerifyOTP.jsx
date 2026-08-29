import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { verifyOTP } from '../services/authService';

function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (isExpired) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExpired]);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate('/register', { replace: true });
    }
  }, [email, navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    if (isExpired) {
      toast.error('OTP has expired. Please register again.');
      return;
    }

    setLoading(true);
    const result = await verifyOTP(email, otp);

    if (result.success) {
      toast.success(result.message);
      navigate('/login', { replace: true });
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-lightblue to-medical-lightgreen flex-center px-4">
      <div className="w-full max-w-md">
        <div className="card animate-slideInUp">
          {/* Back Button */}
          <button
            onClick={() => navigate('/register')}
            className="flex items-center space-x-2 text-medical-blue hover:text-blue-900 transition mb-6 font-medium"
          >
            <FiArrowLeft />
            <span>Back to Registration</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-medical-lightblue rounded-full flex-center mb-4">
              <FiMail className="w-8 h-8 text-medical-blue" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Verify Email
            </h1>
            <p className="text-gray-600">
              We've sent a verification code to:
              <br />
              <span className="font-semibold text-gray-800">{email}</span>
            </p>
          </div>

          {/* OTP Input Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                maxLength="6"
                className="input-field text-center text-2xl tracking-widest font-mono"
                disabled={loading || isExpired}
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                Only numeric characters are allowed
              </p>
            </div>

            {/* Timer */}
            <div
              className={`text-center p-3 rounded-lg ${
                isExpired
                  ? 'bg-medical-lightred text-medical-red'
                  : timeLeft < 60
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-medical-lightblue text-medical-blue'
              }`}
            >
              {isExpired ? (
                <p className="font-semibold">Code has expired</p>
              ) : (
                <>
                  <p className="text-sm">Code expires in:</p>
                  <p className="text-xl font-bold font-mono">
                    {formatTime(timeLeft)}
                  </p>
                </>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isExpired || otp.length !== 6}
              className="btn-primary w-full flex-center space-x-2"
            >
              {loading && <div className="spinner border-white border-t-white" />}
              <span>{loading ? 'Verifying...' : 'Verify Email'}</span>
            </button>
          </form>

          {/* Resend OTP Section */}
          {!isExpired && (
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Didn't receive the code?
              </p>
              <button
                type="button"
                className="text-medical-blue hover:text-blue-900 font-semibold text-sm mt-1"
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>
          )}

          {/* Expired Message */}
          {isExpired && (
            <div className="mt-6 p-4 bg-medical-lightred rounded-lg">
              <p className="text-sm text-medical-red text-center">
                Your verification code has expired. Please register again to
                get a new code.
              </p>
            </div>
          )}

          {/* Contact Support */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Having trouble?{' '}
              <a href="#" className="text-medical-blue hover:text-blue-900">
                Contact support
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          © 2026 ORNGlobal. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default VerifyOTP;
