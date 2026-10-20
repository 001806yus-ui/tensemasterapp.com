import { readTutorResponse } from '../utils/tutorResponse';
import { RecordedDictation } from './RecordedDictation';
import { useLocalization } from "../i18n/LocalizationContext";
import React, { useState, useRef, useEffect } from 'react';
import { CHAT_TOPICS, ChatTopicConfig } from '../data/chatbotTopics';
import { ChatMessage, ChatDifficultyLevel } from '../types';
import { useUser } from '../context/UserContext';
import { playEnglishAudio, unlockAudio } from '../utils/speech';
import { sounds } from '../utils/soundEffects';
import { MicrophonePermissionModal } from './MicrophonePermissionModal';
import { SupportedLanguage } from '../i18n/translations';

const TUTOR_RESPONSE_NOTE: Record<SupportedLanguage, string> = {
  en: 'The tutor may take a few seconds to respond. Your message will be kept if you need to try again.',
  es: 'El tutor puede tardar unos segundos en responder. Tu mensaje se guardará si necesitas intentarlo de nuevo.',
  fr: 'Le tuteur peut prendre quelques secondes pour répondre. Votre message sera conservé si vous devez réessayer.',
  de: 'Der Tutor kann einige Sekunden brauchen, um zu antworten. Deine Nachricht bleibt gespeichert, falls du es noch einmal versuchen musst.',
  it: 'Il tutor potrebbe richiedere alcuni secondi per rispondere. Il tuo messaggio verrà conservato se devi riprovare.',
  pt: 'O tutor pode levar alguns segundos para responder. Sua mensagem será mantida se você precisar tentar novamente.',
  zh: '导师回复可能需要几秒钟。如果需要重试，您的消息将被保留。',
  hi: 'ट्यूटर को उत्तर देने में कुछ सेकंड लग सकते हैं। यदि आपको पुनः प्रयास करने की आवश्यकता हो तो आपका संदेश सुरक्षित रहेगा।',
  id: 'Tutor mungkin memerlukan beberapa detik untuk merespons. Pesan Anda akan tetap disimpan jika Anda perlu mencoba lagi.',
  vi: 'Gia sư có thể mất vài giây để phản hồi. Tin nhắn của bạn sẽ được giữ lại nếu bạn cần thử lại.',
  tr: 'Eğitmenin yanıt vermesi birkaç saniye sürebilir. Tekrar denemeniz gerekirse mesajınız korunacaktır.',
  ar: 'قد يستغرق المعلم بضع ثوانٍ للرد. سيتم الاحتفاظ برسالتك إذا احتجت إلى المحاولة مرة أخرى.',
  ru: 'Ответ репетитора может занять несколько секунд. Ваше сообщение сохранится, если понадобится повторить попытку.',
  ja: 'チューターの返信には数秒かかる場合があります。やり直す必要がある場合でも、メッセージは保持されます。',
};
import {
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  Headphones,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Mic,
  Bot,
  User,
  Info,
  ChevronDown,
  Layers,
  Sparkle,
  Copy,
  Check,
  Languages,
  Lock } from
'lucide-react';

interface ChatbotViewProps {
  onOpenTenseDetail?: (tenseId: string) => void;
  initialPrompt?: string;
}

export const ChatbotView: React.FC<ChatbotViewProps> = ({ onOpenTenseDetail, initialPrompt }) => {const { l } = useLocalization();
  const { nativeLanguage, logDailyPractice, t } = useUser();
  const [selectedTopic, setSelectedTopic] = useState<ChatTopicConfig>(CHAT_TOPICS[0]);
  const [difficulty, setDifficulty] = useState<ChatDifficultyLevel>('intermediate');
  const [inputMessage, setInputMessage] = useState(() => { try { return sessionStorage.getItem('tensemaster-tutor-draft') || ''; } catch { return ''; } });
  const [sendError, setSendError] = useState('');
  const sending = useRef(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => { request.current?.abort(); }, []);
  useEffect(() => { try { sessionStorage.setItem('tensemaster-tutor-draft', inputMessage); } catch {} }, [inputMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTranslations, setShowTranslations] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [autoVoice, setAutoVoice] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [recordedBusy, setRecordedBusy] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

  // Initialize messages with topic intro
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
  {
    id: 'welcome-1',
    sender: 'assistant',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: selectedTopic.initialBotMessage,
    translation: selectedTopic.initialBotTranslation
  }]
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Audio player wrapper
  const playBotAudio = async (text: string) => {
    setIsPlayingAudio(true);
    unlockAudio();
    try {
      await playEnglishAudio(text);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const handleTestAudio = async () => {
    unlockAudio();
    sounds.playClick();
    sounds.playVictory(); // Immediate chime sound confirms physical speakers are unmuted
    await playBotAudio("Hello! I am your English practice tutor. Can you hear me clearly through your speakers?");
  };

  // Handle initialPrompt if provided
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Reset conversation when topic changes
  const handleSelectTopic = (topic: ChatTopicConfig) => {
    if (sending.current || recordedBusy) return;
    setSendError('');
    sounds.playClick();
    setSelectedTopic(topic);
    setDifficulty(topic.difficulty);
    setMessages([
    {
      id: `topic-intro-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: topic.initialBotMessage,
      translation: topic.initialBotTranslation
    }]
    );
    if (autoVoice && topic.initialBotMessage) {
      setTimeout(() => {
        playBotAudio(topic.initialBotMessage);
      }, 300);
    }
  };

  const handleResetConversation = () => {
    if (sending.current || recordedBusy) return;
    setSendError('');
    sounds.playClick();
    setMessages([
    {
      id: `reset-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: selectedTopic.initialBotMessage,
      translation: selectedTopic.initialBotTranslation
    }]
    );
    if (autoVoice && selectedTopic.initialBotMessage) {
      setTimeout(() => {
        playBotAudio(selectedTopic.initialBotMessage);
      }, 300);
    }
  };

  // Send message to Gemini server API
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || sending.current || recordedBusy) return;
    sending.current = true;
    const controller = new AbortController();
    request.current = controller;
    setSendError('');

    sounds.playClick();

    const userMessageId = `user-${Date.now()}`;
    const newUserMsg: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Call full-stack server endpoint
      const response = await fetch('/api/chat', {
        method: 'POST', signal: AbortSignal.any([controller.signal, AbortSignal.timeout(30000)]),
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-8).map((m) => ({
            sender: m.sender,
            text: m.text
          })),
          level: difficulty,
          topic: selectedTopic.id,
          nativeLanguage
        })
      });

      const data = await readTutorResponse(response);
      if (controller.signal.aborted) return;
      setInputMessage('');

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
          suggestedReplies: data.suggestedReplies || []
        }
      };

      // Add bot response message
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: data.replyEnglish,
        translation: data.replyTranslation
      };

      setMessages((prev) => {
        // replace last user msg with feedback version
        const withoutLast = prev.slice(0, -1);
        return [...withoutLast, userMessageWithFeedback, botMsg];
      });

      // Automatically speak bot response aloud!
      if (autoVoice && data.replyEnglish) {
        setTimeout(() => {
          playBotAudio(data.replyEnglish);
        }, 150);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        // Roll back only this unacknowledged turn. Retry must not duplicate it.
        setMessages(messages);
        setInputMessage(text);
        const reason = err instanceof Error && err.name === 'TutorResponseError'
          ? err.message
          : 'The connection was interrupted. Your message is saved. Try again when you are connected.';
        setSendError(reason);
      }
    } finally {
      sending.current = false;
      request.current = null;
      if (!controller.signal.aborted) {
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  };

  const handleCopyText = (id: string, text: string) => {
    sounds.playClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-3 sm:py-5 flex-1 flex flex-col gap-3 sm:gap-4 w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-950 text-white rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden border border-purple-800/40 shrink-0">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-semibold text-purple-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Bot className="w-3.5 h-3.5 text-amber-300" />
              <span>{l('English conversation practice')}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
              {l('Practice with your tutor')}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
              {l('Choose a topic, write or record an answer, then send it. Get a short correction and a follow-up question.')}
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <button
              onClick={() => setShowTranslations(!showTranslations)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-xl border border-white/20 transition-colors cursor-pointer">
              
              <Languages className="w-3.5 h-3.5 text-indigo-300" />
              <span>{l(showTranslations ? t.tutorHideTrans : t.tutorShowTrans)}</span>
            </button>
            <button
              onClick={handleResetConversation}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-xl border border-white/20 transition-colors cursor-pointer">
              
              <RotateCcw className="w-3.5 h-3.5 text-indigo-300" />
              <span>{l(t.tutorReset)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Topics & Difficulty Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm space-y-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{l(t.tutorScenariosTitle)}</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              {l(t.tutorScenariosSubtitle)}
            </p>
          </div>

          {/* Level Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium self-start sm:self-auto shrink-0">
            <span className="text-[10px] text-slate-400 px-2 font-semibold uppercase">{l(t.tutorLevelLabel)}</span>
            {l((['beginner', 'intermediate', 'advanced'] as ChatDifficultyLevel[]).map((lvl) =>
            <button
              key={lvl}
              onClick={() => {
                if (sending.current || recordedBusy) return;
                sounds.playClick();
                setDifficulty(lvl);
              }}
              className={`px-2.5 py-1 rounded-lg transition-all capitalize cursor-pointer text-xs ${
              difficulty === lvl ?
              'bg-indigo-600 text-white font-bold shadow-xs' :
              'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`
              }>
              
                {l(lvl === 'beginner' ? t.tutorLevelBasic || 'Básico' : lvl === 'intermediate' ? t.tutorLevelIntermediate || 'Intermedio' : t.tutorLevelAdvanced || 'Avanzado')}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2 max-h-40 sm:max-h-none overflow-y-auto sm:overflow-visible pr-0.5">
          {l(CHAT_TOPICS.map((topic) => {
            const isSelected = selectedTopic.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => handleSelectTopic(topic)}
                className={`text-left p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${
                isSelected ?
                'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-600 shadow-xs' :
                'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-750 hover:border-slate-300 dark:hover:border-slate-600'}`
                }>
                
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg shrink-0">{l(topic.icon)}</span>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-200'}`}>
                      {l(topic.title)}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {l(topic.targetTenses.join(', '))}
                    </p>
                  </div>
                </div>
              </button>);

          }))}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col flex-1 min-h-[540px] sm:min-h-[640px] lg:min-h-[720px] h-[580px] sm:h-[680px] lg:h-[760px] xl:h-[800px] overflow-hidden w-full">
        {/* Active Scenario Header Bar (Compact & Sleek) */}
        {l(selectedTopic.photoUrl &&
        <div className="relative h-12 sm:h-14 shrink-0 border-b border-slate-200 dark:border-slate-800 overflow-hidden">
            <img
            src={selectedTopic.photoUrl}
            alt={l(selectedTopic.title)}
            className="w-full h-full object-cover opacity-35 dark:opacity-20" />
          
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/60 flex items-center justify-between px-3 sm:px-5 text-white">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span className="text-xl sm:text-2xl shrink-0">{l(selectedTopic.icon)}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold truncate text-white">
                      {l(selectedTopic.title)}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold uppercase shrink-0">
                      {l(t.tutorActiveScenario)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-amber-300 truncate">
                    <span className="hidden sm:inline">{l(t.tutorKeyTenses)}</span>
                    <span className="font-mono truncate">{l(selectedTopic.targetTenses.join(' · '))}</span>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-1.5 text-xs bg-white/10 px-2.5 py-1 rounded-xl border border-white/20 backdrop-blur-xs shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{l(t.tutorVisualMemory)}</span>
              </div>
            </div>
          </div>)
        }

        {/* Audio Engine & Live Controls Bar */}
        <div className="px-3 sm:px-4 py-2 shrink-0 bg-slate-50 dark:bg-slate-850/90 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Auto-Voice Toggle */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setAutoVoice(!autoVoice);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              autoVoice ?
              'bg-emerald-600 text-white shadow-xs' :
              'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`
              }
              title={l("Activar o desactivar que el tutor hable en voz alta al responder")}>
              
              {l(autoVoice ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />)}
              <span>{l(autoVoice ? t.tutorVoiceOn : t.tutorVoiceOff)}</span>
            </button>

            {/* Test Audio Button */}
            <button
              type="button"
              onClick={handleTestAudio}
              disabled={isPlayingAudio}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-indigo-700 dark:text-indigo-300 font-semibold border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title={l("Haz clic para comprobar el sonido en los altavoces de tu computadora")}>
              
              <Headphones className="w-3.5 h-3.5 text-indigo-600" />
              <span>{l(isPlayingAudio ? '🔊 ...' : t.tutorTestAudio)}</span>
            </button>

            {/* Test Microphone Button */}
            <button
              type="button"
              onClick={() => setIsPermissionModalOpen(true)}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-teal-700 dark:text-teal-300 font-semibold border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title={l("Comprobar permisos de micrófono y configuración de navegador")}>
              
              <Mic className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{l(t.tutorTestMic)}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Show Translations Toggle */}
            <button
              type="button"
              onClick={() => setShowTranslations(!showTranslations)}
              className="px-2.5 py-1 text-[11px] rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors cursor-pointer flex items-center gap-1">
              
              <Languages className="w-3.5 h-3.5" />
              <span>{l(showTranslations ? t.tutorHideTrans : t.tutorShowTrans)}</span>
            </button>

            {/* Reset Chat */}
            <button
              type="button"
              onClick={handleResetConversation}
              className="px-2 py-1 text-[11px] rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors cursor-pointer flex items-center gap-1"
              title={l(t.tutorReset || 'Reiniciar')}>
              
              <RotateCcw className="w-3 h-3" />
              <span>{l(t.tutorReset)}</span>
            </button>
          </div>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 min-h-[260px] sm:min-h-[380px] lg:min-h-[460px] overflow-y-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6 overscroll-contain">
          {l(messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2 sm:gap-3.5 max-w-3xl w-full ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                
                {/* Avatar */}
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                  isUser ?
                  'bg-indigo-600 text-white' :
                  'bg-emerald-600 text-white'}`
                  }>
                  {l(isUser ? <User className="w-4 h-4 sm:w-5 sm:h-5" /> : <Bot className="w-4 h-4 sm:w-5 sm:h-5" />)}
                </div>

                {/* Message Body */}
                <div className={`space-y-2 flex-1 min-w-0 max-w-[90%] sm:max-w-2xl ${isUser ? 'items-end ml-auto' : 'items-start mr-auto'}`}>
                  {/* Bubble */}
                  <div
                    className={`rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser ?
                    'bg-indigo-600 text-white rounded-tr-xs ml-auto' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs border border-slate-200/60 dark:border-slate-700/60'}`
                    }>
                    
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3">
                      <p className="font-medium whitespace-pre-wrap break-words flex-1 min-w-0 leading-relaxed text-xs sm:text-sm">{msg.text}</p>
                      
                      {/* Audio Play Button */}
                      <button
                        onClick={() => playBotAudio(msg.text)}
                        title={l(t.listenAudio || 'Escuchar')}
                        className={`self-end sm:self-start shrink-0 px-2 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold ${
                        isUser ?
                        'hover:bg-indigo-500 text-indigo-100' :
                        'hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-750 border border-slate-200 dark:border-slate-700'}`
                        }>
                        
                        <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="text-[11px] hidden sm:inline">{l(t.listenAudio || 'Escuchar')}</span>
                      </button>
                    </div>

                    {/* Spanish Translation helper */}
                    {l(!isUser && nativeLanguage !== 'en' && showTranslations && msg.translation &&
                    <div className="mt-2.5 pt-2.5 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed break-words">
                        {l(msg.translation)}
                      </div>)
                    }
                  </div>

                  {/* Immediate Corrective Feedback Drawer for User Messages */}
                  {l(isUser && msg.feedback &&
                  <div
                    className={`rounded-2xl p-3 sm:p-3.5 text-xs space-y-2 border shadow-xs animate-in fade-in duration-300 ${
                    msg.feedback.hasErrors ?
                    'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/80 text-amber-950 dark:text-amber-100' :
                    'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-100'}`
                    }>
                    
                      {/* Feedback Header */}
                      <div className="flex items-center gap-2 font-bold">
                        {l(msg.feedback.hasErrors ?
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" /> :

                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />)
                      }
                        <span className="break-words">{l(msg.feedback.feedbackSummary)}</span>
                      </div>

                      {/* Detected Tenses Tags */}
                      {l(msg.feedback.detectedTenses.length > 0 &&
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">{l("Tiempos detectados: ")}

                      </span>
                          {l(msg.feedback.detectedTenses.map((tense) =>
                      <span
                        key={tense}
                        className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                        
                              {l(tense)}
                            </span>
                      ))}
                        </div>)
                    }

                      {/* Corrected Sentence if needed */}
                      {l(msg.feedback.hasErrors && msg.feedback.correctedSentence &&
                    <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800 space-y-1">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">{l("Corrección recomendada: ")}

                      </div>
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-slate-900 dark:text-white break-words">
                              "{msg.feedback.correctedSentence}"
                            </p>
                            <button
                          onClick={() => playEnglishAudio(msg.feedback?.correctedSentence || '')}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 cursor-pointer shrink-0"
                          title={l("Escuchar versión correcta")}>
                          
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {l(msg.feedback.explanation &&
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 pt-1 leading-normal break-words">
                              💡 <strong>{l("Explicación:")}</strong> {l(msg.feedback.explanation)}
                            </p>)
                      }
                        </div>)
                    }

                      {/* Better native alternative / phrasing tip */}
                      {l(msg.feedback.betterAlternative &&
                    <div className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 pt-0.5 break-words">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>
                            <strong>{l("Opción más nativa:")}</strong> "{l(msg.feedback.betterAlternative)}"
                          </span>
                        </div>)
                    }
                    </div>)
                  }

                  {/* Timestamp & copy */}
                  <div
                    className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${
                    isUser ? 'justify-end' : 'justify-start'}`
                    }>
                    
                    <span>{l(msg.timestamp)}</span>
                    <button
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      className="hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      title={l("Copiar texto")}>
                      
                      {l(copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />)}
                    </button>
                  </div>
                </div>
              </div>);

          }))}

          {/* Loading indicator */}
          {l(isLoading &&
          <div className="flex gap-3 max-w-xl mr-auto">
              <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-xs p-4 flex items-center gap-2 border border-slate-200/60 dark:border-slate-700/60">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                  {l(t.tutorEvaluating)}
                </span>
              </div>
            </div>)
          }

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Response Quick Buttons - Wrap to separate lines on mobile */}
        {l((() => {
          const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user' && m.feedback?.suggestedReplies);
          const suggestions = lastUserMsg?.feedback?.suggestedReplies || selectedTopic.starterUserPrompts;
          if (!suggestions || suggestions.length === 0) return null;

          return (
            <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 dark:bg-slate-850/80 border-t border-slate-200/80 dark:border-slate-800 shrink-0 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-1.5 sm:gap-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                {l(t.tutorSuggestions)}
              </span>
              {l(suggestions.slice(0, 3).map((prompt, idx) =>
              <button
                key={idx}
                onClick={() => { setInputMessage(prompt); inputRef.current?.focus(); }}
                disabled={isLoading}
                className="w-full sm:w-auto px-3 py-2 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer disabled:opacity-50 text-left text-xs leading-normal break-words shadow-2xs">
                  "{l(prompt)}"
                </button>
              ))}
            </div>);

        })())}

        {/* Bottom Message Input Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
          {sendError && <div role="alert" className="mb-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
            <p>{l(sendError)}</p>
            <p className="mt-1 text-xs">{l('Your answer has not been evaluated. Edit it below or retry. You can also continue with the lessons.')}</p>
            <button type="button" disabled={isLoading || recordedBusy || !inputMessage.trim()} onClick={() => handleSendMessage()}
              className="mt-2 rounded-lg bg-indigo-600 px-3 py-2 font-semibold text-white disabled:opacity-50 cursor-pointer">{l('Retry')}</button>
          </div>}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!recordedBusy) handleSendMessage();
            }}
            className="flex items-center gap-2 w-full">
            
            {/* Text input */}
            <div className="relative flex-1 min-w-0">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={l(t.tutorInputPlaceholder || 'Write your answer in English...')}
                disabled={isLoading}
                className="w-full pl-3.5 sm:pl-4 pr-3 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              aria-label={l("Send message")}
              disabled={!inputMessage.trim() || isLoading || recordedBusy}
              className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 rounded-2xl transition-all cursor-pointer disabled:cursor-not-allowed shadow-xs shrink-0 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold">
              <Send className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>{l(isLoading ? 'Sending…' : 'Send')}</span>
            </button>
          </form>
          <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 px-1 leading-snug">
            {TUTOR_RESPONSE_NOTE[nativeLanguage] || TUTOR_RESPONSE_NOTE.en}
          </p>
          <RecordedDictation disabled={isLoading} onBusy={setRecordedBusy} onTranscript={text => {
            setInputMessage(previous => [previous.trim(), text].filter(Boolean).join(" "));
            setMicError(null);
            inputRef.current?.focus();
          }} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-2 px-1 text-[11px] text-slate-400">
            <span className="leading-tight">{l('Review your text, then tap Send. Your draft stays in this browser tab until sent.')}</span>
            <span className="font-mono text-[10px] sm:text-[11px] shrink-0">{l("Guided Practice")}</span>
          </div>
        </div>
      </div>

      {/* Explicit Microphone & Audio Permission Modal */}
      <MicrophonePermissionModal
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        onPermissionGranted={() => {
          setMicError(null);
          inputRef.current?.focus();
        }}
        onUseTextMessage={() => {
          inputRef.current?.focus();
        }}
        initialError={micError || undefined} />
      
    </div>);

};
