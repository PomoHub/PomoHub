import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth";
import { api, WS_URL } from "@/services/api";
import { 
  Send, 
  Users, 
  ArrowLeft,
  Smartphone
} from "lucide-react";
import { cn, isMobile } from "@/lib/utils";
import { DraggableWidget } from "@/components/features/DraggableWidget";
import { SpaceIsland } from "@/components/features/SpaceIsland";
import { SpaceMembersModal } from "@/components/features/spaces/SpaceMembersModal";
import { SpaceSettingsModal } from "@/components/features/spaces/SpaceSettingsModal";
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

interface SpaceMember {
  user_id: string;
  role: 'admin' | 'member';
  user: {
    username: string;
    avatar_url?: string;
  }
}

interface Space {
  id: string;
  name: string;
  owner_id: string;
  members: SpaceMember[];
}

interface SpaceDetailViewProps {
  spaceId: string;
  onBack: () => void;
}

export function SpaceDetailView({ spaceId, onBack }: SpaceDetailViewProps) {
  const { user, token } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [space, setSpace] = useState<Space | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobileDevice = isMobile();
  const [isLandscape, setIsLandscape] = useState(true);

  // Modal States
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Widget States (Desktop)
  const [showChat, setShowChat] = useState(true);
  const [showTimer, setShowTimer] = useState(true);

  // Mobile Landscape Check
  useEffect(() => {
    if (!isMobileDevice) return;

    const checkOrientation = () => {
      // Simple check: width > height implies landscape-ish or at least wide enough
      if (window.screen.orientation) {
        setIsLandscape(window.screen.orientation.type.includes('landscape'));
      } else {
        setIsLandscape(window.innerWidth > window.innerHeight);
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, [isMobileDevice]);

  // Fetch Space Details
  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const data = await api.get(`/spaces/${spaceId}`);
        setSpace(data);
      } catch (error) {
        console.error("Failed to fetch space details:", error);
      }
    };
    fetchSpace();
  }, [spaceId]);

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

  const handleRemoveMember = async (userId: string) => {
    try {
      await api.delete(`/spaces/${spaceId}/members/${userId}`);
      // Refresh space details to update list
      const data = await api.get(`/spaces/${spaceId}`);
      setSpace(data);
    } catch (error) {
      console.error("Failed to remove member:", error);
      alert("Failed to remove member");
    }
  };

  const handleLeaveSpace = async () => {
    if (!user) return;
    try {
      await api.delete(`/spaces/${spaceId}/members/${user.id}`);
      onBack(); // Go back to dashboard
    } catch (error) {
      console.error("Failed to leave space:", error);
      alert("Failed to leave space");
    }
  };

  const handleDeleteSpace = async () => {
    try {
      await api.delete(`/spaces/${spaceId}`);
      onBack(); // Go back to dashboard
    } catch (error) {
      console.error("Failed to delete space:", error);
      alert("Failed to delete space");
    }
  };

  // --- Mobile Landscape Enforcer ---
  if (isMobileDevice && !isLandscape) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-zinc-950 text-white p-8 text-center space-y-6">
        <div className="relative w-32 h-32">
           <div className="absolute inset-0 border-4 border-zinc-700 rounded-2xl animate-[spin_3s_linear_infinite]"></div>
           <Smartphone className="absolute inset-0 m-auto text-zinc-500 animate-[pulse_2s_ease-in-out_infinite]" size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Please Rotate Your Device</h2>
          <p className="text-zinc-400">
            Social Spaces require a landscape view for the best experience.
          </p>
        </div>
      </div>
    );
  }

  // --- Mobile Layout (Landscape) ---
  if (isMobileDevice) {
    // Reuse Desktop Layout for Mobile Landscape but maybe scaled or adjusted
    // Actually, user asked to "apply desktop spaces page to mobile". 
    // So we will use the "Desktop Layout" code block below for both, 
    // but maybe tweak styles if needed.
  }

  // --- Universal Layout (Desktop + Mobile Landscape) ---
  return (
    <div className="relative h-full w-full bg-zinc-100 dark:bg-black/50 overflow-hidden">
        {/* Dynamic Island Bar */}
        <SpaceIsland 
            spaceName={space?.name || "Loading..."} 
            memberCount={space?.members?.length || 0} 
            onLeave={onBack}
            onToggleMembers={() => setIsMembersModalOpen(true)}
            onToggleSettings={() => setIsSettingsModalOpen(true)}
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

        {/* Modals */}
        <SpaceMembersModal 
            isOpen={isMembersModalOpen}
            onClose={() => setIsMembersModalOpen(false)}
            members={space?.members || []}
            currentUserId={user?.id || ""}
            isOwner={space?.owner_id === user?.id}
            onRemoveMember={handleRemoveMember}
        />

        <SpaceSettingsModal 
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            spaceName={space?.name || ""}
            isOwner={space?.owner_id === user?.id}
            onDeleteSpace={handleDeleteSpace}
            onLeaveSpace={handleLeaveSpace}
        />
    </div>
  );
}
