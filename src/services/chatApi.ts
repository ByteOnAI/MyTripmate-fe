// Chat API Service
// This file contains the mock API. Replace mockChatAPI with your real API implementation

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  buttons?: string[];
}

export interface ChatAPIResponse {
  message: string;
  buttons?: string[];
}

// Mock API - Replace this function with your real API call
export const mockChatAPI = async (userMessage: string): Promise<ChatAPIResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock intelligent responses based on keywords - Vacation Planning Focus
  const messageLower = userMessage.toLowerCase();
  
  // Vacation Planning
  if (messageLower.includes('plan') || messageLower.includes('vacation') || messageLower.includes('trip')) {
    return {
      message: "Exciting! Let's plan your perfect vacation! 🌴 Where would you like to go? I can help with beach destinations, mountain retreats, cultural tours, or adventure trips!",
      buttons: ['Beach Vacation', 'Mountain Getaway', 'City Tour', 'Adventure Trip']
    };
  }
  
  // Hotel recommendations
  if (messageLower.includes('hotel') || messageLower.includes('stay') || messageLower.includes('accommodation')) {
    return {
      message: "I'll find the perfect place for you to stay! What's your preferred budget and what amenities are important to you? (pool, spa, beach access, etc.)",
      buttons: ['Luxury Resorts', 'Budget Hotels', '3-Star Hotels', 'Homestays']
    };
  }
  
  // Flight bookings
  if (messageLower.includes('flight') || messageLower.includes('fly')) {
    return {
      message: "Let me help you find the best flights! ✈️ What are your departure and destination cities? Also, when are you planning to travel?",
      buttons: ['One-Way', 'Round Trip', 'Multi-City', 'Flexible Dates']
    };
  }
  
  // Recommendations
  if (messageLower.includes('recommend') || messageLower.includes('suggest') || messageLower.includes('where')) {
    return {
      message: "Based on your preferences, I'd love to suggest some amazing destinations! Are you looking for a relaxing beach holiday, cultural experience, or adventure?",
      buttons: ['Beach Destinations', 'Cultural Cities', 'Adventure Spots', 'Hill Stations']
    };
  }
  
  // Transport/Travel modes
  if (messageLower.includes('transport') || messageLower.includes('travel') || messageLower.includes('bus') || messageLower.includes('train')) {
    return {
      message: "I can arrange all your transportation needs! What mode of transport would you prefer for your journey?",
      buttons: ['Flight', 'Train', 'Bus', 'Car Rental']
    };
  }
  
  // Booking and payment
  if (messageLower.includes('book') || messageLower.includes('payment') || messageLower.includes('pay')) {
    return {
      message: "Great! I'll help you complete your booking. Your trip package will include flights, hotels, and transfers. Shall we proceed to payment?",
      buttons: ['Proceed to Payment', 'View Summary', 'Modify Details', 'Add Services']
    };
  }
  
  // Check bookings
  if (messageLower.includes('status') || messageLower.includes('check') || messageLower.includes('my booking')) {
    return {
      message: "I can help you check your booking status. Please provide your booking ID or registered email address.",
      buttons: ['View Bookings', 'Download Ticket', 'Modify Booking']
    };
  }
  
  // Greetings
  if (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('hey')) {
    return {
      message: "Hello! 👋 I'm your AI Travel Planner. I can help you plan your entire vacation from discussion to booking! Where would you like to explore?",
      buttons: ['Plan New Trip', 'View Destinations', 'My Bookings', 'Travel Tips']
    };
  }
  
  // Thanks
  if (messageLower.includes('thank')) {
    return {
      message: "You're very welcome! 😊 Ready to continue planning your dream vacation?",
      buttons: ['Continue Planning', 'Start New Trip', 'My Bookings']
    };
  }
  
  // Default responses - vacation focused
  const defaultResponses = [
    "I'm here to make your vacation planning effortless! Tell me more about what you're looking for.",
    "Let's create an amazing travel experience for you! What destination interests you?",
    "I can help you plan every detail - from choosing destinations to completing payments. What would you like to start with?",
    "Your perfect vacation is just a conversation away! Share your travel dreams with me.",
    "I'm your personal travel planner - ready to turn your vacation ideas into reality! 🌍"
  ];
  
  return {
    message: defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  };
};

// Real API implementation template (uncomment and modify when ready)
/*
export const realChatAPI = async (userMessage: string): Promise<ChatAPIResponse> => {
  try {
    const response = await fetch('YOUR_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${YOUR_API_KEY}`
      },
      body: JSON.stringify({
        message: userMessage,
        // Add other required fields
      })
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    
    return {
      message: data.message || data.response,
      buttons: data.buttons
    };
  } catch (error) {
    console.error('Chat API Error:', error);
    return {
      message: "I'm having trouble connecting. Please try again in a moment."
    };
  }
};
*/

// Export the active API function
export const sendChatMessage = mockChatAPI;
// When ready to switch to real API, change to: export const sendChatMessage = realChatAPI;
