import React, { useState } from 'react';
import { useLocalization } from '../i18n/LocalizationContext';
import { FIRST_WEEK, WeekDay } from '../data/firstWeek';
const KEY = 'tensemaster_first_week_v1';
type Entry = { answers: number[]; writing: string; submitted: boolean };
type Progress = Record<string, Entry>;
function restore(): Progress {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    const valid: Progress = {};
    FIRST_WEEK.forEach((day, i) => {
      const entry = saved?.[i];
      if (!entry || !Array.isArray(entry.answers) || typeof entry.writing !== 'string') return;
      const answers = day.questions.map((q, j) => Number.isInteger(entry.answers[j]) && entry.answers[j] >= 0 && entry.answers[j] < q.choices.length ? entry.answers[j] : -1);
      valid[i] = { answers, writing: entry.writing.slice(0, 2000), submitted: entry.submitted === true && answers.every(a => a >= 0) && entry.writing.trim().length > 0 };
    });
    return valid;
  } catch { return {}; }
}
export function FirstWeekPath({ onLesson, onTutor }: { onLesson: (id: string, tab: WeekDay['tab']) => void; onTutor: (prompt: string) => void }) {
  const { l } = useLocalization();
  const [progress, setProgress] = useState<Progress>(restore);
  const [selected, setSelected] = useState(() => {
    const saved = restore();
    const next = FIRST_WEEK.findIndex((_, i) => !saved[i]?.submitted);
    return next < 0 ? 6 : next;
  });
  const [storageError, setStorageError] = useState(false);
  const [error, setError] = useState(false);
  const day = FIRST_WEEK[selected];
  const entry = progress[selected] || { answers: day.questions.map(() => -1), writing: '', submitted: false };
  const complete = Object.values(progress).filter(e => e.submitted).length;
  const save = (next: Entry) => {
    const updated = { ...progress, [selected]: next };
    setProgress(updated);
    try { localStorage.setItem(KEY, JSON.stringify(updated)); setStorageError(false); }
    catch { setStorageError(true); }
  };
  const score = (index: number) => FIRST_WEEK[index].questions.filter((q, i) => progress[index]?.answers[i] === q.answer).length;
  return <section aria-label={l('Your practice today')} className="mx-auto max-w-5xl px-4 py-6">
    <div className="rounded-3xl border border-indigo-200 bg-white p-5 shadow-sm dark:border-indigo-900 dark:bg-slate-900 sm:p-8">
      <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">{l('Your practice today')}</p>
      <h1 className="mt-1 text-2xl font-bold">{l('Your first English week')}</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{l('A seven-day path to talk about everyday life. Go at your own pace.')}</p>
      <div className="mt-4 flex flex-wrap gap-2" aria-label={l('Day')}>
        {FIRST_WEEK.map((_, i) => <button key={i} type="button" aria-pressed={selected === i} disabled={i > 0 && !progress[i - 1]?.submitted}
          onClick={() => { setSelected(i); setError(false); }} className={`min-h-11 rounded-xl px-3 text-sm disabled:opacity-40 ${selected === i ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
          {l('Day')} {i + 1}{progress[i]?.submitted ? ' ✓' : ''}
        </button>)}
      </div>
      <p className="mt-2 text-xs">{l('Days completed')}: {complete}/7</p>
      <h2 className="mt-6 text-xl font-semibold">{l(day.title)}</h2>
      <p className="mt-2">{l(day.mission)}</p>
      <div className="my-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => onLesson(day.tense, day.tab)} className="min-h-11 rounded-xl border border-indigo-300 px-4 text-sm">{l('Open lesson')}</button>
        <button type="button" onClick={() => onTutor(day.tutorPrompt)} className="min-h-11 rounded-xl border border-indigo-300 px-4 text-sm">{l('Practice with the tutor')}</button>
      </div>
      <form onSubmit={e => {
        e.preventDefault();
        if (entry.answers.some(a => a < 0) || !entry.writing.trim()) { setError(true); return; }
        setError(false); save({ ...entry, submitted: true });
      }}>
        {day.questions.map((q, qi) => <fieldset key={`${selected}-${qi}`} disabled={entry.submitted} className="mt-4 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
          <legend className="px-1 font-medium" lang="en">{q.prompt}</legend>
          <div className="flex flex-wrap gap-3">{q.choices.map((choice, ci) => <label key={choice} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-slate-50 px-3 dark:bg-slate-800" lang="en">
            <input type="radio" name={`week-${selected}-${qi}`} checked={entry.answers[qi] === ci} onChange={() => save({ ...entry, answers: entry.answers.map((a, index) => index === qi ? ci : a) })} />{choice}
          </label>)}</div>
          {entry.submitted && <p className="mt-2 text-sm">{l('Correct answer:')} <strong lang="en">{q.choices[q.answer]}</strong>. {l(q.explanation)}</p>}
        </fieldset>)}
        <label className="mt-5 block font-medium" htmlFor="week-writing">{l('Your English practice')}</label>
        <p id="week-writing-help" className="text-sm text-slate-500">{l('Write two English sentences about today’s mission.')}</p>
        <textarea id="week-writing" aria-describedby="week-writing-help" lang="en" maxLength={2000} readOnly={entry.submitted} value={entry.writing} onChange={e => save({ ...entry, writing: e.target.value })} rows={3} className="mt-2 w-full rounded-xl border border-slate-300 bg-transparent p-3 dark:border-slate-600" />
        {error && <p role="alert">{l('Answer every question and write your practice before continuing.')}</p>}
        {!entry.submitted && <button type="submit" className="mt-3 min-h-11 rounded-xl bg-indigo-600 px-5 font-semibold text-white">{l('Check answers')}</button>}
      </form>
      {entry.submitted && <div role="status" className="mt-4 rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950">
        <p>{l('Correct answers')}: {score(selected)}/{day.questions.length}</p>
        <p className="mt-1 text-sm">{l('Read the explanation and practice the correct sentence before continuing.')}</p>
        {selected < 6 && <button type="button" onClick={() => { setSelected(selected + 1); setError(false); }} className="mt-3 min-h-11 rounded-xl bg-indigo-600 px-4 text-white">{l('Next day')}</button>}
      </div>}
      {progress[0]?.submitted && progress[6]?.submitted && selected === 6 && <div className="mt-6 space-y-3 rounded-xl border border-indigo-300 p-4">
        <h3 className="font-bold">{l('Your week comparison')}</h3>
        <p>{l('Start')}: {score(0)}/3 · {l('Finish')}: {score(6)}/3</p>
        <p className="text-sm">{l('These questions check three specific skills, not your overall English level. Your writing samples are for comparison and have not been automatically graded.')}</p>
        <h4 className="font-semibold">{l('First sample')}</h4><p className="whitespace-pre-wrap" lang="en">{progress[0].writing}</p>
        <h4 className="font-semibold">{l('Final sample')}</h4><p className="whitespace-pre-wrap" lang="en">{progress[6].writing}</p>
        <p>{l('Review the questions you missed and use what you learned with the tutor.')}</p>
      </div>}
      <p className="mt-4 text-xs text-slate-500" role={storageError ? 'alert' : undefined}>{l(storageError ? 'Could not save. Keep this page open to retain your progress.' : 'Saved in this browser. Use the same device to continue.')}</p>
    </div>
  </section>;
}
