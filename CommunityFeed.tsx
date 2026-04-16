import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Image as ImageIcon, 
  Send, 
  MoreVertical,
  User as UserIcon,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { CommunityPost } from '../types';
import { Card } from './Card';
import { Button } from './Button';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const CommunityFeed: React.FC = () => {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommunityPost));
      setPosts(postsData);
    });
    return unsubscribe;
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !profile) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'posts'), {
        userId: profile.uid,
        userName: profile.fullName,
        userPhoto: profile.bodyPhoto || '',
        content: newPost,
        type: 'text',
        likes: [],
        comments: [],
        createdAt: new Date().toISOString()
      });
      setNewPost('');
    } catch (error) {
      console.error("Error posting:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string, likes: string[]) => {
    if (!profile) return;
    const postRef = doc(db, 'posts', postId);
    const isLiked = likes.includes(profile.uid);
    
    await updateDoc(postRef, {
      likes: isLiked ? arrayRemove(profile.uid) : arrayUnion(profile.uid)
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Create Post */}
      <Card className="p-6">
        <form onSubmit={handlePost} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-700 border border-zinc-800">
              <UserIcon size={24} />
            </div>
            <textarea 
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="O que está treinando hoje?"
              className="flex-1 bg-transparent border-none resize-none outline-none text-sm py-2 min-h-[80px]"
            />
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
            <button type="button" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
              <ImageIcon size={18} />
              <span>Foto</span>
            </button>
            <Button 
              type="submit" 
              variant="primary" 
              className="px-6 py-2 text-xs"
              disabled={!newPost.trim()}
              loading={loading}
            >
              Postar
            </Button>
          </div>
        </form>
      </Card>

      {/* Posts List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
            >
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-700 border border-zinc-800 overflow-hidden">
                      {post.userPhoto ? (
                        <img src={post.userPhoto} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <UserIcon size={20} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm">{post.userName}</p>
                        {post.type === 'workout_complete' && (
                          <CheckCircle2 size={14} className="text-emerald-500" />
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-500 font-medium">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-zinc-700 hover:text-white transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-zinc-300 leading-relaxed">{post.content}</p>
                  {post.mediaUrl && (
                    <div className="rounded-2xl overflow-hidden border border-zinc-900">
                      <img src={post.mediaUrl} alt="" className="w-full h-auto" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  {post.type === 'achievement' && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
                      <Trophy className="text-amber-500" size={24} />
                      <div>
                        <p className="text-xs font-black text-amber-500 uppercase tracking-widest">Nova Conquista!</p>
                        <p className="text-sm font-bold">Desbloqueou o Badge de Consistência</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-zinc-900">
                  <button 
                    onClick={() => handleLike(post.id!, post.likes)}
                    className={cn(
                      "flex items-center gap-2 transition-all",
                      post.likes.includes(profile?.uid || '') ? "text-rose-500" : "text-zinc-500 hover:text-white"
                    )}
                  >
                    <Heart size={20} fill={post.likes.includes(profile?.uid || '') ? "currentColor" : "none"} />
                    <span className="text-xs font-bold">{post.likes.length}</span>
                  </button>
                  <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all">
                    <MessageSquare size={20} />
                    <span className="text-xs font-bold">{post.comments?.length || 0}</span>
                  </button>
                  <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all ml-auto">
                    <Share2 size={20} />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
