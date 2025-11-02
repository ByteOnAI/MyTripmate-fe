# Quick Setup Guide - Authentication System

## What Was Created

A complete authentication backend for signup and login functionality using Supabase, matching the UI design in `LoginModal.tsx`.

## New Files Created

1. **`src/services/authService.ts`** - Core authentication service with all auth methods
2. **`src/contexts/AuthContext.tsx`** - React Context for global auth state management
3. **`src/components/OTPModal.tsx`** - UI component for OTP verification
4. **`src/pages/AuthCallback.tsx`** - OAuth callback handler page
5. **`AUTH_DOCUMENTATION.md`** - Complete documentation

## Files Modified

1. **`src/components/LoginModal.tsx`** - Integrated with real authentication
2. **`src/App.tsx`** - Added AuthProvider and auth callback route

## Features Implemented

✅ Email/Phone OTP authentication (passwordless login)
✅ Google OAuth authentication
✅ OTP verification with 6-digit code input
✅ Auto-resend OTP with countdown timer
✅ Session management and persistence
✅ Loading states and error handling
✅ Toast notifications for user feedback
✅ OAuth redirect handling

## How to Use

### 1. Supabase Setup Required

Before the authentication works, you need to configure Supabase:

#### A. Enable Email Authentication
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable "Email" provider
3. Configure email templates (optional)

#### B. Enable Google OAuth (for Google login)
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable "Google" provider
3. Add OAuth credentials (Client ID and Secret from Google Console)
4. Add redirect URL: `http://localhost:5173/auth/callback` (development)

#### C. Enable Phone Authentication (optional, for SMS OTP)
1. Enable "Phone" provider in Supabase
2. Configure SMS provider (Twilio, MessageBird, etc.)

#### D. Configure Redirect URLs
Add these URLs in Supabase Dashboard → Authentication → URL Configuration:
- **Site URL**: `http://localhost:5173` (development)
- **Redirect URLs**: 
  - `http://localhost:5173/auth/callback`
  - Your production URL + `/auth/callback`

### 2. Test the Authentication

#### Test Email OTP Login:
1. Run the app: `npm run dev`
2. Click the login button
3. Enter your email address
4. Check your email for the OTP code
5. Enter the 6-digit code in the OTP modal
6. You should be logged in!

#### Test Google OAuth:
1. Click the login button
2. Click the "Google" button
3. Sign in with your Google account
4. You'll be redirected back and logged in

### 3. Using Authentication in Your Components

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.email}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

## Current Login Flow

### OTP (Email/Phone) Flow:
1. User enters email/phone in LoginModal
2. System sends OTP via email/SMS
3. OTPModal opens for verification
4. User enters 6-digit code
5. System verifies and creates session
6. User is logged in ✓

### Google OAuth Flow:
1. User clicks "Google" button in LoginModal
2. Redirects to Google authentication
3. User signs in with Google
4. Redirects back to `/auth/callback`
5. AuthCallback page processes the tokens
6. User is logged in ✓

## Environment Variables

Already configured in `.env`:
```env
VITE_SUPABASE_URL=https://gpnxszrdnodgodbpwkca.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Authentication State

The app now has global authentication state available via `useAuth()`:

```typescript
{
  user: User | null,           // Current logged-in user
  session: Session | null,     // Current session
  isLoading: boolean,          // Loading state
  isAuthenticated: boolean,    // Is user logged in?
  signUp: (email, password) => Promise,
  signIn: (email, password) => Promise,
  signInWithOTP: (emailOrPhone) => Promise,
  verifyOTP: (emailOrPhone, code) => Promise,
  signInWithGoogle: () => Promise,
  signOut: () => Promise,
  resetPassword: (email) => Promise
}
```

## Next Steps

1. **Configure Supabase** - Set up email and OAuth providers
2. **Test Authentication** - Try the login flows
3. **Protect Routes** - Add authentication guards to protected pages
4. **Add Sign Up Flow** - Create a separate signup form if needed
5. **Customize UI** - Adjust the modals to match your brand

## Troubleshooting

**OTP not received?**
- Check Supabase email provider configuration
- Check spam/junk folder
- Verify email templates are enabled

**Google OAuth not working?**
- Ensure OAuth credentials are configured in Supabase
- Check redirect URLs are added correctly
- Verify Google Console OAuth settings

**Session not persisting?**
- Check browser localStorage is enabled
- Verify Supabase client configuration
- Check for browser console errors

## Documentation

For detailed documentation, see `AUTH_DOCUMENTATION.md`

## Support

The authentication system is fully integrated and ready to use once Supabase is properly configured!
