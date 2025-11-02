import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Minimize2, RefreshCw, Mic, Paperclip, Send, User } from "lucide-react";
import { LoginDialog } from "./LoginDialog";

interface Message {
  id: string;
  role: "agent" | "user";
  content: string;
  timestamp: string;
}

const quickActions = [
  "New Booking",
  "Booking Status",
  "Download Ticket",
  "Download Invoice",
];

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "agent",
      content: "Hi! How can we help you?",
      timestamp: new Date().toLocaleString(),
    },
    {
      id: "2",
      role: "agent",
      content: "Welcome to EaseMyTrip Support\nPlease message us below 👇",
      timestamp: new Date().toLocaleString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Mock agent response after delay
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: "Thank you for your message. Our support team is here to help you with your travel needs!",
        timestamp: new Date().toLocaleString(),
      };
      setMessages((prev) => [...prev, agentMessage]);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: action,
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: `I can help you with ${action.toLowerCase()}. Please provide more details.`,
        timestamp: new Date().toLocaleString(),
      };
      setMessages((prev) => [...prev, agentMessage]);
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-light/10 via-background to-primary/5 p-4">
      <Card className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <header className="flex items-center justify-between bg-gradient-to-r from-primary-dark to-primary-light px-6 py-4 text-primary-foreground">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white/20">
              <AvatarImage src="/placeholder.svg" alt="Virtual Agent" />
              <AvatarFallback className="bg-primary-light text-white">VA</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">EaseMyTrip Virtual Agent</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setIsLoginOpen(true)}
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <Minimize2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setMessages([])}
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto bg-background px-6 py-4">
          {messages.map((message) => (
            <div key={message.id} className="mb-6">
              <div
                className={`flex items-start gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar className="h-10 w-10 flex-shrink-0">
                  {message.role === "agent" ? (
                    <>
                      <AvatarImage src="/placeholder.svg" alt="Agent" />
                      <AvatarFallback className="bg-primary text-white">
                        VA
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="bg-muted">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div
                  className={`flex flex-col ${
                    message.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === "agent"
                        ? "bg-chat-agent-bg text-foreground"
                        : "bg-chat-user-bg text-white"
                    }`}
                    style={{
                      maxWidth: "70%",
                    }}
                  >
                    <p className="whitespace-pre-line text-sm leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                  <span className="mt-1 text-xs text-muted-foreground">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="mb-6">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src="/placeholder.svg" alt="Agent" />
                  <AvatarFallback className="bg-primary text-white">
                    VA
                  </AvatarFallback>
                </Avatar>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => (
                    <Button
                      key={action}
                      variant="outline"
                      className="h-auto whitespace-normal rounded-2xl border-2 px-6 py-3 text-sm font-medium hover:border-primary hover:bg-primary/5"
                      onClick={() => handleQuickAction(action)}
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-background px-6 py-4">
          <div className="flex items-center gap-3 rounded-full bg-secondary px-4 py-2 shadow-sm">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Write a message here."
              className="flex-1 border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 flex-shrink-0 text-muted-foreground hover:text-foreground"
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 flex-shrink-0 text-muted-foreground hover:text-foreground"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="h-10 w-10 flex-shrink-0 rounded-full bg-primary text-white hover:bg-primary-dark"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </div>
  );
};
