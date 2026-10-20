import { DuelModeView } from '../src/components/DuelModeView';
import { LeaderboardView } from '../src/components/LeaderboardView';
import { ForumView } from '../src/components/ForumView';
import { TenseComparator } from '../src/components/TenseComparator';
import { TextAnalyzerView } from '../src/components/TextAnalyzerView';
import { VerbsPatternView } from '../src/components/VerbsPatternView';
import { FlashcardsView } from '../src/components/FlashcardsView';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import App from '../src/App';
import { UserProvider, useUser } from '../src/context/UserContext';
import { useLocalization } from '../src/i18n/LocalizationContext';
import { TenseDetailModal } from '../src/components/TenseDetailModal';
import { InteractiveExercise } from '../src/components/InteractiveExercise';
import { SubscriptionModal } from '../src/components/SubscriptionModal';
import { ALL_12_TENSES } from '../src/data/tensesData';
import catalog from '../src/i18n/catalog.json';
import { getCheckoutURL } from '../src/config/membership';
import { SUPPORTED_LANGUAGES } from '../src/i18n/translations';
import englishSource from '../src/i18n/englishSource.json';
import translateHandler from '../api/translate';
import metadata from '../metadata.json';
import { ChatbotView } from '../src/components/ChatbotView';
import { getMicrophoneEnvironmentError, requestMicrophonePermission } from '../src/utils/microphonePermission';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'https://example.test' });
for (const name of ['window', 'document', 'localStorage', 'HTMLElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle']) Object.defineProperty(globalThis, name, { value: (dom.window as any)[name], configurable: true });
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true, requestAnimationFrame: (f: any) => setTimeout(f, 0), cancelAnimationFrame: clearTimeout, ResizeObserver: class { observe() {} unobserve() {} disconnect() {} } });
dom.window.matchMedia = () => ({ matches: false, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; }, media: '' });
let requestCount = 0;
globalThis.fetch = async () => { requestCount++; return new Response(JSON.stringify({ error: 'Not configured' }), { status: 503 }); };
let user: ReturnType<typeof useUser>;
function Probe() {
  user = useUser();
  const { l } = useLocalization();
  return <output id="probe">{l('All-Access Membership')}|{l('Language')}|{l('Progreso: {{0}}% completado', [40])}</output>;
}
let root = createRoot(document.getElementById('root')!);
async function render(node: React.ReactNode) { await act(async () => { root.render(node); }); }
async function reset() { await act(async () => root.unmount()); localStorage.clear(); document.getElementById('root')!.innerHTML = ''; root = createRoot(document.getElementById('root')!); }
const text = () => document.body.textContent || '';

assert(metadata.requestFramePermissions.includes('microphone'));
let microphoneCalls = 0;
let tracksStopped = 0;
Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: {
  getUserMedia: async () => { microphoneCalls++; return { getTracks: () => [{ stop: () => tracksStopped++ }] }; }
} });
Object.defineProperty(document, 'featurePolicy', { configurable: true, value: { allowsFeature: () => false } });
assert.match(getMicrophoneEnvironmentError()!, /preview/);
assert.equal((await requestMicrophonePermission()).status, 'unsupported');
assert.equal(microphoneCalls, 0);
Object.defineProperty(document, 'featurePolicy', { configurable: true, value: { allowsFeature: () => true } });
assert.equal((await requestMicrophonePermission()).granted, true);
assert.equal(tracksStopped, 1);
delete (document as any).featurePolicy;

function RegressionLabels() {
  const { l } = useLocalization();
  return <output>{['Ejemplo real ilustrativo:', 'Escuchar todo (', '0.8x Lento', 'Contexto:', 'Ocultar', 'Entrenador Oral:', 'Probar Altavoces', 'Volver a solicitar permiso'].map(label => l(label)).join('|')}</output>;
}
await render(<UserProvider><RegressionLabels /></UserProvider>);
assert.equal(text(), 'Real-life example:|Listen to all (|0.8x Slow|Context:|Hide|Speaking coach:|Test speakers|Request microphone access');
await reset();

localStorage.setItem('tensemaster_native_language', 'es');
localStorage.setItem('tensemaster_owner_config', JSON.stringify({ priceMonthly: 1.99 }));
await render(<UserProvider><Probe /><SubscriptionModal onClose={() => {}} /></UserProvider>);
assert.equal(user!.nativeLanguage, 'en');
assert.equal(user!.ownerConfig.priceMonthly, 5.99);
assert.equal(document.documentElement.lang, 'en');
assert.equal(document.querySelector('[data-testid="membership-price"]')!.textContent, '$5.99');
assert(!text().includes('1.99'));
assert(!document.querySelector('input'));
assert(!document.querySelector('a[href*="test_"]'));
assert(text().includes('Progress: 40% complete'));
assert.equal(requestCount, 0, 'English must not request AI translations');
await act(async () => user!.setNativeLanguage('es'));
assert(text().includes('Membresía de acceso completo'));
assert(text().includes('Idioma'));
assert.equal(localStorage.getItem('tensemaster_interface_language_v3'), 'es');
await act(async () => user!.setNativeLanguage('ar'));
assert.equal(document.documentElement.dir, 'rtl');
assert(text().includes('عضوية الوصول الكامل'));
await act(async () => user!.setNativeLanguage('en'));
assert.equal(document.documentElement.dir, 'ltr');
for (const language of SUPPORTED_LANGUAGES) {
  await act(async () => user!.setNativeLanguage(language.code));
  assert.equal(user!.nativeLanguage, language.code);
  assert(!document.querySelector('#probe')!.textContent!.includes('{{'));
}
assert.equal(getCheckoutURL(), null, 'Checkout stays closed until billing is verified');
await reset();

await render(<UserProvider><Probe /></UserProvider>);
const legacy = structuredClone(user!.progressState); legacy.subscription.isPro = true; legacy.subscription.priceUSD = 1.99;
await reset();
localStorage.setItem('tensemaster_user_progress_v2', JSON.stringify(legacy));
await render(<UserProvider><Probe /><SubscriptionModal onClose={() => {}} /></UserProvider>);
assert.equal(user!.progressState.subscription.priceUSD, 5.99);
assert.equal(user!.isPro, false, 'Stored demo membership is not proof of payment');
assert(!text().includes('1.99'));
await reset();

// Every explanatory lesson field and all 132 exercise prompts have an English source.
const src: Record<string, string> = englishSource;
for (const tense of ALL_12_TENSES) {
  const fields = [tense.tagline, ...Object.values(tense.timelineGraphic), ...Object.values(tense.formula), ...tense.whenToUse.flatMap((u) => [u.title, u.description]), ...tense.commonMistakes.map((m) => m.why), ...tense.examples.map((e) => e.contextNote), tense.videoLesson.title, tense.videoLesson.summary, ...tense.videoLesson.keyTakeaways, ...tense.exercises.flatMap((e) => [e.prompt, e.explanation, ...(e.hint ? [e.hint] : [])])];
  for (const field of fields) assert(src[field.trim()] || !/[áéíóúñ¿¡]/i.test(field), `Missing English lesson source: ${field}`);
}
for (const tense of ALL_12_TENSES.filter((t) => t.isFreePreview)) {
  await render(<UserProvider><Probe /><TenseDetailModal tense={tense} onClose={() => {}} onOpenSubscription={() => {}} /></UserProvider>);
  assert(text().includes('Subject +'));
  assert(text().includes(tense.examples[0].english));
  assert(document.querySelector('select[aria-label="Lesson language"]'));
  assert(!/Sujeto|Rutinas|Cuándo/.test(text()));
  await act(async () => user!.setNativeLanguage('es'));
  assert(text().includes(tense.examples[0].spanish));
  assert(text().includes(tense.examples[1].spanish), 'Each example must show its own translation');
  assert(text().includes(tense.examples[0].english), 'Learning examples remain English');
  await reset();
}
await render(<UserProvider><InteractiveExercise exercise={ALL_12_TENSES[0].exercises[0]} exerciseIndex={0} totalExercises={11} isLast={false} onNext={() => {}} onAnswerSubmit={() => {}} /></UserProvider>);
assert(text().includes('Complete the sentence:'));
assert(text().includes('studies'));
assert(!text().includes('Completa'));
await reset();

await render(<App />);
assert(text().includes('12 English Tenses'));
assert(text().includes('My Progress'));
assert(!/Aprende|Rutinas|Membresía|Sujeto|Tiempos/.test(text()));
assert(document.querySelector('button[aria-label="Language"]'));
const navLanguage = document.querySelector('button[aria-label="Language"]') as HTMLButtonElement;
await act(async () => navLanguage.click());
assert(document.querySelector('button[aria-expanded="true"]'));
console.log('PASS: Complete app renders in English, including formulas and navigation.');
await reset();

// Read-only handler tests: no provider key, no AI requests, no billing calls.
async function api(body: any) {
  const prevKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  try {
    const result: any = { status: 200 };
    const res: any = { status(n: number) { result.status = n; return this; }, json(data: any) { result.body = data; return this; } };
    await translateHandler({ method: 'POST', body }, res);
    return result;
  } finally {
    if (prevKey !== undefined) process.env.GEMINI_API_KEY = prevKey;
  }
}
assert.equal((await api({ language: 'xx', keys: ['s0'] })).status, 400);
assert.equal((await api({ language: 'fr', keys: ['untrusted-user-content'] })).status, 400);
const key = Object.keys((await import('../src/i18n/catalog.json')).default)[0];
assert.equal((await api({ language: 'fr', keys: [key] })).status, 503);
assert.equal((await api({ language: 'en', keys: [key] })).status, 200);
console.log('PASS: English default, legacy price migration, language persistence, RTL, lesson language selector, correct per-sentence translations, English exercise answers, and API validation.');

await reset();
(dom.window.HTMLElement.prototype as any).scrollIntoView = () => {};
await render(<UserProvider><ChatbotView /></UserProvider>);
assert.equal([...document.querySelectorAll('button')].filter(b => b.textContent === 'Speak').length, 1);
assert(!text().includes('If browser dictation does not work'));
assert(document.querySelector('button[aria-label="Send message"]'));
await reset();
console.log('PASS: Tutor has a single Speak action and an accessible Send action.');

// Review secondary panels and their controls, not only the initial home screen.
const panels: [string, React.ReactNode][] = [
  ['flashcards', <FlashcardsView onOpenTenseLesson={() => {}} onOpenSubscription={() => {}} />],
  ['verbs', <VerbsPatternView />], ['analyzer', <TextAnalyzerView />],
  ['comparator', <TenseComparator />], ['community', <ForumView />],
  ['leaderboard', <LeaderboardView />], ['duel', <DuelModeView />]
];
const panelReport: Record<string, string> = {};
for (const [name, panel] of panels) {
  await reset();
  await render(<UserProvider>{panel}</UserProvider>);
  panelReport[name] = text() + '\nCONTROLS: ' + [...document.querySelectorAll('[title], [placeholder]')].map(el => el.getAttribute('title') || el.getAttribute('placeholder')).join(' | ');
  assert(!/Dominadas|V1 · Presente|V2 · Pasado|V3 · Participio|Escuchar Audio|Escuchando|Siguiente Ronda/.test(panelReport[name]), name + ' contains untranslated controls');
  if (name === 'flashcards') {
    await act(async () => (document.querySelector('[class*="perspective"] > div') as HTMLElement).click());
    assert(!/Dominadas|Escuchar|Estructura y/.test(text()));
    panelReport[name + '-answer'] = text();
  }
  if (name === 'analyzer') {
    const reading = [...document.querySelectorAll('button')].find(b => b.textContent?.includes('Open reading mode'))!;
    await act(async () => reading.click());
    assert(!/Escuchar|Volver al|Resaltar|Escuchando/.test(text()));
    panelReport[name + '-reading'] = text();
  }
  if (name === 'comparator') {
    for (const caption of ['Present Simple vs. Present Continuous', 'Future: Will vs. Be Going To']) {
      const tab = [...document.querySelectorAll('button')].find(b => b.textContent?.trim() === caption)!;
      await act(async () => tab.click());
      assert(!/Palabras clave|Mi hogar permanente|Proyecto meditado|Planes previos/.test(text()));
    }
    panelReport[name + '-future'] = text();
  }

}
await reset();
console.log('PASS: Flashcards, verbs, analyzer, comparator, community, leaderboard and duel controls render in English.');
if (process.env.LOCALE_AUDIT_OUTPUT) (await import('node:fs')).writeFileSync(process.env.LOCALE_AUDIT_OUTPUT, JSON.stringify(panelReport, null, 2));
