import React, { useState } from 'react';
import { DIAGNOSTIC_QUESTIONS } from '../data/diagnosticQuizData';
import { DiagnosticQuestion, DiagnosticResult, CEFRFullLabel, CEFRLevel } from '../types';
import { useUser } from '../context/UserContext';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Award,
  ArrowRight,
  RotateCcw,
  BookOpen,
  FileDown,
  Target,
  Zap,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

interface DiagnosticTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTense?: (tenseId: string) => void;
}

export const DiagnosticTestModal: React.FC<DiagnosticTestModalProps> = ({
  isOpen,
  onClose,
  onSelectTense
}) => {
  const { saveDiagnosticResult, exportProgressPDF, diagnosticResult } = useUser();

  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [answers, setAnswers] = useState<{ questionId: string; isCorrect: boolean; selected: number }[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [completedResult, setCompletedResult] = useState<DiagnosticResult | null>(diagnosticResult || null);

  if (!isOpen) return null;

  const currentQ: DiagnosticQuestion = DIAGNOSTIC_QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);

    const isCorrect = idx === currentQ.correctIndex;
    setAnswers((prev) => [...prev, { questionId: currentQ.id, isCorrect, selected: idx }]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < DIAGNOSTIC_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Calculate final diagnostic results
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const totalCorrect = answers.filter((a) => a.isCorrect).length + (selectedOption === currentQ.correctIndex ? 0 : 0);
    // Note: answers already has this question's answer from handleSelectOption
    const correctCount = answers.length > 0 ? answers.filter((a) => a.isCorrect).length : 0;
    const total = DIAGNOSTIC_QUESTIONS.length;
    const percentage = Math.round((correctCount / total) * 100);

    let cefrLevel: CEFRFullLabel = 'A1 - Principiante';
    let levelCode: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' = 'A1';
    let summaryFeedback = '';
    let priorityTensesToStudy: string[] = [];
    let strongAreas: string[] = [];

    if (correctCount <= 2) {
      cefrLevel = 'A1 - Principiante';
      levelCode = 'A1';
      summaryFeedback = 'Tienes una base inicial lista para florecer. Te recomendamos empezar consolidando el Present Simple y Present Continuous con rutinas diarias.';
      priorityTensesToStudy = ['present-simple', 'present-continuous', 'past-simple'];
      strongAreas = ['Vocabulario cotidiano'];
    } else if (correctCount <= 4) {
      cefrLevel = 'A2 - Básico / Elemental';
      levelCode = 'A2';
      summaryFeedback = '¡Buen manejo de los conceptos elementales! Tu siguiente paso crucial es dominar las diferencias entre el Pasado Simple y el Futuro con "going to".';
      priorityTensesToStudy = ['past-simple', 'future-simple', 'past-continuous'];
      strongAreas = ['Estructuras del presente', 'Frases habituales'];
    } else if (correctCount <= 6) {
      cefrLevel = 'B1 - Intermedio';
      levelCode = 'B1';
      summaryFeedback = '¡Nivel intermedio conversacional sólido! Ya puedes comunicarte en múltiples circunstancias. Enfócate en los tiempos perfectos para narrar con precisión.';
      priorityTensesToStudy = ['present-perfect', 'past-continuous', 'present-perfect-continuous'];
      strongAreas = ['Tiempos básicos de pasado y presente', 'Concordancia verbal'];
    } else if (correctCount <= 8) {
      cefrLevel = 'B2 - Intermedio Alto';
      levelCode = 'B2';
      summaryFeedback = '¡Gran solidez gramatical! Comprendes matices complejos y cronología precisa. Te sugerimos profundizar en Past Perfect y Future Perfect.';
      priorityTensesToStudy = ['past-perfect', 'future-continuous', 'future-perfect'];
      strongAreas = ['Present Perfect vs Pasado', 'Condicionales y acciones continuas'];
    } else {
      cefrLevel = 'C1 - Avanzado';
      levelCode = 'C1';
      summaryFeedback = '¡Excelente dominio avanzado! Tienes un entendimiento fino de la cronología y el aspecto verbal en inglés. Perfecciona la pronunciación y matices de estilo.';
      priorityTensesToStudy = ['past-perfect-continuous', 'future-perfect-continuous'];
      strongAreas = ['Tiempos perfectos compuestos', 'Aspectos continuos avanzados', 'Lógica temporal'];
    }

    const result: DiagnosticResult = {
      cefrLevel,
      levelCode,
      score: correctCount,
      totalQuestions: total,
      percentage,
      completedAt: new Date().toISOString(),
      strongAreas,
      priorityTensesToStudy,
      personalizedRoadmap: priorityTensesToStudy,
      summaryFeedback,
      estimatedStudyTimeDays: Math.max(14, (10 - correctCount) * 5)
    };

    setCompletedResult(result);
    saveDiagnosticResult(result);
    setIsCompleted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setAnswers([]);
    setIsCompleted(false);
    setHasStarted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-4 transition-colors">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
                Test de Nivel Inicial
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  MCER A1 - C1
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                10 preguntas clave para conocer tu nivel real y recomendarte por dónde empezar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!hasStarted && !isCompleted && (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                  ¿Por qué hacer este diagnóstico?
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Evita la frustración de estudiar cosas que ya dominas o sentirte abrumado con temas avanzados sin las bases adecuadas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">Rápido (3-5 min)</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    10 reactivos de opción múltiple con retroalimentación inmediata.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2">
                    <Target className="w-4 h-4" />
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">Ruta Personalizada</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Identifica exactamente en qué orden estudiar los tiempos verbales.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
                    <Award className="w-4 h-4" />
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">+100 XP Gratis</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Ganas experiencia al completarlo para subir en la tabla de clasificación.
                  </p>
                </div>
              </div>

              {completedResult && (
                <div className="p-4 bg-indigo-50/80 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 text-left flex items-center justify-between">
                  <div>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase">Último resultado guardado:</span>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                      Nivel {completedResult.cefrLevel} ({completedResult.percentage}% aciertos)
                    </h5>
                  </div>
                  <button
                    onClick={() => setIsCompleted(true)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Ver detalles →
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={() => {
                    setHasStarted(true);
                    setIsCompleted(false);
                    setCurrentIndex(0);
                    setSelectedOption(null);
                    setShowExplanation(false);
                    setAnswers([]);
                  }}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{completedResult ? 'Repetir Test de Nivel' : 'Comenzar Test Ahora'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Quiz in progress */}
          {hasStarted && !isCompleted && (
            <div className="space-y-5">
              {/* Progress header */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Pregunta {currentIndex + 1}</span> de {DIAGNOSTIC_QUESTIONS.length}
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      Nivel {currentQ.level}
                    </span>
                  </span>
                  <span>{Math.round(((currentIndex) / DIAGNOSTIC_QUESTIONS.length) * 100)}% completado</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300 rounded-full"
                    style={{ width: `${((currentIndex + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Category tag */}
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{currentQ.category}</span>
              </div>

              {/* Question text */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-white leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isChosen = selectedOption === idx;
                  const isCorrectAnswer = idx === currentQ.correctIndex;

                  let optionClass = 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 text-slate-800 dark:text-slate-200';

                  if (showExplanation) {
                    if (isCorrectAnswer) {
                      optionClass = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                    } else if (isChosen && !isCorrectAnswer) {
                      optionClass = 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-900 dark:text-rose-200';
                    } else {
                      optionClass = 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={showExplanation}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between text-sm cursor-pointer ${optionClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center border ${
                          showExplanation && isCorrectAnswer
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : showExplanation && isChosen
                            ? 'bg-rose-500 text-white border-rose-500'
                            : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {showExplanation && (
                        <div>
                          {isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                          {isChosen && !isCorrectAnswer && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card */}
              {showExplanation && (
                <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 transition-all ${
                  selectedOption === currentQ.correctIndex
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                    : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
                }`}>
                  <div className="font-bold flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 shrink-0" />
                    <span>{selectedOption === currentQ.correctIndex ? '¡Correcto!' : 'Explicación Gramatical:'}</span>
                  </div>
                  <p>{currentQ.explanation}</p>
                  <p className="text-[11px] opacity-80 pt-1 font-mono">
                    Enfoque: {currentQ.grammarFocus}
                  </p>
                </div>
              )}

              {/* Action button */}
              {showExplanation && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNext}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>{currentIndex + 1 === DIAGNOSTIC_QUESTIONS.length ? 'Finalizar y Ver Diagnóstico' : 'Siguiente Pregunta'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Completion Screen */}
          {isCompleted && completedResult && (
            <div className="space-y-6 py-2">
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 mb-1">
                  <Award className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Diagnóstico Completado
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Hemos calibrado tu nivel en base al Marco Común Europeo de Referencia (MCER).
                </p>
              </div>

              {/* Main Level Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-indigo-600/5 to-purple-500/10 dark:from-indigo-950/40 dark:to-slate-900 border border-indigo-200 dark:border-indigo-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Nivel Calibrado:
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {completedResult.cefrLevel}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs self-start sm:self-auto">
                    <div className="text-right">
                      <div className="text-xs text-slate-500 dark:text-slate-400">Puntaje</div>
                      <div className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                        {completedResult.score} / {completedResult.totalQuestions} ({completedResult.percentage}%)
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white/70 dark:bg-slate-800/70 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700">
                  {completedResult.summaryFeedback}
                </p>

                {/* Priority Tenses */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Tiempos prioritarios sugeridos para estudiar primero:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {completedResult.priorityTensesToStudy.map((tenseId) => (
                      <button
                        key={tenseId}
                        onClick={() => {
                          onClose();
                          if (onSelectTense) onSelectTense(tenseId);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/10 dark:bg-indigo-400/20 hover:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 font-semibold text-xs border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                      >
                        <span className="capitalize">{tenseId.replace(/-/g, ' ')}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
                <button
                  onClick={handleRestart}
                  className="w-full sm:w-auto px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Repetir Diagnóstico</span>
                </button>

                <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={exportProgressPDF}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <FileDown className="w-4 h-4 text-indigo-500" />
                    <span>Descargar PDF de Nivel</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Comenzar mi Ruta</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
