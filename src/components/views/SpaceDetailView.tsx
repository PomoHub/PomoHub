import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth";
import { api, WS_URL } from "@/services/api";
import { 
  Send, 
  Users, 
  ArrowLeft
} from "lucide-react";
import { cn, isMobile } from "@/lib/utils";
import { DraggableWidget } from "@/components/features/DraggableWidget";
import { SpaceIsland } from "@/components/features/SpaceIsland";
import { MessageSquare, Timer } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender: {
    username: string;
    avatar_url?: string;
  };
}

interface SpaceDetailViewProps {
  spaceId: string;
  onBack: () => void;
}

export function SpaceDetailView({ spaceId, onBack }: SpaceDetailViewProps) {
  const { user, token } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobileDevice = isMobile();

  // Widget States (Desktop)
  const [showChat, setShowChat] = useState(true);
  const [showTimer, setShowTimer] = useState(true);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await api.get(`/spaces/${spaceId}/messages`);
        // Reverse to show oldest first if API returns newest first
        setMessages(data.reverse()); 
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();
  }, [spaceId]);

  // Connect WebSocket
  useEffect(() => {
    const socket = new WebSocket(`${WS_URL}/${spaceId}?token=${token}`);

    socket.onopen = () => {
      console.log("Connected to Space Chat");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat_message") {
        setMessages((prev) => [...prev, data.payload]);
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from Space Chat");
    };

    return () => {
      socket.close();
    };
  }, [spaceId, token]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await api.post(`/spaces/${spaceId}/messages`, { content: newMessage });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // --- Mobile Layout ---
  if (isMobileDevice) {
    return (
        <div className="flex flex-col h-full bg-zinc-50 dark:bg-black relative">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-10 safe-area-pt">
            <button 
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft size={24} className="text-zinc-600 dark:text-zinc-300" />
            </button>
            <div className="flex flex-col items-center">
              <h1 className="font-bold text-zinc-900 dark:text-zinc-100">Space Chat</h1>
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Online
              </span>
            </div>
            <button className="p-2 -mr-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Users size={24} className="text-zinc-600 dark:text-zinc-300" />
            </button>
          </header>
    
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => {
              const isMe = msg.sender_id === user?.id;
              const showAvatar = index === 0 || messages[index - 1].sender_id !== msg.sender_id;
    
              return (
                <div 
                  key={msg.id || index} 
                  className={cn("flex gap-3", isMe ? "flex-row-reverse" : "flex-row")}
                >
                  {/* Avatar */}
              <div className={cn("w-8 h-8 shrink-0 flex items-end", !showAvatar && "opacity-0")}>
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {msg.sender.username[0].toUpperCase()}
                </div>
              </div>
    
                  {/* Bubble */}
                  <div className={cn(
                    "max-w-[75%] p-3 rounded-2xl text-sm shadow-sm",
                    isMe 
                      ? "bg-indigo-600 text-white rounded-br-none" 
                      : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-100 dark:border-zinc-700 rounded-bl-none"
                  )}>
                    {showAvatar && !isMe && (
                      <p className="text-xs font-bold text-indigo-500 mb-1">{msg.sender.username}</p>
                    )}
                    <p className="leading-relaxed">{msg.content}</p>
                    <span className={cn(
                      "text-[10px] block text-right mt-1 opacity-70",
                      isMe ? "text-indigo-100" : "text-zinc-400"
                    )}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
    
          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 safe-area-pb">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-full px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
              />
              <button 
                type="submit"
                className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shrink-0"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      );
  }

  // --- Desktop Layout ---
  return (
    <div className="relative h-full w-full bg-zinc-100 dark:bg-black/50 overflow-hidden">
        {/* Dynamic Island Bar */}
        <SpaceIsland 
            spaceName="Focus Room" 
            memberCount={3} 
            onLeave={onBack}
            onToggleMembers={() => {}}
            onToggleSettings={() => {}}
        />

        {/* Widgets Container */}
        <div className="absolute inset-0 p-8">
            {/* Chat Widget */}
            {showChat && (
                <DraggableWidget 
                    title="Chat" 
                    icon={MessageSquare} 
                    initialPosition={{ x: 50, y: 100 }}
                    onClose={() => setShowChat(false)}
                >
                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-3 space-y-3">
                            {messages.map((msg, index) => (
                                <div key={index} className={cn("text-sm", msg.sender_id === user?.id ? "text-right" : "text-left")}>
                                    <span className="font-bold text-xs text-zinc-500">{msg.sender.username}</span>
                                    <div className={cn(
                                        "mt-1 px-3 py-2 rounded-xl inline-block max-w-[85%]",
                                        msg.sender_id === user?.id 
                                            ? "bg-indigo-600 text-white" 
                                            : "bg-zinc-100 dark:bg-zinc-800"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-2 border-t border-zinc-200 dark:border-zinc-800">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input 
                                    className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none"
                                    placeholder="Message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="p-2 bg-indigo-600 text-white rounded-lg">
                                    <Send size={14} />
                                </button>
                            </form>
                        </div>
                    </div>
                </DraggableWidget>
            )}

            {/* Pomodoro Widget (Placeholder for now, or could duplicate logic) */}
            {showTimer && (
                <DraggableWidget
                    title="Pomodoro Log"
                    icon={Timer}
                    initialPosition={{ x: 400, y: 100 }}
                    onClose={() => setShowTimer(false)}
                >
                    <div className="p-4 flex flex-col items-center justify-center h-full text-zinc-500">
                        <p className="text-sm">Timer controls are in the top bar.</p>
                        <p className="text-xs mt-2">Use this widget for logs/stats later.</p>
                    </div>
                </DraggableWidget>
            )}
        </div>

        {/* Floating Toggle Buttons (if widgets closed) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {!showChat && (
                <button onClick={() => setShowChat(true)} className="p-3 bg-white dark:bg-zinc-800 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700">
                    <MessageSquare size={20} />
                </button>
            )}
            {!showTimer && (
                <button onClick={() => setShowTimer(true)} className="p-3 bg-white dark:bg-zinc-800 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700">
                    <Timer size={20} />
                </button>
            )}
        </div>
    </div>
  );
}
