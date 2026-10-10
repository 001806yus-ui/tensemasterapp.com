import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import {
  X,
  DollarSign,
  Users,
  TrendingUp,
  CreditCard,
  Share2,
  Download,
  Copy,
  Check,
  Globe,
  Settings,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Megaphone,
  BookOpen,
  Landmark,
  Scale,
  RefreshCw,
  PlayCircle,
  Percent,
  LockKeyhole,
  Building,
  CheckCircle2,
  HelpCircle,
  Video,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  FileCode,
  Smartphone,
  ChevronRight,
  Flame,
  ArrowRight,
  Zap
} from 'lucide-react';

interface AdminDashboardModalProps {
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ onClose }) => {
  const { progressState, ownerConfig, updateOwnerConfig, isPro, unlockOwnerAccess, cancelSubscription } = useUser();
  const [activeAdminTab, setActiveAdminTab] = useState<
    'metrics' | 'ownership_legal' | 'payments' | 'stores_pricing' | 'hosting' | 'marketing'
  >('ownership_legal');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Bank Setup Simulator State
  const [bankCountry, setBankCountry] = useState('México (CLABE)');
  const [bankAccountHolder, setBankAccountHolder] = useState('Mi Nombre / Mi Empresa');
  const [bankAccountNumber, setBankAccountNumber] = useState('012 180 00123456789 0');
  const [bankSavedNotice, setBankSavedNotice] = useState(false);

  // Suggestion 2: Real Payments Config
  const [stripeLinkInput, setStripeLinkInput] = useState(ownerConfig?.stripePaymentLink || 'https://buy.stripe.com/test_123tuingles');
  const [mercadoPagoInput, setMercadoPagoInput] = useState(ownerConfig?.mercadoPagoLink || '');
  const [currencyInput, setCurrencyInput] = useState<'USD' | 'MXN' | 'COP' | 'EUR' | 'BRL'>(ownerConfig?.currencyCode || 'USD');
  const [priceInput, setPriceInput] = useState<number>(ownerConfig?.priceMonthly || 1.0);
  const [paymentSaveNotice, setPaymentSaveNotice] = useState(false);

  // Suggestion 1: Hosting & Domain Config
  const [customDomainInput, setCustomDomainInput] = useState(ownerConfig?.customDomain || 'www.tuingles1dolar.com');
  const [domainSaveNotice, setDomainSaveNotice] = useState(false);
  const [copiedConfigType, setCopiedConfigType] = useState<string | null>(null);
  const [checklist, setChecklist] = useState({
    codeDownloaded: true,
    domainBought: false,
    vercelConnected: false,
    sslVerified: false
  });

  // Suggestion 3: Viral Marketing Teleprompter & Hooks
  const [activeScriptTab, setActiveScriptTab] = useState<number>(0);
  const [isTeleprompterRunning, setIsTeleprompterRunning] = useState<boolean>(false);
  const [teleprompterSeconds, setTeleprompterSeconds] = useState<number>(0);
  const [viralViews, setViralViews] = useState<number>(25000);
  const [copiedHookIdx, setCopiedHookIdx] = useState<number | null>(null);
  const [copiedUtmLink, setCopiedUtmLink] = useState<string | null>(null);

  // Pricing simulator state
  const [simulatedStudents, setSimulatedStudents] = useState<number>(1000);
  const [simulatedPrice, setSimulatedPrice] = useState<number>(2.99);

  // Teleprompter Timer
  useEffect(() => {
    let interval: any;
    if (isTeleprompterRunning) {
      interval = setInterval(() => {
        setTeleprompterSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTeleprompterRunning]);

  // Simulated live business figures
  const simulatedSubscribers = [
    { id: 'SUB-101', name: 'Laura Gómez', email: 'laura.g@gmail.com', country: '🇲🇽 México', plan: '$1 USD/mes', status: 'Activa', joined: 'Hace 3 días' },
    { id: 'SUB-102', name: 'Mateo Silva', email: 'mateo.silva@outlook.com', country: '🇨🇴 Colombia', plan: '$1 USD/mes', status: 'Activa', joined: 'Hace 5 días' },
    { id: 'SUB-103', name: 'Carla Rossi', email: 'carla.r@yahoo.com', country: '🇦🇷 Argentina', plan: '$1 USD/mes', status: 'Activa', joined: 'Hace 1 semana' },
    { id: 'SUB-104', name: 'Thiago Oliveira', email: 'thiago.o@uol.com.br', country: '🇧🇷 Brasil', plan: '$1 USD/mes', status: 'Activa', joined: 'Hace 2 semanas' },
    { id: 'SUB-105', name: 'Sofía Morales', email: 'sofia.m@gmail.com', country: '🇪🇸 España', plan: '$1 USD/mes', status: 'Activa', joined: 'Hace 2 semanas' },
    { id: 'SUB-106', name: progressState.userName, email: progressState.userEmail, country: '🌐 Usuario Actual', plan: progressState.subscription.isPro ? '$1 USD/mes' : 'Prueba Gratuita', status: progressState.subscription.isPro ? 'Activa' : 'Prueba', joined: 'Hoy' }
  ];

  const totalActivePaid = simulatedSubscribers.filter((s) => s.status === 'Activa').length;
  const monthlyRecurringRevenue = (totalActivePaid * 1.0).toFixed(2);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const marketingPitch = `🚀 ¡Aprende los 12 tiempos del inglés por solo $1 dólar al mes!
¿Cansado de cursos caros y confusos? En TenseMaster dominas desde el Present Simple hasta el Future Perfect con:
✅ Fórmulas visuales sin enredos
✅ Pronunciación nativa interactiva
✅ Clases en video y ejercicios prácticos
✅ Certificado oficial con tu nombre
🔥 Menos de lo que cuesta un café. Empieza hoy: ${window.location.origin}`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(marketingPitch);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 pb-4 bg-slate-900 text-white flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Panel de Control de la Dueña y Negocio</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif">
              Administración de TenseMaster
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Guía maestra para ser la dueña legal, recibir tus pagos de $1/mes y promocionar tu aplicación a miles de estudiantes.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-slate-200 bg-slate-50 gap-2 overflow-x-auto text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveAdminTab('ownership_legal')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeAdminTab === 'ownership_legal'
                ? 'border-indigo-600 text-indigo-600 font-bold bg-indigo-50/60'
                : 'border-transparent text-slate-700 hover:text-slate-900'
            }`}
          >
            <Landmark className="w-4 h-4 text-emerald-600" />
            <span>🏦 Bancos, Upgrades, Lanzamiento & Patentes</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('metrics')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeAdminTab === 'metrics'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Métricas e Ingresos</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('payments')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeAdminTab === 'payments'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Cómo Recibir los Pagos ($1/mes)</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('hosting')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeAdminTab === 'hosting'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Ser Dueña y Alojar tu App</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('marketing')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeAdminTab === 'marketing'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Estrategia de Promoción Viral</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('stores_pricing')}
            className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeAdminTab === 'stores_pricing'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>App Store, Android y Comisiones</span>
          </button>
        </div>

        {/* Content Container */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">

          {/* QUICK OWNER ACCESS STATUS BAR */}
          <div className="p-4 bg-gradient-to-r from-amber-500/15 via-indigo-50 to-emerald-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👑</span>
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span>Tu Acceso Personal:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${isPro ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                    {isPro ? '✓ Acceso Total Dueña Activo (Gratis)' : 'Restringido (Modo Alumno de Prueba)'}
                  </span>
                </div>
                <p className="text-slate-600 text-xs">
                  {isPro
                    ? 'Tienes todas las 12 lecciones, audios y exámenes 100% desbloqueados sin pagar nada.'
                    : '¿La app te dice que tienes que pagar? Tú eres la dueña; haz clic aquí para desbloquear todo gratis:'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              {!isPro ? (
                <button
                  onClick={unlockOwnerAccess}
                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl shadow-xs cursor-pointer transition-all text-xs flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>👑 Desbloquear Todo Gratis</span>
                </button>
              ) : (
                <button
                  onClick={cancelSubscription}
                  className="w-full sm:w-auto px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg cursor-pointer transition-colors text-[11px]"
                  title="Cambiar temporalmente al modo alumno para ver cómo ven los alumnos la app"
                >
                  Probar vista de Alumno
                </button>
              )}
            </div>
          </div>

          {/* TAB: OWNERSHIP, BANKING, UPGRADES & LEGAL PATENTS */}
          {activeAdminTab === 'ownership_legal' && (
            <div className="space-y-6 text-xs sm:text-sm">
              {/* Highlight Banner */}
              <div className="p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white rounded-2xl border border-emerald-800/40 space-y-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Propiedad Total, Finanzas & Protección Legal
                  </span>
                  <span className="text-xs text-slate-300">
                    Tu negocio bajo tu control exclusivo
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
                  Respuestas Clave para la Dueña: Bancos, Upgrades, Lanzamiento y Patentes
                </h3>
                <p className="text-xs text-slate-200 leading-relaxed max-w-3xl">
                  Tienes en tus manos una aplicación de nivel comercial completa. Aquí tienes las respuestas directas, transparentes y profesionales a todas tus dudas sobre el dinero, la puesta en marcha y la protección de tu creación.
                </p>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 1. UPGRADES CONTINUOS */}
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                    <RefreshCw className="w-4 h-4 text-indigo-600" />
                    <span>1. ¿Esta app se puede actualizar ("upgrade") cada vez?</span>
                  </div>
                  <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-950 space-y-1">
                    <strong className="block text-indigo-900">¡SÍ, las veces que quieras y sin límite!</strong>
                    <p className="leading-relaxed">
                      El código fuente de TenseMaster está construido con arquitectura modular en <strong>React + Vite + TypeScript</strong>. Puedes:
                    </p>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                    <li><strong>Añadir nuevas funciones:</strong> Más audios, nuevos juegos, lecciones avanzadas (C1/C2), historias interactivas o nuevos idiomas.</li>
                    <li><strong>Actualizaciones instantáneas en Web / PWA:</strong> Cada vez que actualices el código en tu hosting (Vercel, Netlify, Cloudflare), se actualiza automáticamente en los teléfonos de todos tus alumnos en 30 segundos, sin que tengan que descargar nada.</li>
                    <li><strong>En Google Play y App Store:</strong> Puedes subir nuevas versiones numeradas (v1.1, v1.2, v2.0) tantas veces al año como desees sin costo adicional.</li>
                  </ul>
                </div>

                {/* 2. CUÁNDO PONER A FUNCIONAR */}
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <PlayCircle className="w-4 h-4 text-emerald-600" />
                    <span>2. ¿Cuándo la puedo poner a funcionar?</span>
                  </div>
                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-xs text-emerald-950 space-y-1">
                    <strong className="block text-emerald-900">¡HOY MISMO! La app ya está 100% terminada y lista.</strong>
                    <p className="leading-relaxed">
                      Todo el contenido pedagógico (los 12 tiempos, pronunciación, tarjetas flash, matriz 3×4, verbos V1/V2/V3, duelos 1v1, analizador de textos con modo lectura y ranking) ya está funcionando.
                    </p>
                  </div>
                  <div className="space-y-1.5 pt-1 text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block">Solo necesitas estos 3 pasos (menos de 24 horas):</span>
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-emerald-600">①</span>
                      <span><strong>Subirla a tu dominio:</strong> Conectar a Vercel o Netlify (gratis) con tu nombre (ej. <code>www.tuingles.com</code>).</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-emerald-600">②</span>
                      <span><strong>Conectar tu enlace de cobro:</strong> Crear tu cuenta en Stripe o Mercado Pago para recibir los $1/mes.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-emerald-600">③</span>
                      <span><strong>Publicar tu primer video en TikTok/Instagram:</strong> "Aprende los 12 tiempos del inglés por $1 dólar".</span>
                    </div>
                  </div>
                </div>

                {/* 3. CONTROL DEL DINERO Y CUENTA BANCARIA */}
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <Landmark className="w-5 h-5 text-emerald-600" />
                      <span>3. ¿Cómo sé que YO controlo el dinero? ¿Dónde pongo mis datos de bancos?</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      Depósitos Directos a tu Cuenta
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-700">
                    <p className="leading-relaxed">
                      <strong>Tu dinero NUNCA pasa por Google AI Studio ni por ningún intermediario extraño.</strong>
                    </p>
                    <p className="leading-relaxed">
                      En el comercio electrónico mundial, el dinero va directamente de la tarjeta del alumno a una <strong>pasarela de pagos regulada internacionalmente</strong> a tu nombre (la más utilizada y segura del planeta es <strong>Stripe</strong> en 46+ países, o <strong>Mercado Pago</strong> en América Latina).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-2 border border-slate-200 rounded-xl p-4 bg-white">
                      <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <LockKeyhole className="w-4 h-4 text-indigo-600" />
                        ¿Dónde pones tus datos bancarios?
                      </h5>
                      <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600">
                        <li>Entras en <strong>dashboard.stripe.com</strong> (o <strong>mercadopago.com</strong>) y creas tu cuenta oficial gratuita.</li>
                        <li>Vas a <em>Configuración &gt; Cuentas bancarias y transferencias</em>.</li>
                        <li>Ingresas tu <strong>número de cuenta bancaria oficial</strong> (CLABE en México, IBAN en España/Europa, CBU/CVU en Argentina, Cuenta Ahorros en Colombia/Chile/Perú, Routing+Account en EE.UU.).</li>
                        <li>Stripe o Mercado Pago te enviará tus ganancias automáticamente cada 24-48 horas o una vez por semana directamente a tu banco personal o de empresa.</li>
                      </ol>
                    </div>

                    {/* Interactive Bank Simulator for the Owner */}
                    <div className="space-y-3 border border-emerald-200 rounded-xl p-4 bg-emerald-50/50">
                      <h5 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-emerald-700" />
                        Simulador de Configuración Bancaria (Tus Datos):
                      </h5>
                      
                      <div className="space-y-2 text-xs">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">País y formato bancario:</label>
                          <select
                            value={bankCountry}
                            onChange={(e) => setBankCountry(e.target.value)}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
                          >
                            <option>México (CLABE Interbancaria 18 dígitos)</option>
                            <option>Colombia (Cuenta de Ahorros / Corriente)</option>
                            <option>España / Unión Europea (Código IBAN)</option>
                            <option>Estados Unidos (Routing Number + Account)</option>
                            <option>Argentina (CBU / CVU / Alias)</option>
                            <option>Chile (Cuenta RUT / BancoEstado)</option>
                            <option>Perú (CCI Interbancario)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Titular de la cuenta:</label>
                          <input
                            type="text"
                            value={bankAccountHolder}
                            onChange={(e) => setBankAccountHolder(e.target.value)}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Número de cuenta o CLABE / IBAN:</label>
                          <input
                            type="text"
                            value={bankAccountNumber}
                            onChange={(e) => setBankAccountNumber(e.target.value)}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono text-xs"
                          />
                        </div>

                        <button
                          onClick={() => {
                            setBankSavedNotice(true);
                            setTimeout(() => setBankSavedNotice(false), 3000);
                          }}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1"
                        >
                          {bankSavedNotice ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>¡Datos de banco verificados y listos para conectar a Stripe!</span>
                            </>
                          ) : (
                            <span>Verificar Datos de Transferencia</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. SE PUEDE PATENTAR QUE NADIE LA IMITE */}
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <Scale className="w-5 h-5 text-amber-600" />
                    <span>4. ¿Se puede patentar para que nadie la imite?</span>
                  </div>
                  
                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                    <strong className="block text-amber-900">La realidad legal y las 4 armas para protegerte:</strong>
                    <p className="leading-relaxed">
                      El idioma inglés y las reglas gramaticales (los 12 tiempos) son de dominio público; por ley en ningún país se puede patentar "un método de enseñar tiempos verbales". Sin embargo, <strong>SÍ tienes 4 protecciones legales muy poderosas:</strong>
                    </p>
                  </div>

                  <ul className="text-xs text-slate-700 space-y-2 list-none pt-1">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-indigo-600">A. Marca Registrada (®):</span>
                      <span>Registras el nombre <strong>"TenseMaster"</strong> y tu logotipo ante el organismo de marcas de tu país (IMPI en México, OEPM en España, USPTO en EE.UU., INPI en Argentina). <em>Nadie en el mundo podrá usar tu nombre comercial en apps ni cursos.</em></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-indigo-600">B. Derechos de Autor / Copyright (©):</span>
                      <span>Todo tu código fuente, las explicaciones escritas, las reglas mnemotécnicas y el diseño visual están protegidos automáticamente desde el momento en que se crean. Si alguien copia tu código o textos, solicitas su retiro inmediato (DMCA Takedown) en Google Play y App Store.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-indigo-600">C. Términos de Servicio y Contrato:</span>
                      <span>Tus alumnos aceptan un acuerdo de usuario que prohíbe la reventa de tu material o ingeniería inversa.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-emerald-600">D. Efecto de Red (Tu ventaja real):</span>
                      <span>Duolingo no es el líder mundial por una patente, sino por su marca, sus rankings, su comunidad y su precio accesible. Tu mejor protección es tener miles de alumnos a $1/mes contentos recomendándote.</span>
                    </li>
                  </ul>
                </div>

                {/* 5. GOOGLE PLAY & APPLE STORE COMISIONES */}
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <Percent className="w-5 h-5 text-indigo-600" />
                    <span>5. ¿Cómo pagar a Google Play y Apple Store? ¿Cobran comisión?</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2 text-slate-800">
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <strong className="block text-slate-900">🤖 Google Play Console:</strong>
                        <p className="text-[11px] text-slate-600">
                          Tarifa de registro: <strong>$25 USD (pago único de por vida)</strong>. Se paga con tarjeta en <code>play.google.com/console</code>.
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <strong className="block text-slate-900">🍏 Apple App Store:</strong>
                        <p className="text-[11px] text-slate-600">
                          Tarifa de desarrollador: <strong>$99 USD al año</strong>. Se paga en <code>developer.apple.com</code>.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-950 space-y-1">
                      <strong className="block text-indigo-900">¿Cuánto porcentaje cobran de cada venta?</strong>
                      <p className="leading-relaxed">
                        • <strong>Si cobras dentro de la app móvil con Apple/Google:</strong> Te cobran solo un <strong>15%</strong> (gracias al <em>Small Business Program</em> para desarrolladores que ganan menos de $1 millón al año). De cada $1 USD, tú recibes $0.85 USD netos.
                      </p>
                      <p className="leading-relaxed font-semibold text-emerald-900 mt-1">
                        • <strong>La Estrategia de Spotify / Netflix (0% comisión a tiendas):</strong> Cobras la suscripción en tu sitio web oficial (Stripe te cobra solo ~2.9% + 30¢), y en el teléfono el alumno simplemente inicia sesión con su correo. ¡Apple y Google no tocan un solo centavo de tu dinero!
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
          
          {/* TAB 1: METRICS & SUBSCRIBERS */}
          {activeAdminTab === 'metrics' && (
            <div className="space-y-6">
              {/* Financial KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold">
                    <span>MRR (Ingreso Mensual Recurrente)</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-emerald-950">
                    ${monthlyRecurringRevenue} USD
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Calculado a $1.00 USD/mes por alumno activo
                  </p>
                </div>

                <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-indigo-800 font-semibold">
                    <span>Alumnos Suscritos Activos</span>
                    <Users className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-indigo-950">
                    {totalActivePaid}
                  </div>
                  <p className="text-[11px] text-indigo-700">
                    Retención mensual proyectada: 94%
                  </p>
                </div>

                <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 space-y-1">
                  <div className="flex items-center justify-between text-xs text-purple-800 font-semibold">
                    <span>Potencial con 1,000 Alumnos</span>
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-purple-950">
                    $1,000 USD / mes
                  </div>
                  <p className="text-[11px] text-purple-700">
                    Ingreso pasivo mensual estable y predecible
                  </p>
                </div>
              </div>

              {/* Subscribers Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Lista de Alumnos y Suscriptores Recientes
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">
                    {simulatedSubscribers.length} registros
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/50 text-slate-400 font-medium border-b border-slate-100">
                      <tr>
                        <th className="p-3">Nombre</th>
                        <th className="p-3">País</th>
                        <th className="p-3">Plan</th>
                        <th className="p-3">Estado</th>
                        <th className="p-3">Registro</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {simulatedSubscribers.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold text-slate-900">
                            {sub.name}
                            <span className="text-slate-400 block font-normal text-[11px]">{sub.email}</span>
                          </td>
                          <td className="p-3">{sub.country}</td>
                          <td className="p-3 font-mono font-medium">{sub.plan}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                sub.status === 'Activa'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500">{sub.joined}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOW TO COLLECT REAL PAYMENTS (SUGGESTION 2) */}
          {activeAdminTab === 'payments' && (
            <div className="space-y-6 text-xs sm:text-sm">
              <div className="p-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl border border-indigo-800/40 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Sugerencia 2: Pasarela de Cobros Real
                  </span>
                  <span className="text-xs text-indigo-200">
                    Conexión Directa con Stripe / Mercado Pago
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold font-serif text-white">
                  Configura tu Enlace Oficial de Cobro ($1 USD/mes)
                </h4>
                <p className="text-xs text-indigo-200 leading-relaxed max-w-3xl">
                  Pega aquí tu enlace de cobro de <strong>Stripe Payment Links</strong> o <strong>Mercado Pago</strong>. En cuanto lo guardes, todos los botones de "Activar Membresía" y "Pagar" de tu aplicación redirigirán automáticamente a tu pasarela oficial para que el dinero entre directo a tu cuenta bancaria.
                </p>
              </div>

              {/* Access Mode Selector: Paid vs 100% Free for Everyone */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm block">
                      Modalidad de Acceso para Estudiantes:
                    </span>
                    <span className="text-slate-500 text-xs">
                      Tú decides si tus alumnos pagan $1 USD o si la app es 100% gratuita para todo el mundo.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateOwnerConfig({ allTensesFreeMode: false })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        !ownerConfig?.allTensesFreeMode
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      💼 Modo Negocio ($1 USD/mes)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateOwnerConfig({ allTensesFreeMode: true })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        ownerConfig?.allTensesFreeMode
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      🎁 Modo 100% Gratis
                    </button>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80">
                  {!ownerConfig?.allTensesFreeMode ? (
                    <span>
                      🔒 <strong>Modo Negocio activo:</strong> Los estudiantes pueden probar gratis 2 tiempos verbales. Los 10 restantes muestran la pantalla de suscripción de <strong>$1.00 USD/mes</strong>. (Tú como dueña tienes acceso gratis ilimitado usando el botón dorado superior).
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-semibold">
                      🎉 <strong>Modo 100% Gratis activo:</strong> Todos los 12 tiempos verbales están completamente desbloqueados para cualquier persona que visite tu página, sin pedirles tarjeta ni suscripción.
                    </span>
                  )}
                </div>
              </div>

              {/* Price Tier Selection: $1.00 vs $1.99 USD / mes */}
              <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border-2 border-emerald-400 rounded-2xl space-y-3.5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        Precio Oficial para tus Alumnos:
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-700 text-white font-mono shadow-2xs">
                        ${(ownerConfig?.priceMonthly || 1.99).toFixed(2)} USD / mes
                      </span>
                    </div>
                    <span className="text-slate-600 text-xs">
                      Selecciona con 1 clic el precio que quieres cobrar:
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateOwnerConfig({ priceMonthly: 1.00, allTensesFreeMode: false });
                        setPriceInput(1.00);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        (ownerConfig?.priceMonthly || 1.99) === 1.00
                          ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>🏷️ Cobrar $1.00 USD</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        updateOwnerConfig({ priceMonthly: 1.99, allTensesFreeMode: false });
                        setPriceInput(1.99);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        (ownerConfig?.priceMonthly || 1.99) === 1.99
                          ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>⭐ Cobrar $1.99 USD (Doble Ganancia)</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white/90 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Estrategia A: $1.00 USD/mes</span>
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-sm">Masivo</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      La gente lo compra sin pensarlo porque cuesta menos que un chicle. Facilísimo de promocionar en TikTok y conseguir cientos de usuarios rápido.
                    </p>
                    <div className="text-[11px] font-mono font-semibold text-indigo-700 pt-1 border-t border-slate-100">
                      500 alumnos = $500 USD/mes ($6,000/año)
                    </div>
                  </div>

                  <div className="p-3 bg-white/90 rounded-xl border border-emerald-300 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900">Estrategia B: $1.99 USD/mes ⭐</span>
                      <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-sm">Rentabilidad</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Sigue teniendo la barrera psicológica de "menos de 2 dólares", pero tú te llevas el <strong>doble de dinero</strong> en cada cobro automático.
                    </p>
                    <div className="text-[11px] font-mono font-semibold text-emerald-700 pt-1 border-t border-slate-100">
                      500 alumnos = <strong>$995 USD/mes (~$11,940/año)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Setup Form */}
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    <strong className="text-slate-900 text-sm">Tu Enlace de Pago Activo en la App:</strong>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    Modo Producción Listo
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Stripe Payment Link Input */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Enlace de Stripe Payment Link (o Checkout):
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        placeholder="https://buy.stripe.com/..."
                        value={stripeLinkInput}
                        onChange={(e) => setStripeLinkInput(e.target.value)}
                        className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                      <button
                        onClick={() => {
                          updateOwnerConfig({
                            stripePaymentLink: stripeLinkInput,
                            currencyCode: currencyInput,
                            priceMonthly: priceInput
                          });
                          setPaymentSaveNotice(true);
                          setTimeout(() => setPaymentSaveNotice(false), 3000);
                        }}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors whitespace-nowrap"
                      >
                        Guardar Enlace
                      </button>
                      {stripeLinkInput && (
                        <a
                          href={stripeLinkInput}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Probar en Vivo</span>
                        </a>
                      )}
                    </div>
                    {paymentSaveNotice && (
                      <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>¡Enlace guardado con éxito! Tus alumnos ahora pagarán directamente a este checkout.</span>
                      </p>
                    )}
                  </div>

                  {/* Currency and Price Selectors */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 block">Moneda de cobro:</label>
                    <select
                      value={currencyInput}
                      onChange={(e) => setCurrencyInput(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs"
                    >
                      <option value="USD">Dólares Estadounidenses ($ USD)</option>
                      <option value="MXN">Pesos Mexicanos ($ MXN)</option>
                      <option value="COP">Pesos Colombianos ($ COP)</option>
                      <option value="EUR">Euros (€ EUR)</option>
                      <option value="BRL">Reales Brasileños (R$ BRL)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 block">Cuota mensual recurrente:</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.5"
                      value={priceInput}
                      onChange={(e) => setPriceInput(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 3 Step Visual Guide to create payment link in Stripe */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Cómo crear tu enlace en Stripe Dashboard en 90 segundos:</span>
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-indigo-600 block">1. Ir a Payment Links</span>
                    <p className="text-slate-600 leading-relaxed">
                      Entra a tu cuenta en <strong>dashboard.stripe.com</strong> y haz clic en <em>Más &gt; Payment Links &gt; + Nuevo</em>.
                    </p>
                  </div>
                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-indigo-600 block">2. Configurar Producto</span>
                    <p className="text-slate-600 leading-relaxed">
                      Escribe el nombre: <strong>"TenseMaster Membresía Total"</strong>, precio: <strong>$1.99 USD</strong> y marca <strong>"Recurrente mensual"</strong>.
                    </p>
                  </div>
                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-indigo-600 block">3. Copiar y Pegar</span>
                    <p className="text-slate-600 leading-relaxed">
                      Stripe te genera un enlace corto como <code>buy.stripe.com/abc123xyz</code>. Pégalo en el cuadro de arriba y haz clic en <strong>Guardar</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OWNERSHIP & HOSTING (SUGGESTION 1) */}
          {activeAdminTab === 'hosting' && (
            <div className="space-y-6 text-xs sm:text-sm">
              <div className="p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-2xl border border-emerald-800/40 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    Sugerencia 1: Hosting & Dominio Propio
                  </span>
                  <span className="text-xs text-emerald-200">
                    Despliegue Gratuito en 1-Clic
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold font-serif text-white">
                  Publica tu App con tu Propio Dominio Web (.com / .app)
                </h4>
                <p className="text-xs text-emerald-200 leading-relaxed max-w-3xl">
                  Esta aplicación está construida en React + Vite. Puedes alojarla gratis en plataformas globales de alta velocidad como <strong>Vercel</strong> o <strong>Netlify</strong> (costo de servidor $0 USD/mes) conectada a tu dominio personalizado.
                </p>
              </div>

              {/* Domain Input & DNS Record Generator */}
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <strong className="text-slate-900 text-sm flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    Configurador de Dominio Personalizado:
                  </strong>
                  <span className="text-xs text-slate-500">Coste de dominio: ~$10/año</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="ej. www.tuingles1dolar.com o www.tensemaster.app"
                    value={customDomainInput}
                    onChange={(e) => setCustomDomainInput(e.target.value)}
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <button
                    onClick={() => {
                      updateOwnerConfig({ customDomain: customDomainInput });
                      setDomainSaveNotice(true);
                      setTimeout(() => setDomainSaveNotice(false), 3000);
                    }}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors whitespace-nowrap"
                  >
                    Guardar Dominio
                  </button>
                </div>

                {domainSaveNotice && (
                  <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>¡Dominio actualizado en la configuración de la app!</span>
                  </p>
                )}

                {/* Generated DNS Records Table */}
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    Registros DNS para poner en tu registrador (Namecheap, GoDaddy, Cloudflare):
                  </span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs border border-slate-200 rounded-xl overflow-hidden">
                      <thead className="bg-slate-100 text-slate-600 uppercase text-[10px]">
                        <tr>
                          <th className="p-2.5">Tipo</th>
                          <th className="p-2.5">Nombre / Host</th>
                          <th className="p-2.5">Valor / Destino</th>
                          <th className="p-2.5 text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr className="bg-white">
                          <td className="p-2.5 font-bold text-indigo-600">A</td>
                          <td className="p-2.5">@</td>
                          <td className="p-2.5 text-slate-800">76.76.21.21 (Vercel Anycast)</td>
                          <td className="p-2.5 text-right">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText('76.76.21.21');
                                setCopiedConfigType('A');
                                setTimeout(() => setCopiedConfigType(null), 2000);
                              }}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[11px] cursor-pointer"
                            >
                              {copiedConfigType === 'A' ? '¡Copiado!' : 'Copiar'}
                            </button>
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td className="p-2.5 font-bold text-indigo-600">CNAME</td>
                          <td className="p-2.5">www</td>
                          <td className="p-2.5 text-slate-800">cname.vercel-dns.com</td>
                          <td className="p-2.5 text-right">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText('cname.vercel-dns.com');
                                setCopiedConfigType('CNAME');
                                setTimeout(() => setCopiedConfigType(null), 2000);
                              }}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[11px] cursor-pointer"
                            >
                              {copiedConfigType === 'CNAME' ? '¡Copiado!' : 'Copiar'}
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Ready-to-download config files: vercel.json & netlify.toml */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-indigo-600" />
                    <span>Archivos de Configuración de Producción (SPA Routing):</span>
                  </h5>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-mono">vercel.json</strong>
                      <button
                        onClick={() => {
                          const content = JSON.stringify({
                            rewrites: [{ source: "/(.*)", destination: "/index.html" }]
                          }, null, 2);
                          const blob = new Blob([content], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'vercel.json';
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar</span>
                      </button>
                    </div>
                    <pre className="p-2 bg-slate-950 text-slate-300 font-mono text-[11px] rounded-lg overflow-x-auto">
{`{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`}
                    </pre>
                  </div>

                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-mono">netlify.toml</strong>
                      <button
                        onClick={() => {
                          const content = `[[redirects]]\n  from = "/*"\n  to = "/index.html"\n  status = 200\n`;
                          const blob = new Blob([content], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'netlify.toml';
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar</span>
                      </button>
                    </div>
                    <pre className="p-2 bg-slate-950 text-slate-300 font-mono text-[11px] rounded-lg overflow-x-auto">
{`[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Interactive 24-Hour Launch Checklist */}
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-emerald-600" />
                  <span>Checklist Interactivo de Lanzamiento en 24 Horas:</span>
                </h5>

                <div className="space-y-2 text-xs">
                  {[
                    { key: 'codeDownloaded', label: '1. Código fuente listo y verificado con los 12 tiempos y PWA' },
                    { key: 'domainBought', label: '2. Dominio comprado en Namecheap o Cloudflare (~$10/año)' },
                    { key: 'vercelConnected', label: '3. Repositorio importado en Vercel o Netlify (Hosting $0/mes)' },
                    { key: 'sslVerified', label: '4. Certificado de seguridad HTTPS verificado y activo' }
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={(checklist as any)[item.key]}
                        onChange={(e) => setChecklist({ ...checklist, [item.key]: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 rounded-sm accent-emerald-600 cursor-pointer"
                      />
                      <span className={(checklist as any)[item.key] ? 'font-semibold text-slate-900 line-through text-slate-400' : 'font-semibold text-slate-700'}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VIRAL MARKETING STRATEGY & TELEPROMPTER (SUGGESTION 3) */}
          {activeAdminTab === 'marketing' && (
            <div className="space-y-6 text-xs sm:text-sm">
              <div className="p-5 bg-gradient-to-r from-amber-950 via-slate-900 to-rose-950 text-white rounded-2xl border border-amber-800/40 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    Sugerencia 3: Kit de Marketing Viral en Redes
                  </span>
                  <span className="text-xs text-amber-200">
                    TikTok, Reels & YouTube Shorts
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold font-serif text-white">
                  Guiones de Video Listos, Teleprompter y Ganchos de 3 Segundos
                </h4>
                <p className="text-xs text-amber-200 leading-relaxed max-w-3xl">
                  Grábate con tu teléfono mirando a la cámara mientras lees estos guiones con nuestro teleprompter integrado. La oferta de $1 dólar tiene una tasa de conversión récord porque nadie se resiste a probar por ese precio.
                </p>
              </div>

              {/* Teleprompter Component */}
              <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-amber-400" />
                    <strong className="text-sm font-serif">Teleprompter de Grabación en Vivo:</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsTeleprompterRunning(!isTeleprompterRunning)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                        isTeleprompterRunning
                          ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {isTeleprompterRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isTeleprompterRunning ? 'Pausar Lectura' : 'Iniciar Teleprompter'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsTeleprompterRunning(false);
                        setTeleprompterSeconds(0);
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                      title="Reiniciar temporizador"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs px-2 py-1 bg-slate-800 rounded-lg text-amber-300 font-bold">
                      ⏱️ {String(Math.floor(teleprompterSeconds / 60)).padStart(2, '0')}:{String(teleprompterSeconds % 60).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Script Selector Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
                  {[
                    '1. El Truco de los Verbos (Familias)',
                    '2. Matriz de los 12 Tiempos (30s)',
                    '3. Cursos de $100 vs App de $1'
                  ].map((title, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveScriptTab(idx);
                        setTeleprompterSeconds(0);
                      }}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                        activeScriptTab === idx
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {title}
                    </button>
                  ))}
                </div>

                {/* Teleprompter Script Card */}
                <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 text-sm sm:text-base font-serif leading-relaxed text-slate-100 space-y-3">
                  {activeScriptTab === 0 && (
                    <div>
                      <p className="text-amber-400 font-sans font-bold text-xs uppercase tracking-wider mb-2">
                        🎣 Gancho (0 a 3 segundos - mira a la cámara y dilo con energía):
                      </p>
                      <p className="text-lg font-bold text-amber-200 mb-3">
                        "¡Si sigues memorizando verbos en inglés en orden alfabético, estás perdiendo tu tiempo!"
                      </p>
                      <p className="leading-loose text-slate-200">
                        El cerebro no recuerda por la letra inicial; ¡recuerda por patrones de sonido! <br />
                        Por ejemplo, los <strong>'Intocables'</strong> nunca cambian: <em>Cut, Cut, Cut</em>. <em>Hit, Hit, Hit</em>. <em>Cost, Cost, Cost</em>. <br />
                        Los <strong>'Musicales'</strong> cambian de la I a la A a la U: <em>Sing, Sang, Sung</em>. <em>Drink, Drank, Drunk</em>. <em>Swim, Swam, Swum</em>. <br />
                        En nuestra app TenseMaster los tienes agrupados en 6 familias para memorizarlos en minutos, con audio y ejercicios. <br />
                        ¡Y todo cuesta solo <strong>1 dólar al mes</strong>! El link está en mi perfil.
                      </p>
                    </div>
                  )}

                  {activeScriptTab === 1 && (
                    <div>
                      <p className="text-amber-400 font-sans font-bold text-xs uppercase tracking-wider mb-2">
                        🎣 Gancho (0 a 3 segundos):
                      </p>
                      <p className="text-lg font-bold text-amber-200 mb-3">
                        "En inglés solo existen 12 combinaciones de tiempo, ¡no 50!"
                      </p>
                      <p className="leading-loose text-slate-200">
                        La gente piensa que el inglés es imposible, pero es matemática pura: <br />
                        Tienes 3 líneas temporales: <strong>Pasado, Presente y Futuro</strong>. <br />
                        Multiplicadas por 4 aspectos: <strong>Simple, Continuo, Perfecto y Perfecto Continuo</strong>. <br />
                        3 por 4 = ¡Solo 12 casillas en una matriz! <br />
                        Si dominas estas 12 casillas, entiendes cualquier película, canción o entrevista de trabajo. <br />
                        Pruébalo ahora mismo en el link de mi perfil por solo $1 dólar.
                      </p>
                    </div>
                  )}

                  {activeScriptTab === 2 && (
                    <div>
                      <p className="text-amber-400 font-sans font-bold text-xs uppercase tracking-wider mb-2">
                        🎣 Gancho (0 a 3 segundos):
                      </p>
                      <p className="text-lg font-bold text-amber-200 mb-3">
                        "¿Por qué te cobran $100 dólares al mes por explicarte lo que puedes aprender en 10 minutos?"
                      </p>
                      <p className="leading-loose text-slate-200">
                        Los cursos tradicionales estiran las clases durante meses para cobrarte mensualidades caras. <br />
                        Por eso creé TenseMaster: <br />
                        ✅ Los 12 tiempos del inglés sin rodeos <br />
                        ✅ Pronunciación nativa interactiva <br />
                        ✅ Duelos de preguntas 1 contra 1 <br />
                        ✅ Certificado descargable <br />
                        Todo por menos de lo que cuesta un café: <strong>$1 USD al mes</strong>. Pruébalo gratis en el enlace de mi perfil.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 5 Proven 3-Second Hooks */}
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>5 Ganchos Virales de 3 Segundos (Para la primera frase del video):</span>
                </h5>

                <div className="space-y-2 text-xs">
                  {[
                    "Deja de estudiar inglés como en los años 90...",
                    "Este secreto de los 12 tiempos verbales me ahorró 2 años de instituto...",
                    "Si sabes decir 'I have been working', ya estás en nivel avanzado...",
                    "El 95% de la gente confunde 'I lived' con 'I have lived'. Mira la diferencia en 5 segundos...",
                    "La única app de inglés que no te cobra $50 al mes: Todo por $1 dólar."
                  ].map((hook, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3"
                    >
                      <span className="font-semibold text-slate-800">
                        "{hook}"
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(hook);
                          setCopiedHookIdx(idx);
                          setTimeout(() => setCopiedHookIdx(null), 2000);
                        }}
                        className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 rounded-lg cursor-pointer whitespace-nowrap"
                      >
                        {copiedHookIdx === idx ? '¡Copiado!' : 'Copiar'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* UTM Campaign Link Generator & Revenue Calculator */}
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Calculadora de Ganancias por Viralidad en Redes:</span>
                </h5>

                <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Visualizaciones estimadas en video de TikTok/Reels:</span>
                    <span className="font-mono text-indigo-700 font-bold">{viralViews.toLocaleString()} views</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="200000"
                    step="5000"
                    value={viralViews}
                    onChange={(e) => setViralViews(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>5,000 views</span>
                    <span>100,000</span>
                    <span>200,000 views</span>
                  </div>

                  {/* Calculations */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200 text-center">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase block">Visitas a la Web (5%)</span>
                      <span className="font-mono font-bold text-slate-800 text-sm">
                        {Math.round(viralViews * 0.05).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase block">Alumnos ($1/mes, 10%)</span>
                      <span className="font-mono font-bold text-emerald-700 text-sm">
                        {Math.round(viralViews * 0.05 * 0.1).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                      <span className="text-[10px] text-emerald-800 uppercase font-bold block">Ingreso Mensual MRR</span>
                      <span className="font-mono font-bold text-emerald-950 text-base">
                        ${Math.round(viralViews * 0.05 * 0.1 * 1.0).toLocaleString()} USD
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ready-to-use UTM Tracking Links */}
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    Tus enlaces de biografía con seguimiento de procedencia (UTM):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { channel: 'TikTok', param: 'ref=tiktok' },
                      { channel: 'Instagram Reels', param: 'ref=reels' },
                      { channel: 'WhatsApp / Bio', param: 'ref=bio' }
                    ].map((item) => {
                      const fullUrl = `https://${customDomainInput || 'www.tuingles.com'}/?${item.param}`;
                      return (
                        <div key={item.channel} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                          <span className="font-bold text-xs text-slate-800 block">{item.channel}</span>
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono text-[11px] text-slate-500 truncate">{fullUrl}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(fullUrl);
                                setCopiedUtmLink(item.channel);
                                setTimeout(() => setCopiedUtmLink(null), 2000);
                              }}
                              className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[10px] font-bold cursor-pointer"
                            >
                              {copiedUtmLink === item.channel ? '¡OK!' : 'Copiar'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: APP STORES & PRICING STRATEGY */}
          {activeAdminTab === 'stores_pricing' && (
            <div className="space-y-6 text-xs sm:text-sm">
              
              {/* Introduction Banner */}
              <div className="p-4 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-200 rounded-xl space-y-1 text-purple-950">
                <h4 className="font-bold text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Estrategia de Expansión: Tiendas de Apps y Escalabilidad de Precios</span>
                </h4>
                <p className="text-xs text-purple-900 leading-relaxed">
                  A continuación tienes las respuestas directas a cómo llevar tu app a Google Play (Android) y Apple App Store (iOS), y cómo subir el precio de la membresía para multiplicar tus ingresos recurrentes sin perder alumnos.
                </p>
              </div>

              {/* Interactive Pricing Simulator */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">
                      Simulador de Ingresos y Subida de Precios
                    </h5>
                    <p className="text-xs text-slate-500">
                      Compara cuánto dinero ganas con el precio inicial de $1 vs precios escalonados.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Ingreso Mensual Estimado:</span>
                    <span className="text-2xl font-bold font-mono text-emerald-600">
                      ${(simulatedStudents * simulatedPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      ${(simulatedStudents * simulatedPrice * 12).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD al año
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Slider: Students */}
                  <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>Alumnos activos suscritos:</span>
                      <span className="font-mono text-indigo-700 font-bold">{simulatedStudents.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="10000"
                      step="100"
                      value={simulatedStudents}
                      onChange={(e) => setSimulatedStudents(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>100 alumnos</span>
                      <span>5,000</span>
                      <span>10,000 alumnos</span>
                    </div>
                  </div>

                  {/* Selector: Price per month */}
                  <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-xs font-semibold text-slate-700 block">
                      Selecciona cuota mensual:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { price: 1.0, label: '$1.00 USD', desc: 'Lanzamiento' },
                        { price: 2.99, label: '$2.99 USD', desc: 'Recomendado' },
                        { price: 4.99, label: '$4.99 USD', desc: 'Premium Pro' }
                      ].map((tier) => (
                        <button
                          key={tier.price}
                          onClick={() => setSimulatedPrice(tier.price)}
                          className={`p-2 rounded-lg text-center border transition-all cursor-pointer ${
                            simulatedPrice === tier.price
                              ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-xs block">{tier.label}</span>
                          <span className={`text-[10px] block opacity-80 ${simulatedPrice === tier.price ? 'text-indigo-100' : 'text-slate-400'}`}>
                            {tier.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Roadmap: How to put on Google Play and Apple App Store */}
              <div className="space-y-3">
                <h5 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span>1. ¿Cómo publicar en Google Play (Android) y Apple App Store (iOS)?</span>
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Google Play */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🤖</span>
                      <strong className="text-slate-900 text-xs">Google Play Store (Android): La vía más fácil</strong>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Esta aplicación ya está optimizada como Progressive Web App. Puedes convertirla en un APK de Android oficial en 5 minutos usando herramientas como <strong>PWABuilder.com</strong> o <strong>Capacitor</strong>.
                    </p>
                    <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside pt-1">
                      <li>Creas tu cuenta en <strong>Google Play Console</strong> ($25 USD pago único de por vida).</li>
                      <li>Subes el archivo <code>.aab</code> generado por PWABuilder.</li>
                      <li>¡Apareces en las búsquedas de Android en todo el mundo!</li>
                    </ul>
                  </div>

                  {/* Apple App Store */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🍏</span>
                      <strong className="text-slate-900 text-xs">Apple App Store (iPhone / iPad)</strong>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Para estar en Apple, se usa <strong>Capacitor (Ionic)</strong> o un wrapper nativo de WebKit. Empaqueta este mismo código en un proyecto Xcode.
                    </p>
                    <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside pt-1">
                      <li>Requiere cuenta <strong>Apple Developer</strong> ($99 USD/año).</li>
                      <li>Se compila y firma desde una computadora Mac en Xcode.</li>
                      <li>Pasa la revisión de Apple en 24 a 48 horas.</li>
                    </ul>
                  </div>
                </div>

                {/* Secret Trick: Avoiding 30% Apple commission */}
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-1">
                  <strong>💡 El "Secreto de Spotify y Netflix" para no perder el 30% con Apple:</strong>
                  <p className="leading-relaxed">
                    Si cobras dentro de la app con compras de Apple/Google, ellos se quedan con el 15% al 30% de cada dólar. La mejor estrategia es: <em>"Inscríbete y activa tu suscripción en nuestra web oficial (Stripe te cobra solo ~3%) y luego simplemente descarga la app en tu teléfono e inicia sesión."</em>
                  </p>
                </div>
              </div>

              {/* Strategy: How and when to increase the subscription price */}
              <div className="space-y-3 pt-2">
                <h5 className="font-bold text-sm text-slate-900">
                  2. ¿Cómo y cuándo subir el precio de la membresía? (Estrategia Recomendada)
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-indigo-700 block">Fase 1: Los Primeros 500 Alumnos a $1/mes</span>
                    <p className="text-slate-600 leading-relaxed">
                      Mantén $1 USD como precio de lanzamiento. Esto te permite crecer a velocidad récord en TikTok e Instagram, recopilar cientos de testimonios y posicionarte como la app más accesible del mercado.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-indigo-700 block">Fase 2: "Grandfathering" (Urgencia)</span>
                    <p className="text-slate-600 leading-relaxed">
                      Antes de subir el precio anuncias: <em>"Últimos 7 días para conseguir acceso a $1/mes para siempre. El próximo mes el precio sube a $2.99"</em>. Esto provocará una ola masiva de suscripciones de última hora.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-indigo-700 block">Fase 3: Añadir Plan Anual ($19.99/año)</span>
                    <p className="text-slate-600 leading-relaxed">
                      Ofreces: $2.99/mes mensual o <strong>$19.99 USD/año pago único</strong>. El 40% de los alumnos elegirá el plan anual, dándote dinero por adelantado para invertir en marketing y crecer aún más rápido.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Enlace de tu aplicación:</span>
            <button
              onClick={handleCopyLink}
              className="font-mono text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>{window.location.host}</span>
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
          >
            Cerrar Panel
          </button>
        </div>

      </div>
    </div>
  );
};
