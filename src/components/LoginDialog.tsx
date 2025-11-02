import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";

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
  const [email, setEmail] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleContinue = () => {
    if (!email) {
      toast.error("Please enter your email or mobile number");
      return;
    }
    toast.success("Login functionality will be implemented soon!");
    onOpenChange(false);
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login will be implemented soon!`);
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
            <Input
              type="text"
              placeholder="Email ID or Mobile Number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-lg border-2 text-base"
            />

            <Button
              onClick={handleContinue}
              className="h-12 w-full rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
            >
              Continue
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-4 text-muted-foreground">
                  Or Login Via
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-6">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 rounded-2xl border-2 px-8 py-4 hover:border-primary"
                onClick={() => handleSocialLogin("Google")}
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

              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 rounded-2xl border-2 px-8 py-4 hover:border-primary"
                onClick={() => handleSocialLogin("Facebook")}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2]">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Facebook</span>
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
