import React, { useState, useEffect, useRef } from 'react';
import { DuelQuestion, DuelOpponent, DuelStats } from '../types';
import { DUEL_QUESTIONS, DUEL_OPPONENTS } from '../data/duelData';
import { useUser } from '../context/UserContext';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  Swords,
  Trophy,
  Zap,
  Timer,
  Flame,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  UserCheck,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Smile,
  Heart
} from 'lucide-react';

const DUEL_STATS_KEY = 'tensemaster_duel_stats_v1';

export const DuelModeView: React.FC = () => {
  const { progressState, logDailyPractice } = useUser();
  const [duelStats, setDuelStats] = useState<DuelStats>(() => {
    try {
      const saved = localStorage.getItem(DUEL_STATS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      lp: 1250,
      division: 'Plata',
      wins: 8,
      losses: 3,
      currentStreak: 2,
      bestStreak: 5
    };
  });

  // Duel match states: 'lobby' | 'matchmaking' | 'battle' | 'results'
  const [gameState, setGameState] = useState<'lobby' | 'matchmaking' | 'battle' | 'results'>('lobby');
  const [selectedOpponent, setSelectedOpponent] = useState<DuelOpponent>(DUEL_OPPONENTS[0]);

  // Battle session states
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [matchQuestions, setMatchQuestions] = useState<DuelQuestion[]>([]);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(12);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [opponentAnswerIndex, setOpponentAnswerIndex] = useState<number | null>(null);
  const [isRoundAnswered, setIsRoundAnswered] = useState<boolean>(false);
  const [playerCombo, setPlayerCombo] = useState<number>(0);
  const [floatingReaction, setFloatingReaction] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Persist duel stats
  useEffect(() => {
    try {
      localStorage.setItem(DUEL_STATS_KEY, JSON.stringify(duelStats));
    } catch (e) {}
  }, [duelStats]);

  // Round timer countdown
  useEffect(() => {
    if (gameState !== 'battle' || isRoundAnswered) return;

    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft((prev) => {
        if (prev <= 4 && prev > 1) {
          sounds.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState, timeLeft, isRoundAnswered]);

  const startMatchmaking = (opponent?: DuelOpponent) => {
    sounds.playClick();
    const targetOpponent = opponent || DUEL_OPPONENTS[Math.floor(Math.random() * DUEL_OPPONENTS.length)];
    setSelectedOpponent(targetOpponent);
    setGameState('matchmaking');

    // Shuffle 5 questions for this 5-round duel
    const shuffled = [...DUEL_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 5);
    setMatchQuestions(shuffled);

    // Simulate match connection delay
    setTimeout(() => {
      setPlayerScore(0);
      setOpponentScore(0);
      setCurrentRound(0);
      setPlayerCombo(0);
      setTimeLeft(12);
      setSelectedAnswerIndex(null);
      setOpponentAnswerIndex(null);
      setIsRoundAnswered(false);
      setGameState('battle');
      sounds.playClick();
    }, 1400);
  };

  const handleTimeOut = () => {
    if (isRoundAnswered) return;
    setIsRoundAnswered(true);
    sounds.playIncorrect();
    setPlayerCombo(0);

    // Opponent still has a chance to answer
    simulateOpponentAnswer(matchQuestions[currentRound], 0);
  };

  const handleSelectAnswer = (index: number) => {
    if (isRoundAnswered || !matchQuestions[currentRound]) return;
    setIsRoundAnswered(true);
    setSelectedAnswerIndex(index);

    const question = matchQuestions[currentRound];
    const isCorrect = index === question.correctIndex;

    // Calculate score: 100 base + speed bonus + combo bonus
    const speedBonus = Math.max(0, timeLeft * 8);
    const comboMultiplier = playerCombo >= 2 ? 1.5 : playerCombo >= 1 ? 1.2 : 1.0;

    if (isCorrect) {
      sounds.playCorrect();
      const points = Math.round((100 + speedBonus) * comboMultiplier);
      setPlayerScore((prev) => prev + points);
      setPlayerCombo((prev) => prev + 1);
    } else {
      sounds.playIncorrect();
      setPlayerCombo(0);
    }

    // Simulate opponent's answer with human-like delay
    simulateOpponentAnswer(question, timeLeft);
  };

  const simulateOpponentAnswer = (question: DuelQuestion, playerAnswerTimeLeft: number) => {
    const accuracy = selectedOpponent.accuracy;
    const willOpponentBeRight = Math.random() < accuracy;
    const opponentIndex = willOpponentBeRight
      ? question.correctIndex
      : (question.correctIndex + 1) % question.options.length;

    setOpponentAnswerIndex(opponentIndex);

    if (willOpponentBeRight) {
      const oppSpeed = Math.floor(Math.random() * 8) + 3;
      const oppPoints = 100 + oppSpeed * 5;
      setOpponentScore((prev) => prev + oppPoints);
    }
  };

  const handleNextRound = () => {
    sounds.playClick();
    if (currentRound < matchQuestions.length - 1) {
      setCurrentRound((prev) => prev + 1);
      setTimeLeft(12);
      setSelectedAnswerIndex(null);
      setOpponentAnswerIndex(null);
      setIsRoundAnswered(false);
    } else {
      finishDuel();
    }
  };

  const finishDuel = () => {
    setGameState('results');
    const isWinner = playerScore > opponentScore;

    if (isWinner) {
      sounds.playVictory();
      confetti({ particleCount: 70, spread: 70 });
      logDailyPractice(150); // +150 XP for winning duel
      setDuelStats((prev) => {
        const newLp = prev.lp + 35;
        const newStreak = prev.currentStreak + 1;
        const div = newLp >= 2000 ? 'Diamante' : newLp >= 1200 ? 'Oro' : 'Plata';
        return {
          ...prev,
          lp: newLp,
          division: div,
          wins: prev.wins + 1,
          currentStreak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak)
        };
      });
    } else {
      sounds.playIncorrect();
      logDailyPractice(40); // consolation XP for participating
      setDuelStats((prev) => ({
        ...prev,
        lp: Math.max(0, prev.lp - 15),
        losses: prev.losses + 1,
        currentStreak: 0
      }));
    }
  };

  const currentQ = matchQuestions[currentRound];
  const isWinner = playerScore > opponentScore;
  const isDraw = playerScore === opponentScore;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Lobby View */}
      {gameState === 'lobby' && (
        <div className="space-y-8">
          {/* Header Hero Banner */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-purple-800/40">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center gap-1.5">
                    <Swords className="w-3.5 h-3.5 text-rose-400" />
                    Modo Duelo 1v1 Gramatical
                  </span>
                  <span className="text-xs text-purple-200">
                    5 rondas de reflejos · 12 segundos por pregunta
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight text-white">
                  Duelo de Tiempos Verbales
                </h1>
                <p className="text-sm sm:text-base text-purple-200/90 mt-2 max-w-2xl">
                  Enfréntate a otros estudiantes en tiempo real o reta al Bot Entrenador. Demuestra tu velocidad identificando fórmulas y tiempos bajo presión.
                </p>
              </div>

              {/* Quick Play Button */}
              <button
                onClick={() => startMatchmaking()}
                className="px-6 py-3.5 bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white font-extrabold text-sm rounded-xl shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Zap className="w-5 h-5 text-amber-300" />
                <span>¡Duelo Rápido Ahora!</span>
              </button>
            </div>

            {/* Duel League Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-purple-800/60 text-xs">
              <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-800/40">
                <span className="text-purple-300 font-medium block">División Actual</span>
                <span className="text-lg font-black text-amber-300 flex items-center gap-1 mt-0.5">
                  <Trophy className="w-4 h-4" /> Liga {duelStats.division}
                </span>
              </div>
              <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-800/40">
                <span className="text-purple-300 font-medium block">Puntos de Liga (LP)</span>
                <span className="text-lg font-black text-white mt-0.5">
                  {duelStats.lp} LP
                </span>
              </div>
              <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-800/40">
                <span className="text-purple-300 font-medium block">Racha de Victorias</span>
                <span className="text-lg font-black text-rose-400 flex items-center gap-1 mt-0.5">
                  <Flame className="w-4 h-4" /> {duelStats.currentStreak} seguidas
                </span>
              </div>
              <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-800/40">
                <span className="text-purple-300 font-medium block">Historial V/D</span>
                <span className="text-lg font-black text-emerald-400 mt-0.5">
                  {duelStats.wins}V - {duelStats.losses}D ({Math.round((duelStats.wins / (duelStats.wins + duelStats.losses || 1)) * 100)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Opponents Selection Deck */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Rivales Disponibles en Línea
                </h2>
                <p className="text-xs text-slate-500">
                  Selecciona a quién retar o pulsa en Duelo Rápido para emparejamiento automático.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DUEL_OPPONENTS.map((opp) => (
                <div
                  key={opp.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 transition-all flex flex-col justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={opp.avatar}
                      alt={opp.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200 dark:border-indigo-800"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {opp.name}
                        </span>
                        <span>{opp.flag}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded-sm font-semibold">
                          {opp.level}
                        </span>
                        <span>·</span>
                        <span>{opp.lp} LP</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <span>Efectividad: {opp.winRate}%</span>
                    <button
                      onClick={() => startMatchmaking(opp)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
                    >
                      <Swords className="w-3.5 h-3.5" />
                      <span>Retar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Matchmaking Animation */}
      {gameState === 'matchmaking' && (
        <div className="max-w-md mx-auto py-16 text-center space-y-6">
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600/30 border-t-indigo-600 animate-spin" />
            <Swords className="w-12 h-12 text-rose-500 animate-pulse" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-serif">
              Conectando con {selectedOpponent.name}...
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Sincronizando preguntas de 5 rondas para el duelo verbal
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-xs mx-auto flex items-center gap-3">
            <img
              src={selectedOpponent.avatar}
              alt={selectedOpponent.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-left text-xs">
              <span className="font-bold text-slate-900 dark:text-white block">
                {selectedOpponent.name} {selectedOpponent.flag}
              </span>
              <span className="text-slate-500">
                {selectedOpponent.level} · {selectedOpponent.lp} LP
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Battle Arena */}
      {gameState === 'battle' && currentQ && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Top Battle HUD: Player vs Opponent */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between gap-4">
              {/* Player 1 (User) */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    {progressState.userName.charAt(0) || 'T'}
                  </div>
                  {playerCombo >= 2 && (
                    <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full animate-bounce">
                      x{playerCombo}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                    {progressState.userName || 'Tú'}
                  </span>
                  <span className="text-base sm:text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                    {playerScore} pts
                  </span>
                </div>
              </div>

              {/* Center VS & Timer */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-400 mb-1">
                  <span>Ronda {currentRound + 1} / 5</span>
                </div>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black font-mono ${
                  timeLeft <= 3
                    ? 'bg-rose-100 text-rose-600 animate-ping'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  <Timer className="w-3.5 h-3.5" />
                  <span>{timeLeft}s</span>
                </div>
              </div>

              {/* Player 2 (Opponent) */}
              <div className="flex items-center gap-3 flex-row-reverse text-right">
                <img
                  src={selectedOpponent.avatar}
                  alt={selectedOpponent.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-rose-400"
                />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                    {selectedOpponent.name} {selectedOpponent.flag}
                  </span>
                  <span className="text-base sm:text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
                    {opponentScore} pts
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Tension Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  timeLeft <= 4 ? 'bg-rose-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${(timeLeft / 12) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl text-center space-y-4">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Enfoque: {currentQ.tenseFocus}
            </span>

            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {currentQ.prompt}
            </h3>

            <div className="text-lg sm:text-2xl font-serif font-bold text-slate-900 dark:text-white px-4 py-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700">
              {currentQ.sentenceWithBlank}
            </div>

            {/* Options Deck */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswerIndex === idx;
                const isCorrect = idx === currentQ.correctIndex;
                const isOpponentChoice = opponentAnswerIndex === idx;

                let cardStyle = 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-800 dark:text-slate-100';

                if (isRoundAnswered) {
                  if (isCorrect) {
                    cardStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20';
                  } else if (isSelected) {
                    cardStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-300';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isRoundAnswered}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`p-4 rounded-2xl border font-semibold text-sm transition-all text-left relative flex items-center justify-between cursor-pointer ${cardStyle}`}
                  >
                    <span>{option}</span>

                    <div className="flex items-center gap-1">
                      {isOpponentChoice && isRoundAnswered && (
                        <span className="text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded-full font-bold">
                          Rival
                        </span>
                      )}
                      {isSelected && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      {isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation on round end */}
            {isRoundAnswered && (
              <div className="mt-4 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-left animate-in fade-in">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 block mb-1">
                  💡 Explicación de la Ronda:
                </span>
                <p className="text-xs text-indigo-800 dark:text-indigo-300">
                  {currentQ.explanation}
                </p>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleNextRound}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{currentRound < 4 ? 'Siguiente Ronda' : 'Ver Resultados Finales'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Screen */}
      {gameState === 'results' && (
        <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-2xl space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 border border-amber-200 dark:border-amber-800 flex items-center justify-center shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
              {isWinner ? '¡Victoria Rotunda! 🎉' : isDraw ? '¡Empate Técnico! 🤝' : '¡Buen Intento! ⚔️'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isWinner
                ? 'Has superado a tu oponente con reflejos gramaticales de élite.'
                : 'La práctica constante bajo presión afina tus reflejos para hablar inglés fluido.'}
            </p>
          </div>

          {/* Final Scoreboard */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Tus Puntos</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                {playerScore}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">{selectedOpponent.name}</span>
              <span className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
                {opponentScore}
              </span>
            </div>
          </div>

          {/* Rewards Breakdown */}
          <div className="flex items-center justify-around py-3 border-y border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>{isWinner ? '+150 XP' : '+40 XP'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
              <Trophy className="w-4 h-4" />
              <span>{isWinner ? '+35 LP' : '-15 LP'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold">
              <Flame className="w-4 h-4" />
              <span>Racha: {duelStats.currentStreak}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => startMatchmaking(selectedOpponent)}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Revancha Inmediata</span>
            </button>

            <button
              onClick={() => setGameState('lobby')}
              className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
            >
              Volver al Lobby de Duelos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
