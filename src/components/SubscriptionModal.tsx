import { useLocalization } from "../i18n/LocalizationContext";
import React, { useState } from 'react';
import { X, CheckCircle2, ExternalLink, CreditCard, ShieldCheck, Sparkles, KeyRound } from 'lucide-react';
import { MEMBERSHIP, getCheckoutURL } from '../config/membership';
import { useUser } from '../context/UserContext';

interface SubscriptionModalProps {
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose }) => {
  const { l } = useLocalization();
  const { isPro, subscribeWithPromoCode } = useUser();
  const checkoutURL = getCheckoutURL();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [showPromoBox, setShowPromoBox] = useState(false);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = subscribeWithPromoCode(promoInput);
    if (ok) {
      setPromoSuccess(true);
      setPromoError(null);
    } else {
      setPromoError(l("Invalid promo code. Please check and try again."));
      setPromoSuccess(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <section role="dialog" aria-modal="true" aria-labelledby="membership-title" className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full my-auto shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 text-white relative">
          <button onClick={onClose} aria-label={l("Close membership")} className="absolute right-4 top-4 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"><X className="w-5 h-5" /></button>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              {l("All-Access Membership")}
            </span>
          </div>
          <h2 id="membership-title" className="text-2xl font-bold">{l("Master English with Unlimited Access")}</h2>
          <p className="mt-3 flex items-baseline gap-2">
            <strong className="text-4xl font-extrabold" data-testid="membership-price">${l(MEMBERSHIP.monthlyUSD.toFixed(2))}</strong>
            <span className="text-indigo-200 text-sm">{l("USD per month")}</span>
          </p>
        </div>

        <div className="p-6 space-y-5">
          {isPro || promoSuccess ? (
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 text-emerald-900 dark:text-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">{l("Your All-Access Pass is Active!")}</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">{l("All 12 tenses, exercises, native audio, and 24/7 AI tutor are fully unlocked.")}</p>
              </div>
            </div>
          ) : (
            <>
              <p className="font-medium text-slate-800 dark:text-slate-200">{l("All 12 tenses included in one subscription — US$5.99/month. No separate charge per lesson.")}</p>
              
              <ul className="space-y-2.5 text-sm">
                {[
                  'All 12 English tenses included with full mastery roadmaps',
                  '132+ guided exercises, real-life situational practice & flashcards',
                  'Native pronunciation audio coaching & speech evaluation',
                  '24/7 AI conversational grammar tutor with instant explanations',
                  'Progress analytics, timeline anchors & completion certificate'
                ].map((benefit) => (
                  <li key={benefit} className="flex gap-2.5 items-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{l(benefit)}</span>
                  </li>
                ))}
              </ul>

              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 p-3.5 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>{l("Payment details are entered on Stripe's secure checkout page.")} {l("Cancel anytime with 1 click.")}</span>
              </div>

              {checkoutURL ? (
                <a
                  href={checkoutURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white p-3.5 rounded-xl font-semibold shadow-md shadow-indigo-600/20 transition-all text-base cursor-pointer"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>{l("Continue to Stripe")} (${MEMBERSHIP.monthlyUSD.toFixed(2)}/mo)</span>
                  <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
                </a>
              ) : (
                <p role="status" className="text-sm p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200">
                  {l("Enrollment opens soon. You can study the free preview lessons now.")}
                </p>
              )}

              {/* Promo / Access code toggle */}
              <div className="pt-1 text-center">
                {!showPromoBox ? (
                  <button
                    type="button"
                    onClick={() => setShowPromoBox(true)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <KeyRound className="w-3 h-3" />
                    {l("Have a promo or access code?")}
                  </button>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      placeholder={l("Enter code (e.g. PROMO599)")}
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 text-xs font-semibold bg-slate-800 text-white dark:bg-slate-700 rounded-lg hover:bg-slate-900 cursor-pointer"
                    >
                      {l("Apply")}
                    </button>
                  </form>
                )}
                {promoError && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{promoError}</p>}
              </div>
            </>
          )}

          <button onClick={onClose} className="w-full p-3 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl text-sm font-medium cursor-pointer transition-colors">
            {l("Return to lessons")}
          </button>
        </div>
      </section>
    </div>
  );
};
