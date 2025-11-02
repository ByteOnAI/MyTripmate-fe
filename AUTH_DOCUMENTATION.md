# Authentication System Documentation

## Overview

This document describes the authentication system implemented for MyTripmate. The system uses **Supabase Auth** for backend authentication and supports multiple authentication methods:

- Email/Phone OTP (One-Time Password) authentication
- Google OAuth authentication
- Email/Password authentication (via Supabase)

## Architecture

### Key Components

1. **Authentication Service** (`src/services/authService.ts`)
   - Handles all authentication-related API calls
   - Provides methods for signup, signin, OTP, OAuth, and session management

2. **Authentication Context** (`src/contexts/AuthContext.tsx`)
   - React Context Provider for managing global authentication state
   - Provides hooks and methods accessible throughout the application

3. **Login Modal** (`src/components/LoginModal.tsx`)
   - UI component for user login
   - Supports email/phone input and Google OAuth

4. **OTP Modal** (`src/components/OTPModal.tsx`)
   - UI component for OTP verification
   - 6-digit code input with auto-focus and paste support
   - Countdown timer and resend functionality

5. **Auth Callback Page** (`src/pages/AuthCallback.tsx`)
   - Handles OAuth redirect callbacks
   - Processes authentication tokens and establishes session

## Features

### 1. Email/Phone OTP Authentication

Users can sign in using their email address or phone number. The system will:
1. Send a one-time password to the provided contact
2. Present an OTP verification modal
3. Validate the OTP and create a session

**Implementation:**
```typescript
const { signInWithOTP } = useAuth();
await signInWithOTP('user@example.com'); // or phone number
```

### 2. Google OAuth

Users can sign in using their Google account:
1. Click "Google" button in the login modal
2. Redirected to Google authentication
3. Callback handled at `/auth/callback` route
4. Session established automatically

**Implementation:**
```typescript
const { signInWithGoogle } = useAuth();
await signInWithGoogle();
```

### 3. Session Management

The authentication context automatically:
- Persists sessions in localStorage
- Refreshes tokens automatically
- Listens for auth state changes
- Provides `user` and `session` state globally

**Usage:**
```typescript
const { user, session, isAuthenticated, isLoading } = useAuth();

if (isLoading) return <LoadingSpinner />;
if (!isAuthenticated) return <LoginPrompt />;

return <Dashboard user={user} />;
```

## File Structure

```
src/
├── services/
│   └── authService.ts          # Core authentication service
├── contexts/
│   └── AuthContext.tsx         # Auth context provider & hook
├── components/
│   ├── LoginModal.tsx          # Login UI component
│   └── OTPModal.tsx            # OTP verification UI
├── pages/
│   └── AuthCallback.tsx        # OAuth callback handler
├── integrations/
│   └── supabase/
│       ├── client.ts           # Supabase client instance
│       └── types.ts            # Database type definitions
└── App.tsx                     # Root component with AuthProvider
```

## Setup & Configuration

### Environment Variables

The following environment variables must be set in `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### Supabase Configuration

1. **Enable Authentication Providers** in Supabase Dashboard:
   - Email/Password
   - Phone (with SMS provider like Twilio)
   - Google OAuth

2. **Configure OAuth Redirect URLs**:
   - Add `http://localhost:5173/auth/callback` for development
   - Add your production URL callback for production

3. **Email Templates** (Optional):
   - Customize OTP email templates in Supabase Dashboard
   - Configure email sender settings

## API Reference

### AuthService Methods

#### `signUp({ email, password, fullName, phone })`
Create a new user account.

**Parameters:**
- `email` (string): User's email address
- `password` (string): User's password
- `fullName` (string, optional): User's full name
- `phone` (string, optional): User's phone number

**Returns:** `Promise<AuthResult>`

---

#### `signIn({ email, password })`
Sign in with email and password.

**Parameters:**
- `email` (string): User's email
- `password` (string): User's password

**Returns:** `Promise<AuthResult>`

---

#### `signInWithOTP(emailOrPhone)`
Send OTP to email or phone.

**Parameters:**
- `emailOrPhone` (string): Email address or phone number

**Returns:** `Promise<{ error: AuthError | null }>`

---

#### `verifyOTP(emailOrPhone, token)`
Verify the OTP code.

**Parameters:**
- `emailOrPhone` (string): Email or phone used to send OTP
- `token` (string): 6-digit OTP code

**Returns:** `Promise<AuthResult>`

---

#### `signInWithOAuth(provider)`
Initiate OAuth sign-in flow.

**Parameters:**
- `provider` ('google' | 'facebook' | 'github'): OAuth provider

**Returns:** `Promise<{ error: AuthError | null }>`

---

#### `signOut()`
Sign out the current user.

**Returns:** `Promise<{ error: AuthError | null }>`

---

#### `getSession()`
Get the current session.

**Returns:** `Promise<{ session: Session | null; error: AuthError | null }>`

---

#### `getCurrentUser()`
Get the current user.

**Returns:** `Promise<{ user: User | null; error: AuthError | null }>`

---

#### `resetPassword(email)`
Send password reset email.

**Parameters:**
- `email` (string): User's email

**Returns:** `Promise<{ error: AuthError | null }>`

---

#### `updatePassword(newPassword)`
Update user's password.

**Parameters:**
- `newPassword` (string): New password

**Returns:** `Promise<{ error: AuthError | null }>`

---

### useAuth Hook

The `useAuth` hook provides access to authentication state and methods:

```typescript
const {
  user,              // Current user object or null
  session,           // Current session or null
  isLoading,         // Loading state
  isAuthenticated,   // Boolean: is user authenticated
  signUp,            // Sign up method
  signIn,            // Sign in method
  signInWithOTP,     // OTP sign in method
  verifyOTP,         // OTP verification method
  signInWithGoogle,  // Google OAuth method
  signOut,           // Sign out method
  resetPassword,     // Password reset method
} = useAuth();
```

## Usage Examples

### Example 1: Check Authentication Status

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user.email}!</div>;
}
```

### Example 2: Implement Login

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await signIn(email, password);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged in successfully!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

### Example 3: OTP Flow

```typescript
import { useAuth } from '@/contexts/AuthContext';

function OTPLogin() {
  const { signInWithOTP, verifyOTP } = useAuth();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async () => {
    const { error } = await signInWithOTP(email);
    if (!error) {
      setOtpSent(true);
    }
  };

  const handleVerifyOTP = async () => {
    const { error } = await verifyOTP(email, otp);
    if (!error) {
      // User is now logged in
    }
  };

  return (
    <div>
      {!otpSent ? (
        <>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
          <button onClick={handleSendOTP}>Send OTP</button>
        </>
      ) : (
        <>
          <input value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button onClick={handleVerifyOTP}>Verify</button>
        </>
      )}
    </div>
  );
}
```

## Security Best Practices

1. **Never expose sensitive keys**: Keep `SUPABASE_SERVICE_KEY` secret. Only use `PUBLISHABLE_KEY` in frontend.

2. **Use HTTPS in production**: Ensure all authentication flows happen over HTTPS.

3. **Implement Row Level Security (RLS)**: Configure Supabase RLS policies for database access control.

4. **Validate input**: Always validate user input before sending to authentication services.

5. **Handle errors gracefully**: Don't expose sensitive error information to users.

6. **Implement rate limiting**: Prevent brute force attacks by limiting OTP requests.

## Troubleshooting

### Common Issues

**Issue: OAuth redirect not working**
- Solution: Ensure callback URL is configured in Supabase Dashboard
- Check that the route `/auth/callback` exists in your application

**Issue: OTP not received**
- Solution: Check Supabase email/SMS provider configuration
- Verify email templates are set up correctly
- Check spam folder for emails

**Issue: Session not persisting**
- Solution: Ensure localStorage is available and not blocked
- Check browser console for errors
- Verify Supabase client configuration

**Issue: TypeScript errors**
- Solution: Run `npm run build` to check for type errors
- Ensure all dependencies are installed
- Update type definitions if needed

## Testing

### Manual Testing Checklist

- [ ] Email OTP login flow
- [ ] Phone OTP login flow (if SMS configured)
- [ ] Google OAuth login
- [ ] OTP resend functionality
- [ ] Session persistence across page refreshes
- [ ] Sign out functionality
- [ ] Error handling for invalid credentials
- [ ] Loading states display correctly

### Unit Testing (Recommended)

```typescript
// Example test for auth service
import { authService } from '@/services/authService';

describe('AuthService', () => {
  it('should sign in with email and password', async () => {
    const result = await authService.signIn({
      email: 'test@example.com',
      password: 'password123'
    });
    
    expect(result.error).toBeNull();
    expect(result.user).toBeTruthy();
  });
});
```

## Future Enhancements

Potential improvements to consider:

1. **Multi-factor authentication (MFA)**: Add additional security layer
2. **Biometric authentication**: Face ID, fingerprint for mobile
3. **Social login**: Add Facebook, GitHub, Twitter OAuth
4. **Password strength validator**: Enforce strong passwords
5. **Account verification**: Email verification requirement
6. **Session management**: View and revoke active sessions
7. **Login history**: Track user login activities
8. **Remember me**: Extended session option

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs/guides/auth
- Review Supabase Auth examples: https://github.com/supabase/supabase/tree/master/examples
- Contact development team

---

**Last Updated:** 2024
**Version:** 1.0.0
