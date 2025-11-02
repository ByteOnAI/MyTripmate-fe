import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const promoSlides = [
  {
    title: "Check-in to Savings!",
    description: "Book Your Favorite Hotel Now At Exclusive Prices.",
  },
  {
    title: "Fly Away Today!",
    description: "Get Amazing Deals on Flights Worldwide.",
  },
  {
    title: "Journey Begins Here!",
    description: "Plan Your Dream Vacation with Us.",
  },
];

export const LoginDialog = ({ open, onOpenChange }: LoginDialogProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
      
      toast.success("Redirecting to Google...");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-10 rounded-full bg-black/80 text-white hover:bg-black"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Promo Banner */}
        <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-r from-orange-50 to-blue-50 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="mb-2 text-xl font-bold text-foreground">
                {promoSlides[currentSlide].title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {promoSlides[currentSlide].description}
              </p>
            </div>
            <div className="ml-4 text-6xl">🏨</div>
          </div>
          <div className="mt-4 flex gap-2">
            {promoSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "w-6 bg-primary"
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Login Form */}
        <div className="p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold">
              Login or Create an account
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">
                Sign in to access your bookings and personalized recommendations
              </p>
            </div>

            <div className="flex justify-center gap-6">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 rounded-2xl border-2 px-8 py-4 hover:border-primary"
                onClick={handleGoogleLogin}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                  <svg viewBox="0 0 24 24" className="h-8 w-8">
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
                </div>
                <span className="text-sm font-medium">Google</span>
              </Button>

            </div>

            <p className="text-center text-xs text-muted-foreground">
              By logging in, I understand & agree to EaseMyTrip{" "}
              <a href="#" className="text-primary hover:underline">
                terms of use
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                privacy policy
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
