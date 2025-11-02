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
  
  // Mock intelligent responses based on keywords
  const messageLower = userMessage.toLowerCase();
  
  if (messageLower.includes('booking') || messageLower.includes('book')) {
    return {
      message: "I can help you with booking! Would you like to book a flight, hotel, or holiday package?",
      buttons: ['Flight Booking', 'Hotel Booking', 'Holiday Package']
    };
  }
  
  if (messageLower.includes('ticket') || messageLower.includes('download')) {
    return {
      message: "I'll help you download your ticket. Please provide your booking reference number.",
    };
  }
  
  if (messageLower.includes('status') || messageLower.includes('check')) {
    return {
      message: "To check your booking status, please provide your booking reference number or email ID.",
    };
  }
  
  if (messageLower.includes('cancel') || messageLower.includes('refund')) {
    return {
      message: "I understand you want to cancel. Please note our cancellation policy applies. Shall I proceed with the cancellation?",
      buttons: ['Yes, Cancel', 'No, Keep Booking', 'View Policy']
    };
  }
  
  if (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('hey')) {
    return {
      message: "Hello! Welcome to EaseMyTrip Support. How may I assist you with your travel plans today?",
      buttons: ['New Booking', 'Check Status', 'Modify Booking', 'Get Help']
    };
  }
  
  if (messageLower.includes('thank')) {
    return {
      message: "You're welcome! Is there anything else I can help you with today?",
      buttons: ['New Booking', 'More Help', 'End Chat']
    };
  }
  
  // Default responses
  const defaultResponses = [
    "I'm here to help! Could you please provide more details about your query?",
    "Thank you for reaching out. I'll be happy to assist you with your travel needs.",
    "I understand. Let me help you with that right away.",
    "Great question! How can I make your travel experience better?",
    "I'm your virtual travel assistant. How can I help you today?"
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
