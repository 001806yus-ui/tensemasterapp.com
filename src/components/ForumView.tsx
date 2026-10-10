import React, { useState, useEffect } from 'react';
import { ForumPost, ForumReply } from '../types';
import { INITIAL_FORUM_POSTS } from '../data/forumData';
import { useUser } from '../context/UserContext';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  MessageSquare,
  Search,
  Plus,
  ThumbsUp,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Trophy,
  Filter,
  Send,
  X,
  Share2,
  Bookmark,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';

const FORUM_STORAGE_KEY = 'tensemaster_forum_posts_v1';
const LIKED_STORAGE_KEY = 'tensemaster_forum_liked_posts';

interface ForumViewProps {
  onOpenTenseDetail?: (tenseId: string) => void;
}

export const ForumView: React.FC<ForumViewProps> = ({ onOpenTenseDetail }) => {
  const { progressState, logDailyPractice } = useUser();
  const [posts, setPosts] = useState<ForumPost[]>(() => {
    try {
      const saved = localStorage.getItem(FORUM_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_FORUM_POSTS;
  });

  const [likedPostIds, setLikedPostIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LIKED_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tenses' | 'common-mistakes' | 'challenges' | 'study-tips'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'unsolved'>('popular');
  const [activePost, setActivePost] = useState<ForumPost | null>(null);

  // New Question Modal State
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'tenses' | 'common-mistakes' | 'challenges' | 'study-tips'>('tenses');
  const [newContent, setNewContent] = useState('');
  const [newTenseTag, setNewTenseTag] = useState('present-perfect');

  // Reply text state
  const [replyText, setReplyText] = useState('');

  // Persist posts
  useEffect(() => {
    try {
      localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(posts));
    } catch (e) {}
  }, [posts]);

  // Persist likes
  useEffect(() => {
    try {
      localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(likedPostIds));
    } catch (e) {}
  }, [likedPostIds]);

  const handleLikePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    const isLiked = likedPostIds.includes(postId);
    const updatedLikes = isLiked
      ? likedPostIds.filter((id) => id !== postId)
      : [...likedPostIds, postId];

    setLikedPostIds(updatedLikes);

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newVotes = isLiked ? Math.max(0, post.upvotes - 1) : post.upvotes + 1;
          return { ...post, upvotes: newVotes };
        }
        return post;
      })
    );

    if (activePost && activePost.id === postId) {
      setActivePost((prev) =>
        prev
          ? {
              ...prev,
              upvotes: isLiked ? Math.max(0, prev.upvotes - 1) : prev.upvotes + 1
            }
          : null
      );
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    sounds.playCorrect();
    confetti({ particleCount: 30, spread: 50 });

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      authorName: progressState.userName || 'Tú (Estudiante)',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      authorCountry: 'España / Latam',
      authorLevel: 'B1',
      category: newCategory,
      tenseTag: newTenseTag,
      createdAt: 'Justo ahora',
      upvotes: 1,
      views: 1,
      isSolved: false,
      replies: []
    };

    setPosts([newPost, ...posts]);
    setLikedPostIds([...likedPostIds, newPost.id]);
    setIsNewPostModalOpen(false);
    setNewTitle('');
    setNewContent('');

    // Reward user with 25 XP for community participation
    logDailyPractice(25);
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activePost) return;

    sounds.playCorrect();
    const newReply: ForumReply = {
      id: `rep-${Date.now()}`,
      authorName: progressState.userName || 'Tú (Estudiante)',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      authorLevel: 'B1',
      content: replyText.trim(),
      createdAt: 'Justo ahora',
      upvotes: 0
    };

    const updatedPost = {
      ...activePost,
      replies: [...activePost.replies, newReply]
    };

    setActivePost(updatedPost);
    setPosts((prev) => prev.map((p) => (p.id === activePost.id ? updatedPost : p)));
    setReplyText('');

    // Reward user with 15 XP for replying
    logDailyPractice(15);
  };

  // Filter & Sort
  const filteredPosts = posts
    .filter((post) => {
      if (selectedCategory !== 'all' && post.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(q) ||
          post.content.toLowerCase().includes(q) ||
          (post.tenseTag && post.tenseTag.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.upvotes - a.upvotes;
      if (sortBy === 'unsolved') return (a.isSolved ? 1 : 0) - (b.isSolved ? 1 : 0);
      return 0; // Default recent
    });

  const getCategoryBadge = (cat: ForumPost['category']) => {
    switch (cat) {
      case 'tenses':
        return { label: 'Tiempos Verbales', bg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
      case 'common-mistakes':
        return { label: 'Errores & Falsos Amigos', bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' };
      case 'challenges':
        return { label: 'Reto de Oraciones', bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
      case 'study-tips':
        return { label: 'Consejos de Estudio', bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
      default:
        return { label: 'General', bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden border border-indigo-800/50">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-300" />
                Comunidad Activa 24/7
              </span>
              <span className="text-xs text-indigo-300/80">
                +1,200 hispanohablantes aprendiendo juntos
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight text-white">
              Foro & Consultorio Gramatical
            </h1>
            <p className="text-sm sm:text-base text-indigo-200/90 mt-2 max-w-2xl">
              Resuelve tus dudas sobre los 12 tiempos en minutos. Comparte tus oraciones, descubre errores que cometen otros nativos de español y gana XP ayudando a la comunidad.
            </p>
          </div>

          <button
            onClick={() => setIsNewPostModalOpen(true)}
            className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Hacer una Pregunta (+25 XP)</span>
          </button>
        </div>

        {/* Quick stats ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-indigo-800/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-indigo-200 font-medium">94% de dudas resueltas</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-indigo-200 font-medium">+15 XP por cada respuesta</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-300" />
            <span className="text-indigo-200 font-medium">Revisión por profesores C2</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-indigo-200 font-medium">Sin spam ni juicios</span>
          </div>
        </div>
      </div>

      {/* Main Forum Content: Split view or list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left side: Posts List & Filters */}
        <div className={`${activePost ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-5 transition-all`}>
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar dudas (ej: 'present perfect', 'since vs for', 'interviews')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'popular' | 'recent' | 'unsolved')}
                  className="px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-hidden"
                >
                  <option value="popular">🔥 Más Populares</option>
                  <option value="recent">⚡ Más Recientes</option>
                  <option value="unsolved">❓ Sin Resolver</option>
                </select>
              </div>
            </div>

            {/* Category Tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Todas las Discusiones ({posts.length})
              </button>
              <button
                onClick={() => setSelectedCategory('tenses')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === 'tenses'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                🗣️ Dudas de Tiempos
              </button>
              <button
                onClick={() => setSelectedCategory('common-mistakes')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === 'common-mistakes'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                ⚠️ Errores Frecuentes
              </button>
              <button
                onClick={() => setSelectedCategory('challenges')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === 'challenges'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                🎯 Retos de Oraciones
              </button>
              <button
                onClick={() => setSelectedCategory('study-tips')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === 'study-tips'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                💡 Consejos & Hábitos
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-3">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
                <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  No se encontraron preguntas coincidentes
                </h3>
                <p className="text-xs text-slate-500">
                  Sé el primero en preguntar sobre este tema.
                </p>
                <button
                  onClick={() => setIsNewPostModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Crear Nueva Pregunta
                </button>
              </div>
            ) : (
              filteredPosts.map((post) => {
                const categoryStyle = getCategoryBadge(post.category);
                const isSelected = activePost?.id === post.id;
                const isLiked = likedPostIds.includes(post.id);

                return (
                  <div
                    key={post.id}
                    onClick={() => {
                      sounds.playClick();
                      setActivePost(post);
                    }}
                    className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 p-5 cursor-pointer hover:shadow-md ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20 dark:border-indigo-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryStyle.bg}`}>
                            {categoryStyle.label}
                          </span>
                          {post.isSolved && (
                            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3" /> Resuelta
                            </span>
                          )}
                          {post.tenseTag && (
                            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-sm">
                              #{post.tenseTag}
                            </span>
                          )}
                          <span className="text-xs text-slate-400 ml-auto flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {post.createdAt}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                          {post.content}
                        </p>

                        {/* Author info & metrics */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                          <div className="flex items-center gap-2">
                            <img
                              src={post.authorAvatar}
                              alt={post.authorName}
                              className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            />
                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                              {post.authorName}
                            </span>
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded-sm font-mono">
                              {post.authorLevel}
                            </span>
                            <span className="text-slate-400 hidden sm:inline">
                              · {post.authorCountry}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => handleLikePost(post.id, e)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                isLiked
                                  ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                              title="Votar como útil"
                            >
                              <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-indigo-600' : ''}`} />
                              <span>{post.upvotes}</span>
                            </button>

                            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>{post.replies.length}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right side: Detailed Discussion Thread View */}
        {activePost && (
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 h-fit sticky top-20 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Hilo de Discusión
              </span>
              <button
                onClick={() => setActivePost(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-1 space-y-4 my-4">
              {/* Main question box */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={activePost.authorAvatar}
                    alt={activePost.authorName}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {activePost.authorName}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Nivel {activePost.authorLevel} · {activePost.authorCountry}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {activePost.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-2 whitespace-pre-line leading-relaxed">
                  {activePost.content}
                </p>

                {activePost.tenseTag && onOpenTenseDetail && (
                  <button
                    onClick={() => onOpenTenseDetail(activePost.tenseTag!)}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    <span>Repasar lección de #{activePost.tenseTag}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Replies Header */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {activePost.replies.length} Respuestas de la Comunidad
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> +15 XP por responder
                </span>
              </div>

              {/* Replies List */}
              <div className="space-y-3">
                {activePost.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`p-4 rounded-2xl border ${
                      reply.isAcceptedSolution
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={reply.authorAvatar}
                          alt={reply.authorName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {reply.authorName}
                            </span>
                            {reply.authorBadge && (
                              <span className="text-[9px] bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.2 rounded-full font-bold">
                                {reply.authorBadge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Nivel {reply.authorLevel} · {reply.createdAt}
                          </span>
                        </div>
                      </div>

                      {reply.isAcceptedSolution && (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Solución Destacada
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Reply Form */}
            <form onSubmit={handleAddReply} className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Escribe tu respuesta o explicación..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition-transform active:scale-95 cursor-pointer"
                  title="Enviar respuesta"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* New Question Modal */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Hacer una Pregunta en la Comunidad
                  </h3>
                  <p className="text-xs text-slate-500">
                    Recibe respuestas de estudiantes y profesores de inglés
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsNewPostModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Título de tu duda o tema *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: ¿Cuándo usar Past Simple vs Present Perfect con 'for'?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ForumPost['category'])}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="tenses">🗣️ Dudas de Tiempos Verbales</option>
                    <option value="common-mistakes">⚠️ Errores Frecuentes & Falsos Amigos</option>
                    <option value="challenges">🎯 Retos de Oraciones</option>
                    <option value="study-tips">💡 Consejos de Aprendizaje</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tiempo verbal relacionado
                  </label>
                  <select
                    value={newTenseTag}
                    onChange={(e) => setNewTenseTag(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="present-simple">Present Simple</option>
                    <option value="present-continuous">Present Continuous</option>
                    <option value="present-perfect">Present Perfect</option>
                    <option value="past-simple">Past Simple</option>
                    <option value="past-continuous">Past Continuous</option>
                    <option value="past-perfect">Past Perfect</option>
                    <option value="future-simple">Future Simple (Will)</option>
                    <option value="general">Varios / General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Explicación o ejemplo concreto *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explica qué frase te genera dudas, qué contexto intentas expresar o qué regla no te queda clara..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Ganarás +25 XP
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewPostModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    Publicar Pregunta
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
