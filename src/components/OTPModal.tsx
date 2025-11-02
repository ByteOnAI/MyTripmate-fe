import { useState, useEffect, useRef } from 'react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailOrPhone: string;
}

const OTPModal = ({ isOpen, onClose, emailOrPhone }: OTPModalProps) => {
  const { verifyOTP, signInWithOTP, isLoading } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowModal(true), 10);
      // Focus first input when modal opens
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
      // Start countdown for resend
      setCountdown(60);
      setCanResend(false);
    } else {
      setShowModal(false);
      setOtp(['', '', '', '', '', '']);
      setIsVerified(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown, isOpen]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last digit
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (index === 5 && value && newOtp.every(digit => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    while (newOtp.length < 6) newOtp.push('');
    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();

    // Auto-verify if complete
    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join('');
    
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await verifyOTP(emailOrPhone, code);

      if (error) {
        toast.error(error.message || 'Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setIsVerified(true);
        toast.success('Successfully verified!', {
          description: 'You are now logged in.',
        });
        setTimeout(() => {
          handleClose();
        }, 1500);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsSubmitting(true);
    try {
      const { error } = await signInWithOTP(emailOrPhone);

      if (error) {
        toast.error(error.message || 'Failed to resend OTP. Please try again.');
      } else {
        const isEmail = emailOrPhone.includes('@');
        toast.success(`OTP resent to your ${isEmail ? 'email' : 'mobile'}!`);
        setCountdown(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
      setOtp(['', '', '', '', '', '']);
      setIsVerified(false);
    }, 300);
  };

  if (!isOpen) return null;

  const isEmail = emailOrPhone.includes('@');
  const maskedContact = isEmail
    ? emailOrPhone.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    : emailOrPhone.replace(/(\d{2})(\d+)(\d{2})/, '$1****$3');

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        showModal ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all duration-300 ${
          showModal ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center transition-all transform hover:scale-110 hover:rotate-90 shadow-xl"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 px-8 pt-10 pb-6">
          <div className="relative z-10 text-center">
            {isVerified ? (
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-xl">
                  <span className="text-3xl font-bold text-white">✓</span>
                </div>
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isVerified ? 'Verified!' : 'Verify Your Account'}
            </h2>
            <p className="text-sm text-gray-600">
              {isVerified 
                ? 'You have been successfully verified'
                : `We've sent a 6-digit code to ${maskedContact}`
              }
            </p>
          </div>
        </div>

        {/* OTP Input */}
        {!isVerified && (
          <div className="px-8 py-8">
            <div className="flex gap-2 justify-center mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={isSubmitting || isLoading}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              ))}
            </div>

            <button
              onClick={() => handleVerify()}
              disabled={otp.some(digit => digit === '') || isSubmitting || isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-200 disabled:to-gray-300 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                'Verify OTP'
              )}
            </button>

            <div className="mt-6 text-center">
              {canResend ? (
                <button
                  onClick={handleResend}
                  disabled={isSubmitting || isLoading}
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline disabled:text-gray-400 disabled:no-underline"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-sm text-gray-500">
                  Resend OTP in <span className="font-semibold text-blue-600">{countdown}s</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPModal;
