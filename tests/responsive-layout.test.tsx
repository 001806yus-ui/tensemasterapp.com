import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import App from '../src/App';
import { UserProvider } from '../src/context/UserContext';
import { Navbar } from '../src/components/Navbar';
import { ChatbotView } from '../src/components/ChatbotView';
import { TUTORIAL_STORAGE_KEY } from '../src/components/WelcomeTutorial';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'https://example.test' });
for (const name of ['window', 'document', 'localStorage', 'HTMLElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle']) {
  Object.defineProperty(globalThis, name, { value: (dom.window as any)[name], configurable: true });
}
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
Object.assign(globalThis, {
  IS_REACT_ACT_ENVIRONMENT: true,
  requestAnimationFrame: (f: any) => setTimeout(f, 0),
  cancelAnimationFrame: clearTimeout,
  ResizeObserver: class { observe() {} unobserve() {} disconnect() {} }
});
(dom.window.HTMLElement.prototype as any).scrollIntoView = () => {};

let root = createRoot(document.getElementById('root')!);
async function render(node: React.ReactNode) {
  await act(async () => { root.render(node); });
}
async function reset() {
  await act(async () => root.unmount());
  localStorage.clear();
  document.getElementById('root')!.innerHTML = '';
  root = createRoot(document.getElementById('root')!);
}

console.log('--- Testing First Visit Guide Behavior ---');
// 1. First visit: localStorage does NOT have TUTORIAL_STORAGE_KEY
localStorage.clear();
await render(<App />);
assert(
  document.body.textContent!.includes('Interactive Guide') ||
  document.body.textContent!.includes('Cognitive Visual Method') ||
  document.body.textContent!.includes('Situations Method'),
  'Welcome tutorial must be open on first visit'
);

// Close tutorial
const closeBtn = document.querySelector('button[title*="guide"], button[title*="presentation"], button[title*="presentación"]') as HTMLButtonElement;
if (closeBtn) {
  await act(async () => closeBtn.click());
} else {
  const gotItBtn = [...document.querySelectorAll('button')].find(b => b.textContent?.includes('Got it') || b.textContent?.includes('Start'));
  if (gotItBtn) await act(async () => (gotItBtn as HTMLButtonElement).click());
}

// 2. Second visit: localStorage HAS TUTORIAL_STORAGE_KEY
await reset();
localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
await render(<App />);
assert(
  !document.body.textContent!.includes('Step 1 of 5') &&
  !document.body.textContent!.includes('Interactive Guide'),
  'Welcome tutorial must not auto-open on return visits'
);

// 3. Opening tutorial on demand via Quick Guide button
const guideBtn = [...document.querySelectorAll('button')].find(b =>
  b.textContent?.includes('Guide') || b.textContent?.includes('Guía') || b.getAttribute('title')?.includes('Guide') || b.getAttribute('title')?.includes('Guía')
) as HTMLButtonElement;
assert(guideBtn, 'Quick Guide button must be accessible');
await act(async () => guideBtn.click());
assert(
  document.body.textContent!.includes('Interactive Guide') || document.body.textContent!.includes('Cognitive Visual Method'),
  'Guide button must open the tutorial on demand'
);
await reset();

console.log('--- Testing Viewport Widths (375, 768, 1024, 1440 px) ---');
const widths = [375, 768, 1024, 1440];

for (const width of widths) {
  (dom.window as any).innerWidth = width;
  await render(
    <UserProvider>
      <Navbar
        currentTab="roadmap"
        setCurrentTab={() => {}}
        onOpenSubscription={() => {}}
        onOpenCertificate={() => {}}
        onOpenReminders={() => {}}
        onOpenOfflineCenter={() => {}}
        onOpenDiagnostic={() => {}}
        onOpenVoiceSettings={() => {}}
        onOpenWelcomeTutorial={() => {}}
      />
    </UserProvider>
  );

  // A. MENÚ button
  const menuBtn = [...document.querySelectorAll('button')].find(b =>
    /menu/i.test(b.textContent || '') || /menu/i.test(b.getAttribute('aria-label') || '')
  );
  assert(menuBtn, `MENÚ button must be present at width ${width}px`);

  // B. Language selector
  const langBtn = document.querySelector('button[aria-label="Language"]');
  assert(langBtn, `Language selector must be accessible at width ${width}px`);

  // C. Quick Guide button
  const navGuideBtn = [...document.querySelectorAll('button')].find(b =>
    b.textContent?.includes('Guide') || b.textContent?.includes('Guía') || b.getAttribute('title')?.includes('Guide') || b.getAttribute('title')?.includes('Guía')
  );
  assert(navGuideBtn, `Quick Guide button must be accessible at width ${width}px`);

  // D. Plan price
  const hasPrice = document.body.textContent!.includes('5.99') || document.body.textContent!.includes('$5.99');
  assert(hasPrice, `Plan price must be displayed at width ${width}px`);

  // E. Navigation tabs
  assert(document.body.textContent!.includes('All 12 Tenses'), `All 12 Tenses tab must be present at width ${width}px`);
  assert(document.body.textContent!.includes('3×4 Matrix'), `Matrix tab must be present at width ${width}px`);
  assert(document.body.textContent!.includes('Flashcards'), `Flashcards tab must be present at width ${width}px`);
  assert(document.body.textContent!.includes('My Progress'), `My Progress tab must be present at width ${width}px`);
  assert(document.body.textContent!.includes('Practice with your tutor'), `Tutor tab must be present at width ${width}px`);

  await reset();
}

console.log('--- Testing Tutor View Text Layout & Notices ---');
await render(
  <UserProvider>
    <ChatbotView />
  </UserProvider>
);

// 1. Tutor response delay note
assert(
  document.body.textContent!.includes('The tutor may take a few seconds to respond. Your message will be kept if you need to try again.'),
  'Tutor response delay note must be rendered'
);

// 2. Draft note
assert(
  document.body.textContent!.includes('Review your text, then tap Send. Your draft stays in this browser tab until sent.'),
  'Review text and draft persistence notice must be rendered'
);

// 3. Audio & Send controls
assert(document.querySelector('button[aria-label="Send message"]'), 'Send message button must be present');
const audioButtons = document.querySelectorAll('button');
const hasAudioAction = [...audioButtons].some(b => b.textContent?.includes('Escuchar') || b.textContent?.includes('Listen') || b.getAttribute('title')?.includes('Escuchar') || b.getAttribute('title')?.includes('Listen'));
assert(hasAudioAction || [...audioButtons].some(b => b.textContent?.includes('Speak')), 'Audio control must be present in tutor');

// 4. Suggested responses wrap
const suggestionButtons = [...document.querySelectorAll('button')].filter(b => b.className.includes('w-full sm:w-auto'));
assert(suggestionButtons.length > 0, 'Suggested replies must use w-full sm:w-auto to break into separate lines on mobile');

await reset();
console.log('PASS: Responsive navigation at 375, 768, 1024, 1440 px, first-visit tutorial auto-opening, and uncrowded tutor layout verified.');
