import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Target,
  BookOpen,
  Globe,
  CheckCircle2,
  HelpCircle,
  GraduationCap,
  Layers,
  Volume2,
  Award,
  Zap,
  Lightbulb,
  Compass,
  DollarSign
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';

interface WelcomeTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDiagnostic: () => void;
  onExploreCatalog: () => void;
}

export const TUTORIAL_STORAGE_KEY = 'tensemaster_tutorial_seen_v1';

export const WelcomeTutorial: React.FC<WelcomeTutorialProps> = ({
  isOpen,
  onClose,
  onStartDiagnostic,
  onExploreCatalog
}) => {
  const { nativeLanguage, setNativeLanguage, t, ownerConfig } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStudentGoal, setSelectedStudentGoal] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [dontShowAgain, setDontShowAgain] = useState(true);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      } else if (e.key === 'ArrowRight' && currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        setCurrentStep((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const handleDismiss = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
      } catch (e) {
        // Safe fallback if storage fails
      }
    }
    onClose();
  };

  const handleFinishWithDiagnostic = () => {
    try {
      localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    } catch (e) {}
    onClose();
    onStartDiagnostic();
  };

  const handleFinishWithCatalog = () => {
    try {
      localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    } catch (e) {}
    onClose();
    onExploreCatalog();
  };

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === nativeLanguage) || SUPPORTED_LANGUAGES[0];

  const steps = [
    {
      id: 'audience',
      badge: '¿Para quién es esta App?',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300',
      title: 'Diseñada para ti, sin importar tu nivel inicial',
      subtitle: 'Tanto si empiezas desde cero absoluto como si ya tienes bases y quieres eliminar dudas definitivas.',
      renderContent: () => (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            El mayor problema de aprender inglés tradicionalmente es la confusión con los 12 tiempos verbales.
            Esta plataforma se adapta a <strong>dos tipos de alumnos</strong>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* Student profile 1: Beginners from zero */}
            <div
              onClick={() => setSelectedStudentGoal('beginner')}
              className={`p-3.5 sm:p-4 rounded-xl border text-left cursor-pointer transition-all ${
                selectedStudentGoal === 'beginner'
                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-400/40'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xl">🌱</span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                  Sin conocimientos previos (A0 - A1)
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                Empezar desde Cero
              </h4>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong>Fórmulas visuales fijas:</strong> Sujeto + Auxiliar + Verbo.</li>
                <li><strong>Glosario con traducción y fonética:</strong> Explicaciones en tu propio idioma nativo.</li>
                <li><strong>Líneas de tiempo intuitivas:</strong> Visualiza cuándo ocurre la acción sin memorizar listas vacías.</li>
                <li><strong>Audios nativos claros:</strong> Entrena tu oído desde la primera lección.</li>
              </ul>
            </div>

            {/* Student profile 2: Intermediate with gaps */}
            <div
              onClick={() => setSelectedStudentGoal('intermediate')}
              className={`p-3.5 sm:p-4 rounded-xl border text-left cursor-pointer transition-all ${
                selectedStudentGoal === 'intermediate'
                  ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-400/40'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xl">⚡</span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300">
                  Con conocimientos (A2 - B2)
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                Eliminar Dudas y Conquistar Fluidez
              </h4>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong>Matriz Comparativa 3×4:</strong> Entiende por fin la diferencia entre <em>Past Simple</em> y <em>Present Perfect</em>.</li>
                <li><strong>Palabras Clave (Signal Words):</strong> <em>since, for, already, yet, by the time</em>.</li>
                <li><strong>Nivel Experto:</strong> Oraciones complejas con voz pasiva y condicionales.</li>
                <li><strong>Duelos 1v1 y Analizador:</strong> Practica rapidez mental y analiza cualquier texto en segundos.</li>
              </ul>
            </div>
          </div>

          <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {selectedStudentGoal === 'beginner'
                ? 'Tip: Si eres principiante, te recomendamos comenzar en el catálogo por el Present Simple y Past Simple.'
                : 'Tip: Si ya tienes bases, te sugerimos iniciar con el Test de Nivel para identificar tus lagunas en 3 minutos.'}
            </span>
          </div>
        </div>
      )
    },
    {
      id: 'catalog',
      badge: 'Paso 1: El Catálogo',
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300',
      title: 'Cómo usar el Catálogo de los 12 Tiempos',
      subtitle: 'La forma más ordenada y lógica de estudiar la estructura del inglés.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 text-center">
              <span className="text-2xl block mb-1">🕰️</span>
              <span className="text-xs font-bold text-slate-800 dark:text-white block">3 Tiempos Base</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Pasado · Presente · Futuro</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/60 text-center">
              <span className="text-2xl block mb-1">📐</span>
              <span className="text-xs font-bold text-slate-800 dark:text-white block">4 Aspectos Verbales</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Simple · Continuo · Perfecto · Perfecto Continuo</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 text-center">
              <span className="text-2xl block mb-1">🧠</span>
              <span className="text-xs font-bold text-slate-800 dark:text-white block">12 Tarjetas Maestras</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Con audio nativo, fórmulas y ejercicios</span>
            </div>
          </div>

          {/* Interactive illustration card preview */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-900/80 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  EJEMPLO DE TARJETA
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-white">
                  Present Perfect (Presente Perfecto)
                </span>
              </div>
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium">
                Puntaje & Práctica
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  1. Fórmulas Visuales
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  (+) Sujeto + have/has + Pasado Participio<br />
                  (-) Sujeto + have/has + not + Pasado Participio
                </p>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  2. Glosario con Fonética
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Toca cualquier palabra subrayada para escuchar su pronunciación y ver su traducción en tu idioma.
                </p>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  3. Ejercicios & Nivel Experto
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Practica con opción múltiple, oraciones desordenadas, voz pasiva y condicionales avanzados.
                </p>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  4. Errores Típicos
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Aprende por qué los hispanohablantes suelen equivocarse y cómo evitarlo al instante.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'diagnostic',
      badge: 'Paso 2: El Test de Nivel',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300',
      title: 'Cómo usar el Test de Diagnóstico de Nivel',
      subtitle: 'En 3 a 5 minutos sabrás exactamente qué tiempos verbales dominas y cuáles debes repasar.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-slate-900 dark:to-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  12 Preguntas Rápidas Calibradas (CEFR A1 a C1)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Cada pregunta evalúa un tiempo verbal clave y detecta confusiones sutiles.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
              <div className="p-2.5 bg-white dark:bg-slate-800/90 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-lg block mb-0.5">📊</span>
                <strong className="block text-slate-800 dark:text-white">Diagnóstico Preciso</strong>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Nivel A1, A2, B1, B2 o C1</span>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-800/90 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-lg block mb-0.5">🎯</span>
                <strong className="block text-slate-800 dark:text-white">Ruta Personalizada</strong>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Te dice qué tiempo estudiar hoy</span>
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-800/90 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-lg block mb-0.5">📜</span>
                <strong className="block text-slate-800 dark:text-white">Certificado y PDF</strong>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Exporta tu reporte de progreso</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Puedes repetir el test las veces que quieras para ver cómo sube tu puntaje.</span>
            </div>
            <button
              onClick={handleFinishWithDiagnostic}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shrink-0 text-xs transition-colors cursor-pointer"
            >
              Hacer Test Ahora
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'languages-and-price',
      badge: `Idiomas & Filosofía $${(ownerConfig?.priceMonthly || 1.99).toFixed(2)} USD`,
      badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300',
      title: 'Tu idioma natal y educación accesible para todos',
      subtitle: 'Aprende inglés explicándolo en tu idioma, sin barreras económicas.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Global Language Selector */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Selector Global de Idioma
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-2.5">
                En la barra superior puedes cambiar instantáneamente entre 12 idiomas globales:
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {SUPPORTED_LANGUAGES.slice(0, 7).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setNativeLanguage(lang.code)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                      nativeLanguage === lang.code
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Actualiza dinámicamente títulos, botones, glosarios y explicaciones.
              </span>
            </div>

            {/* Why Affordable Membership */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  ¿Por qué solo ${(ownerConfig?.priceMonthly || 1.99).toFixed(2)} USD / mes?
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                Creemos que la fluidez en inglés no debería costar $50 o $100 dólares mensuales.
              </p>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Micro-pago accesible:</strong> Menos que el costo de un café o una botella de agua.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Equivalente local:</strong> (~{currentLang.currencyEquiv} en tu moneda nativa).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Cancela cuando quieras:</strong> Si terminas en 1 mes, solo pagas ${(ownerConfig?.priceMonthly || 1.99).toFixed(2)} en total.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span>💡</span>
            <span>
              Puedes usar gran parte de la aplicación completamente gratis sin tarjeta de crédito.
            </span>
          </div>
        </div>
      )
    },
    {
      id: 'ready',
      badge: '¡Todo listo!',
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300',
      title: '¿Por dónde te gustaría empezar hoy?',
      subtitle: 'Elige tu camino de inicio y comienza a dominar los 12 tiempos verbales.',
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Option A: Level Test */}
            <button
              onClick={handleFinishWithDiagnostic}
              className="p-4 rounded-xl border-2 border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100/60 dark:hover:bg-indigo-900/50 text-left transition-all group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  1. Hacer el Test de Nivel Inicial
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Recomendado: Descubre en 3 minutos qué tiempos ya dominas y qué temas necesitas reforzar.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>Comenzar Test</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Option B: Explore Catalog */}
            <button
              onClick={handleFinishWithCatalog}
              className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  2. Explorar el Catálogo Directamente
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Ideal para principiantes desde cero que quieren ver el Present Simple o la Matriz 3×4 de inmediato.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>Ir al Catálogo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Puedes volver a ver este tutorial cuando quieras haciendo clic en "Tutorial" en la barra superior.</span>
            </span>
          </div>
        </div>
      )
    }
  ];

  const current = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${current.badgeColor}`}>
              {current.badge}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Paso {currentStep + 1} de {steps.length}
            </span>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Cerrar tutorial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 flex">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-300 ${
                idx <= currentStep
                  ? 'bg-indigo-600 dark:bg-indigo-500'
                  : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
              {current.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {current.subtitle}
            </p>
          </div>

          {current.renderContent()}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              <span>No mostrar al iniciar</span>
            </label>

            <button
              onClick={handleDismiss}
              className="sm:hidden text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Saltar
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer ml-auto sm:ml-0"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinishWithDiagnostic}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer ml-auto sm:ml-0"
              >
                <span>¡Empezar con Test!</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
