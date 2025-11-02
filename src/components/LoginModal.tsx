import { useState, useEffect } from "react";
import {
  X,
  Hotel,
  Plane,
  Ship,
  Loader2,
  MapPin,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { signInWithGoogle, isLoading } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log("LoginModal isOpen:", isOpen);
    if (isOpen) {
      setTimeout(() => setShowModal(true), 10);
    } else {
      setShowModal(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const slides = [
    {
      title: "Plan Your Dream Vacation!",
      subtitle:
        "AI-powered travel planning from discussion to booking - all in one chat.",
      icon: MapPin,
      color: "from-blue-400 to-cyan-400",
    },
    {
      title: "Discover Perfect Destinations!",
      subtitle:
        "Get personalized recommendations for hotels, resorts & accommodations.",
      icon: Hotel,
      color: "from-purple-400 to-pink-400",
    },
    {
      title: "Book Flights Instantly!",
      subtitle: "Compare prices and book the best flight deals in seconds.",
      icon: Plane,
      color: "from-orange-400 to-red-400",
    },
    {
      title: "Complete Travel Packages!",
      subtitle:
        "Seamless booking for flights, hotels, transfers & experiences.",
      icon: Ship,
      color: "from-green-400 to-teal-400",
    },
    {
      title: "Secure & Easy Payments!",
      subtitle: "Complete your booking with safe, instant payment options.",
      icon: CreditCard,
      color: "from-pink-400 to-rose-400",
    },
  ];

  const handleSocialLogin = async (provider: string) => {
    if (provider.toLowerCase() === "google") {
      setIsSubmitting(true);
      try {
        const { error } = await signInWithGoogle();

        if (error) {
          toast.error(error.message || "Failed to sign in with Google");
          setIsSubmitting(false);
        } else {
          // OAuth will redirect, so we don't need to do anything here
          toast.success("Signing in with Google...");
        }
      } catch (error) {
        console.error("OAuth error:", error);
        toast.error("An unexpected error occurred. Please try again.");
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        showModal ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all duration-300 ${
          showModal ? "scale-100 translate-y-0" : "scale-95 translate-y-10"
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

        {/* Carousel Section */}
        <div className="relative bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 px-8 pt-10 pb-6 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>

          <div className="relative z-10">
            <div className="flex justify-center mb-5">
              <div
                className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${slides[currentSlide].color} flex items-center justify-center shadow-xl transform transition-all duration-500 hover:scale-110`}
              >
                <CurrentIcon
                  className="w-16 h-16 text-white"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center animate-fade-in">
              {slides[currentSlide].title}
            </h2>
            <p className="text-sm text-gray-600 mb-5 text-center animate-fade-in">
              {slides[currentSlide].subtitle}
            </p>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 w-8"
                      : "bg-gray-300 w-2 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="px-8 py-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Sign in to start planning your vacation
          </h3>

          <div className="space-y-6">
            <button
              onClick={() => handleSocialLogin("Google")}
              disabled={isSubmitting || isLoading}
              className="w-full py-4 bg-white hover:bg-gray-50 border-2 border-gray-300 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin text-gray-700" />
                  <span className="text-gray-700 font-semibold">
                    Signing in...
                  </span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-gray-800 font-semibold text-base">
                    Continue with Google
                  </span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By continuing, you agree to MyTripMate's{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginModal;
