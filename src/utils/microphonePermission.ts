/**
 * Microphone permissions helper utilities
 * Provides explicit permission requests, browser detection, and step-by-step guidance.
 */

export type PermissionStatusResult = 'granted' | 'denied' | 'prompt' | 'unsupported' | 'device-error';

export interface BrowserInfo {
  name: 'chrome' | 'edge' | 'safari' | 'firefox' | 'opera' | 'other';
  isMobile: boolean;
  os: 'ios' | 'android' | 'macos' | 'windows' | 'linux' | 'other';
}

export interface MicPermissionResult {
  granted: boolean;
  status: PermissionStatusResult;
  error?: string;
  errorMessage?: string;
  browser: BrowserInfo;
}

// Browser site permissions do not override the embedding page's Permissions Policy.
export const getMicrophoneEnvironmentError = (): string | null => {
  if (typeof window === 'undefined') return 'Voice recording requires a browser.';
  if (window.isSecureContext === false) return 'Microphone access requires a secure HTTPS page.';
  const policy = (document as Document & {
    permissionsPolicy?: { allowsFeature: (feature: string) => boolean };
    featurePolicy?: { allowsFeature: (feature: string) => boolean };
  });
  const activePolicy = policy.permissionsPolicy || policy.featurePolicy;
  if (activePolicy && !activePolicy.allowsFeature('microphone')) {
    return 'This preview does not allow microphone access. The app owner must enable the microphone permission for the preview, then reload it. Changing browser permissions alone will not fix this.';
  }
  return null;
};

/**
 * Detect user browser and operating system
 */
export const detectBrowser = (): BrowserInfo => {
  if (typeof window === 'undefined') {
    return { name: 'other', isMobile: false, os: 'other' };
  }

  const userAgent = navigator.userAgent || '';
  const vendor = navigator.vendor || '';

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  let os: BrowserInfo['os'] = 'other';
  if (/iPhone|iPad|iPod/i.test(userAgent)) os = 'ios';
  else if (/Android/i.test(userAgent)) os = 'android';
  else if (/Macintosh|Mac OS X/i.test(userAgent)) os = 'macos';
  else if (/Windows/i.test(userAgent)) os = 'windows';
  else if (/Linux/i.test(userAgent)) os = 'linux';

  let name: BrowserInfo['name'] = 'other';
  if (/Edg\//i.test(userAgent)) {
    name = 'edge';
  } else if (/OPR\//i.test(userAgent) || /Opera/i.test(userAgent)) {
    name = 'opera';
  } else if (/Firefox\//i.test(userAgent)) {
    name = 'firefox';
  } else if (/Chrome\//i.test(userAgent) && /Google/i.test(vendor)) {
    name = 'chrome';
  } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
    name = 'safari';
  } else if (/Chrome/i.test(userAgent)) {
    name = 'chrome';
  }

  return { name, isMobile, os };
};

/**
 * Check current microphone permission status if supported by navigator.permissions
 */
export const checkMicrophonePermissionStatus = async (): Promise<PermissionStatusResult> => {
  if (typeof window === 'undefined') return 'unsupported';
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return 'unsupported';
  }

  if (navigator.permissions && navigator.permissions.query) {
    try {
      const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      return status.state as PermissionStatusResult; // 'granted' | 'denied' | 'prompt'
    } catch {
      // Some browsers (like Safari) throw on querying 'microphone'
      return 'prompt';
    }
  }

  return 'prompt';
};

/**
 * Explicitly request microphone access from user via getUserMedia
 */
export const requestMicrophonePermission = async (): Promise<MicPermissionResult> => {
  const browser = detectBrowser();
  const environmentError = getMicrophoneEnvironmentError();
  if (environmentError) return { granted: false, status: 'unsupported', error: 'MicrophoneEnvironment', errorMessage: environmentError, browser };

  if (typeof window === 'undefined') {
    return {
      granted: false,
      status: 'unsupported',
      errorMessage: 'Entorno no compatible con grabación de voz.',
      browser
    };
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return {
      granted: false,
      status: 'unsupported',
      errorMessage: 'Tu navegador o entorno actual no soporta acceso directo a micrófono.',
      browser
    };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    // Successfully granted! Stop tracks right away so the recording indicator turns off
    stream.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch {
        // ignore
      }
    });

    return {
      granted: true,
      status: 'granted',
      browser
    };
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string };
    const errName = error?.name || '';
    const errMsg = error?.message || '';

    if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
      return {
        granted: false,
        status: 'denied',
        error: errName,
        errorMessage: 'Microphone access was denied. Check this app’s permission and your system microphone privacy settings. An embedded preview may also restrict access.',
        browser
      };
    }

    if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
      return {
        granted: false,
        status: 'device-error',
        error: errName,
        errorMessage: 'No se detectó ningún micrófono conectado en tu computadora.',
        browser
      };
    }

    if (errName === 'NotReadableError' || errName === 'TrackStartError') {
      return {
        granted: false,
        status: 'device-error',
        error: errName,
        errorMessage: 'El micrófono está siendo utilizado por otra aplicación o pestaña.',
        browser
      };
    }

    return {
      granted: false,
      status: 'denied',
      error: errName || 'UnknownError',
      errorMessage: errMsg || 'Error al solicitar acceso al micrófono.',
      browser
    };
  }
};

/**
 * Get tailored browser settings instructions in Spanish
 */
export const getBrowserInstructions = (browser: BrowserInfo): {
  title: string;
  steps: string[];
  tip?: string;
} => {
  if (browser.isMobile) {
    if (browser.os === 'ios') {
      return {
        title: 'Cómo activar el micrófono en Safari / iPhone / iPad',
        steps: [
          'Abre la app de "Ajustes" o "Configuración" de tu iPhone o iPad.',
          'Baja y selecciona "Safari" (o el navegador que uses).',
          'En la sección "Configuración de sitios web", toca en "Micrófono".',
          'Selecciona "Permitir" (o "Preguntar").',
          'Regresa a esta página y presiona "Probar Micrófono".'
        ],
        tip: 'Si usas Chrome en iOS, ve a Ajustes > Chrome > Activar Micrófono.'
      };
    }
    return {
      title: 'Cómo activar el micrófono en Android / Móvil',
      steps: [
        'Toca el ícono de candado 🔒 o los 3 puntos (⋮) en la parte superior derecha de tu navegador.',
        'Selecciona "Permisos" o "Configuración de sitios" > "Micrófono".',
        'Cambia el estado de "Bloqueado" a "Permitir".',
        'Vuelve aquí y pulsa "Probar Micrófono".'
      ],
      tip: 'Asegúrate de que Android no tenga silenciado el micrófono a nivel del sistema.'
    };
  }

  // Desktop
  if (browser.name === 'chrome' || browser.name === 'edge' || browser.name === 'opera') {
    return {
      title: `Cómo activar el micrófono en ${browser.name === 'edge' ? 'Microsoft Edge' : 'Google Chrome'}`,
      steps: [
        'En la parte superior, busca la barra de direcciones (donde está la URL de la página).',
        'Haz clic en el ícono de CANDADO 🔒 (o el ícono de ajustes de sitio junto al candado).',
        'Busca la opción "Micrófono" en la lista de permisos.',
        'Cambia el interruptor o menú desplegable de "Bloqueado" a "Permitir" (Allow).',
        'Haz clic en el botón de abajo "Volver a solicitar permiso" para confirmar.'
      ],
      tip: 'Si no ves el candado, ve a Ajustes de Chrome > Privacidad y seguridad > Configuración de sitios > Micrófono.'
    };
  }

  if (browser.name === 'safari') {
    return {
      title: 'Cómo activar el micrófono en Safari (Mac)',
      steps: [
        'En la barra superior de tu Mac, haz clic en el menú "Safari" > "Ajustes..." (o "Preferencias").',
        'Haz clic en la pestaña "Sitios web" en la parte superior.',
        'En la columna izquierda, selecciona "Micrófono".',
        'En la lista de la derecha, busca esta página web y cámbiala a "Permitir".',
        'Vuelve aquí y presiona "Volver a solicitar permiso".'
      ],
      tip: 'Verifica también en Ajustes del Sistema de tu Mac > Privacidad y Seguridad > Micrófono que Safari tenga permiso activado.'
    };
  }

  if (browser.name === 'firefox') {
    return {
      title: 'Cómo activar el micrófono en Mozilla Firefox',
      steps: [
        'En la barra de direcciones, haz clic en el ícono de permisos o candado 🔒 a la izquierda de la URL.',
        'Si ves "Micrófono: Bloqueado", haz clic en la "X" junto al bloqueo para eliminar la excepción.',
        'Regresa a la página y pulsa el botón "Volver a solicitar permiso".',
        'Cuando aparezca la ventana emergente de Firefox, selecciona "Permitir".'
      ],
      tip: 'Puedes marcar la casilla "Recordar esta decisión" para no tener que volver a autorizarlo.'
    };
  }

  return {
    title: 'Cómo activar el permiso de micrófono en tu navegador',
    steps: [
      'Haz clic en el ícono de candado 🔒 o escudo a la izquierda de la dirección web (URL).',
      'Localiza el permiso de "Micrófono" y cámbialo a "Permitir".',
      'Si no aparece, ve a la Configuración de tu navegador > Privacidad > Permisos de sitios > Micrófono.',
      'Regresa a esta ventana y presiona el botón "Volver a solicitar permiso".'
    ]
  };
};
