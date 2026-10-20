import { useLocalization } from "../i18n/LocalizationContext";
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { ALL_12_TENSES } from '../data/tensesData';
import { TenseData } from '../types';
import { StreakTrackerCard } from './StreakTrackerCard';
import {
  Flame,
  Clock,
  CheckCircle2,
  Trophy,
  Award,
  ArrowRight,
  Sparkles,
  TrendingUp,
  AlertCircle,
  User,
  Edit2,
  Check,
  FileDown,
  Target } from
'lucide-react';

interface ProgressDashboardProps {
  onSelectTense: (tense: TenseData) => void;
  onOpenCertificate: () => void;
  onOpenSubscription: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  onSelectTense,
  onOpenCertificate,
  onOpenSubscription
}) => {const { l } = useLocalization();
  const {
    progressState,
    overallMasteryPercentage,
    setUserName,
    weakTenses,
    canAccessTense,
    exportProgressPDF,
    diagnosticResult,
    nativeLanguage,
    t,
    ownerConfig
  } = useUser();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(progressState.userName);

  const handleSaveName = () => {
    setUserName(nameInput);
    setIsEditingName(false);
  };

  // Group achievements
  const completedCount = Object.values(progressState.tenseProgress).filter(
    (tp) => tp.status === 'completed' || tp.status === 'mastered'
  ).length;

  const masteredCount = Object.values(progressState.tenseProgress).filter(
    (tp) => tp.status === 'mastered'
  ).length;

  // Find next recommended tense
  const nextRecommendedTense =
  ALL_12_TENSES.find((t) => weakTenses.includes(t.id)) ||
  ALL_12_TENSES.find((t) => {
    const p = progressState.tenseProgress[t.id];
    return !p || p.status === 'not-started';
  }) ||
  ALL_12_TENSES[0];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Profile & Summary Row */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <User className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-2.5 py-1 text-base font-bold border border-indigo-300 dark:border-indigo-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    placeholder={l("Your full name")} />
                
                  <button
                    onClick={handleSaveName}
                    className="p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer">
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white">
                    {progressState.userName}
                  </h2>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md transition-colors cursor-pointer"
                    title={l("Edit name for certificate")}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <span>{l("Plan: ")}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{l(progressState.subscription.planName)}</span>
              </p>
              {diagnosticResult && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {l("CEFR: ")}{diagnosticResult.levelCode}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Certificate & PDF CTA */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={exportProgressPDF}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            title={l(nativeLanguage === 'en' ? "Download full study report as PDF" : "Descargar reporte completo en formato PDF")}>
            
            <FileDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{l('Download PDF')}</span>
          </button>

          <button
            onClick={onOpenCertificate}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs">
            
            <Award className="w-4 h-4 text-amber-400" />
            <span>{l('View Official Certificate')}</span>
          </button>
        </div>
      </div>

      {/* Gamified Daily Learning Streak Tracker */}
      <StreakTrackerCard onStartQuickPractice={(tense) => onSelectTense(tense)} />

      {/* Metrics Row (4 Key Stats) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Overall Mastery */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{l('Overall Mastery')}</span>
            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white">
              {l(overallMasteryPercentage)}%
            </span>
            <span className="text-xs text-slate-400">{l('of 100%')}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${overallMasteryPercentage}%` }} />
            
          </div>
        </div>

        {/* Metric 2: Racha diaria */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{l('Study Streak')}</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-amber-700 dark:text-amber-400">
              {l(progressState.streakDays)}
            </span>
            <span className="text-xs text-slate-400">{l('active days')}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {l(progressState.todayExercisesCount >= progressState.dailyGoalExercises ? l(
              '✓ Today\'s goal completed') : l(
              'Practice pending today'))}
          </p>
        </div>

        {/* Metric 3: Ejercicios Completados */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{l('Completed Exercises')}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white">
              {l(progressState.totalExercisesCompleted)}
            </span>
            <span className="text-xs text-slate-400">{l('completed')}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {l("{{0}} of 12 tenses fully mastered.", [
            masteredCount])
            }
          </p>
        </div>

        {/* Metric 4: Tiempo Invertido */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{l('Study Time')}</span>
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white">
              {l(progressState.totalMinutesSpent)}
            </span>
            <span className="text-xs text-slate-400">{l('minutes')}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {l('Active listening & practice time.')}
          </p>
        </div>
      </div>

      {/* Personalized Learning Diagnosis Box */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-slate-50 border border-indigo-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>{l("Today's Personalized Study Assessment")}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {weakTenses.length > 0 ? (
              <>{l("Recommended priority: Reinforce {{0}}", [nextRecommendedTense.name])}</>
            ) : (
              <>{l("Great progress! Your next recommended goal: {{0}}", [nextRecommendedTense.name])}</>
            )}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {weakTenses.length > 0
              ? l("We noticed you can reinforce your answers in {{0}}. Doing 3 interactive exercises today will improve your long-term retention.", [nextRecommendedTense.name])
              : l("You have made steady progress. Explore {{0}} ({{1}}) to keep advancing through the matrix.", [nextRecommendedTense.name, nextRecommendedTense.tagline])}
          </p>
        </div>

        <button
          onClick={() => {
            if (canAccessTense(nextRecommendedTense.id)) {
              onSelectTense(nextRecommendedTense);
            } else {
              onOpenSubscription();
            }
          }}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 shrink-0 transition-colors cursor-pointer">
          
          <span>{l("Study {{0}}", [nextRecommendedTense.name])}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Detailed Tenses Status Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              {l("Status of All 12 English Tenses")}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {l("Detailed monitoring of your individual progress in each temporal aspect.")}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            {completedCount} / 12 {l("Completed")}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="p-4">{l("Verb Tense")}</th>
                <th className="p-4">{l("CEFR Level")}</th>
                <th className="p-4">{l("Progress")}</th>
                <th className="p-4">{l("Score")}</th>
                <th className="p-4">{l("Last Practice")}</th>
                <th className="p-4 text-right">{l("Action")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ALL_12_TENSES.map((tenseItem) => {
                const prog = progressState.tenseProgress[tenseItem.id];
                const hasAccess = canAccessTense(tenseItem.id);
                const score = prog?.score || 0;

                return (
                  <tr key={tenseItem.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name */}
                    <td className="p-4 font-medium text-slate-900">
                      <div>
                        <span className="font-bold">{tenseItem.name}</span>
                        <span className="text-xs text-slate-400 block">{tenseItem.spanishName}</span>
                      </div>
                    </td>

                    {/* CEFR */}
                    <td className="p-4 font-mono text-slate-600">
                      {tenseItem.cefrLevel}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      {prog?.status === 'mastered' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-semibold text-xs border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />{l("Mastered")}
                        </span>
                      ) : prog?.status === 'in-progress' ? (
                        <span className="inline-flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md font-semibold text-xs border border-indigo-200">
                          {l("In progress ({{0}}/{{1}})", [prog.exercisesDone, tenseItem.exercises.length])}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">
                          {l("Not started")}
                        </span>
                      )}
                    </td>

                    {/* Score Bar */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${score}%` }} />
                          
                        </div>
                        <span className="font-mono text-xs text-slate-700">{l(score)}%</span>
                      </div>
                    </td>

                    {/* Last Studied */}
                    <td className="p-4 text-xs text-slate-500 font-mono">
                      {l(prog?.lastStudiedAt || '—')}
                    </td>

                    {/* Action */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          if (hasAccess) {
                            onSelectTense(tenseItem);
                          } else {
                            onOpenSubscription();
                          }
                        }}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer">
                        
                        {l(hasAccess ? t.enterTense || l('Open') : t.unlockTense || l('Unlock Pro'))}
                      </button>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

};
