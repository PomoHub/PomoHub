import { MessageSquare, Users, Hash, Search, Loader2, UserPlus, Newspaper } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { format } from "date-fns";

interface User {
  id: string;
  username: string;
  avatar_url?: string;
  first_name: string;
  last_name: string;
}

interface Post {
  id: string;
  content: string;
  user: User;
  created_at: string;
}

export function RightPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'feed' | 'search'>('feed');
  const [loading, setLoading] = useState(false);
  
  // Feed State
  const [posts, setPosts] = useState<Post[]>([]);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const data = await api.get('/posts/feed');
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch feed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const data = await api.get(`/users/search?q=${searchQuery}`);
      setSearchResults(data);
    } catch (error) {
      console.error("Failed to search users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (userId: string) => {
    try {
      await api.post(`/friends/request/${userId}`, {});
      alert("Friend request sent!");
    } catch (error) {
      alert("Failed to send request.");
    }
  };

  useEffect(() => {
    if (activeTab === 'feed') {
      fetchFeed();
    }
  }, [activeTab]);

  if (!isOpen) {
    return (
        <button 
            onClick={() => setIsOpen(true)}
            className="fixed right-4 bottom-4 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
        >
            <MessageSquare size={20} className="text-indigo-500" />
        </button>
    );
  }

  return (
    <aside className="w-80 h-full bg-white/50 dark:bg-zinc-900/50 border-l border-zinc-200 dark:border-zinc-800 backdrop-blur-xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Users size={16} className="text-indigo-500" />
            Social
        </h3>
        <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400"
        >
            <Hash size={14} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'feed' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}
        >
          Activity Feed
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'search' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}
        >
          Find Friends
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'feed' ? (
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-4"><Loader2 className="animate-spin text-zinc-400" /></div>
            ) : posts.length > 0 ? (
              posts.map(post => (
                <div key={post.id} className="bg-white dark:bg-zinc-800 p-3 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                      {post.user.avatar_url ? <img src={post.user.avatar_url} className="w-full h-full rounded-full object-cover"/> : post.user.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{post.user.username}</p>
                      <p className="text-xs text-zinc-500">{format(new Date(post.created_at), 'MMM d, h:mm a')}</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">{post.content}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-zinc-500 py-8 text-sm">
                <Newspaper className="mx-auto mb-2 opacity-50" />
                No updates yet. Add friends to see their activity!
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Search username or email..." 
                className="w-full pl-9 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <div className="space-y-2">
              {loading ? (
                 <div className="flex justify-center py-4"><Loader2 className="animate-spin text-zinc-400" /></div>
              ) : searchResults.length > 0 ? (
                searchResults.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate w-24">{user.username}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAddFriend(user.id)}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors"
                      title="Add Friend"
                    >
                      <UserPlus size={16} />
                    </button>
                  </div>
                ))
              ) : searchQuery && (
                <div className="text-center text-zinc-500 text-sm py-4">No users found.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
