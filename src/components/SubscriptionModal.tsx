import { useLocalization } from "../i18n/LocalizationContext";
import React, { useState } from 'react';
import { X, CheckCircle2, ExternalLink, CreditCard, ShieldCheck, Sparkles, MailCheck, LogOut, RefreshCw } from 'lucide-react';
import { MEMBERSHIP, getCheckoutURL } from '../config/membership';
import { useUser, SignInResult } from '../context/UserContext';

const SIGN_IN_MESSAGES: Partial<Record<SignInResult, string>> = {
  'no-subscription': "We couldn't find an active subscription for that email. Use the email from your Stripe receipt.",
  'invalid-email': 'Please enter a valid email address.',
  'wrong-code': 'That code is not correct or has expired. Check the email and try again.',
  'too-many-attempts': 'Too many attempts. Please wait a minute and try again.',
  'not-configured': 'Sign-in is not available yet. Please try again later.',
  'unavailable': "We couldn't verify your subscription right now. Please try again in a moment."
};

interface SubscriptionModalProps {
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose }) => {
  const { l } = useLocalization();
  const {
    isPro, memberEmail, membershipStatus, signInEmail, requestSignInCode, confirmSignInCode,
    cancelSignIn, signOut, retryMembership, pendingEmailVerification, dismissPendingEmailVerification
  } = useUser();
  const checkoutURL = getCheckoutURL();
  const [emailInput, setEmailInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [signInError, setSignInError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const signInOpen = showSignIn || pendingEmailVerification || !!signInEmail;

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || busy) return;
    setBusy(true);
    setSignInError(null);
    const result = await requestSignInCode(emailInput);
    setBusy(false);
    if (result === 'code-sent') setCodeInput('');
    else setSignInError(SIGN_IN_MESSAGES[result] || SIGN_IN_MESSAGES.unavailable!);
  };

  const handleConfirmCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInput.trim() || busy) return;
    setBusy(true);
    setSignInError(null);
    const result = await confirmSignInCode(codeInput);
    setBusy(false);
    if (result !== 'active') setSignInError(SIGN_IN_MESSAGES[result] || SIGN_IN_MESSAGES.unavailable!);
  };

  const useAnotherEmail = () => {
    cancelSignIn();
    setCodeInput('');
    setSignInError(null);
  };

  const handleClose = () => {
    dismissPendingEmailVerification();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <section role="dialog" aria-modal="true" aria-labelledby="membership-title" className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full my-auto shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 text-white relative">
          <button onClick={handleClose} aria-label={l("Close membership")} className="absolute right-4 top-4 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"><X className="w-5 h-5" /></button>
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
          {isPro ? (
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 text-emerald-900 dark:text-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">{l("Your All-Access Pass is Active!")}</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">{l("All 12 tenses, exercises, native audio, and 24/7 AI tutor are fully unlocked.")}</p>
                {memberEmail && (
                  <p className="text-xs text-emerald-800 dark:text-emerald-200 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>{l("Signed in as {{0}}", [memberEmail])}</span>
                    <button type="button" onClick={signOut} className="inline-flex items-center gap-1 font-semibold underline cursor-pointer">
                      <LogOut className="w-3 h-3" />{l("Sign out")}
                    </button>
                  </p>
                )}
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

              {membershipStatus === 'loading' && (
                <p role="status" className="text-sm text-center text-slate-600 dark:text-slate-300">{l("Checking…")}</p>
              )}
              {membershipStatus === 'error' && (
                <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30 p-3.5 text-sm text-amber-900 dark:text-amber-200 flex flex-wrap items-center justify-between gap-2">
                  <span>{l("We couldn't load your lessons. Check your connection and try again.")}</span>
                  <button type="button" onClick={retryMembership} className="inline-flex items-center gap-1.5 font-semibold underline cursor-pointer">
                    <RefreshCw className="w-4 h-4" />{l("Try again")}
                  </button>
                </div>
              )}

              {/* Members sign in with a code sent to the email they paid with */}
              {membershipStatus !== 'loading' && membershipStatus !== 'error' && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3.5 text-center">
                {pendingEmailVerification && (
                  <p role="status" className="text-sm font-medium text-emerald-800 dark:text-emerald-300 mb-2">
                    {l("Thanks for your payment! Confirm the email you used at checkout to activate your access.")}
                  </p>
                )}
                {!signInOpen ? (
                  <button
                    type="button"
                    onClick={() => setShowSignIn(true)}
                    className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <MailCheck className="w-4 h-4" />
                    {l("Already paid? Verify your access")}
                  </button>
                ) : !signInEmail ? (
                  <form onSubmit={handleRequestCode} className="flex flex-wrap items-center gap-2">
                    <label htmlFor="membership-verify-email" className="sr-only">{l("Email used at checkout")}</label>
                    <input
                      id="membership-verify-email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder={l("Email used at checkout")}
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="flex-1 min-w-0 basis-48 px-3 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={busy}
                      className="px-4 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                    >
                      {busy ? l("Sending…") : l("Send code")}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleConfirmCode} className="space-y-2">
                    <p className="text-sm text-slate-700 dark:text-slate-300">{l("We sent a 6-digit code to {{0}}. It expires in 10 minutes.", [signInEmail])}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <label htmlFor="membership-code" className="sr-only">{l("6-digit code")}</label>
                      <input
                        id="membership-code"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={7}
                        required
                        placeholder={l("6-digit code")}
                        value={codeInput}
                        onChange={(e) => setCodeInput(e.target.value)}
                        className="flex-1 min-w-0 basis-40 px-3 py-2.5 text-lg tracking-[0.3em] text-center font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="submit"
                        disabled={busy}
                        className="px-4 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                      >
                        {busy ? l("Checking…") : l("Verify my access")}
                      </button>
                    </div>
                    <button type="button" onClick={useAnotherEmail} className="text-xs text-indigo-600 dark:text-indigo-400 underline cursor-pointer">
                      {l("Use another email")}
                    </button>
                  </form>
                )}
                {signInError && <p role="alert" className="text-xs text-rose-600 dark:text-rose-400 mt-2">{l(signInError)}</p>}
              </div>
              )}
            </>
          )}

          <button onClick={handleClose} className="w-full p-3 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl text-sm font-medium cursor-pointer transition-colors">
            {l("Return to lessons")}
          </button>
        </div>
      </section>
    </div>
  );
};
