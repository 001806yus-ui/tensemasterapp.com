import React, { useState, useRef, useEffect } from 'react';
import { CHAT_TOPICS, ChatTopicConfig, GENERAL_FALLBACK_CORRECTIONS } from '../data/chatbotTopics';
import { ChatMessage, ChatFeedbackData, ChatDifficultyLevel } from '../types';
import { useUser } from '../context/UserContext';
import { playEnglishAudio } from '../utils/speech';
import { sounds } from '../utils/soundEffects';
import {
  Sparkles,
  Send,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Mic,
  MicOff,
  Bot,
  User,
  Info,
  ChevronDown,
  Layers,
  Sparkle,
  Copy,
  Check,
  Languages
} from 'lucide-react';

interface ChatbotViewProps {
  onOpenTenseDetail?: (tenseId: string) => void;
}

export const ChatbotView: React.FC<ChatbotViewProps> = ({ onOpenTenseDetail }) => {
  const { nativeLanguage, logDailyPractice } = useUser();
  const [selectedTopic, setSelectedTopic] = useState<ChatTopicConfig>(CHAT_TOPICS[0]);
  const [difficulty, setDifficulty] = useState<ChatDifficultyLevel>('intermediate');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTranslations, setShowTranslations] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Initialize messages with topic intro
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: selectedTopic.initialBotMessage,
      translation: selectedTopic.initialBotTranslation,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Speech Recognition Setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Tu navegador no soporta entrada de voz por micrófono. Te recomendamos usar Google Chrome o Edge.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      sounds.playClick();
      setIsRecording(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        setIsRecording(false);
      }
    }
  };

  // Reset conversation when topic changes
  const handleSelectTopic = (topic: ChatTopicConfig) => {
    sounds.playClick();
    setSelectedTopic(topic);
    setDifficulty(topic.difficulty);
    setMessages([
      {
        id: `topic-intro-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: topic.initialBotMessage,
        translation: topic.initialBotTranslation,
      },
    ]);
  };

  const handleResetConversation = () => {
    sounds.playClick();
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: selectedTopic.initialBotMessage,
        translation: selectedTopic.initialBotTranslation,
      },
    ]);
  };

  // Send message to Gemini server API
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    sounds.playClick();
    setInputMessage('');

    const userMessageId = `user-${Date.now()}`;
    const newUserMsg: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Call full-stack server endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: updatedMessages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          level: difficulty,
          topic: selectedTopic.id,
          nativeLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      // Check feedback and give points/sound
      if (data.hasErrors) {
        sounds.playIncorrect();
      } else {
        sounds.playCorrect();
        logDailyPractice(15); // Award XP for speaking correct English
      }

      // Add feedback to the user message
      const userMessageWithFeedback: ChatMessage = {
        ...newUserMsg,
        feedback: {
          hasErrors: data.hasErrors,
          feedbackSummary: data.feedbackSummary,
          correctedSentence: data.correctedSentence,
          explanation: data.explanation,
          detectedTenses: data.detectedTenses || [],
          betterAlternative: data.betterAlternative,
          suggestedReplies: data.suggestedReplies || [],
        },
      };

      // Add bot response message
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: data.replyEnglish,
        translation: data.replyTranslation,
      };

      setMessages((prev) => {
        // replace last user msg with feedback version
        const withoutLast = prev.slice(0, -1);
        return [...withoutLast, userMessageWithFeedback, botMsg];
      });
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback offline / local heuristic response
      handleFallbackResponse(text, updatedMessages, newUserMsg);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // Graceful offline fallback if server or network is momentarily unavailable
  const handleFallbackResponse = (
    text: string,
    currentHistory: ChatMessage[],
    userMsg: ChatMessage
  ) => {
    const lower = text.toLowerCase();
    let detectedError: any = null;

    for (const [key, val] of Object.entries(GENERAL_FALLBACK_CORRECTIONS)) {
      if (lower.includes(key)) {
        detectedError = val;
        break;
      }
    }

    const hasErrors = Boolean(detectedError);
    const feedback: ChatFeedbackData = {
      hasErrors,
      feedbackSummary: hasErrors
        ? '¡Buen intento! Te dejamos un pequeño ajuste gramatical para que suenes como nativo.'
        : '¡Excelente estructura gramatical! Tu mensaje se entiende perfectamente.',
      correctedSentence: hasErrors ? detectedError.corrected : undefined,
      explanation: hasErrors
        ? detectedError.explanation
        : 'Usaste los tiempos verbales y la concordancia de forma natural y fluida.',
      detectedTenses: ['Present Simple', 'Past Simple'],
      suggestedReplies: [
        "Yes, absolutely! Let's continue.",
        "Could you explain that rule with another example?",
        "I understand. What should we discuss next?"
      ],
    };

    const fallbackBotReply: ChatMessage = {
      id: `bot-fallback-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `That's very interesting! Could you tell me more about that, or share another detail about your experience?`,
      translation: `¡Eso es muy interesante! ¿Podrías contarme más sobre eso o compartir otro detalle de tu experiencia?`,
    };

    setMessages((prev) => {
      const withoutLast = prev.slice(0, -1);
      return [
        ...withoutLast,
        { ...userMsg, feedback },
        fallbackBotReply,
      ];
    });
  };

  const handleCopyText = (id: string, text: string) => {
    sounds.playClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/30 border border-indigo-400/30 rounded-full text-xs font-semibold text-indigo-200">
              <Bot className="w-3.5 h-3.5 text-indigo-300" />
              <span>TenseMaster AI Conversational Coach</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              Chatbot de Conversación y Corrección en Vivo
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              Practica conversaciones reales en inglés a tu propio ritmo. El tutor inteligente analiza cada una de tus oraciones, te indica si hay errores de tiempos verbales y te enseña cómo hablar como un nativo.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <button
              onClick={() => setShowTranslations(!showTranslations)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-xl border border-white/20 transition-colors cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-300" />
              <span>{showTranslations ? 'Ocultar traducciones' : 'Ver traducciones'}</span>
            </button>
            <button
              onClick={handleResetConversation}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-xl border border-white/20 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-300" />
              <span>Reiniciar diálogo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Topics & Difficulty Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Escenarios y Temas de Práctica</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Elige el contexto en el que deseas entrenar hoy:
            </p>
          </div>

          {/* Level Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
            <span className="text-[10px] text-slate-400 px-2 font-semibold uppercase">Nivel:</span>
            {(['beginner', 'intermediate', 'advanced'] as ChatDifficultyLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  sounds.playClick();
                  setDifficulty(lvl);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all capitalize cursor-pointer ${
                  difficulty === lvl
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lvl === 'beginner' ? 'Básico' : lvl === 'intermediate' ? 'Intermedio' : 'Avanzado'}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {CHAT_TOPICS.map((topic) => {
            const isSelected = selectedTopic.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => handleSelectTopic(topic)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-750 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{topic.icon}</span>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-200'}`}>
                      {topic.title}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {topic.targetTenses.join(', ')}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col h-[650px] overflow-hidden">
        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Body */}
                <div className={`space-y-2 max-w-[85%] sm:max-w-xl ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Bubble */}
                  <div
                    className={`rounded-2xl p-4 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs border border-slate-200/60 dark:border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
                      
                      {/* Audio Play Button */}
                      <button
                        onClick={() => playEnglishAudio(msg.text)}
                        title="Escuchar pronunciación nativa"
                        className={`shrink-0 p-1 rounded-lg transition-colors cursor-pointer ${
                          isUser
                            ? 'hover:bg-indigo-500 text-indigo-100'
                            : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Spanish Translation helper */}
                    {!isUser && showTranslations && msg.translation && (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 italic">
                        {msg.translation}
                      </div>
                    )}
                  </div>

                  {/* Immediate Corrective Feedback Drawer for User Messages */}
                  {isUser && msg.feedback && (
                    <div
                      className={`rounded-2xl p-3.5 text-xs space-y-2 border shadow-xs animate-in fade-in duration-300 ${
                        msg.feedback.hasErrors
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/80 text-amber-950 dark:text-amber-100'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-100'
                      }`}
                    >
                      {/* Feedback Header */}
                      <div className="flex items-center gap-2 font-bold">
                        {msg.feedback.hasErrors ? (
                          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                        <span>{msg.feedback.feedbackSummary}</span>
                      </div>

                      {/* Detected Tenses Tags */}
                      {msg.feedback.detectedTenses.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                            Tiempos detectados:
                          </span>
                          {msg.feedback.detectedTenses.map((tense) => (
                            <span
                              key={tense}
                              className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold"
                            >
                              {tense}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Corrected Sentence if needed */}
                      {msg.feedback.hasErrors && msg.feedback.correctedSentence && (
                        <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800 space-y-1">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                            Corrección recomendada:
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-slate-900 dark:text-white">
                              "{msg.feedback.correctedSentence}"
                            </p>
                            <button
                              onClick={() => playEnglishAudio(msg.feedback?.correctedSentence || '')}
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 cursor-pointer"
                              title="Escuchar versión correcta"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {msg.feedback.explanation && (
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 pt-1 leading-normal">
                              💡 <strong>Explicación:</strong> {msg.feedback.explanation}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Better native alternative / phrasing tip */}
                      {msg.feedback.betterAlternative && (
                        <div className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 pt-0.5">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>
                            <strong>Opción más nativa:</strong> "{msg.feedback.betterAlternative}"
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Timestamp & copy */}
                  <div
                    className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      className="hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      title="Copiar texto"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-xl mr-auto">
              <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-xs p-4 flex items-center gap-2 border border-slate-200/60 dark:border-slate-700/60">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                  El tutor está evaluando tu gramática...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Response Quick Buttons */}
        {(() => {
          const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user' && m.feedback?.suggestedReplies);
          const suggestions = lastUserMsg?.feedback?.suggestedReplies || selectedTopic.starterUserPrompts;
          if (!suggestions || suggestions.length === 0) return null;

          return (
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-850/80 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                Sugerencias:
              </span>
              {suggestions.slice(0, 3).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoading}
                  className="shrink-0 px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer disabled:opacity-50"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          );
        })()}

        {/* Bottom Message Input Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice input button */}
            <button
              type="button"
              onClick={toggleRecording}
              title={isRecording ? 'Detener grabación' : 'Hablar en inglés por micrófono'}
              className={`p-3 rounded-2xl transition-all cursor-pointer ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text input */}
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  isRecording
                    ? 'Escuchando tu voz en inglés...'
                    : 'Escribe tu respuesta en inglés (ej: "I went to Spain last year")...'
                }
                disabled={isLoading}
                className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 rounded-2xl transition-all cursor-pointer disabled:cursor-not-allowed shadow-xs"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400">
            <span>Presiona Enter para enviar · Retroalimentación gramatical en tiempo real</span>
            <span className="font-mono">Gemini AI Coach</span>
          </div>
        </div>
      </div>
    </div>
  );
};
