import { useLocalization } from "../i18n/LocalizationContext";
import React, { useState, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { INITIAL_LEADERBOARD_USERS } from '../data/leaderboardData';
import { LeaderboardUser } from '../types';
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  ArrowUp,
  CheckCircle2,
  Medal,
  Crown,
  ChevronRight,
  Zap,
  TrendingUp,
  Users } from
'lucide-react';

interface LeaderboardViewProps {
  onOpenTenseDetail?: (tenseId: string) => void;
  onOpenFlashcards?: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  onOpenFlashcards
}) => {const { l } = useLocalization();
  const { progressState, overallMasteryPercentage } = useUser();
  const [filter, setFilter] = useState<'weekly' | 'streak' | 'global'>('weekly');

  // Compute current user's entry
  const currentUserEntry: LeaderboardUser = useMemo(() => {
    const xp = progressState.totalXP || 140;
    const streak = progressState.streakDays || 1;
    const masteredCount = Object.values(progressState.tenseProgress || {}).filter(
      (t) => t.status === 'mastered' || t.status === 'completed'
    ).length;

    let tier: 'bronze' | 'silver' | 'gold' | 'sapphire' | 'diamond' = 'bronze';
    if (xp >= 2500) tier = 'diamond';else
    if (xp >= 1200) tier = 'sapphire';else
    if (xp >= 600) tier = 'gold';else
    if (xp >= 250) tier = 'silver';

    return {
      id: 'current-user',
      name: progressState.userName || 'English Learner',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      country: 'Tu país',
      flag: '⭐',
      xp,
      streak,
      tier,
      tensesMastered: masteredCount,
      isCurrentUser: true
    };
  }, [progressState]);

  // Combine and sort leaderboard depending on filter
  const rankedUsers = useMemo(() => {
    const all = [...INITIAL_LEADERBOARD_USERS, currentUserEntry];

    if (filter === 'streak') {
      return all.sort((a, b) => b.streak - a.streak);
    }
    if (filter === 'weekly') {
      // Weekly XP simulation
      return all.sort((a, b) => {
        const aWeekly = a.isCurrentUser ? a.xp : Math.round(a.xp * 0.45);
        const bWeekly = b.isCurrentUser ? b.xp : Math.round(b.xp * 0.45);
        return bWeekly - aWeekly;
      });
    }
    // Global all-time
    return all.sort((a, b) => b.xp - a.xp);
  }, [currentUserEntry, filter]);

  // Find user's current position (1-indexed)
  const userRank = rankedUsers.findIndex((u) => u.isCurrentUser) + 1;
  const userAhead = userRank > 1 ? rankedUsers[userRank - 2] : null;

  const top3 = rankedUsers.slice(0, 3);
  const remainingUsers = rankedUsers.slice(3);

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'diamond':
        return { label: 'Liga Diamante', color: 'bg-cyan-100 text-cyan-800 border-cyan-300' };
      case 'sapphire':
        return { label: 'Liga Zafiro', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
      case 'gold':
        return { label: 'Liga Oro', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'silver':
        return { label: 'Liga Plata', color: 'bg-slate-200 text-slate-800 border-slate-300' };
      default:
        return { label: 'Liga Bronce', color: 'bg-orange-100 text-orange-800 border-orange-300' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      <p role="note" className="mb-4 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-900 dark:bg-slate-800 dark:text-indigo-100">{l('Practice leaderboard: other profiles and scores are sample data, not a live ranking.')}</p>
      
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5" />
              <span>{l("Competencia Comunitaria Global")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-white tracking-tight">{l("Tabla de Clasificación & Rankings ")}

            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl leading-relaxed">{l("Compite amistosamente con aprendices de inglés en todo el mundo. Practica todos los días, completa ejercicios y escala en tu división semanal. ")}

            </p>
          </div>

          {/* Current User Quick Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 font-black font-mono text-2xl flex flex-col items-center justify-center shadow-inner">
              <span className="text-[10px] uppercase font-sans font-bold -mb-1">{l("Puesto")}</span>
              <span>#{l(userRank)}</span>
            </div>
            <div>
              <div className="text-xs text-indigo-200 font-medium">{l("Tu división actual:")}</div>
              <div className="text-base font-bold text-white flex items-center gap-1.5">
                <span>{l(getTierBadge(currentUserEntry.tier).label)}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-amber-300 font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{l(currentUserEntry.xp)}{l(" XP")}</span>
                <span className="text-indigo-200">·</span>
                <span className="flex items-center gap-0.5 text-orange-300">
                  <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                  {l(currentUserEntry.streak)}{l(" días ")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Motivational Alert: Distance to next rank */}
      {l(userAhead &&
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950">{l("¡Estás a solo ")}
              {l(Math.max(15, userAhead.xp - currentUserEntry.xp + 10))}{l(" XP de superar a ")}{l(userAhead.name.split(' ')[0])} ({l(userAhead.flag)})!
              </h4>
              <p className="text-[11px] text-amber-800">{l("Completa una sesión de flashcards o una prueba de pronunciación hoy para subir al ")}
              <strong>{l("Puesto #")}{l(userRank - 1)}</strong>.
              </p>
            </div>
          </div>

          {l(onOpenFlashcards &&
        <button
          onClick={onOpenFlashcards}
          className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-2xs flex items-center gap-1.5">
          
              <Zap className="w-3.5 h-3.5" />
              <span>{l("Practicar y Ganar XP")}</span>
            </button>)
        }
        </div>)
      }

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setFilter('weekly')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'weekly' ?
            'bg-white text-indigo-900 shadow-xs' :
            'text-slate-600 hover:text-slate-900'}`
            }>{l("🏆 Liga Semanal ")}


          </button>
          <button
            onClick={() => setFilter('streak')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'streak' ?
            'bg-white text-indigo-900 shadow-xs' :
            'text-slate-600 hover:text-slate-900'}`
            }>{l("🔥 Rachas de Fuego ")}


          </button>
          <button
            onClick={() => setFilter('global')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'global' ?
            'bg-white text-indigo-900 shadow-xs' :
            'text-slate-600 hover:text-slate-900'}`
            }>{l("⭐ Puntuación Global (XP) ")}


          </button>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />{l("Actualizado en tiempo real ")}

          </span>
          <span>·</span>
          <span>{l("Reinicia cada domingo")}</span>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        
        {/* 2nd Place (Silver) */}
        {l(top3[1] &&
        <div className="md:order-1 bg-white border-2 border-slate-200 rounded-3xl p-5 text-center flex flex-col items-center justify-between shadow-sm relative group hover:border-slate-400 transition-all">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold font-mono text-sm flex items-center justify-center absolute -top-3 left-1/2 -translate-x-1/2 shadow-xs border border-slate-300">
              🥈 2
            </div>
            <div className="mt-2 space-y-2">
              <img
              src={top3[1].avatar}
              alt={l(top3[1].name)}
              className="w-16 h-16 rounded-full mx-auto object-cover ring-4 ring-slate-100 shadow-xs" />
            
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center justify-center gap-1">
                  <span>{l(top3[1].name)}</span>
                  <span>{l(top3[1].flag)}</span>
                </h4>
                <span className="text-[11px] text-slate-500">{l(top3[1].country)}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-around text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">{l("XP")}</span>
                <strong className="font-mono text-indigo-600">{l(top3[1].xp)}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">{l("Racha")}</span>
                <strong className="font-mono text-orange-600 flex items-center gap-0.5 justify-center">
                  <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                  {l(top3[1].streak)}{l("d ")}
              </strong>
              </div>
            </div>
          </div>)
        }

        {/* 1st Place (Gold / Crown) */}
        {l(top3[0] &&
        <div className="md:order-2 bg-gradient-to-b from-amber-50 to-white border-2 border-amber-300 rounded-3xl p-6 text-center flex flex-col items-center justify-between shadow-md relative md:-translate-y-2 ring-2 ring-amber-200/50">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-amber-950 font-black font-mono text-base flex items-center justify-center absolute -top-5 left-1/2 -translate-x-1/2 shadow-md border-2 border-white">
              <Crown className="w-5 h-5 fill-amber-900 text-amber-900" />
            </div>
            <div className="mt-3 space-y-2">
              <div className="relative inline-block">
                <img
                src={top3[0].avatar}
                alt={l(top3[0].name)}
                className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-amber-300 shadow-md" />
              
                <span className="absolute -bottom-1 -right-1 text-base bg-white rounded-full px-1 shadow-xs border border-amber-200">
                  🥇
                </span>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center justify-center gap-1">
                  <span>{l(top3[0].name)}</span>
                  <span>{l(top3[0].flag)}</span>
                </h4>
                <span className="text-xs text-amber-700 font-semibold">{l(top3[0].country)}{l(" · Líder de Liga")}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-100 w-full flex items-center justify-around text-xs bg-amber-50/50 p-2 rounded-2xl">
              <div>
                <span className="text-slate-500 block text-[10px] font-bold">{l("TOTAL XP")}</span>
                <strong className="font-mono text-base text-indigo-700 font-black">{l(top3[0].xp)}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-bold">{l("RACHA")}</span>
                <strong className="font-mono text-base text-orange-600 font-black flex items-center gap-0.5 justify-center">
                  <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                  {l(top3[0].streak)}{l("d ")}
              </strong>
              </div>
            </div>
          </div>)
        }

        {/* 3rd Place (Bronze) */}
        {l(top3[2] &&
        <div className="md:order-3 bg-white border-2 border-orange-200 rounded-3xl p-5 text-center flex flex-col items-center justify-between shadow-sm relative group hover:border-orange-300 transition-all">
            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-800 font-bold font-mono text-sm flex items-center justify-center absolute -top-3 left-1/2 -translate-x-1/2 shadow-xs border border-orange-200">
              🥉 3
            </div>
            <div className="mt-2 space-y-2">
              <img
              src={top3[2].avatar}
              alt={l(top3[2].name)}
              className="w-16 h-16 rounded-full mx-auto object-cover ring-4 ring-orange-100 shadow-xs" />
            
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center justify-center gap-1">
                  <span>{l(top3[2].name)}</span>
                  <span>{l(top3[2].flag)}</span>
                </h4>
                <span className="text-[11px] text-slate-500">{l(top3[2].country)}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-around text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">{l("XP")}</span>
                <strong className="font-mono text-indigo-600">{l(top3[2].xp)}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">{l("Racha")}</span>
                <strong className="font-mono text-orange-600 flex items-center gap-0.5 justify-center">
                  <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                  {l(top3[2].streak)}{l("d ")}
              </strong>
              </div>
            </div>
          </div>)
        }
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">{l("Ranking General de la Comunidad ")}

            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {l(rankedUsers.length)}{l(" aprendices activos ")}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {l(rankedUsers.map((user, idx) => {
            const rankNumber = idx + 1;
            const isCurrentUser = user.isCurrentUser;
            const badge = getTierBadge(user.tier);

            return (
              <div
                key={user.id}
                className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 transition-colors ${
                isCurrentUser ?
                'bg-indigo-50/70 border-l-4 border-indigo-600 font-semibold' :
                'hover:bg-slate-50'}`
                }>
                
                {/* Left: Rank & Avatar & Name */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <span
                    className={`w-7 sm:w-8 text-center font-mono font-bold text-xs sm:text-sm shrink-0 ${
                    rankNumber === 1 ?
                    'text-amber-600' :
                    rankNumber === 2 ?
                    'text-slate-600' :
                    rankNumber === 3 ?
                    'text-orange-600' :
                    'text-slate-400'}`
                    }>
                    
                    #{l(rankNumber)}
                  </span>

                  <img
                    src={user.avatar}
                    alt={l(user.name)}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200" />
                  

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {l(user.name)}
                      </span>
                      <span className="text-xs shrink-0">{l(user.flag)}</span>
                      {l(isCurrentUser &&
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white shrink-0">{l("TÚ ")}

                      </span>)
                      }
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{l(user.country)}</span>
                      <span>·</span>
                      <span className={`px-1.5 py-0.2 rounded-md border text-[10px] ${badge.color}`}>
                        {l(badge.label)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Stats (Streak & XP) */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0 text-right">
                  <div className="hidden sm:block">
                    <span className="text-[10px] text-slate-400 block">{l("Tiempos")}</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {l(user.tensesMastered)}/12
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">{l("Racha")}</span>
                    <span className="text-xs font-bold text-orange-600 flex items-center gap-0.5 justify-end">
                      <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                      {l(user.streak)}{l("d ")}
                    </span>
                  </div>

                  <div className="w-16 sm:w-20">
                    <span className="text-[10px] text-slate-400 block">{l("Puntos")}</span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-indigo-700">
                      {l(user.xp)}{l(" XP ")}
                    </span>
                  </div>
                </div>
              </div>);

          }))}
        </div>
      </div>

      {/* Guide: How to earn XP card */}
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>{l("¿Cómo ganar puntos de experiencia (XP) para subir en el ranking?")}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span className="font-mono text-indigo-600 font-bold text-sm block">{l("+20 XP")}</span>
            <strong className="text-slate-800 block">{l("Ejercicio Interactivo")}</strong>
            <p className="text-slate-500 text-[11px]">{l("Por cada respuesta correcta en los talleres.")}</p>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span className="font-mono text-rose-600 font-bold text-sm block">{l("+15 XP")}</span>
            <strong className="text-slate-800 block">{l("Prueba de Pronunciación")}</strong>
            <p className="text-slate-500 text-[11px]">{l("Por dicción superior al 70% con micrófono.")}</p>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span className="font-mono text-emerald-600 font-bold text-sm block">{l("+50 XP")}</span>
            <strong className="text-slate-800 block">{l("Tiempo Verbal Dominado")}</strong>
            <p className="text-slate-500 text-[11px]">{l("Al completar todos los módulos de un tiempo.")}</p>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span className="font-mono text-amber-600 font-bold text-sm block">{l("+10 XP")}</span>
            <strong className="text-slate-800 block">{l("Racha Diaria")}</strong>
            <p className="text-slate-500 text-[11px]">{l("Bono diario por estudiar sin interrumpir tu fuego.")}</p>
          </div>
        </div>
      </div>

    </div>);

};
