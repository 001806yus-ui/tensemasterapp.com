import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2, Share2, PlusSquare } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'nav' | 'banner' | 'card' }> = ({
  variant = 'nav'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed standalone PWA, suppress the prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Fallback desktop / unsupported instruction
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === 'nav' ? (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-all shadow-2xs cursor-pointer group"
          title="Instalar TenseMaster en tu dispositivo para estudiar sin internet"
        >
          <Smartphone className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Instalar App</span>
          <span className="text-[10px] bg-indigo-200/60 text-indigo-800 px-1 rounded-sm">PWA</span>
        </button>
      ) : (
        <div className="p-4 bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl border border-indigo-700/50 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/40 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Instalar TenseMaster en tu pantalla</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded-full font-mono">
                  100% Offline
                </span>
              </h4>
              <p className="text-xs text-indigo-200 mt-0.5">
                Accede a los 12 tiempos verbales y tus tarjetas incluso en el avión o sin señal móvil.
              </p>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Instalar ahora</span>
          </button>
        </div>
      )}

      {/* iOS & Mobile Safari installation modal guide */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Instalar TenseMaster en tu Celular
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Sigue estos sencillos pasos para tener la aplicación en tu pantalla de inicio como una app nativa:
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </div>
                <div>
                  En tu navegador (Safari en iPhone o Chrome en Android), pulsa el botón <strong>Compartir</strong> <Share2 className="w-3.5 h-3.5 inline mx-0.5 text-indigo-600" /> o el menú de tres puntos.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </div>
                <div>
                  Desplázate y selecciona <strong>"Agregar a inicio"</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-indigo-600" /> o "Instalar app".
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  ✓
                </div>
                <div>
                  ¡Listo! Se creará el icono de <strong>TenseMaster</strong> para entrar directo sin abrir el navegador y estudiar sin conexión.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
