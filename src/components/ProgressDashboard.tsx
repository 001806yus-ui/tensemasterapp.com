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
  Target
} from 'lucide-react';

interface ProgressDashboardProps {
  onSelectTense: (tense: TenseData) => void;
  onOpenCertificate: () => void;
  onOpenSubscription: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  onSelectTense,
  onOpenCertificate,
  onOpenSubscription
}) => {
  const {
    progressState,
    overallMasteryPercentage,
    setUserName,
    weakTenses,
    canAccessTense,
    exportProgressPDF,
    diagnosticResult
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
                    placeholder="Tu nombre completo"
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer"
                  >
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
                    title="Editar nombre para el certificado"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Plan: <span className="font-semibold text-slate-700 dark:text-slate-300">{progressState.subscription.planName}</span>
              </p>
              {diagnosticResult && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  MCER: {diagnosticResult.levelCode}
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
            title="Descargar reporte completo en formato PDF"
          >
            <FileDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Descargar PDF</span>
          </button>

          <button
            onClick={onOpenCertificate}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Ver Mi Certificado Oficial</span>
          </button>
        </div>
      </div>

      {/* Gamified Daily Learning Streak Tracker */}
      <StreakTrackerCard onStartQuickPractice={(tense) => onSelectTense(tense)} />

      {/* Metrics Row (4 Key Stats) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Overall Mastery */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Dominio Global</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-900">
              {overallMasteryPercentage}%
            </span>
            <span className="text-xs text-slate-400">de 100%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${overallMasteryPercentage}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Racha diaria */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Racha de Estudio</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-amber-700">
              {progressState.streakDays}
            </span>
            <span className="text-xs text-slate-400">días activos</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {progressState.todayExercisesCount >= progressState.dailyGoalExercises
              ? '✓ Meta de hoy cumplida'
              : 'Práctica pendiente hoy'}
          </p>
        </div>

        {/* Metric 3: Ejercicios Completados */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Ejercicios Resueltos</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-900">
              {progressState.totalExercisesCompleted}
            </span>
            <span className="text-xs text-slate-400">completados</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {masteredCount} de 12 tiempos ya dominados con éxito.
          </p>
        </div>

        {/* Metric 4: Tiempo Invertido */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Tiempo de Estudio</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-900">
              {progressState.totalMinutesSpent}
            </span>
            <span className="text-xs text-slate-400">minutos</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Tiempo efectivo de práctica y escucha de audio.
          </p>
        </div>
      </div>

      {/* Personalized AI & Learning Diagnosis Box */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-slate-50 border border-indigo-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Diagnóstico Personalizado de Hoy</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {weakTenses.length > 0 ? (
              <>Tu prioridad recomendada: Reforzar <strong>{nextRecommendedTense.name}</strong></>
            ) : (
              <>¡Gran avance! Tu siguiente meta recomendada: <strong>{nextRecommendedTense.name}</strong></>
            )}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {weakTenses.length > 0
              ? `Hemos detectado que puedes reforzar tus respuestas en ${nextRecommendedTense.spanishName}. Hacer 3 ejercicios interactivos hoy mejorará tu retención a largo plazo.`
              : `Has progresado firmemente. Explora ${nextRecommendedTense.spanishName} (${nextRecommendedTense.tagline}) para continuar avanzando en la matriz.`}
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
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 shrink-0 transition-colors cursor-pointer"
        >
          <span>Estudiar {nextRecommendedTense.name}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Detailed Tenses Status Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              Estado de los 12 Tiempos del Inglés
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitoreo detallado de tu progreso individual en cada aspecto temporal.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            {completedCount} / 12 Completados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="p-4">Tiempo Verbal</th>
                <th className="p-4">Nivel CEFR</th>
                <th className="p-4">Progreso</th>
                <th className="p-4">Calificación</th>
                <th className="p-4">Última Práctica</th>
                <th className="p-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ALL_12_TENSES.map((t) => {
                const prog = progressState.tenseProgress[t.id];
                const hasAccess = canAccessTense(t.id);
                const score = prog?.score || 0;

                return (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name */}
                    <td className="p-4 font-medium text-slate-900">
                      <div>
                        <span className="font-bold">{t.name}</span>
                        <span className="text-xs text-slate-400 block">{t.spanishName}</span>
                      </div>
                    </td>

                    {/* CEFR */}
                    <td className="p-4 font-mono text-slate-600">
                      {t.cefrLevel}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      {prog?.status === 'mastered' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-semibold text-xs border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Dominado
                        </span>
                      ) : prog?.status === 'in-progress' ? (
                        <span className="inline-flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md font-semibold text-xs border border-indigo-200">
                          En progreso ({prog.exercisesDone}/{t.exercises.length})
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">
                          Por iniciar
                        </span>
                      )}
                    </td>

                    {/* Score Bar */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-slate-700">{score}%</span>
                      </div>
                    </td>

                    {/* Last Studied */}
                    <td className="p-4 text-xs text-slate-500 font-mono">
                      {prog?.lastStudiedAt || '—'}
                    </td>

                    {/* Action */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          if (hasAccess) {
                            onSelectTense(t);
                          } else {
                            onOpenSubscription();
                          }
                        }}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                      >
                        {hasAccess ? 'Abrir Taller' : 'Desbloquear ($1)'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
