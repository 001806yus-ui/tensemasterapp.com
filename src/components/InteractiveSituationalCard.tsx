import { useLocalization } from "../i18n/LocalizationContext";
import React, { useState } from 'react';
import { SITUATIONAL_SCENARIOS, SituationalScenario } from '../data/situationalScenarios';
import { playEnglishAudio } from '../utils/speech';
import { sounds } from '../utils/soundEffects';
import {
  Volume2,
  Sparkles,
  Brain,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Bot,
  RotateCcw,
  Eye,
  EyeOff,
  Flame,
  HelpCircle,
  Lightbulb } from
'lucide-react';

interface InteractiveSituationalCardProps {
  onStartTutorScenario?: (starterPrompt: string) => void;
  onOpenTense?: (tenseId: string) => void;
  className?: string;
  showTutorButton?: boolean;
}

export const InteractiveSituationalCard: React.FC<InteractiveSituationalCardProps> = ({
  onStartTutorScenario,
  onOpenTense,
  className = '',
  showTutorButton = true
}) => {const { l } = useLocalization();
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const scenario = SITUATIONAL_SCENARIOS[selectedScenarioIndex];

  const handleSelectScenario = (index: number) => {
    sounds.playClick();
    setSelectedScenarioIndex(index);
    setSelectedAnswerIndex(null);
  };

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    playEnglishAudio(scenario.keyPhraseEnglish);
    setTimeout(() => setIsPlayingAudio(false), 2200);
  };

  const handleSelectAnswer = (optionIndex: number) => {
    const isCorrect = scenario.interactiveQuiz.options[optionIndex].isCorrect;
    setSelectedAnswerIndex(optionIndex);
    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playIncorrect();
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswerIndex(null);
    sounds.playClick();
  };

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all ${className}`}>
      
      {/* Top Header: Neuroscience Hook & Scenario Selector */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white border-b border-indigo-900/50">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Brain className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold block">{l("Fijación Visual & Memoria Cognitiva ")}

              </span>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-white">{l("Tarjeta Demostración: Situaciones de la Vida Diaria ")}

              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-white/10 px-3 py-1 rounded-full text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{l("Retención +65% superior a listas vacías")}</span>
          </div>
        </div>

        {/* Scenario Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {l(SITUATIONAL_SCENARIOS.map((sc, idx) => {
            const isActive = idx === selectedScenarioIndex;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive ?
                'bg-amber-400 text-slate-950 shadow-md font-bold scale-[1.02]' :
                'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'}`
                }>
                
                <span>{l(sc.id === 'coffee_shop' ? '☕' : sc.id === 'airport_gate' ? '✈️' : sc.id === 'job_interview' ? '💼' : sc.id === 'supermarket' ? '🛒' : sc.id === 'hotel_checkin' ? '🏨' : '🩺')}</span>
                <span>{l(sc.spanishTitle)}</span>
              </button>);

          }))}
        </div>
      </div>

      {/* Main Body: Real-Life Photo & Interactive Demonstration */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Visual Situation Photo & Anchors */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="relative rounded-2xl overflow-hidden shadow-md group border border-slate-200 dark:border-slate-800">
            <img
              src={scenario.photoUrl}
              alt={l(scenario.photoAlt)}
              className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex flex-col justify-end p-4 text-white">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold bg-slate-950/70 px-2 py-0.5 rounded w-max mb-1">
                {l(scenario.spanishTitle)}
              </span>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">
                {l(scenario.contextDescription)}
              </p>
            </div>
          </div>

          {/* Neuroscience Anchor Box */}
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-2xl text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{l("¿Por qué tu cerebro no olvida esta frase?")}</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
              {l(scenario.whyBrainRemembers)}
            </p>
          </div>
        </div>

        {/* Right Column: Audio Demonstration & Interactive Challenge */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          
          {/* Audio Phrase Banner */}
          <div className="p-4 sm:p-5 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 uppercase">{l("Tiempo Gramatical Activo: ")}

                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-white bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                  {l(scenario.targetTenseName)}
                </span>
              </div>

              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors">
                
                {l(showTranslation ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />)}
                <span>{l(showTranslation ? 'Ocultar traducción' : 'Ver traducción')}</span>
              </button>
            </div>

            {/* Target English Phrase */}
            <div className="flex items-start justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-indigo-200/60 dark:border-indigo-900/60">
              <div className="space-y-1">
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  "{scenario.keyPhraseEnglish}"
                </p>
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {l(scenario.keyPhrasePhonetic)}
                </p>
                {l(showTranslation &&
                <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium pt-1">{l("Traducción: \"")}
                  {l(scenario.keyPhraseSpanish)}"
                  </p>)
                }
              </div>

              <button
                onClick={handlePlayAudio}
                disabled={isPlayingAudio}
                title={l("Escuchar pronunciación nativa de alta fidelidad")}
                className={`p-3 rounded-xl transition-all cursor-pointer shrink-0 ${
                isPlayingAudio ?
                'bg-amber-400 text-slate-950 scale-105 shadow-md' :
                'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'}`
                }>
                
                <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              </button>
            </div>
          </div>

          {/* Interactive Challenge (Micro-Quiz) */}
          <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>{l("Pruébalo en vivo (Demostración interactiva)")}</span>
              </span>
              {l(selectedAnswerIndex !== null &&
              <button
                onClick={handleResetQuiz}
                className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 cursor-pointer transition-colors">
                
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{l("Reintentar")}</span>
                </button>)
              }
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
              {l(scenario.interactiveQuiz.question)}
            </p>

            <div className="space-y-2">
              {l(scenario.interactiveQuiz.options.map((option, optIdx) => {
                const isSelected = selectedAnswerIndex === optIdx;
                const hasAnswered = selectedAnswerIndex !== null;

                let btnStyles = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500';

                if (hasAnswered) {
                  if (option.isCorrect) {
                    btnStyles = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30 font-semibold';
                  } else if (isSelected) {
                    btnStyles = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/30';
                  } else {
                    btnStyles = 'border-slate-200 dark:border-slate-700 opacity-60 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectAnswer(optIdx)}
                    disabled={hasAnswered}
                    className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start justify-between gap-2 cursor-pointer ${btnStyles}`}>
                    
                    <span>{option.text}</span>
                    {l(hasAnswered && option.isCorrect &&
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />)
                    }
                    {l(hasAnswered && isSelected && !option.isCorrect &&
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />)
                    }
                  </button>);

              }))}
            </div>

            {/* Answer Feedback Banner */}
            {l(selectedAnswerIndex !== null &&
            <div
              className={`p-3 rounded-xl text-xs leading-relaxed animate-in fade-in duration-300 ${
              scenario.interactiveQuiz.options[selectedAnswerIndex].isCorrect ?
              'bg-emerald-100/70 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800' :
              'bg-rose-100/70 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200 border border-rose-300 dark:border-rose-800'}`
              }>
              
                {l(scenario.interactiveQuiz.options[selectedAnswerIndex].feedback)}
              </div>)
            }
          </div>

          {/* Action Row: Tutor 24/7 Simulator CTA */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {l(onOpenTense &&
            <button
              onClick={() => onOpenTense(scenario.targetTenseId)}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer">
              
                <span>{l("Ver lección completa de este tiempo")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>)
            }

            {l(showTutorButton && onStartTutorScenario &&
            <button
              onClick={() => onStartTutorScenario(scenario.tutorStarterPrompt)}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer ml-auto">
              
                <Bot className="w-4 h-4 text-amber-300" />
                <span>{l("Practicar en vivo con el Tutor IA 24/7")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>)
            }
          </div>

        </div>

      </div>
    </div>);

};
