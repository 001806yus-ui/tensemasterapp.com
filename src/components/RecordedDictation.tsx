import { Mic, Square, LoaderCircle } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useLocalization } from '../i18n/LocalizationContext';
import { getMicrophoneEnvironmentError } from '../utils/microphonePermission';
import { stopAudio } from '../utils/speech';

type Props = { disabled: boolean; onTranscript: (text: string) => void; onBusy: (busy: boolean) => void };
export function RecordedDictation({ disabled, onTranscript, onBusy }: Props) {
  const { l } = useLocalization();
  const [phase, setPhase] = useState<'idle' | 'starting' | 'recording' | 'transcribing'>('idle');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const job = useRef<AbortController | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cleanup = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    stream.current?.getTracks().forEach(track => track.stop());
    stream.current = null;
  };
  const cancel = () => {
    job.current?.abort(); job.current = null;
    const old = recorder.current; recorder.current = null;
    if (old?.state === 'recording') old.stop();
    cleanup();
  };
  useEffect(() => () => cancel(), []);
  const start = async () => {
    if (job.current) return;
    const controller = new AbortController(); job.current = controller;
    const current = () => job.current === controller && !controller.signal.aborted;
    setError(''); setReady(false); setPhase('starting'); onBusy(true); stopAudio();
    try {
      const blocked = getMicrophoneEnvironmentError();
      if (blocked) throw new Error(blocked);
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') throw new Error('Audio recording is unavailable in this browser.');
      const availability = await fetch('/api/transcribe', { cache: 'no-store', signal: AbortSignal.any([controller.signal, AbortSignal.timeout(5000)]) });
      if (!availability.ok) throw new Error(`The transcription server could not be reached (HTTP ${availability.status}).`);
      let status: { enabled?: boolean; error?: string };
      try { status = await availability.json(); }
      catch { throw new Error('The preview did not return a transcription server response. The /api/transcribe route must run on the app server.'); }
      if (!status.enabled) throw new Error(status.error || 'Audio transcription is not enabled yet. You can still use browser dictation or type your message.');
      // A late permission response after Cancel must never leave the microphone on.
      const acquired = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!current()) { acquired.getTracks().forEach(t => t.stop()); return; }
      stream.current = acquired;
      const mime = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg;codecs=opus'].find(type => MediaRecorder.isTypeSupported(type));
      if (!mime) throw new Error('This browser has no supported audio recording format.');
      const recording = new MediaRecorder(acquired, { mimeType: mime, audioBitsPerSecond: 64000 });
      recorder.current = recording;
      const chunks: Blob[] = [];
      let bytes = 0;
      recording.ondataavailable = event => {
        if (event.data.size) { chunks.push(event.data); bytes += event.data.size; }
        if (bytes > 1000000 && recording.state === 'recording') recording.stop();
      };
      recording.onerror = () => {
        if (!current()) return;
        cancel(); setPhase('idle'); onBusy(false); setError('The recording failed. Please try again.');
      };
      recording.onstop = async () => {
        if (!current()) return;
        cleanup(); recorder.current = null;
        setPhase('transcribing');
        try {
          const blob = new Blob(chunks, { type: mime });
          if (blob.size < 24 || blob.size > 1000000) throw new Error('The recording is empty or too large. Please record a short sentence.');
          const buffer = new Uint8Array(await blob.arrayBuffer());
          let binary = '';
          for (let i = 0; i < buffer.length; i += 8192) binary += String.fromCharCode(...buffer.subarray(i, i + 8192));
          if (!current()) return;
          const response = await fetch('/api/transcribe', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.any([controller.signal, AbortSignal.timeout(25000)]),
            body: JSON.stringify({ audio: btoa(binary), mimeType: mime.split(';')[0] })
          });
          let result: { error?: string; transcript?: string };
          try { result = await response.json(); }
          catch { throw new Error('The connection was interrupted. Your draft is safe. Please try recording again.'); }
          if (!response.ok) throw new Error(result.error || 'Transcription failed.');
          if (!result.transcript?.trim()) throw new Error('No clear speech was detected. Please try again.');
          if (current()) { onTranscript(result.transcript.trim()); setReady(true); }
        } catch (err) {
          if (current()) setError(err instanceof Error ? err.message : 'Transcription failed.');
        } finally {
          if (current()) { job.current = null; setPhase('idle'); onBusy(false); }
        }
      };
      recording.start(250); setPhase('recording');
      timer.current = setTimeout(() => { if (current() && recording.state === 'recording') recording.stop(); }, 20000);
    } catch (err) {
      if (current()) {
        cancel(); setPhase('idle'); onBusy(false);
        setError(err instanceof Error ? err.message : 'Could not start recording.');
      }
    }
  };
  return <div className="mt-3 text-sm">
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" disabled={(disabled && phase === 'idle') || phase === 'starting' || phase === 'transcribing'}
        className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white disabled:opacity-60 ${phase === 'recording' ? 'bg-rose-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
        onClick={() => {
          if (phase === 'idle') void start();
          else if (phase === 'recording') recorder.current?.stop();
        }}>
        {phase === 'recording' ? <Square aria-hidden="true" className="h-4 w-4" /> : phase === 'idle' ? <Mic aria-hidden="true" className="h-4 w-4" /> : <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />}
        {l(phase === 'recording' ? 'Stop' : phase === 'transcribing' ? 'Transcribing…' : phase === 'starting' ? 'Preparing microphone…' : 'Speak')}
      </button>
      {phase !== 'idle' && <button type="button" className="min-h-11 px-2 underline" onClick={() => { cancel(); setPhase('idle'); onBusy(false); }}>{l('Cancel')}</button>}
      <p role="status" aria-live="polite" className="text-xs text-slate-600 dark:text-slate-300">
        {l(phase === 'recording' ? 'Recording. Tap Stop when you finish. Maximum 20 seconds.' : phase === 'transcribing' ? 'Turning your voice into text…' : ready ? 'Your text is ready. Review it, then tap Send.' : 'Tap Speak, say your message, then tap Stop.')}
      </p>
    </div>
    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{l('Audio is sent to Gemini for transcription. Messages are sent only when you tap Send.')}</p>
    {error && <p role="alert" className="mt-2 rounded-lg bg-amber-50 p-2 text-amber-900 dark:bg-amber-950 dark:text-amber-100">{l(error)}</p>}
  </div>;
}
