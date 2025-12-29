import { X, UserMinus, Shield, UserPlus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useConfirm } from "@/components/providers/ConfirmProvider";
import { useState, useEffect } from "react";
import { api } from "@/services/api";

interface SpaceMember {
  user_id: string;
  role: 'admin' | 'member';
  user: {
    username: string;
    avatar_url?: string;
  }
}

interface Friend {
  id: string;
  username: string;
  avatar_url?: string;
}

interface SpaceMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: SpaceMember[];
  currentUserId: string;
  isOwner: boolean;
  onRemoveMember: (userId: string) => void;
  onAddMember?: (userId: string) => Promise<void>;
}

export function SpaceMembersModal({
  isOpen,
  onClose,
  members,
  currentUserId,
  isOwner,
  onRemoveMember,
  onAddMember
}: SpaceMembersModalProps) {
  const { confirm } = useConfirm();
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setActiveTab('list');
    }
  }, [isOpen]);

  useEffect(() => {
    if (activeTab === 'add' && isOpen) {
        fetchFriends();
    }
  }, [activeTab, isOpen]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
        const data = await api.get('/friends');
        // Filter out existing members
        const existingMemberIds = new Set(members.map(m => m.user_id));
        const availableFriends = data.filter((f: Friend) => !existingMemberIds.has(f.id));
        setFriends(availableFriends);
    } catch (error) {
        console.error("Failed to fetch friends:", error);
    } finally {
        setLoading(false);
    }
  };

  const handleAdd = async (userId: string) => {
      if (onAddMember) {
          await onAddMember(userId);
          // Refresh list (remove added user)
          setFriends(prev => prev.filter(f => f.id !== userId));
      }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-4"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[70vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800 shrink-0">
                <h2 className="text-lg font-semibold text-white">Space Members</h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              {isOwner && (
                  <div className="flex border-b border-zinc-800 shrink-0">
                      <button 
                        onClick={() => setActiveTab('list')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'list' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                          Members ({members.length})
                      </button>
                      <button 
                        onClick={() => setActiveTab('add')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'add' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                          Add Member
                      </button>
                  </div>
              )}

              {/* List */}
              <div className="overflow-y-auto p-4 space-y-3 min-h-[200px]">
                {activeTab === 'list' ? (
                    <>
                        {members.map((member) => (
                        <div 
                            key={member.user_id}
                            className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl border border-zinc-800/50"
                        >
                            <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                                {member.user.avatar_url ? (
                                <img src={member.user.avatar_url} alt={member.user.username} className="w-full h-full object-cover" />
                                ) : (
                                member.user.username.substring(0, 2).toUpperCase()
                                )}
                            </div>
                            <div>
                                <div className="font-medium text-white flex items-center gap-2">
                                {member.user.username}
                                {member.role === 'admin' && (
                                    <Shield size={14} className="text-yellow-500" fill="currentColor" />
                                )}
                                </div>
                                <div className="text-xs text-zinc-500 capitalize">{member.role}</div>
                            </div>
                            </div>

                            {/* Actions */}
                            {isOwner && member.user_id !== currentUserId && (
                            <button
                                onClick={async () => {
                                    const isConfirmed = await confirm({
                                        title: "Remove Member",
                                        message: `Are you sure you want to remove ${member.user.username} from the space?`,
                                        confirmText: "Remove",
                                        variant: "danger"
                                    });
                                    if (isConfirmed) {
                                        onRemoveMember(member.user_id);
                                    }
                                }}
                                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                title="Remove Member"
                            >
                                <UserMinus size={18} />
                            </button>
                            )}
                        </div>
                        ))}

                        {members.length === 0 && (
                        <div className="text-center py-8 text-zinc-500">
                            No members found.
                        </div>
                        )}
                    </>
                ) : (
                    <>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="animate-spin text-zinc-500" />
                            </div>
                        ) : friends.length > 0 ? (
                            friends.map((friend) => (
                                <div 
                                    key={friend.id}
                                    className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl border border-zinc-800/50"
                                >
                                    <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                                        {friend.avatar_url ? (
                                        <img src={friend.avatar_url} alt={friend.username} className="w-full h-full object-cover" />
                                        ) : (
                                        friend.username.substring(0, 2).toUpperCase()
                                        )}
                                    </div>
                                    <div className="font-medium text-white">
                                        {friend.username}
                                    </div>
                                    </div>

                                    <button
                                        onClick={() => handleAdd(friend.id)}
                                        className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors"
                                        title="Add to Space"
                                    >
                                        <UserPlus size={18} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-zinc-500">
                                <p>No friends available to add.</p>
                                <p className="text-xs mt-1 opacity-70">Add friends from the Social tab first.</p>
                            </div>
                        )}
                    </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
