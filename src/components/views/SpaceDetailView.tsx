import { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/store";
import { useAuthStore } from "@/store/auth";
import { api, WS_URL } from "@/services/api";
import { 
  Send
} from "lucide-react";
import { cn, isMobile } from "@/lib/utils";
import { DraggableWidget } from "@/components/features/DraggableWidget";
import { SpaceIsland } from "@/components/features/SpaceIsland";
import { SpaceMembersModal } from "@/components/features/spaces/SpaceMembersModal";
import { SpaceSettingsModal } from "@/components/features/spaces/SpaceSettingsModal";
import { Pomodoro } from "@/components/features/Pomodoro";
import { MessageSquare, Timer, StickyNote } from "lucide-react";
import { PomodoroSettings, usePomodoro } from "@/hooks/usePomodoro";

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
  pomodoro_work_duration?: number;
  pomodoro_short_break_duration?: number;
  pomodoro_long_break_duration?: number;
  pomodoro_rounds?: number;
}

interface SpaceDetailViewProps {
  spaceId: string;
  onBack: () => void;
}

export function SpaceDetailView({ spaceId, onBack }: SpaceDetailViewProps) {
  const { user, token } = useAuthStore();
  const { setIsSpaceDetailOpen } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [space, setSpace] = useState<Space | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobileDevice = isMobile();

  // Manage Nav Bar visibility
  useEffect(() => {
    if (isMobileDevice) {
        setIsSpaceDetailOpen(true);
        return () => setIsSpaceDetailOpen(false);
    }
  }, [isMobileDevice, setIsSpaceDetailOpen]);

  // Modal States
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Widget States (Desktop)
  const [showChat, setShowChat] = useState(true);
  const [showTimer, setShowTimer] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  const [notesContent, setNotesContent] = useState(""); // Simple local notes for now

  const pomodoro = usePomodoro({
    initialSettings: {
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4,
      autoStartBreaks: false,
      autoStartPomodoros: false,
    }
  });

  // Sync Space Settings to Pomodoro Hook
  useEffect(() => {
    if (space) {
        // Only update if values are valid numbers
        const newSettings = {
            workDuration: typeof space.pomodoro_work_duration === 'number' ? space.pomodoro_work_duration : 25,
            shortBreakDuration: typeof space.pomodoro_short_break_duration === 'number' ? space.pomodoro_short_break_duration : 5,
            longBreakDuration: typeof space.pomodoro_long_break_duration === 'number' ? space.pomodoro_long_break_duration : 15,
            longBreakInterval: typeof space.pomodoro_rounds === 'number' ? space.pomodoro_rounds : 4,
            autoStartBreaks: false,
            autoStartPomodoros: false
        };
        pomodoro.updateSettings(newSettings);
    }
  }, [space?.pomodoro_work_duration, space?.pomodoro_short_break_duration, space?.pomodoro_long_break_duration, space?.pomodoro_rounds]);

  // Fetch Space Details
  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const data = await api.get(`/spaces/${spaceId}`);
        if (data) {
            setSpace(data);
        }
      } catch (error) {
        console.error("Failed to fetch space details:", error);
      }
    };
    if (spaceId) {
        fetchSpace();
    }
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

  const handleAddMember = async (userId: string) => {
    try {
      await api.post(`/spaces/${spaceId}/members`, { user_id: userId });
      // Refresh space data
      const data = await api.get(`/spaces/${spaceId}`);
      setSpace(data);
    } catch (error) {
      console.error("Failed to add member:", error);
      alert("Failed to add member");
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

  const handlePomodoroSettingsChange = async (newSettings: PomodoroSettings) => {
    if (!space) return;
    try {
        await api.put(`/spaces/${space.id}`, {
            pomodoro_work_duration: newSettings.workDuration,
            pomodoro_short_break_duration: newSettings.shortBreakDuration,
            pomodoro_long_break_duration: newSettings.longBreakDuration,
            pomodoro_rounds: newSettings.longBreakInterval
        });
        
        // Update local hook immediately
        pomodoro.updateSettings(newSettings);

        // Optimistic update
        setSpace(prev => prev ? ({
            ...prev,
            pomodoro_work_duration: newSettings.workDuration,
            pomodoro_short_break_duration: newSettings.shortBreakDuration,
            pomodoro_long_break_duration: newSettings.longBreakDuration,
            pomodoro_rounds: newSettings.longBreakInterval
        }) : null);
    } catch (e) {
        console.error("Failed to update space settings:", e);
    }
  };

  // --- Universal Layout ---
  return (
    <div className="relative h-full w-full bg-zinc-100 dark:bg-black/50 overflow-hidden flex flex-col">
        {/* Dynamic Island Bar */}
        <SpaceIsland 
            spaceName={space?.name || "Loading..."} 
            memberCount={space?.members?.length || 0} 
            onLeave={onBack}
            onToggleMembers={() => setIsMembersModalOpen(true)}
            onToggleSettings={() => setIsSettingsModalOpen(true)}
            timerState={{
                timeLeft: pomodoro.timeLeft,
                isActive: pomodoro.isActive,
                toggleTimer: pomodoro.toggleTimer
            }}
        />

        {/* Widgets Container */}
        {isMobileDevice ? (
          // Mobile: Vertical Stack
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 safe-area-pt pt-20">
              {/* Timer First on Mobile */}
              {space && (
                 <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-4">
                     <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                        <Timer size={18} /> Focus Timer
                     </h3>
                     <Pomodoro 
                          spaceId={spaceId}
                          externalState={pomodoro}
                          onSettingsChange={handlePomodoroSettingsChange}
                      />
                 </div>
              )}

              {/* Chat Second */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 h-96 flex flex-col">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                      <MessageSquare size={18} /> Chat
                  </h3>
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

              {/* Notes Last */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 h-48 flex flex-col">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                      <StickyNote size={18} /> Notes
                  </h3>
                  <textarea 
                      className="w-full h-full p-4 bg-transparent resize-none focus:outline-none text-zinc-700 dark:text-zinc-300 text-sm"
                      placeholder="Shared notes..."
                      value={notesContent}
                      onChange={(e) => setNotesContent(e.target.value)}
                  />
              </div>
          </div>
        ) : (
          // Desktop: Draggable Widgets
          <div className="absolute inset-0 p-8">
            {/* Chat Widget */}
            {showChat && (
                <DraggableWidget 
                    title="Chat" 
                    icon={MessageSquare} 
                    initialPosition={{ x: 50, y: 100 }}
                    onClose={() => setShowChat(false)}
                    className="w-80 h-96"
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

            {/* Pomodoro Timer Widget */}
            {showTimer && space && (
                <DraggableWidget
                    title="Focus Timer"
                    icon={Timer}
                    initialPosition={{ x: 400, y: 100 }}
                    onClose={() => setShowTimer(false)}
                    className="w-96 h-auto"
                >
                    <div className="p-4">
                        <Pomodoro 
                            spaceId={spaceId}
                            externalState={pomodoro}
                            onSettingsChange={handlePomodoroSettingsChange}
                        />
                    </div>
                </DraggableWidget>
            )}

            {/* Notes Widget */}
            {showNotes && (
                <DraggableWidget
                    title="Space Notes"
                    icon={StickyNote}
                    initialPosition={{ x: 750, y: 100 }}
                    onClose={() => setShowNotes(false)}
                    className="w-80 h-80"
                >
                    <textarea 
                        className="w-full h-full p-4 bg-transparent resize-none focus:outline-none text-zinc-700 dark:text-zinc-300 text-sm"
                        placeholder="Shared notes..."
                        value={notesContent}
                        onChange={(e) => setNotesContent(e.target.value)}
                    />
                </DraggableWidget>
            )}
          </div>
        )}

        {/* Floating Toggle Buttons (if widgets closed - Desktop Only) */}
        {!isMobileDevice && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-40">
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
              {!showNotes && (
                  <button onClick={() => setShowNotes(true)} className="p-3 bg-white dark:bg-zinc-800 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700">
                      <StickyNote size={20} />
                  </button>
              )}
          </div>
        )}

        {/* Modals */}
        <SpaceMembersModal 
            isOpen={isMembersModalOpen}
            onClose={() => setIsMembersModalOpen(false)}
            members={space?.members || []}
            currentUserId={user?.id || ""}
            isOwner={space?.owner_id === user?.id}
            onRemoveMember={handleRemoveMember}
            onAddMember={handleAddMember}
        />

        <SpaceSettingsModal 
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            spaceName={space?.name || ""}
            isOwner={space?.owner_id === user?.id}
            onDeleteSpace={handleDeleteSpace}
            onLeaveSpace={handleLeaveSpace}
            pomodoroSettings={{
                workDuration: space?.pomodoro_work_duration || 25,
                shortBreakDuration: space?.pomodoro_short_break_duration || 5,
                longBreakDuration: space?.pomodoro_long_break_duration || 15,
                longBreakInterval: space?.pomodoro_rounds || 4,
                autoStartBreaks: false,
                autoStartPomodoros: false
            }}
            onUpdatePomodoroSettings={handlePomodoroSettingsChange}
        />
    </div>
  );
}
