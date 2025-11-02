import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash fragment from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        if (error) {
          console.error('Auth callback error:', error, errorDescription);
          toast.error(errorDescription || 'Authentication failed');
          navigate('/', { replace: true });
          return;
        }

        if (accessToken) {
          // Session is automatically set by Supabase client
          const { data, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Session error:', sessionError);
            toast.error('Failed to establish session');
            navigate('/', { replace: true });
            return;
          }

          if (data.session) {
            toast.success('Successfully signed in!');
            navigate('/', { replace: true });
          } else {
            toast.error('No session found');
            navigate('/', { replace: true });
          }
        } else {
          // No access token found, redirect to home
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        toast.error('An unexpected error occurred');
        navigate('/', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing Sign In</h2>
        <p className="text-gray-600">Please wait while we finish setting up your account...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
