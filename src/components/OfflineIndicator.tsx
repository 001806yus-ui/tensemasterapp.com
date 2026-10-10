import React, { useState } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Wifi, WifiOff, CheckCircle2, ShieldCheck, X, HardDriveDownload } from 'lucide-react';

interface OfflineIndicatorProps {
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  isSimulatedOffline,
  onToggleSimulatedOffline
}) => {
  const { isOnline, isRealOffline } = useOnlineStatus(isSimulatedOffline);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  return (
    <>
      {/* Floating or Persistent Offline Pill / Toast */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-40 animate-bounce-short">
          <button
            onClick={() => setShowDetailsModal(true)}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-lg text-xs font-semibold cursor-pointer border border-amber-500 transition-all hover:scale-102"
          >
            <div className="w-2 h-2 rounded-full bg-white animate-ping" />
            <WifiOff className="w-4 h-4 text-amber-100" />
            <span>Modo Offline: App 100% funcional sin internet</span>
          </button>
        </div>
      )}

      {/* Offline Diagnostic & Sync Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Centro de Modo Offline & Caché
                  </h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                    isOnline
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isRealOffline
                      ? 'Desconectado de la red'
                      : isSimulatedOffline
                      ? 'Modo Offline Simulado Activo'
                      : 'Conectado a Internet'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              TenseMaster está programada como una Progressive Web App (PWA) de primera clase. Todo el plan de estudios, lógica gramatical y ejercicios funcionan <strong>sin conexión a internet</strong>.
            </p>

            {/* Offline Assets Checklist */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>12 Tiempos del inglés & Fórmulas</span>
                </span>
                <strong className="text-emerald-700 font-mono text-[11px]">100% Offline</strong>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cuestionarios & Flashcards 3D</span>
                </span>
                <strong className="text-emerald-700 font-mono text-[11px]">100% Offline</strong>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Audio & Reconocimiento (Web Speech)</span>
                </span>
                <strong className="text-emerald-700 font-mono text-[11px]">Nativo Offline</strong>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Guardado de Progreso & Rachas</span>
                </span>
                <strong className="text-emerald-700 font-mono text-[11px]">Local Storage</strong>
              </div>

              <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200/80">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 text-center font-bold text-slate-400">ℹ</span>
                  <span>Videos explicativos de YouTube</span>
                </span>
                <span className="font-mono text-[11px] text-slate-400">Requiere red</span>
              </div>
            </div>

            {/* Simulated Offline Toggle for Testing */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onToggleSimulatedOffline}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                  isSimulatedOffline
                    ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <WifiOff className="w-4 h-4" />
                <span>
                  {isSimulatedOffline
                    ? 'Desactivar Modo Offline Simulado'
                    : 'Simular Modo Offline (Probar sin internet)'}
                </span>
              </button>
            </div>

            <button
              onClick={() => setShowDetailsModal(false)}
              className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-medium cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
