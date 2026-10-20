import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { UserProvider } from '../src/context/UserContext';
import { FIRST_WEEK } from '../src/data/firstWeek';
const dom = new JSDOM('<div id="root"></div>', { url: 'https://example.test' });
for (const name of ['window', 'document', 'localStorage', 'navigator', 'HTMLElement', 'Node']) Object.defineProperty(globalThis, name, { configurable: true, value: (dom.window as any)[name] });
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
const { FirstWeekPath } = await import('../src/components/FirstWeekPath');
let lesson = '', tutor = '';
let root = createRoot(document.getElementById('root')!);
const view = <UserProvider><FirstWeekPath onLesson={id => lesson = id} onTutor={p => tutor = p} /></UserProvider>;
await act(async () => root.render(view));
async function click(label: string) {
  const button = [...document.querySelectorAll('button')].find(b => b.textContent === label)!;
  assert(button, label); await act(async () => button.click());
}
assert((document.querySelectorAll('[aria-pressed]')[1] as HTMLButtonElement).disabled);
await click('Check answers'); assert(document.querySelector('[role="alert"]'));
await click('Open lesson'); assert.equal(lesson, 'present-simple');
await click('Practice with the tutor'); assert(tutor.includes(FIRST_WEEK[0].mission));
for (let day = 0; day < 7; day++) {
  for (let q = 0; q < FIRST_WEEK[day].questions.length; q++) {
    const correct = FIRST_WEEK[day].questions[q].answer;
    const choice = day === 0 ? (correct + 1) % 3 : correct;
    await act(async () => (document.querySelectorAll(`input[name="week-${day}-${q}"]`)[choice] as HTMLInputElement).click());
  }
  const area = document.querySelector('textarea')!;
  // React event support differs across jsdom versions; use the rendered prop handler.
  const propKey = Object.keys(area).find(k => k.startsWith('__reactProps$'))!;
  await act(async () => (area as any)[propKey].onChange({ target: { value: `Day ${day + 1}: I study English. I practice every day.` } }));
  await click('Check answers');
  if (day < 6) await click('Next day');
}
assert(document.body.textContent!.includes('Start: 0/3 · Finish: 3/3'));
assert(document.body.textContent!.includes('Day 1: I study English.'));
assert(document.body.textContent!.includes('Day 7: I study English.'));
await act(async () => root.unmount());
root = createRoot(document.getElementById('root')!);
await act(async () => root.render(view));
assert(document.body.textContent!.includes('Days completed: 7/7'));
assert(document.body.textContent!.includes('Start: 0/3 · Finish: 3/3'));
await act(async () => root.unmount());
console.log('PASS: Seven-day progression, required answers, lesson/tutor links, honest scores and persisted writing samples.');
