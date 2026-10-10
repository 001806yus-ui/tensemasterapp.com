import React, { useState } from 'react';
import {
  X,
  Volume2,
  Check,
  Play,
  Sparkles,
  Radio,
  Sliders,
  RotateCcw
} from 'lucide-react';
import {
  VOICE_PROFILES,
  VoicePersona,
  getPreferredVoicePersona,
  setPreferredVoicePersona,
  testPlayVoice,
  stopAudio
} from '../utils/speech';

interface VoiceSettingsModalProps {
  onClose: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({ onClose }) => {
  const [selectedPersona, setSelectedPersona] = useState<VoicePersona>(() => getPreferredVoicePersona());
  const [isPlayingPersona, setIsPlayingPersona] = useState<VoicePersona | null>(null);

  const handleSelect = (persona: VoicePersona) => {
    setSelectedPersona(persona);
    setPreferredVoicePersona(persona);
  };

  const handleTestAudio = async (persona: VoicePersona, e: React.MouseEvent) => {
    e.stopPropagation();
    stopAudio();
    setIsPlayingPersona(persona);
    await testPlayVoice(persona);
    setIsPlayingPersona(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full my-auto shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-900 via-indigo-950 to-slate-900 text-white relative">
          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="absolute right-4 top-4 p-1.5 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-teal-200 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Motor de Voz Humana HD (Sin Sonido Robótico)</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif">
            Personalizar Voz de los Audios
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-md">
            Elige la voz nativa que prefieras para todas las lecciones, oraciones y ejercicios de la aplicación.
          </p>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="font-semibold uppercase tracking-wider">Voces Nativa de Estudio Disponibles:</span>
            <span>Haz clic para probar</span>
          </div>

          <div className="space-y-2.5">
            {VOICE_PROFILES.map((profile) => {
              const isSelected = selectedPersona === profile.id;
              const isPlaying = isPlayingPersona === profile.id;

              return (
                <div
                  key={profile.id}
                  onClick={() => handleSelect(profile.id)}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                          isSelected
                            ? 'bg-teal-600 border-teal-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {profile.label}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {profile.accent}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                        {profile.tagline}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleTestAudio(profile.id, e)}
                    disabled={isPlaying}
                    title="Escuchar muestra de esta voz"
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                      isPlaying
                        ? 'bg-teal-600 text-white animate-pulse'
                        : 'bg-white dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700 shadow-2xs'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPlaying ? 'Hablando...' : 'Probar'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs space-y-1 text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>¿Por qué suena ahora mucho más natural?</span>
            </div>
            <p className="leading-relaxed">
              Hemos conectado los motores neuronales de alta definición (Google Neural, Apple Enhanced y Microsoft Natural) con entonación cálida y micro-pausas gramaticales, eliminando la voz robótica plana de antes.
            </p>
          </div>

          {/* Action button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => {
                stopAudio();
                onClose();
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
            >
              Guardar y Continuar
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
