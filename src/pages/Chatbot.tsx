import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Sparkles, LogOut, User } from 'lucide-react';
import LoginModal from '@/components/LoginModal';
import { sendChatMessage, ChatMessage } from '@/services/chatApi';
import { useAuth } from '@/contexts/AuthContext';

const Chatbot = () => {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! I\'m your AI Travel Assistant. Ready to plan your perfect vacation? ✈️',
      sender: 'bot',
      timestamp: new Date().toLocaleString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }).replace(',', '')
    },
    {
      id: '2',
      text: 'I can help you plan everything from start to finish:\n\n✨ Discuss your dream destination\n🏨 Find perfect hotels & resorts\n✈️ Book flights & transport\n💰 Complete payments\n📋 Get instant confirmations\n\nLet\'s start planning your next adventure!',
      sender: 'bot',
      timestamp: new Date().toLocaleString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }).replace(',', ''),
      buttons: ['Plan a Vacation', 'Find Hotels', 'Book Flights', 'My Bookings']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(!user && !authLoading);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, typingText]);

  // Cleanup typing interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  // Show login modal if user is not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      setIsLoginModalOpen(true);
    }
  }, [user, authLoading]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showProfileMenu && !target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const formatTimestamp = () => {
    return new Date().toLocaleString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    }).replace(',', '');
  };

  // Word-by-word typing animation
  const typeMessage = (fullText: string, buttons?: string[]) => {
    const words = fullText.split(' ');
    let currentIndex = 0;
    let currentText = '';

    setTypingText('');
    setIsTyping(true);

    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < words.length) {
        currentText += (currentIndex > 0 ? ' ' : '') + words[currentIndex];
        setTypingText(currentText);
        currentIndex++;
      } else {
        // Typing complete - add final message
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
        
        const botMessage: ChatMessage = {
          id: Date.now().toString(),
          text: fullText,
          sender: 'bot',
          timestamp: formatTimestamp(),
          buttons: buttons
        };

        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        setTypingText('');
      }
    }, 100); // Adjust speed here (100ms per word)
  };

  const handleSendMessage = async (messageText?: string) => {
    // Require authentication to send messages
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    // Clear any existing typing animation
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      setIsTyping(false);
      setTypingText('');
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: formatTimestamp()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Get bot response from API
    try {
      const response = await sendChatMessage(textToSend);
      
      // Start word-by-word typing animation
      typeMessage(response.message, response.buttons);
    } catch (error) {
      console.error('Chat error:', error);
      typeMessage("I'm having trouble connecting. Please try again.");
    } finally {
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleButtonClick = (buttonText: string) => {
    handleSendMessage(buttonText);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-[#4c9ce4] via-[#5eb5e8] to-[#68c8ed] text-white px-6 py-5 shadow-2xl z-10">
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated wave effect - transparent only */}
          <svg className="absolute bottom-0 left-0 w-full h-24 animate-wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,60 Q360,120 720,60 T1440,60 L1440,120 L0,120 Z" fill="white" opacity="0.15"/>
          </svg>
          <svg className="absolute bottom-0 left-0 w-full h-20 animate-wave-slow" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,50 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z" fill="white" opacity="0.2"/>
          </svg>
          {/* Sparkle effects */}
          <div className="absolute top-2 right-20 text-white/30 animate-pulse">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="absolute top-8 right-40 text-white/20 animate-pulse animation-delay-1000">
            <Sparkles className="w-3 h-3" />
          </div>
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4 animate-fade-in">
            <div className="relative w-16 h-16 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center overflow-visible border-3 border-white/40 shadow-xl transform hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img 
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='35' r='18' fill='%23d4a574'/%3E%3Cpath d='M25 85 Q25 55 50 55 Q75 55 75 85' fill='%23a8d8ea'/%3E%3Cpath d='M30 50 Q30 45 35 45 L65 45 Q70 45 70 50' fill='%23d4a574'/%3E%3Ccircle cx='38' cy='32' r='2' fill='%23333'/%3E%3Ccircle cx='62' cy='32' r='2' fill='%23333'/%3E%3Cpath d='M42 40 Q50 43 58 40' stroke='%23333' fill='none' stroke-width='1.5'/%3E%3Cpath d='M32 28 Q30 25 28 28' stroke='%238b4513' fill='none' stroke-width='2'/%3E%3Cpath d='M68 28 Q70 25 72 28' stroke='%238b4513' fill='none' stroke-width='2'/%3E%3C/svg%3E" 
                  alt="Virtual Agent" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wide drop-shadow-lg">EaseMyTrip AI Travel Planner</h1>
              <p className="text-sm text-white/90 font-medium mt-0.5">Your personal assistant for seamless vacation planning 🌴</p>
            </div>
          </div>
          
        </div>

        {/* Login/Profile Button */}
        <div className="absolute top-5 right-6 z-20">
          {user ? (
            // User Profile Menu
            <div className="relative profile-menu-container">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 px-4 py-2 bg-white hover:bg-gray-50 rounded-full shadow-xl transition-all transform hover:scale-105"
              >
                {user.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt={user.user_metadata?.full_name || user.email}
                    className="w-8 h-8 rounded-full border-2 border-blue-400"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4c9ce4] to-[#5eb5e8] flex items-center justify-center text-white font-semibold">
                    {user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U'}
                  </div>
                )}
                <span className="text-gray-800 font-medium text-sm max-w-[120px] truncate">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-down">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={async () => {
                      setShowProfileMenu(false);
                      await signOut();
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Login Button
            <button
              onClick={() => {
                console.log('Login button clicked!');
                setIsLoginModalOpen(true);
              }}
              className="px-7 py-3 bg-white text-[#4c9ce4] hover:bg-gray-50 rounded-full font-semibold shadow-xl transition-all text-sm transform hover:scale-105 hover:shadow-2xl cursor-pointer"
            >
              Login or Signup
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 relative z-0">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2 animate-slide-up">
            {message.sender === 'bot' ? (
              <div className="flex items-start gap-3 max-w-4xl">
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex-shrink-0 flex items-center justify-center overflow-visible shadow-lg border-2 border-blue-200">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img 
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='35' r='18' fill='%23d4a574'/%3E%3Cpath d='M25 85 Q25 55 50 55 Q75 55 75 85' fill='%23a8d8ea'/%3E%3Cpath d='M30 50 Q30 45 35 45 L65 45 Q70 45 70 50' fill='%23d4a574'/%3E%3Ccircle cx='38' cy='32' r='2' fill='%23333'/%3E%3Ccircle cx='62' cy='32' r='2' fill='%23333'/%3E%3Cpath d='M42 40 Q50 43 58 40' stroke='%23333' fill='none' stroke-width='1.5'/%3E%3Cpath d='M32 28 Q30 25 28 28' stroke='%238b4513' fill='none' stroke-width='2'/%3E%3Cpath d='M68 28 Q70 25 72 28' stroke='%238b4513' fill='none' stroke-width='2'/%3E%3C/svg%3E" 
                      alt="Agent" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-2xl rounded-tl-sm px-6 py-4 shadow-lg border border-gray-100 max-w-2xl transform hover:scale-[1.01] transition-transform">
                    <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
                      {message.text}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 ml-2 font-medium">{message.timestamp}</p>
                  
                  {message.buttons && (
                    <div className="flex flex-wrap gap-3 mt-5">
                      {message.buttons.map((button, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleButtonClick(button)}
                          className="px-6 py-3 bg-white hover:bg-gradient-to-r hover:from-[#4c9ce4] hover:to-[#5eb5e8] hover:text-white text-gray-800 rounded-full shadow-md hover:shadow-xl transition-all text-sm font-semibold border border-gray-200 transform hover:scale-105"
                        >
                          {button}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex justify-end items-start gap-3 max-w-4xl ml-auto">
                <div className="flex-1 flex flex-col items-end">
                  <div className="bg-gradient-to-r from-[#4c9ce4] to-[#5eb5e8] text-white rounded-2xl rounded-tr-sm px-6 py-4 shadow-lg max-w-2xl transform hover:scale-[1.01] transition-transform">
                    <p className="text-base leading-relaxed">{message.text}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 mr-2 font-medium">{message.timestamp}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4c9ce4] to-[#5eb5e8] flex-shrink-0 flex items-center justify-center text-white font-semibold shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Typing Indicator - Word by word */}
        {isTyping && (
          <div className="flex items-start gap-3 animate-slide-up">
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex-shrink-0 flex items-center justify-center overflow-visible shadow-lg border-2 border-blue-200">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img 
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='35' r='18' fill='%23d4a574'/%3E%3Cpath d='M25 85 Q25 55 50 55 Q75 55 75 85' fill='%23a8d8ea'/%3E%3Cpath d='M30 50 Q30 45 35 45 L65 45 Q70 45 70 50' fill='%23d4a574'/%3E%3Ccircle cx='38' cy='32' r='2' fill='%23333'/%3E%3Ccircle cx='62' cy='32' r='2' fill='%23333'/%3E%3Cpath d='M42 40 Q50 43 58 40' stroke='%23333' fill='none' stroke-width='1.5'/%3E%3C/svg%3E" 
                  alt="Agent" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-2xl rounded-tl-sm px-6 py-4 shadow-lg border border-gray-100 max-w-2xl">
                {typingText ? (
                  <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
                    {typingText}
                    <span className="inline-block w-0.5 h-4 bg-blue-500 ml-1 animate-pulse"></span>
                  </p>
                ) : (
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-400"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200 px-6 py-5 shadow-2xl relative z-10">
        <div className="flex items-center gap-4 max-w-5xl mx-auto">
          <div className="flex-1 flex items-center gap-3 bg-gray-100 rounded-full px-6 py-4 shadow-inner border border-gray-200">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={user ? "Tell me about your dream vacation..." : "Please login to start planning your trip..."}
              disabled={!user}
              className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-base font-medium disabled:cursor-not-allowed"
            />
            <button className="text-gray-400 hover:text-blue-500 transition-colors transform hover:scale-110">
              <Mic className="w-6 h-6" />
            </button>
            <button className="text-gray-400 hover:text-blue-500 transition-colors transform hover:scale-110">
              <Paperclip className="w-6 h-6" />
            </button>
          </div>
          <button
            onClick={() => handleSendMessage()}
            disabled={!user || !inputMessage.trim()}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-[#4c9ce4] to-[#5eb5e8] hover:from-[#3d8fd4] hover:to-[#4da4d8] text-white flex items-center justify-center shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 active:scale-95"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      
      {/* Custom Styles */}
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes wave {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-25%); }
        }
        
        @keyframes wave-slow {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-15%); }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-wave {
          animation: wave 10s ease-in-out infinite;
        }
        
        .animate-wave-slow {
          animation: wave-slow 15s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
