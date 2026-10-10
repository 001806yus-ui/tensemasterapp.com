import React, { useState, useEffect } from 'react';
import { PushReminderSettings } from '../types';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestPushPermission,
  sendPushNotification,
  playNotificationChime,
  NOTIFICATION_TEMPLATES
} from '../utils/notifications';
import {
  Bell,
  BellRing,
  X,
  CheckCircle2,
  Clock,
  Flame,
  AlertTriangle,
  Sparkles,
  Volume2,
  Send
} from 'lucide-react';

interface PushRemindersModalProps {
  settings: PushReminderSettings;
  onUpdateSettings: (newSettings: PushReminderSettings) => void;
  onClose: () => void;
  streakDays: number;
}

export const PushRemindersModal: React.FC<PushRemindersModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  streakDays
}) => {
  const [permission, setPermission] = useState(getNotificationPermission());
  const [reminderTime, setReminderTime] = useState(settings.time || '20:00');
  const [frequency, setFrequency] = useState<'daily' | 'weekdays' | 'weekends'>(settings.frequency || 'daily');
  const [streakAlerts, setStreakAlerts] = useState(settings.streakAlerts !== false);
  const [testNotificationSent, setTestNotificationSent] = useState(false);
  const [inAppToast, setInAppToast] = useState<{ title: string; body: string } | null>(null);

  const supported = isNotificationSupported();

  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  const handleRequestPermission = async () => {
    const res = await requestPushPermission();
    setPermission(res);
    onUpdateSettings({
      ...settings,
      permission: res,
      enabled: res === 'granted'
    });
  };

  const handleSaveSettings = () => {
    onUpdateSettings({
      ...settings,
      time: reminderTime,
      frequency,
      streakAlerts,
      enabled: permission === 'granted'
    });
    onClose();
  };

  const handleSendTestNotification = () => {
    const template = NOTIFICATION_TEMPLATES[0];
    const customTitle = `🔥 ¡Mantén tu racha de ${streakDays || 1} días en TenseMaster!`;
    const customBody = 'Solo te tomará 3 minutos hoy repasar los 12 tiempos del inglés. ¡Tu meta está al alcance!';

    const sent = sendPushNotification({
      title: customTitle,
      body: customBody
    });

    setTestNotificationSent(true);

    // Show simulated in-app notification banner as visual guarantee
    setInAppToast({
      title: customTitle,
      body: customBody
    });

    setTimeout(() => {
      setInAppToast(null);
    }, 6000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">
                Recordatorios Push de Estudio
              </h3>
              <p className="text-xs text-slate-500">
                Avisos discretos en tu celular o PC para proteger tu racha diaria
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Permission Status Box */}
        <div className="p-4 rounded-xl border bg-slate-50/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              Permiso de Notificaciones en este Navegador:
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              permission === 'granted'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : permission === 'denied'
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {permission === 'granted'
                ? '✓ Habilitado'
                : permission === 'denied'
                ? '✗ Bloqueado en navegador'
                : 'Pendiente de activar'}
            </span>
          </div>

          {permission !== 'granted' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
              <p className="text-xs text-slate-600">
                {permission === 'denied'
                  ? 'Las notificaciones están bloqueadas en la configuración de este navegador. Haz clic en el icono del candado en la barra de URL para permitirlas.'
                  : 'Autoriza las alertas para recibir recordatorios incluso si tienes la pestaña cerrada.'}
              </p>
              {permission !== 'denied' && (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-2xs"
                >
                  Permitir Notificaciones
                </button>
              )}
            </div>
          )}
        </div>

        {/* Reminder Time Picker */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>¿A qué hora te gustaría practicar inglés?</span>
          </label>

          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Mañana (8:00 AM)', val: '08:00' },
              { label: 'Almuerzo (1:30 PM)', val: '13:30' },
              { label: 'Tarde (7:00 PM)', val: '19:00' },
              { label: 'Noche (9:00 PM)', val: '21:00' },
            ].map((slot) => (
              <button
                key={slot.val}
                type="button"
                onClick={() => setReminderTime(slot.val)}
                className={`p-2.5 rounded-xl text-center border text-xs font-medium transition-all cursor-pointer ${
                  reminderTime === slot.val
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold shadow-2xs ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="font-mono text-sm">{slot.val}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{slot.label.split(' ')[0]}</div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
            <span>O ajusta una hora exacta:</span>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-mono font-bold bg-white"
            />
          </div>
        </div>

        {/* Frequency & Streak Alert Options */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800">
              Frecuencia de recordatorios:
            </label>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setFrequency('daily')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  frequency === 'daily' ? 'bg-white font-bold text-indigo-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Diario
              </button>
              <button
                type="button"
                onClick={() => setFrequency('weekdays')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  frequency === 'weekdays' ? 'bg-white font-bold text-indigo-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Lun-Vie
              </button>
              <button
                type="button"
                onClick={() => setFrequency('weekends')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  frequency === 'weekends' ? 'bg-white font-bold text-indigo-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Fin de semana
              </button>
            </div>
          </div>

          {/* Streak Danger Saver Toggle */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Flame className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-950 block">
                  Protector de Racha Nocturna
                </span>
                <span className="text-[11px] text-amber-800 leading-tight block">
                  Si son las 8:30 PM y aún no has completado tu ejercicio diario, te avisaremos para evitar perder tus días acumulados.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={streakAlerts}
              onChange={(e) => setStreakAlerts(e.target.checked)}
              className="w-4 h-4 mt-1 accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Live Test Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSendTestNotification}
            className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4 text-indigo-600" />
            <span>Enviar Notificación de Prueba Ahora (Probar Sonido & Push)</span>
          </button>
        </div>

        {/* Live in-app toast preview when sent */}
        {inAppToast && (
          <div className="p-3.5 bg-indigo-900 text-white rounded-xl shadow-lg border border-indigo-700 flex items-start gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] text-indigo-300 font-mono block">Vista previa de notificación:</span>
              <div className="text-xs font-bold">{inAppToast.title}</div>
              <div className="text-[11px] text-indigo-200 mt-0.5">{inAppToast.body}</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSaveSettings}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Guardar Preferencias
          </button>
        </div>

      </div>
    </div>
  );
};
