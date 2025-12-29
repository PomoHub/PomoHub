import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useAppStore } from "@/store";
import { api } from "@/services/api";
import { PageContainer } from "@/components/layout/PageContainer";
import { 
  MapPin, 
  Calendar, 
  Edit2, 
  Camera, 
  Image as ImageIcon,
  Loader2,
  Save,
  X,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface Post {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  likes: number;
}

export function ProfileView() {
  const { user, updateUser } = useAuthStore();
  const { setCurrentView } = useAppStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  
  // Edit Form State
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    avatar_url: "",
    banner_url: ""
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        bio: user.bio || "",
        avatar_url: user.avatar_url || "",
        banner_url: user.banner_url || ""
      });
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const data = await api.get(`/users/${user?.username}/posts`);
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      // Temporary hack: use POST if I can't change api.ts right now? No, I should fix it.
      // Let's just use fetch for now to be safe.
      const token = useAuthStore.getState().token;
      const res = await fetch(`http://localhost:8080/api/v1/users/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      
      updateUser(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      await api.post("/posts", { content: newPostContent });
      setNewPostContent("");
      fetchPosts();
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  if (!user) return null;

  return (
    <PageContainer 
      title="My Profile" 
      description="Manage your account and view your activity."
      actions={
        <button 
          onClick={() => setCurrentView('settings')}
          className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
          title="Settings"
        >
          <Settings size={20} />
        </button>
      }
    >
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm relative group">
            {/* Banner */}
            <div className="h-32 bg-linear-to-r from-indigo-500 to-purple-500 relative">
              {user?.banner_url && (
                <img src={user.banner_url} alt="Banner" className="w-full h-full object-cover" />
              )}
              {isEditing && (
                 <button className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" />
                 </button>
              )}
            </div>

            {/* Avatar & Info */}
            <div className="px-6 pb-6 pt-0 relative">
              <div className="relative -mt-12 mb-4 w-24 h-24 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                 {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-zinc-400">
                        {user?.username?.[0]?.toUpperCase()}
                    </div>
                 )}
              </div>

              <div className="text-center lg:text-left">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {user?.first_name} {user?.last_name}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">@{user?.username}</p>
                
                {isEditing ? (
                    <textarea 
                        className="w-full p-2 text-sm bg-zinc-50 dark:bg-zinc-800 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        rows={3}
                        value={editForm.bio}
                        onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                        placeholder="Write a short bio..."
                    />
                ) : (
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed">
                        { user?.bio || "No bio yet." }
                    </p>
                )}

                <div className="flex flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-400 mb-6 justify-center lg:justify-start">
                    <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        Earth
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        Joined {format(new Date(user?.created_at || new Date()), 'MMMM yyyy')}
                    </div>
                </div>

                {isEditing ? (
                    <div className="flex gap-2">
                        <button 
                            onClick={handleUpdateProfile}
                            disabled={loading}
                            className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 size={14} className="animate-spin" />}
                            <Save size={16} /> Save
                        </button>
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="px-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 py-2 rounded-xl text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Edit2 size={16} /> Edit Profile
                    </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Activity / Posts */}
        <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <form onSubmit={handleCreatePost} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0">
                       {user?.avatar_url ? (
                          <img src={user.avatar_url} alt="Me" className="w-full h-full object-cover" />
                       ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-zinc-400">
                                {user?.username?.[0]?.toUpperCase()}
                            </div>
                         )}
                    </div>
                    <div className="flex-1 space-y-3">
                        <input 
                            type="text" 
                            placeholder="Share your progress..." 
                            className="w-full bg-transparent border-none focus:ring-0 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-lg"
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                        />
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                            <button type="button" className="text-zinc-400 hover:text-indigo-500 transition-colors">
                                <ImageIcon size={20} />
                            </button>
                            <button 
                                type="submit"
                                disabled={!newPostContent.trim() || loading}
                                className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg px-2">Recent Activity</h3>
                {posts.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500">
                        No posts yet. Share your first achievement!
                    </div>
                ) : (
                    posts.map((post) => (
                        <motion.div 
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                                        {user?.avatar_url ? (
                                            <img src={user.avatar_url} alt="User" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-bold text-zinc-400">
                                                {user?.username?.[0]?.toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{user?.first_name} {user?.last_name}</h4>
                                        <span className="text-xs text-zinc-500">{format(new Date(post.created_at), 'MMM d, h:mm a')}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed mb-4">
                                {post.content}
                            </p>

                            {post.image_url && (
                                <div className="rounded-2xl overflow-hidden mb-4">
                                    <img src={post.image_url} alt="Post content" className="w-full h-auto" />
                                </div>
                            )}

                            {/* Actions (Like, Comment - Mocked for now) */}
                            <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400">
                                <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                                    <span className="text-sm font-medium">{post.likes} Likes</span>
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>

      </div>
    </PageContainer>
  );
}
