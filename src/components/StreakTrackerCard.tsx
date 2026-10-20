import { useLocalization } from "../i18n/LocalizationContext";
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import {
  Flame,
  CheckCircle2,
  Shield,
  Zap,
  Trophy,
  Calendar,
  Sparkles,
  ArrowRight,
  Target,
  Award,
  ChevronRight,
  Info } from
'lucide-react';
import { ALL_12_TENSES } from '../data/tensesData';
import { TenseData } from '../types';

interface StreakTrackerCardProps {
  onStartQuickPractice: (tense: TenseData) => void;
}

export const StreakTrackerCard: React.FC<StreakTrackerCardProps> = ({ onStartQuickPractice }) => {const { l } = useLocalization();
  const {
    progressState,
    logDailyPractice,
    useStreakFreeze,
    setDailyGoal,
    canAccessTense,
    nativeLanguage
  } = useUser();

  const [showGoalSelector, setShowGoalSelector] = useState(false);
  const [justCelebrated, setJustCelebrated] = useState(false);

  const streakDays = progressState.streakDays || 1;
  const todayExercises = progressState.todayExercisesCount || 0;
  const dailyTarget = progressState.dailyGoalExercises || 3;
  const isGoalMet = todayExercises >= dailyTarget;
  const totalXP = progressState.totalXP || 360;

  // Level calculation
  const level = Math.floor(totalXP / 150) + 1;
  const xpCurrentLevel = totalXP % 150;
  const xpNextLevel = 150;
  const levelProgress = Math.min(100, Math.round(xpCurrentLevel / xpNextLevel * 100));

  // Determine last 7 days for the weekly rolling calendar
  const todayObj = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(todayObj.getDate() - (6 - i));
    const isoString = d.toISOString().split('T')[0];
    const isToday = i === 6;
    const dayName = d.toLocaleDateString(nativeLanguage === 'en' ? 'en-US' : 'es-ES', { weekday: 'short' }).replace('.', '');
    const dayNumber = d.getDate();
    const isActive = progressState.activeDates?.includes(isoString);

    return {
      date: isoString,
      dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
      dayNumber,
      isToday,
      isActive: isActive || isToday && isGoalMet
    };
  });

  const handleQuickPracticeClick = () => {
    logDailyPractice(25);
    setJustCelebrated(true);
    setTimeout(() => setJustCelebrated(false), 2500);
  };

  // Find a recommended tense to practice right now
  const quickTense =
  ALL_12_TENSES.find((t) => canAccessTense(t.id) && progressState.tenseProgress[t.id]?.status !== 'mastered') ||
  ALL_12_TENSES[0];

  const milestones = [
  { days: 3, name: l('Chispa Inicial'), icon: '✨', description: l('3 días practicando sin parar') },
  { days: 7, name: l('Hábito de Acero'), icon: '⚡', description: l('Una semana completa de inmersión') },
  { days: 14, name: l('Mente Imparable'), icon: '🛡️', description: l('2 semanas consecutivas dominando tiempos') },
  { days: 30, name: l('Leyenda del Inglés'), icon: '👑', description: l('Un mes entero de fluidez') }];

  const remainingExercises = Math.max(0, dailyTarget - todayExercises);
  const nextStreakDays = streakDays + 1;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8 relative">
      
      {/* Top Banner: Streak Flame + Level Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        
        {/* Left: Streak Flame Badge & Motivation Text */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-amber-500/10 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center text-white">
                <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-100">{l("Active Streak")}</span>
              </div>
            </div>
            {l(isGoalMet &&
            <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs shadow-xs border-2 border-white">
                ✓
              </span>)
            }
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 font-mono">
                {streakDays} {l(streakDays === 1 ? 'Day' : 'Days')}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                🔥 {l("Active Streak")}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md">
              {isGoalMet
                ? l("Today's goal completed! Your streak is safe for tomorrow.")
                : remainingExercises === 1
                  ? l("You have 1 exercise left today to extend your streak to {{0}} days.", [nextStreakDays])
                  : l("You have {{0}} exercises left today to extend your streak to {{1}} days.", [remainingExercises, nextStreakDays])}
            </p>
          </div>
        </div>

        {/* Right: Gamified Level & XP Pill */}
        <div className="w-full md:w-auto bg-slate-50 border border-slate-200/80 rounded-xl p-4 min-w-[240px] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{l("Level {{0}}: {{1}}", [level, l(level === 1 ? 'Beginner' : level === 2 ? 'Explorer' : level === 3 ? 'Consistent' : 'Expert')])}</span>
            </div>
            <span className="font-mono text-indigo-700 font-bold">{totalXP} XP</span>
          </div>

          {/* Level Progress bar */}
          <div className="space-y-1">
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }} />
              
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>{xpCurrentLevel} XP</span>
              <span>{l("{{0}} XP to Level {{1}}", [xpNextLevel, level + 1])}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Rolling Interactive Calendar */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>{l("Your Weekly Practice Log (Last 7 days)")}</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {l("{{0}} of 7 active days", [weekDays.filter((d) => d.isActive).length])}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {l(weekDays.map((day, idx) => {
            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-between p-2.5 sm:p-3.5 rounded-xl border text-center transition-all ${
                day.isActive ?
                'bg-amber-50/70 border-amber-300 shadow-2xs' :
                day.isToday ?
                'bg-indigo-50/60 border-indigo-300 ring-2 ring-indigo-500/20' :
                'bg-slate-50/50 border-slate-200/70 opacity-70'}`
                }>
                
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {l(day.dayName)}
                </span>

                <div className="my-1.5 flex items-center justify-center">
                  {l(day.isActive ?
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                      <Flame className="w-4 h-4 fill-white" />
                    </div> :
                  day.isToday ?
                  <div className="w-8 h-8 rounded-full border-2 border-dashed border-indigo-400 flex items-center justify-center text-indigo-600 font-bold text-xs bg-white animate-pulse">
                    {l("Today")}
                  </div> :

                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-mono">
                      {l(day.dayNumber)}
                    </div>)
                  }
                </div>

                <span className="text-[10px] font-mono font-medium text-slate-600">
                  {l(day.isActive ? 'Active' : day.isToday ? 'In play' : `${day.dayNumber}`)}
                </span>
              </div>);

          }))}
        </div>
      </div>

      {/* Daily Target Progress & Quick Challenge Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
        
        {/* Left: Daily Target Card */}
        <div className="lg:col-span-7 bg-slate-50 border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {l("Daily Study Goal")}
              </span>
            </div>

            {/* Change goal button */}
            <div className="relative">
              <button
                onClick={() => setShowGoalSelector(!showGoalSelector)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer flex items-center gap-1">
                <span>{l("Adjust ({{0}} ex/day)", [dailyTarget])}</span>
              </button>

              {l(showGoalSelector &&
              <div className="absolute right-0 top-6 z-20 bg-white border border-slate-200 rounded-xl shadow-lg p-2 flex gap-1 text-xs">
                  {l([2, 3, 5, 7].map((num) =>
                <button
                  key={num}
                  onClick={() => {
                    setDailyGoal(num);
                    setShowGoalSelector(false);
                  }}
                  className={`px-3 py-1 rounded-md font-bold cursor-pointer ${
                  dailyTarget === num ?
                  'bg-indigo-600 text-white' :
                  'bg-slate-100 hover:bg-slate-200 text-slate-700'}`
                  }>
                      {l(num)}
                    </button>
                ))}
                </div>)
              }
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-semibold text-slate-700">
                {l("Today's progress: {{0}} of {{1}} exercises", [todayExercises, dailyTarget])}
              </span>
              <span className="font-mono font-bold text-indigo-600">
                {Math.round(todayExercises / dailyTarget * 100)}%
              </span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                isGoalMet ?
                'bg-emerald-500' :
                'bg-indigo-600'}`
                }
                style={{ width: `${Math.min(100, Math.round(todayExercises / dailyTarget * 100))}%` }} />
            </div>
          </div>

          {/* Instant Practice Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/60">
            <div className="text-xs text-slate-600">
              {l(isGoalMet ?
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />{l("Today's goal achieved! (+50 XP bonus)")}
              </span> :

              <span>{l("Complete a quick 2-minute session to keep your streak alive.")}</span>)
              }
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleQuickPracticeClick}
                className="px-3.5 py-2 bg-white border border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 text-slate-800 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{l("+1 Quick Practice (+25 XP)")}</span>
              </button>

              <button
                onClick={() => onStartQuickPractice(quickTense)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5">
                <span>{l("Practice {{0}}", [quickTense.name])}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Streak Freeze / Salvavidas de Racha */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>{l("Streak Protection Shield")}</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                {l("1 Available")}
              </span>
            </div>
            <h4 className="text-base font-bold font-serif">{l("Streak Freeze")}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {l("Busy day or traveling? Activating your freeze protects your {{0}} day streak even if you cannot practice today.", [streakDays])}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">{l("Status: ")}
              <span className={progressState.streakFreezeUsed ? 'text-cyan-400 font-bold' : 'text-slate-300'}>
                {l(progressState.streakFreezeUsed ? '❄️ Shield Active' : 'Inactive (In reserve)')}
              </span>
            </div>

            <button
              onClick={useStreakFreeze}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              progressState.streakFreezeUsed ?
              'bg-cyan-500 text-slate-900 font-bold' :
              'bg-white/10 hover:bg-white/20 text-white border border-white/20'}`
              }>
              {l(progressState.streakFreezeUsed ? 'Deactivate Shield' : 'Activate Shield')}
            </button>
          </div>
        </div>

      </div>

      {/* Streak Milestones Progression */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Award className="w-4 h-4 text-amber-500" />
            <span>{l("Consistency Milestones & Unlockable Achievements")}</span>
          </div>
          <span className="text-slate-400">{l("Next milestone: ")}
            {streakDays >= 7 ? `14 ${l('Days')}` : `7 ${l('Days')}`}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {l(milestones.map((m) => {
            const isUnlocked = streakDays >= m.days;
            const progressRatio = Math.min(100, Math.round(streakDays / m.days * 100));

            return (
              <div
                key={m.days}
                className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
                isUnlocked ?
                'bg-amber-50/40 border-amber-200 text-slate-900' :
                'bg-slate-50 border-slate-200/70 text-slate-500'}`
                }>
                
                <div className="flex items-center justify-between">
                  <span className="text-xl">{l(m.icon)}</span>
                  {l(isUnlocked ?
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">{l("Conseguido ")}

                  </span> :

                  <span className="text-[10px] font-mono text-slate-400 font-bold">
                      {l(streakDays)}/{l(m.days)}{l(" días ")}
                  </span>)
                  }
                </div>

                <div>
                  <div className="font-bold text-slate-900 truncate">{l(m.name)}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {l(m.description)}
                  </div>
                </div>

                {l(!isUnlocked &&
                <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden mt-1">
                    <div
                    className="bg-amber-500 h-1 rounded-full"
                    style={{ width: `${progressRatio}%` }} />
                  
                  </div>)
                }
              </div>);

          }))}
        </div>
      </div>

      {/* Floating Celebration Toast */}
      {l(justCelebrated &&
      <div className="absolute top-4 right-4 z-30 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{l("¡Práctica registrada! +25 XP añadidos a tu racha diaria.")}</span>
        </div>)
      }

    </div>);

};
