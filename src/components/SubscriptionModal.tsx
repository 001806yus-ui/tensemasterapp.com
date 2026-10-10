import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import {
  X,
  CheckCircle2,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Zap,
  HelpCircle,
  Receipt,
  Download,
  ExternalLink,
  Clock
} from 'lucide-react';

interface SubscriptionModalProps {
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose }) => {
  const { isPro, progressState, subscribePro, cancelSubscription, ownerConfig, unlockOwnerAccess, nativeLanguage } = useUser();
  const currentLangOption = SUPPORTED_LANGUAGES.find((l) => l.code === nativeLanguage) || SUPPORTED_LANGUAGES[0];
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'gpay'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(progressState.userName || 'Estudiante');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const price = appliedPromo ? 0.0 : (ownerConfig?.priceMonthly ?? 1.99);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'PRIMERMES' || promoCode.trim().toUpperCase() === 'PROMO1') {
      setAppliedPromo(true);
    } else {
      alert(`Código no válido. Puedes usar el código "PRIMERMES" para 1 mes gratis o continuar con $${(ownerConfig?.priceMonthly || 1.99).toFixed(2)} USD/mes.`);
    }
  };

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      subscribePro(
        paymentMethod === 'card'
          ? 'Tarjeta terminada en 4242'
          : paymentMethod === 'paypal'
          ? 'PayPal Express'
          : 'Google Pay'
      );
      setIsProcessing(false);
      setShowReceipt(true);
    }, 900);
  };

  const handleCancel = () => {
    if (confirm(`¿Estás seguro de que deseas cancelar tu suscripción de $${(ownerConfig?.priceMonthly || 1.99).toFixed(2)}/mes? Mantendrás acceso hasta el final del periodo.`)) {
      cancelSubscription();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-indigo-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Aprender inglés sin complicaciones ni barreras de precio</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif">
            {isPro ? 'Tu Suscripción Activa' : `Pase Total: Solo $${(ownerConfig?.priceMonthly || 1.99).toFixed(2)} USD / mes`}
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-md">
            {isPro
              ? 'Tienes acceso total e ilimitado a los 12 tiempos del inglés.'
              : 'Diseñado para que cualquier persona pueda aprender inglés de verdad por menos de lo que cuesta un café.'}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Active Subscription State View */}
          {isPro ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Membresía Activa</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    ${(progressState.subscription.priceUSD || ownerConfig?.priceMonthly || 1.99).toFixed(2)} USD / mes
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-emerald-200/60 font-mono">
                  <div><strong>Titular:</strong> {progressState.userName}</div>
                  <div><strong>Método de pago:</strong> {progressState.subscription.paymentMethod || 'Tarjeta registrada'}</div>
                  <div><strong>ID Transacción:</strong> {progressState.subscription.transactionId || 'TXN-984712A'}</div>
                  <div><strong>Próxima renovación:</strong> {progressState.subscription.renewalDate ? new Date(progressState.subscription.renewalDate).toLocaleDateString() : 'En 30 días'}</div>
                </div>
              </div>

              {/* What's active */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Beneficios activos en tu cuenta:
                </span>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Acceso completo a los 12 tiempos verbales (Pasado, Presente, Futuro).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Audio nativo con velocidad ajustable en todos los ejemplos.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Talleres interactivos con corrección y explicaciones inmediatas.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Certificado de finalización descargable con tu nombre.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer"
                >
                  Cancelar suscripción
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Continuar aprendiendo
                </button>
              </div>
            </div>
          ) : (
            /* Checkout View */
            <div className="space-y-5">
              
              {/* OWNER / VIP FREE ACCESS BANNER */}
              <div className="p-4 bg-gradient-to-r from-amber-500/15 via-amber-100/90 to-amber-50 border-2 border-amber-400 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm text-lg font-bold">
                    👑
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                        Modo Dueña / Creadora
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-amber-950 leading-snug">
                      ¿Eres la dueña probando tu app? <strong>¡Tú NO tienes que pagar nada!</strong>
                    </p>
                    <p className="text-xs text-amber-900/90 leading-relaxed">
                      Este aviso de cobro de ${(ownerConfig?.priceMonthly || 1.99).toFixed(2)} USD es únicamente la pantalla que verán <em>tus alumnos</em> cuando lancen la app. Para probar todas las lecciones sin pagar un centavo, haz clic aquí:
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    unlockOwnerAccess();
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-98"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>👑 Desbloquear Todo Gratis (Acceso Total Dueña)</span>
                </button>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <Zap className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Los 12 Tiempos Completos</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sin permanencia</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Videoclases guiadas</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Certificado oficial</span>
                </div>
              </div>

              {/* Price summary badge */}
              <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Total a pagar hoy:</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold font-mono text-indigo-900">
                        ${price.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-600 font-medium">USD / mes</span>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-500">
                    <span>Renovación automática mensual</span>
                    <span className="block text-emerald-600 font-semibold">Cancela cuando quieras</span>
                  </div>
                </div>

                {currentLangOption && (
                  <div className="pt-2 border-t border-indigo-100/80 flex items-center justify-between text-xs text-indigo-900">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span>{currentLangOption.flag}</span>
                      <span>Equivalente local ({currentLangOption.name}):</span>
                    </span>
                    <span className="font-bold font-mono bg-white px-2 py-0.5 rounded-md border border-indigo-200/80 text-indigo-700">
                      {currentLangOption.currencyEquiv}
                    </span>
                  </div>
                )}
              </div>

              {/* All-inclusive clarification */}
              <div className="p-3.5 bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-950 dark:text-emerald-200 flex items-start gap-2.5 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-emerald-900 dark:text-emerald-100 block">
                    Acceso Total a todos los niveles (A1 hasta C1):
                  </span>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    Con este único pago de ${price.toFixed(2)} USD al mes, el alumno desbloquea <strong>los 12 tiempos verbales completos</strong>, las 12 clases en video, laboratorio de grabación de voz, audios nativos y certificado. <strong>NO se cobra por nivel ni por lección separada.</strong>
                  </p>
                </div>
              </div>

              {/* Course Duration & Payment Schedule Guide */}
              <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-200 text-xs">
                  <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>¿Cuánto dura el curso y por cuánto tiempo se paga?</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-indigo-950 dark:text-indigo-200">
                  <div className="p-2 bg-white/80 dark:bg-slate-900/60 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">⏱️ Duración del curso:</span>
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong>1 a 3 meses</strong> en promedio (10 a 15 min al día). Al completar los 12 tiempos y pruebas, se emite el certificado oficial.
                    </p>
                  </div>
                  <div className="p-2 bg-white/80 dark:bg-slate-900/60 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">💳 Tiempo de pago:</span>
                    <p className="text-slate-600 dark:text-slate-300">
                      Solo el tiempo que el alumno decida estar suscrito. Puede cancelar con 1 clic cuando termine; si termina en 1 mes, <strong>solo paga ${(ownerConfig?.priceMonthly || 1.99).toFixed(2)} USD en total</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Selecciona método de pago:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Tarjeta</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'paypal'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>PayPal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('gpay')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'gpay'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Google Pay</span>
                  </button>
                </div>
              </div>

              {/* Simulated Card Fields */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <label className="text-slate-500 block mb-1">Nombre en la tarjeta</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 block mb-1">Número de tarjeta (Simulador)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-500 block mb-1">Vencimiento</label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1">CVC / CVV</label>
                      <input
                        type="text"
                        defaultValue="921"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Promo code field */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="¿Tienes cupón? (ej. PRIMERMES)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg cursor-pointer"
                >
                  Aplicar
                </button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => {
                    unlockOwnerAccess();
                    onClose();
                  }}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>👑 Desbloquear Todo Gratis (Modo Dueña / Sin Pagar)</span>
                </button>

                {ownerConfig.stripePaymentLink ? (
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="text-[11px] text-slate-500 text-center font-medium">
                      O prueba el enlace real que verán tus alumnos:
                    </div>
                    <a
                      href={ownerConfig.stripePaymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setTimeout(() => handleSubscribe(), 1200);
                      }}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Probar Enlace de Pago de Stripe (${(ownerConfig?.priceMonthly || 1.99).toFixed(2)} USD)</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleSubscribe}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>🧪 Simular cobro demo de alumno (${(ownerConfig?.priceMonthly || 1.99).toFixed(2)} USD)</span>
                  </button>
                )}
              </div>

              <p className="text-[11px] text-center text-slate-400">
                🔒 Transacción encriptada SSL de 256 bits directa a Stripe. Cancela con 1 clic en cualquier momento sin penalizaciones.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
