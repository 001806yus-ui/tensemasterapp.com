import { PushReminderSettings } from '../types';

export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getNotificationPermission = (): 'default' | 'granted' | 'denied' | 'unsupported' => {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
};

export const requestPushPermission = async (): Promise<'default' | 'granted' | 'denied' | 'unsupported'> => {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
};

/**
 * Play a gentle harmonic bell sound using Web Audio API
 */
export const playNotificationChime = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440, ctx.currentTime); // A4
    osc2.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.3); // E5

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.8);
    osc2.stop(ctx.currentTime + 0.8);
  } catch (e) {
    // Audio context may require user interaction
  }
};

export interface SendPushOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
}

export const sendPushNotification = (options: SendPushOptions): boolean => {
  playNotificationChime();

  if (!isNotificationSupported()) {
    console.warn('Native notifications not supported on this platform.');
    return false;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission is not granted.');
    return false;
  }

  try {
    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon || '/icon.svg',
      badge: options.badge || '/icon.svg',
      tag: options.tag || 'tensemaster-reminder',
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  } catch (err) {
    console.error('Error triggering notification:', err);
    return false;
  }
};

export const NOTIFICATION_TEMPLATES = [
  {
    id: 'streak-saver',
    title: '🔥 ¡Salva tu racha de inglés en TenseMaster!',
    body: 'Estás a solo 3 minutos de mantener encendido tu fuego diario. ¡Practica un ejercicio antes de medianoche!'
  },
  {
    id: 'daily-practice',
    title: '🎯 Momento de dominar un tiempo verbal',
    body: '¿Recuerdas cuándo usar Present Perfect vs Past Simple? Haz una ronda rápida de tarjetas de memoria.'
  },
  {
    id: 'pronunciation',
    title: '🎙️ Entrena tu acento en inglés',
    body: 'Usa el micrófono hoy y compara tu pronunciación con hablantes nativos. ¡Gana +15 XP extras!'
  },
  {
    id: 'league-alert',
    title: '🏆 ¡Subiste de posición en el Ranking!',
    body: 'Otros estudiantes están practicando ahora mismo. Completa una lección para proteger tu puesto en el podio.'
  }
];

export const DEFAULT_REMINDER_SETTINGS: PushReminderSettings = {
  enabled: true,
  time: '20:00',
  frequency: 'daily',
  streakAlerts: true,
  permission: 'default'
};
