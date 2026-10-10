import React, { useState } from 'react';
import { ExerciseItem } from '../types';
import { playEnglishAudio } from '../utils/speech';
import { CheckCircle2, XCircle, Volume2, HelpCircle, RotateCcw, ArrowRight, Mic } from 'lucide-react';

interface InteractiveExerciseProps {
  exercise: ExerciseItem;
  exerciseIndex: number;
  totalExercises: number;
  onAnswerSubmit: (isCorrect: boolean) => void;
  onNext: () => void;
  isLast: boolean;
}

export const InteractiveExercise: React.FC<InteractiveExerciseProps> = ({
  exercise,
  exerciseIndex,
  totalExercises,
  onAnswerSubmit,
  onNext,
  isLast
}) => {
  // State for multiple-choice
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // State for fill-in-blank
  const [inputAnswer, setInputAnswer] = useState<string>('');

  // State for sentence-order
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(
    exercise.scrambledWords ? [...exercise.scrambledWords] : []
  );

  // General evaluation state
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Speech Recognition state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechResultText, setSpeechResultText] = useState<string>('');

  const handleAudioPrompt = async (text: string) => {
    setIsPlayingAudio(true);
    await playEnglishAudio(text);
    setIsPlayingAudio(false);
  };

  // Word click for sentence reordering
  const handlePickWord = (word: string, index: number) => {
    if (isSubmitted) return;
    setOrderedWords([...orderedWords, word]);
    const updated = [...availableWords];
    updated.splice(index, 1);
    setAvailableWords(updated);
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (isSubmitted) return;
    setAvailableWords([...availableWords, word]);
    const updated = [...orderedWords];
    updated.splice(index, 1);
    setOrderedWords(updated);
  };

  const handleResetWords = () => {
    if (isSubmitted) return;
    setOrderedWords([]);
    setAvailableWords(exercise.scrambledWords ? [...exercise.scrambledWords] : []);
  };

  // Check answer logic
  const handleCheck = () => {
    let correct = false;

    if (exercise.type === 'multiple-choice') {
      correct = selectedOption === exercise.correctAnswer;
    } else if (exercise.type === 'fill-blank') {
      const cleanInput = inputAnswer.trim().toLowerCase();
      const cleanTarget = (exercise.correctAnswer as string).trim().toLowerCase();
      correct = cleanInput === cleanTarget;
    } else if (exercise.type === 'sentence-order') {
      const targetArray = exercise.correctAnswer as string[];
      correct =
        orderedWords.length === targetArray.length &&
        orderedWords.every((w, idx) => w.toLowerCase() === targetArray[idx].toLowerCase());
    }

    setIsCorrect(correct);
    setIsSubmitted(true);
    onAnswerSubmit(correct);
  };

  const handleNextStep = () => {
    // Reset states for next question
    setSelectedOption(null);
    setInputAnswer('');
    setOrderedWords([]);
    setAvailableWords(exercise.scrambledWords ? [...exercise.scrambledWords] : []);
    setIsSubmitted(false);
    setIsCorrect(null);
    setShowHint(false);
    setSpeechResultText('');
    onNext();
  };

  // Speech practice
  const handleSpeechPractice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Tu navegador no tiene activado el reconocimiento de voz. Te recomendamos Google Chrome.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSpeechResultText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } catch (e) {
      setIsListening(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
      {/* Header index & type */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 text-xs text-slate-500">
        <span className="font-semibold text-indigo-700">
          Ejercicio {exerciseIndex + 1} de {totalExercises}
        </span>
        <div className="flex items-center gap-2">
          {exercise.difficulty && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              exercise.difficulty === 'basic'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : exercise.difficulty === 'intermediate'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : exercise.difficulty === 'advanced'
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200 font-extrabold'
            }`}>
              {exercise.difficulty === 'basic' && '🟢 Básico'}
              {exercise.difficulty === 'intermediate' && '🔵 Intermedio'}
              {exercise.difficulty === 'advanced' && '🟣 Avanzado'}
              {exercise.difficulty === 'expert' && '🔥 Experto (C1/C2)'}
            </span>
          )}
          <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-slate-600">
            {exercise.type === 'multiple-choice' && 'Opción múltiple'}
            {exercise.type === 'sentence-order' && 'Ordenar oración'}
            {exercise.type === 'fill-blank' && 'Completar espacio'}
            {exercise.type === 'pronunciation' && 'Pronunciación'}
          </span>
        </div>
      </div>

      {/* Prompt */}
      <div className="mb-6">
        <h4 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
          {exercise.prompt}
        </h4>
        {exercise.hint && (
          <div className="mt-2">
            {!showHint ? (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Ver pista</span>
              </button>
            ) : (
              <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 inline-block">
                💡 Pista: {exercise.hint}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 1. Multiple Choice Mode */}
      {exercise.type === 'multiple-choice' && exercise.options && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {exercise.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isRight = isSubmitted && option === exercise.correctAnswer;
            const isWrong = isSubmitted && isSelected && !isRight;

            let buttonStyles =
              'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-800';

            if (isSelected && !isSubmitted) {
              buttonStyles = 'border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-2 ring-indigo-500/20';
            } else if (isRight) {
              buttonStyles = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
            } else if (isWrong) {
              buttonStyles = 'border-red-400 bg-red-50 text-red-900';
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isSubmitted}
                onClick={() => setSelectedOption(option)}
                className={`p-3.5 rounded-lg border text-left text-sm font-medium transition-all cursor-pointer flex items-center justify-between gap-2 ${buttonStyles}`}
              >
                <span>{option}</span>
                {isRight && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                {isWrong && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {/* 2. Sentence Order Mode */}
      {exercise.type === 'sentence-order' && (
        <div className="space-y-4 mb-6">
          {/* Target sentence construction dropzone */}
          <div className="min-h-16 p-3.5 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-wrap gap-2 items-center">
            {orderedWords.length === 0 ? (
              <span className="text-xs text-slate-400 italic">
                Haz clic en las palabras de abajo para armar la oración en el orden correcto...
              </span>
            ) : (
              orderedWords.map((word, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => handleRemoveWord(word, idx)}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  {word}
                </button>
              ))
            )}
          </div>

          {/* Reset button */}
          {orderedWords.length > 0 && !isSubmitted && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleResetWords}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reiniciar orden</span>
              </button>
            </div>
          )}

          {/* Word bank choices */}
          <div className="flex flex-wrap gap-2 pt-2">
            {availableWords.map((word, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isSubmitted}
                onClick={() => handlePickWord(word, idx)}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 text-slate-800 rounded-lg text-sm font-medium transition-all cursor-pointer shadow-2xs"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Fill In Blank Mode */}
      {exercise.type === 'fill-blank' && (
        <div className="mb-6 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              disabled={isSubmitted}
              placeholder="Escribe tu respuesta aquí..."
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isSubmitted && handleCheck()}
              className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>
        </div>
      )}

      {/* Explanation Banner when answered */}
      {isSubmitted && (
        <div
          className={`p-4 rounded-xl mb-6 text-xs sm:text-sm border transition-all ${
            isCorrect
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-red-50 border-red-200 text-red-950'
          }`}
        >
          <div className="flex items-center gap-2 font-bold mb-1">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>¡Excelente! Respuesta correcta</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-red-600" />
                <span>Respuesta incorrecta</span>
              </>
            )}
          </div>
          <p className="mt-1 text-slate-700 leading-relaxed">{exercise.explanation}</p>
        </div>
      )}

      {/* Action controls */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div>
          {isSubmitted && (
            <button
              type="button"
              onClick={() => {
                const textToSpeak = Array.isArray(exercise.correctAnswer)
                  ? exercise.correctAnswer.join(' ')
                  : exercise.correctAnswer;
                handleAudioPrompt(textToSpeak);
              }}
              disabled={isPlayingAudio}
              className="inline-flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md font-medium transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Escuchar respuesta</span>
            </button>
          )}
        </div>

        <div>
          {!isSubmitted ? (
            <button
              type="button"
              onClick={handleCheck}
              disabled={
                (exercise.type === 'multiple-choice' && !selectedOption) ||
                (exercise.type === 'sentence-order' && orderedWords.length === 0) ||
                (exercise.type === 'fill-blank' && !inputAnswer.trim())
              }
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Comprobar respuesta
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <span>{isLast ? 'Finalizar Taller' : 'Siguiente ejercicio'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
