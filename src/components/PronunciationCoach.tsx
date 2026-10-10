import React, { useState, useEffect, useRef } from 'react';
import {
  startPronunciationRecognition,
  evaluatePronunciation,
  isSpeechRecognitionSupported,
  requestMicrophoneAccess,
  playEnglishAudio,
  stopAudio,
  RecognitionController,
  PronunciationEvaluation
} from '../utils/speech';
import { useUser } from '../context/UserContext';
import {
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Award,
  ChevronRight,
  Info,
  Lock,
  Headphones,
  Play,
  Pause,
  Square
} from 'lucide-react';

interface PronunciationCoachProps {
  targetSentence: string;
  translation: string;
  audioText: string;
  onSuccessXP?: () => void;
}

export const PronunciationCoach: React.FC<PronunciationCoachProps> = ({
  targetSentence,
  translation,
  audioText,
  onSuccessXP
}) => {
  const { logDailyPractice } = useUser();
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [evaluation, setEvaluation] = useState<PronunciationEvaluation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasAwardedXP, setHasAwardedXP] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [isManualPracticeDone, setIsManualPracticeDone] = useState(false);
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const [hasAttemptedRecord, setHasAttemptedRecord] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [selfGraded, setSelfGraded] = useState<string | null>(null);

  const controllerRef = useRef<RecognitionController | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const userAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isRecordingRef = useRef<boolean>(false);

  const isSpeechSupported = isSpeechRecognitionSupported();

  // Reset when sentence changes
  useEffect(() => {
    setInterimTranscript('');
    setFinalTranscript('');
    setEvaluation(null);
    setErrorMessage(null);
    setHasAwardedXP(false);
    setIsManualPracticeDone(false);
    setIsPlayingUserAudio(false);
    setHasAttemptedRecord(false);
    setRecordingSeconds(0);
    setMicVolume(0);
    setSelfGraded(null);
    isRecordingRef.current = false;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (userAudioUrl) {
      URL.revokeObjectURL(userAudioUrl);
      setUserAudioUrl(null);
    }
    if (userAudioElementRef.current) {
      userAudioElementRef.current.pause();
      userAudioElementRef.current = null;
    }
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
  }, [targetSentence]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isRecordingRef.current = false;
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (userAudioUrl) {
        URL.revokeObjectURL(userAudioUrl);
      }
      if (userAudioElementRef.current) {
        userAudioElementRef.current.pause();
        userAudioElementRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [userAudioUrl]);

  const handleRequestPermission = async () => {
    setIsRequestingPermission(true);
    const res = await requestMicrophoneAccess();
    setIsRequestingPermission(false);
    if (res.granted) {
      setErrorMessage(null);
      setTimeout(() => {
        handleStartRecording();
      }, 200);
    } else {
      setErrorMessage(
        'El navegador tiene el micrófono bloqueado. Haz clic en el candado 🔒 de tu barra de navegación (arriba) y cambia "Micrófono" a "Permitir".'
      );
    }
  };

  const handleManualPracticeComplete = () => {
    setIsManualPracticeDone(true);
    if (!hasAwardedXP) {
      logDailyPractice(15);
      setHasAwardedXP(true);
      onSuccessXP?.();
    }
  };

  const handleSelfGrade = (grade: string) => {
    setSelfGraded(grade);
    if (!hasAwardedXP) {
      logDailyPractice(15);
      setHasAwardedXP(true);
      onSuccessXP?.();
    }
  };

  const handleStartRecording = async () => {
    setErrorMessage(null);
    setInterimTranscript('');
    setFinalTranscript('');
    setEvaluation(null);
    setIsPlayingUserAudio(false);
    setHasAttemptedRecord(true);
    setRecordingSeconds(0);
    setMicVolume(0);
    setSelfGraded(null);

    if (userAudioUrl) {
      URL.revokeObjectURL(userAudioUrl);
      setUserAudioUrl(null);
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage('Tu navegador no admite grabación directa de micrófono. Te recomendamos Google Chrome o Safari.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;
      isRecordingRef.current = true;
      setIsRecording(true);

      // Start duration timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      // Setup Audio Visualizer (AnalyserNode) to give clear visual feedback of voice volume
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateVolume = () => {
            if (!isRecordingRef.current) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            const normalized = Math.min(100, Math.round((avg / 128) * 100));
            setMicVolume(normalized);
            animFrameRef.current = requestAnimationFrame(updateVolume);
          };
          updateVolume();
        }
      } catch (e) {
        console.warn('AudioContext volume meter initialization skipped:', e);
      }

      // Setup MediaRecorder
      let mimeType = '';
      if (typeof MediaRecorder.isTypeSupported === 'function') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        }
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const finalType = recorder.mimeType || mimeType || 'audio/webm';
          const blob = new Blob(audioChunksRef.current, { type: finalType });
          const url = URL.createObjectURL(blob);
          setUserAudioUrl(url);
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(100);
      mediaRecorderRef.current = recorder;

      // Optional Speech Recognition on supported engines
      if (isSpeechSupported) {
        const controller = startPronunciationRecognition({
          onStart: () => {},
          onInterimResult: (currentText) => {
            setInterimTranscript(currentText);
          },
          onFinalResult: (transcriptText) => {
            setFinalTranscript(transcriptText);
            const evalResult = evaluatePronunciation(targetSentence, transcriptText);
            setEvaluation(evalResult);

            if (evalResult.isPassing && !hasAwardedXP) {
              logDailyPractice(15);
              setHasAwardedXP(true);
              onSuccessXP?.();
            }
          },
          onError: (err) => {
            console.warn('SpeechRecognition notice:', err);
            // Do not break audio recording if SpeechRecognition is noisy
          },
          onEnd: () => {
            // SpeechRecognition naturally finished phrase
          },
        });
        controllerRef.current = controller;
      }
    } catch (err: any) {
      console.warn('getUserMedia error:', err);
      setIsRecording(false);
      isRecordingRef.current = false;
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage(
          'El micrófono no tiene permisos otorgados. Haz clic en el candado 🔒 o en la configuración de permisos de tu navegador y activa "Micrófono: Permitir".'
        );
      } else {
        setErrorMessage('No se pudo acceder al micrófono: ' + (err.message || 'Verifica que tu micrófono esté conectado'));
      }
    }
  };

  const handleStopRecording = () => {
    isRecordingRef.current = false;
    setIsRecording(false);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setMicVolume(0);

    if (controllerRef.current) {
      controllerRef.current.stop();
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        if (typeof mediaRecorderRef.current.requestData === 'function') {
          mediaRecorderRef.current.requestData();
        }
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn('Error stopping MediaRecorder:', e);
      }
    }
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const handleListenModel = async (rate: number = 0.94) => {
    if (isPlayingUserAudio && userAudioElementRef.current) {
      userAudioElementRef.current.pause();
      setIsPlayingUserAudio(false);
    }
    setIsPlayingAudio(true);
    await playEnglishAudio(audioText, rate);
    setIsPlayingAudio(false);
  };

  const handleTogglePlayUserAudio = () => {
    if (!userAudioUrl) return;

    if (isPlayingUserAudio) {
      if (userAudioElementRef.current) {
        userAudioElementRef.current.pause();
        userAudioElementRef.current.currentTime = 0;
      }
      setIsPlayingUserAudio(false);
    } else {
      stopAudio(); // Stop any reference audio
      if (!userAudioElementRef.current) {
        userAudioElementRef.current = new Audio(userAudioUrl);
        userAudioElementRef.current.onended = () => {
          setIsPlayingUserAudio(false);
        };
        userAudioElementRef.current.onerror = () => {
          setIsPlayingUserAudio(false);
        };
      } else {
        userAudioElementRef.current.src = userAudioUrl;
      }
      userAudioElementRef.current
        .play()
        .then(() => {
          setIsPlayingUserAudio(true);
        })
        .catch(() => {
          setIsPlayingUserAudio(false);
        });
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              Entrenador de Pronunciación en Tiempo Real
            </span>
            <span className="text-[11px] text-slate-500">
              Usa el micrófono de tu dispositivo para comparar tu dicción
            </span>
          </div>
        </div>

        {/* Audio Model playback */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleListenModel(0.94)}
            disabled={isPlayingAudio}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer shadow-xs ${
              isPlayingAudio ? 'ring-2 ring-indigo-400 animate-pulse' : ''
            }`}
            title="Escuchar pronunciación nativa de referencia"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingAudio ? 'Hablando...' : '🔊 Escuchar al Profesor'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleListenModel(0.75)}
            disabled={isPlayingAudio}
            className="text-xs font-semibold px-2.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 cursor-pointer shadow-2xs transition-colors"
            title="Escuchar a velocidad lenta"
          >
            🐢 0.8x Lento
          </button>
        </div>
      </div>

      {/* Target Sentence Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
          Frase objetivo a pronunciar:
        </span>
        <div className="text-base sm:text-lg font-bold text-slate-900">
          "{targetSentence}"
        </div>
        <div className="text-xs text-slate-500 italic pb-1">
          {translation}
        </div>

        {/* Botón azul directo para escuchar pronunciación del profesor */}
        <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => handleListenModel(0.94)}
            disabled={isPlayingAudio}
            className={`px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-all active:scale-95 ${
              isPlayingAudio ? 'ring-2 ring-indigo-400 animate-pulse' : ''
            }`}
            title="Escuchar pronunciación nativa de la frase"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingAudio ? '🔊 Hablando...' : '🔊 Escuchar Pronunciación (Profesor)'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleListenModel(0.75)}
            disabled={isPlayingAudio}
            className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Escuchar a velocidad lenta"
          >
            <span>🐢 Lento 0.8x</span>
          </button>
        </div>
      </div>

      {/* Microphone Record Action Stage - Always available to all browsers */}
      <div className="flex flex-col items-center justify-center py-2 space-y-3">
        <div className="relative">
          {/* Animated Pulse waves when recording */}
          {isRecording && (
            <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping scale-125" />
          )}

          <button
            type="button"
            onClick={handleToggleRecord}
            className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer shadow-md ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white ring-4 ring-red-400/40 animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105 active:scale-95'
            }`}
            title={isRecording ? 'Presiona para detener la grabación' : 'Presiona para grabar tu pronunciación'}
          >
            {isRecording ? (
              <Square className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
            ) : (
              <Mic className="w-7 h-7 sm:w-8 sm:h-8" />
            )}
          </button>
        </div>

        <div className="text-center space-y-1.5 w-full max-w-sm">
          {isRecording ? (
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-bold text-red-600 block animate-pulse">
                🔴 Grabando tu voz... (00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds})
              </span>

              {/* Live sound level audio visualizer */}
              <div className="flex flex-col items-center gap-1 py-1">
                <div className="flex items-center gap-1 h-5">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 rounded-full transition-all duration-75 ${
                        micVolume > (i + 1) * 7
                          ? 'bg-emerald-500 h-5 shadow-xs'
                          : 'bg-slate-200 dark:bg-slate-700 h-2'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-emerald-700">
                  {micVolume > 10 ? '🎙️ Micrófono captando sonido' : 'Habla en voz alta cerca del micrófono'}
                </span>
              </div>

              <span className="text-[11px] text-slate-600 block">
                Lee la frase en inglés y pulsa el botón cuando termines:
              </span>
              <button
                type="button"
                onClick={handleStopRecording}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>⏹️ Terminar Grabación y Escucharme</span>
              </button>
            </div>
          ) : (
            <>
              <span className="text-xs sm:text-sm font-bold block text-slate-800">
                Toca el círculo para grabar tu voz
              </span>
              <span className="text-[11px] text-slate-500 block">
                Presiona el micrófono, di la frase en inglés y luego tócalo para detenerlo y escucharte
              </span>

              {/* Botón azul visible para escuchar al profesor en computadora y celular */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleListenModel(0.94)}
                  disabled={isPlayingAudio}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition-colors cursor-pointer border border-indigo-200 shadow-2xs"
                  title="Escuchar audio modelo nativo"
                >
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                  <span>🔊 Escuchar al Profesor antes de grabar</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Real-time live transcript as user speaks */}
        {isRecording && interimTranscript && (
          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs font-mono text-indigo-950 w-full text-center animate-fade-in">
            <span className="text-slate-400 text-[10px] block font-sans">Escuchando en tiempo real:</span>
            "{interimTranscript}"
          </div>
        )}
      </div>

      {/* RECORDED AUDIO PLAYBACK & COMPARISON CARD (TU VOZ VS NATIVO) */}
      {(userAudioUrl || evaluation || finalTranscript) && !isRecording && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-50 via-indigo-50 to-purple-50 border-2 border-teal-300 dark:border-teal-700 rounded-2xl space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-teal-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-950">
                Reproducción de Audio: Tu Voz vs Modelo Nativo
              </span>
            </div>
            <span className="text-[11px] font-bold text-teal-800 bg-white px-2.5 py-0.5 rounded-full border border-teal-200 shadow-2xs">
              {userAudioUrl ? '✓ Grabación lista' : '✓ Dicción procesada'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Button 1: Play User Voice */}
            <div className="p-3.5 bg-white rounded-xl border border-teal-200 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5 text-teal-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                  <span>1. Tu Voz Grabada:</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Micrófono</span>
              </div>

              {userAudioUrl ? (
                <>
                  <button
                    type="button"
                    onClick={handleTogglePlayUserAudio}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                      isPlayingUserAudio
                        ? 'bg-teal-700 text-white animate-pulse'
                        : 'bg-teal-600 hover:bg-teal-500 text-white hover:scale-[1.01] active:scale-[0.99]'
                    }`}
                  >
                    {isPlayingUserAudio ? (
                      <>
                        <Pause className="w-4 h-4 fill-white" />
                        <span>⏸️ Pausar Mi Grabación</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>▶️ Escuchar Mi Voz Grabada</span>
                      </>
                    )}
                  </button>

                  {/* Barra de audio integrada para control total en computadora y celular */}
                  <audio
                    controls
                    src={userAudioUrl}
                    className="w-full mt-2 h-9 rounded-lg"
                    title="Controlador de reproducción de voz"
                  />

                  <span className="text-[11px] text-slate-500 text-center block pt-0.5">
                    Haz clic en el botón verde o usa la barra para escuchar cómo se escuchó tu voz
                  </span>
                </>
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg text-center space-y-1">
                  <span className="text-xs font-semibold text-slate-700 block">
                    Voz transcrita por el navegador:
                  </span>
                  <span className="text-xs font-mono text-indigo-700 font-bold block">
                    "{finalTranscript || 'Texto capturado'}"
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Para escuchar el modelo nativo correcto, usa el botón azul a la derecha 👉
                  </span>
                </div>
              )}
            </div>

            {/* Button 2: Native Reference Voice */}
            <div className="p-3.5 bg-white rounded-xl border border-indigo-200 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5 text-indigo-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span>2. Profesor Nativo:</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Referencia</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleListenModel(0.94)}
                  disabled={isPlayingAudio}
                  className={`flex-1 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                    isPlayingAudio
                      ? 'bg-indigo-700 text-white animate-pulse'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-[1.01] active:scale-[0.99]'
                  }`}
                  title="Escuchar audio modelo nativo"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlayingAudio ? 'Hablando...' : '🔊 Escuchar Nativo'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleListenModel(0.75)}
                  disabled={isPlayingAudio}
                  className="py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  title="Escuchar a velocidad lenta para notar cada fonema"
                >
                  <span>🐢 Lento</span>
                </button>
              </div>
              <span className="text-[11px] text-slate-500 text-center block pt-2">
                Haz clic en el botón azul para comparar tu pronunciación con el nativo
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Self-evaluation card when voice was recorded but automatic speech recognition didn't grade */}
      {userAudioUrl && !evaluation && !isRecording && (
        <div className="bg-white border-2 border-emerald-200 rounded-xl p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-sm text-slate-900">
                ¡Tu voz se grabó perfectamente!
              </span>
            </div>
            {hasAwardedXP && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                +15 XP sumados
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Puedes escuchar tu grabación arriba usando el botón verde <strong>"▶️ Escuchar Mi Voz Grabada"</strong> y compararla con el botón azul <strong>"🔊 Escuchar Nativo"</strong>.
          </p>

          <div className="pt-1">
            <span className="text-xs font-bold text-slate-800 block mb-2">
              ¿Cómo sentiste tu pronunciación al compararte con el nativo?
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleSelfGrade('excelente')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                  selfGraded === 'excelente'
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <span>🌟 Excelente (+15 XP)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelfGrade('buena')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                  selfGraded === 'buena'
                    ? 'bg-teal-600 text-white ring-2 ring-teal-400'
                    : 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100'
                }`}
              >
                <span>👍 Bastante parecida (+15 XP)</span>
              </button>

              <button
                type="button"
                onClick={handleStartRecording}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Grabar de nuevo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pronunciation Feedback & Evaluation Results */}
      {evaluation && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
          {/* Header Score Gauge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div
                className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-mono font-bold text-lg shadow-2xs border ${
                  evaluation.accuracyScore >= 80
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : evaluation.accuracyScore >= 60
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}
              >
                <span>{evaluation.accuracyScore}%</span>
                <span className="text-[9px] font-sans font-normal uppercase tracking-wider">Acierto</span>
              </div>

              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                  {evaluation.isPassing ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>¡Excelente dicción!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Sigue practicando</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {evaluation.feedbackMessage}
                </p>
              </div>
            </div>

            {evaluation.isPassing && hasAwardedXP && (
              <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-800 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>+15 XP ganados</span>
              </div>
            )}
          </div>

          {/* Word-by-word accuracy visual breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Desglose palabra por palabra:</span>
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Correcto
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Impreciso
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-400" /> Omitido/Mejorar
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              {evaluation.words.map((item, idx) => {
                const styles =
                  item.status === 'correct'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : item.status === 'imperfect'
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-red-100 text-red-900 border-red-300';

                return (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border flex items-center gap-1 ${styles}`}
                    title={
                      item.status === 'correct'
                        ? 'Pronunciación correcta'
                        : item.status === 'imperfect'
                        ? `Detectado como: "${item.spokenWord || ''}"`
                        : 'No se detectó con claridad'
                    }
                  >
                    <span>{item.targetWord}</span>
                    <span className="text-[10px] opacity-75">
                      {item.status === 'correct' && '✓'}
                      {item.status === 'imperfect' && '~'}
                      {item.status === 'missing' && '✗'}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Comparison summary */}
          <div className="text-xs text-slate-500 space-y-1 font-mono pt-1">
            <div>
              <span className="text-slate-400 font-sans">El micrófono reconoció: </span>
              <span className="text-slate-800 italic">"{finalTranscript}"</span>
            </div>
          </div>

          {/* Action buttons after evaluation */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleListenModel(0.94)}
                disabled={isPlayingAudio}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                title="Escuchar pronunciación nativa de la frase"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingAudio ? 'Hablando...' : '🔊 Escuchar al Profesor'}</span>
              </button>

              {userAudioUrl && (
                <button
                  type="button"
                  onClick={handleTogglePlayUserAudio}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                  title="Escuchar cómo sonó tu voz grabada"
                >
                  {isPlayingUserAudio ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pausar mi voz</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>▶️ Escuchar mi voz</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleStartRecording}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Intentar de nuevo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
