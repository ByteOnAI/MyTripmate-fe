# 🤖 MyTripMate Virtual Agent Chatbot

A premium, high-performance chatbot interface built with React, TypeScript, and Tailwind CSS. Features an elegant design matching MyTripMate's brand identity with smooth animations and professional UX.

## ✨ Features

### 🎨 **Premium UI/UX**

- **Exact MyTripMate brand colors** - Blue gradient (`#4c9ce4` → `#5eb5e8` → `#68c8ed`)
- **Smooth animations** - Fade-ins, slide-ups, blob effects, wave animations
- **Responsive design** - Works perfectly on all screen sizes
- **Beautiful avatars** - Custom SVG avatars for bot and user
- **Typing indicators** - Real-time typing feedback
- **Hover effects** - Interactive buttons and elements

### 💬 **Chat Features**

- Real-time messaging interface
- Quick action buttons (New Booking, Status Check, etc.)
- Message timestamps
- User and bot message differentiation
- Auto-scroll to latest message
- Mock API with intelligent responses

### 🔐 **Authentication**

- Beautiful login modal with carousel
- Email/Mobile input
- Social login (Google & Facebook)
- Smooth modal animations
- Terms and privacy policy links

### 🚀 **Performance**

- Fast load times with Vite
- Optimized React components
- Lazy loading where appropriate
- Smooth 60fps animations

## 📁 Project Structure

```
src/
├── components/
│   ├── LoginModal.tsx      # Login/Signup modal component
│   └── ui/                 # shadcn/ui components library
├── pages/
│   ├── Chatbot.tsx         # Main chatbot interface
│   └── NotFound.tsx        # 404 page
├── services/
│   └── chatApi.ts          # Chat API service (mock & real)
├── App.tsx                 # Main app component with routing
├── main.tsx                # App entry point
└── index.css               # Global styles & design tokens

public/
└── favicon.svg             # MyTripMate branded favicon
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - High-quality component library
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server

The app will run on `http://localhost:8080` (or next available port)

## 🔌 API Integration

### Current Setup (Mock API)

The chatbot currently uses a **mock API** with intelligent responses. The mock API is located in:

```typescript
src / services / chatApi.ts;
```

### Switching to Real API

To integrate your real API, follow these steps:

1. **Open** `src/services/chatApi.ts`

2. **Uncomment** the `realChatAPI` function template

3. **Configure** your API endpoint and authentication:

```typescript
export const realChatAPI = async (
  userMessage: string
): Promise<ChatAPIResponse> => {
  try {
    const response = await fetch("YOUR_API_ENDPOINT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${YOUR_API_KEY}`,
      },
      body: JSON.stringify({
        message: userMessage,
        // Add other required fields
      }),
    });

    const data = await response.json();

    return {
      message: data.message,
      buttons: data.buttons, // Optional quick action buttons
    };
  } catch (error) {
    console.error("Chat API Error:", error);
    return {
      message: "I'm having trouble connecting. Please try again.",
    };
  }
};
```

4. **Switch the export** at the bottom of the file:

```typescript
// Change from:
export const sendChatMessage = mockChatAPI;

// To:
export const sendChatMessage = realChatAPI;
```

### API Response Format

Your API should return JSON in this format:

```json
{
  "message": "Response text here",
  "buttons": ["Button 1", "Button 2"] // Optional
}
```

## 🎨 Design Tokens

Brand colors are defined in `src/index.css`:

```css
--primary: 207 89% 46%; /* #4c9ce4 */
--primary-light: 207 90% 61%; /* #5eb5e8 */
--gradient-header: linear-gradient(135deg, ...);
```

## 🔧 Customization

### Changing Colors

Edit `src/index.css` to modify the color scheme:

```css
:root {
  --primary: YOUR_COLOR_HSL;
  --primary-light: YOUR_LIGHT_COLOR_HSL;
}
```

### Modifying Initial Messages

Edit `src/pages/Chatbot.tsx` - look for the initial `messages` state:

```typescript
const [messages, setMessages] = useState<ChatMessage[]>([
  {
    id: "1",
    text: "Your welcome message here",
    sender: "bot",
    timestamp: formatTimestamp(),
  },
]);
```

### Changing Quick Action Buttons

Modify the `buttons` array in initial messages or API responses:

```typescript
buttons: ["New Booking", "Status Check", "Help", "Cancel"];
```

## 📱 Features Breakdown

### Chatbot Component (`src/pages/Chatbot.tsx`)

- **Message handling** - Send and receive messages
- **Typing indicator** - Shows when bot is responding
- **Auto-scroll** - Automatically scrolls to new messages
- **Button actions** - Quick action buttons send messages
- **Refresh chat** - Reset conversation
- **Minimize option** - Minimize chat window

### Login Modal (`src/components/LoginModal.tsx`)

- **Promotional carousel** - Auto-rotating slides
- **Email/Mobile input** - Single input field
- **Social login** - Google and Facebook integration
- **Smooth animations** - Modal fade and slide effects
- **Close button** - With rotation animation

### Chat API Service (`src/services/chatApi.ts`)

- **Mock responses** - Keyword-based intelligent replies
- **Real API template** - Ready to implement
- **Error handling** - Graceful fallbacks
- **Type safety** - Full TypeScript support

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

### Deploy to Netlify/Vercel

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

## 📝 Environment Variables

If your API requires environment variables:

1. Create `.env` file:

```env
VITE_API_ENDPOINT=https://your-api.com
VITE_API_KEY=your-api-key
```

2. Access in code:

```typescript
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
```

## 🎯 Key Components

### Message Interface

```typescript
interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
  buttons?: string[];
}
```

### API Response Interface

```typescript
interface ChatAPIResponse {
  message: string;
  buttons?: string[];
}
```

## 🔍 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 📄 License

This project is built for MyTripMate.

## 🤝 Support

For issues or questions:

1. Check the code comments
2. Review the API integration guide above
3. Test with mock API first before integrating real API

## 🎉 Credits

Built with ❤️ using modern web technologies:

- React Team for React
- Vercel for Next.js inspiration
- shadcn for beautiful components
- Tailwind Labs for Tailwind CSS

---

**Ready to deploy!** 🚀 The chatbot is production-ready and just needs your API integration.
