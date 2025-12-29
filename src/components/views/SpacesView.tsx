import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/auth";
import { SpaceDetailView } from "./SpaceDetailView";
import { 
  Users, 
  Plus, 
  Hash, 
  Trash2, 
  MessageSquare, 
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Space {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  members: any[];
}

import { useConfirm } from "@/components/providers/ConfirmProvider";

export function SpacesView() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [newSpaceName, setNewSpaceName] = useState("");
  const { user } = useAuthStore();
  const { confirm } = useConfirm();

  const fetchSpaces = async () => {
    try {
      const data = await api.get("/spaces");
      setSpaces(data);
    } catch (error) {
      console.error("Failed to fetch spaces:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/spaces", { name: newSpaceName });
      setShowCreateModal(false);
      setNewSpaceName("");
      fetchSpaces();
    } catch (error) {
      console.error("Failed to create space:", error);
    }
  };

  const handleDeleteSpace = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening space
    
    const isConfirmed = await confirm({
      title: "Delete Space",
      message: "Are you sure you want to delete this space? This action cannot be undone.",
      confirmText: "Delete",
      variant: "danger"
    });

    if (!isConfirmed) return;

    try {
      await api.delete(`/spaces/${id}`);
      fetchSpaces();
    } catch (error) {
      console.error("Failed to delete space:", error);
    }
  };

  if (selectedSpaceId) {
    return <SpaceDetailView spaceId={selectedSpaceId} onBack={() => setSelectedSpaceId(null)} />;
  }

  return (
    <PageContainer 
        title="Spaces" 
        description="Connect with friends and focus together."
        actions={
            <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
                <Plus size={18} />
                Create Space
            </button>
        }
    >
      {loading ? (
        <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-zinc-400" />
        </div>
      ) : spaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spaces.map(space => (
                <motion.div 
                    key={space.id}
                    layoutId={space.id}
                    onClick={() => setSelectedSpaceId(space.id)}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:shadow-lg hover:border-indigo-500/30 transition-all group cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl">
                            <Hash size={24} />
                        </div>
                        {space.owner_id === user?.id && (
                            <button 
                                onClick={(e) => handleDeleteSpace(space.id, e)}
                                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">{space.name}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Created by {space.owner_id === user?.id ? "You" : "Admin"}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                            <div className="flex items-center gap-1">
                                <Users size={16} />
                                <span>{space.members?.length || 1}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MessageSquare size={16} />
                                <span>Chat</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setSelectedSpaceId(space.id)}
                            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            Open Space
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6">
            <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-3xl flex items-center justify-center text-zinc-400">
                <Users size={48} />
            </div>
            <div className="max-w-md">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">No Spaces Yet</h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Create a space to start focusing with your friends or join an existing one.
                </p>
            </div>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800"
                >
                    <h2 className="text-2xl font-bold mb-4">Create New Space</h2>
                    <form onSubmit={handleCreateSpace}>
                        <input
                            type="text"
                            placeholder="Space Name (e.g. Study Group)"
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={newSpaceName}
                            onChange={(e) => setNewSpaceName(e.target.value)}
                            autoFocus
                        />
                        <div className="flex justify-end gap-3">
                            <button 
                                type="button"
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={!newSpaceName.trim()}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
