import { useLocalization } from "../i18n/LocalizationContext";
import React from 'react';
import { X, CheckCircle2, ExternalLink, CreditCard } from 'lucide-react';
import { MEMBERSHIP, getCheckoutURL } from '../config/membership';
interface SubscriptionModalProps {onClose: () => void;}
export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose }) => {const { l } = useLocalization();
  const checkoutURL = getCheckoutURL();
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <section role="dialog" aria-modal="true" aria-labelledby="membership-title" className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full my-auto shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="p-6 bg-gradient-to-r from-indigo-900 to-slate-900 text-white relative">
          <button onClick={onClose} aria-label={l("Close membership")} className="absolute right-4 top-4 p-2 rounded-lg hover:bg-white/10 cursor-pointer"><X className="w-5 h-5" /></button>
          <p className="text-indigo-200 text-sm mb-2">{l("Learn at your own pace")}</p>
          <h2 id="membership-title" className="text-2xl font-bold">{l("All-Access Membership")}</h2>
          <p className="mt-3"><strong className="text-4xl" data-testid="membership-price">${l(MEMBERSHIP.monthlyUSD.toFixed(2))}</strong> <span>{l("USD per month")}</span></p>
        </div>
        <div className="p-6 space-y-5">
          <p className="font-medium text-slate-800 dark:text-slate-200">{l("All 12 tenses included in one subscription — US$5.99/month. No separate charge per lesson.")}</p>
          <ul className="space-y-3 text-sm">
            {l(['All 12 English tenses included', 'Guided practice, interactive exercises and flashcards', 'Audio and pronunciation practice', 'Progress tracking and completion certificate'].map((benefit) =>
            <li key={benefit} className="flex gap-2 items-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />{l(benefit)}</li>
            ))}
          </ul>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 text-sm space-y-2">
            <p className="font-semibold text-indigo-900 dark:text-indigo-300">{l("All 12 tenses included in one subscription — US$5.99/month. No separate charge per lesson.")}</p>
            <p>{l("Payment details are entered on Stripe's secure checkout page.")}</p>
          </div>
          {l(checkoutURL ?
          <a href={checkoutURL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-indigo-600 text-white p-3 rounded-xl font-semibold"><CreditCard className="w-4 h-4" />{l("Continue to Stripe")}<ExternalLink className="w-4 h-4" /></a> :

          <p role="status" className="text-sm p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200">{l("Enrollment opens soon. You can study the free preview lessons now.")}</p>)
          }
          <button onClick={onClose} className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer">{l("Return to lessons")}</button>
        </div>
      </section>
    </div>);

};
