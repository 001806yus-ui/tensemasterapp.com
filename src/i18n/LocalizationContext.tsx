import React, { useEffect, useRef, useSyncExternalStore } from 'react';
import { useUser } from '../context/UserContext';
import { TRANSLATIONS, SUPPORTED_LANGUAGES, SupportedLanguage } from './translations';
import membershipTranslations from './membershipTranslations.json';
import englishSource from './englishSource.json';
import catalog from './catalog.json';

const sourceMap: Record<string, string> = englishSource;
const textToKey = new Map(Object.entries(catalog).map(([key, text]) => [text, key]));
const direct = new Map<string, Record<string, string>>();
for (const key of Object.keys(TRANSLATIONS.en)) {
  const row: Record<string, string> = {};
  for (const lang of SUPPORTED_LANGUAGES) row[lang.code] = TRANSLATIONS[lang.code][key as keyof typeof TRANSLATIONS.en];
  for (const value of Object.values(row)) if (value) direct.set(value.trim(), row);
}
for (const row of Object.values(membershipTranslations)) for (const text of Object.values(row)) direct.set(text, row);

const spanishByEnglish = new Map<string, string>();
for (const [es, en] of Object.entries(sourceMap)) if (!spanishByEnglish.has(en)) spanishByEnglish.set(en, es);

const cache: Record<string, Record<string, string>> = {};
const listeners = new Set<() => void>();
const failures = new Map<string, string>();
const requests = new Map<string, Set<string>>();
let revision = 0;
let running = false;
const emit = () => { revision++; listeners.forEach((listener) => listener()); };
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
const snapshot = () => revision;
const CACHE_VERSION = 'tensemaster_translations_v3';

function getCache(lang: string): Record<string, string> {
  if (cache[lang]) return cache[lang];
  try {
    const saved = JSON.parse(localStorage.getItem(`${CACHE_VERSION}_${lang}`) || '{}');
    cache[lang] = Object.fromEntries(Object.entries(saved).filter(([key, value]) => key in catalog && typeof value === 'string')) as Record<string, string>;
  } catch { cache[lang] = {}; }
  return cache[lang];
}

async function flush() {
  if (running) return;
  running = true;
  try {
    for (const [lang, queue] of requests) {
      if (failures.has(lang)) continue;
      while (queue.size) {
        const keys = [...queue].slice(0, 30);
        keys.forEach((key) => queue.delete(key));
        try {
          const response = await fetch('/api/translate', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language: lang, keys }), signal: AbortSignal.timeout(45000)
          });
          if (!response.ok) throw new Error('Translation unavailable');
          const data = await response.json();
          if (!data.translations || typeof data.translations !== 'object') throw new Error('Invalid translation response');
          const translated = getCache(lang);
          for (const key of keys) if (typeof data.translations[key] === 'string' && data.translations[key].trim()) translated[key] = data.translations[key];
          if (keys.some((key) => !translated[key])) throw new Error('Incomplete translation response');
          try { localStorage.setItem(`${CACHE_VERSION}_${lang}`, JSON.stringify(translated)); } catch { /* Memory cache still works. */ }
          emit();
        } catch {
          keys.forEach((key) => queue.add(key));
          failures.set(lang, 'The translation service is unavailable. English text remains available.');
          emit();
          break;
        }
      }
    }
  } finally { running = false; }
}

export function useLocalization() {
  const { nativeLanguage } = useUser();
  useSyncExternalStore(subscribe, snapshot, snapshot);
  const pending = useRef(new Set<string>());
  // Register public content after React commits, never request during render.
  useEffect(() => {
    if (nativeLanguage === 'en' || !pending.current.size) return;
    const queue = requests.get(nativeLanguage) || new Set<string>();
    for (const key of pending.current) if (!getCache(nativeLanguage)[key]) queue.add(key);
    pending.current.clear(); requests.set(nativeLanguage, queue);
    void flush();
  });

  function l<T>(value: T, parameters?: unknown[]): T {
    if (typeof value !== 'string' || !value.trim()) return value;
    const leading = value.match(/^\s*/)?.[0] || '';
    const trailing = value.match(/\s*$/)?.[0] || '';
    const original = value.trim();
    const format = (text: string) => text.replace(/\{\{(\d+)\}\}/g, (_, index) => String(parameters?.[Number(index)] ?? ''));
    const builtIn = direct.get(original)?.[nativeLanguage];
    if (builtIn) return (leading + format(builtIn) + trailing) as T;
    const english = sourceMap[original] || original;
    if (nativeLanguage === 'en') return (leading + format(english) + trailing) as T;
    const sourceSpanish = spanishByEnglish.get(english);
    if (nativeLanguage === 'es' && sourceSpanish) return (leading + format(sourceSpanish) + trailing) as T;
    const key = textToKey.get(english);
    if (key) {
      const translated = getCache(nativeLanguage)[key];
      if (translated) return (leading + format(translated) + trailing) as T;
      pending.current.add(key);
    }
    return (leading + format(english) + trailing) as T;
  }

  return { l, language: nativeLanguage, translationError: failures.get(nativeLanguage), retryTranslations: () => { failures.delete(nativeLanguage); emit(); void flush(); } };
}

export const TranslationStatus: React.FC = () => {
  const { translationError, retryTranslations, language } = useLocalization();
  if (!translationError) return null;
  return <div role="status" lang="en" className="fixed bottom-3 left-3 right-3 z-[80] mx-auto max-w-lg rounded-xl bg-amber-50 border border-amber-300 p-3 text-sm text-amber-950 shadow-lg">{translationError} <button className="underline font-semibold ml-2 cursor-pointer" onClick={retryTranslations}>Retry {language.toUpperCase()}</button></div>;
};
