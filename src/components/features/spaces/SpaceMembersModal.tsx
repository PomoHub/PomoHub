import { X, UserMinus, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useConfirm } from "@/components/providers/ConfirmProvider";

interface SpaceMember {
  user_id: string;
  role: 'admin' | 'member';
  user: {
    username: string;
    avatar_url?: string;
  }
}

interface SpaceMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: SpaceMember[];
  currentUserId: string;
  isOwner: boolean;
  onRemoveMember: (userId: string) => void;
}

export function SpaceMembersModal({
  isOpen,
  onClose,
  members,
  currentUserId,
  isOwner,
  onRemoveMember
}: SpaceMembersModalProps) {
  const { confirm } = useConfirm();
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
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <h2 className="text-lg font-semibold text-white">Space Members</h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* List */}
              <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
                {members.map((member) => (
                  <div 
                    key={member.user_id}
                    className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl border border-zinc-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                        {member.user.avatar_url ? (
                          <img src={member.user.avatar_url} alt={member.user.username} className="w-full h-full rounded-full object-cover" />
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
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
