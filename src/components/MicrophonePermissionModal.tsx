import { useLocalization } from "../i18n/LocalizationContext";
import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Lock,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  X,
  HelpCircle,
  Headphones,
  RotateCcw,
  ExternalLink,
  MessageSquare } from
'lucide-react';
import {
  detectBrowser,
  getBrowserInstructions,
  requestMicrophonePermission,
  MicPermissionResult } from
'../utils/microphonePermission';
import { playEnglishAudio, unlockAudio } from '../utils/speech';
import { sounds } from '../utils/soundEffects';

interface MicrophonePermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionGranted?: () => void;
  onUseTextMessage?: () => void;
  initialError?: string;
}

export const MicrophonePermissionModal: React.FC<MicrophonePermissionModalProps> = ({
  isOpen,
  onClose,
  onPermissionGranted,
  onUseTextMessage,
  initialError
}) => {const { l } = useLocalization();
  const browser = detectBrowser();
  const instructions = getBrowserInstructions(browser);

  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<MicPermissionResult | null>(null);
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [audioTestSuccess, setAudioTestSuccess] = useState<boolean | null>(null);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    setIsChecking(true);
    setResult(null);
    unlockAudio();
    sounds.playClick();

    try {
      const res = await requestMicrophonePermission();
      setResult(res);

      if (res.granted) {
        sounds.playCorrect();
        setTimeout(() => {
          onPermissionGranted?.();
          onClose();
        }, 1200);
      } else {
        sounds.playIncorrect();
      }
    } finally {
      setIsChecking(false);
    }
  };

  const handleTestSpeakers = async () => {
    setIsTestingAudio(true);
    setAudioTestSuccess(null);
    unlockAudio();
    sounds.playClick();

    try {
      // Play chime first
      sounds.playVictory();
      // Then speak sample sentence
      const spoken = await playEnglishAudio(
        "Hello! I am your 24/7 personal English tutor. Can you hear me clearly through your speakers?"
      );
      setAudioTestSuccess(spoken);
    } catch {
      setAudioTestSuccess(false);
    } finally {
      setIsTestingAudio(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mic-modal-title">
        
        {/* Top Decorative Gradient */}
        <div className="h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
              <MicOff className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">{l("Configuración de Voz ")}

                </span>
                <span className="text-xs text-slate-400">
                  {l(browser.name.toUpperCase())} · {l(browser.os.toUpperCase())}
                </span>
              </div>
              <h2 id="mic-modal-title" className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-white mt-0.5">{l("Permiso de Micrófono y Audio del Tutor ")}

              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            aria-label={l("Cerrar ventana")}>
            
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Main Friendly Notice */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-4 text-xs sm:text-sm text-amber-950 dark:text-amber-100 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{l("El tutor no puede escucharte porque el micrófono no está autorizado")}</span>
            </div>
            <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
              {l(initialError ||
              'Los navegadores modernos bloquean el micrófono por privacidad hasta que tú lo autorizas explícitamente. Actívalo en 1 clic para que tu tutor reconozca tu pronunciación.')}
            </p>
          </div>

          {/* Visual Address Bar Mockup (Guides user directly to the lock icon or tune icon) */}
          <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-500" />
                <span>{l("¿No ves el candado? Mira aquí en tu navegador:")}</span>
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">{l("Chrome / Edge / Safari")}</span>
            </div>

            {/* Browser Address Bar Illustration */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-2.5 border-2 border-indigo-200 dark:border-indigo-800/60 shadow-xs flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-700 rounded-lg text-indigo-700 dark:text-indigo-300 font-bold text-xs animate-pulse shrink-0">
                <span>{l("🔒 o 🎛️")}</span>
                <span>{l("(A la izquierda)")}</span>
              </div>
              <div className="text-xs font-mono text-slate-400 dark:text-slate-500 truncate flex-1">{l("https://ais-.../ ")}

              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-700 rounded-lg text-rose-700 dark:text-rose-300 font-bold text-[11px] shrink-0">
                <span>🎤❌</span>
                <span className="hidden sm:inline">{l("(A la derecha)")}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/50">
              💡 <strong>{l("¿Por qué no ves el candado?")}</strong>{l(" En las versiones recientes de Google Chrome y Microsoft Edge, el candado 🔒 fue reemplazado por el ícono de dos interruptores ")}<strong>{l("🎛️ (Ajustes del sitio)")}</strong>{l(". También puedes buscar un icono de ")}<strong>{l("micrófono con una cruz roja 🎤❌")}</strong>{l(" al final de la barra de direcciones en la esquina derecha. ")}
            </p>
          </div>

          {/* Browser Specific Step-by-Step Instructions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{l(instructions.title)}</span>
            </h3>

            <ol className="space-y-2.5 pl-1">
              {l(instructions.steps.map((step, idx) =>
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {l(idx + 1)}
                  </span>
                  <span className="leading-relaxed">{l(step)}</span>
                </li>
              ))}
            </ol>

            {l(instructions.tip &&
            <div className="text-[11px] bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-slate-600 dark:text-slate-400 italic">
                💡 <strong>{l("Consejo:")}</strong> {l(instructions.tip)}
              </div>)
            }
          </div>

          {/* Result Feedback Banner */}
          {l(result &&
          <div
            className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
            result.granted ?
            'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100' :
            'bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-100'}`
            }>
            
              {l(result.granted ?
            <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm">{l("¡Micrófono activado con éxito!")}</strong>
                    <span>{l("Ya puedes hablar libremente con tu tutor. Cerrando ventana...")}</span>
                  </div>
                </> :

            <>
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm">{l("Sigue bloqueado")}</strong>
                    <span>{l(result.errorMessage || 'Asegúrate de cambiar "Micrófono" a "Permitir" en el candado 🔒 y haz clic de nuevo en el botón.')}</span>
                  </div>
                </>)
            }
            </div>)
          }

          {/* Audio Speaker Test Section */}
          <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>{l("¿Tampoco escuchas la voz del tutor?")}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{l("Comprueba si los altavoces de tu computadora están encendidos y sin silenciar. ")}

              </p>
            </div>

            <button
              type="button"
              onClick={handleTestSpeakers}
              disabled={isTestingAudio}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-xs disabled:opacity-50">
              
              <Volume2 className="w-4 h-4" />
              <span>{l(isTestingAudio ? 'Reproduciendo audio...' : 'Probar Altavoces')}</span>
            </button>
          </div>

          {l(audioTestSuccess !== null &&
          <div className="text-xs p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-purple-600" />
              <span>
                {l(audioTestSuccess ?
              'Sonido enviado a los altavoces. Si no lo escuchaste, revisa el volumen físico de tu computadora o auriculares.' :
              'No se pudo reproducir audio. Haz clic en la pantalla para activar el audio de tu navegador.')}
              </span>
            </div>)
          }
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-850/80 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onUseTextMessage?.();
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5">
            
            <MessageSquare className="w-4 h-4" />
            <span>{l("Usar Modo Teclado (Escribir en el chat)")}</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleRequestPermission}
              disabled={isChecking}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95">
              
              <Mic className="w-4 h-4" />
              <span>{l(isChecking ? 'Verificando...' : 'Volver a solicitar permiso')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>);

};
