import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { X, Volume2, Check } from 'lucide-react';
import { useLocalization } from '../i18n/LocalizationContext';
import {
  VOICE_PROFILES, VoicePersona, getPreferredVoicePersona, setPreferredVoicePersona,
  testPlayVoice, stopAudio, getAvailableEnglishVoices, getPreferredDeviceVoice,
  setPreferredDeviceVoice, getVoicePlaybackState, subscribeVoicePlayback,
  checkNaturalAudio, selectDeviceVoice, playEnglishAudio,
} from '../utils/speech';

export const VoiceSettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { l } = useLocalization();
  const [persona, setPersona] = useState<VoicePersona>(getPreferredVoicePersona);
  const [voices, setVoices] = useState(getAvailableEnglishVoices);
  const [deviceURI, setDeviceURI] = useState(getPreferredDeviceVoice);
  const [playing, setPlaying] = useState<string | null>(null);
  const status = useSyncExternalStore(subscribeVoicePlayback, getVoicePlaybackState, getVoicePlaybackState);
  useEffect(() => {
    const refresh = () => setVoices(getAvailableEnglishVoices());
    window.speechSynthesis?.addEventListener('voiceschanged', refresh);
    void checkNaturalAudio();
    return () => { window.speechSynthesis?.removeEventListener('voiceschanged', refresh); stopAudio(); };
  }, []);
  const choose = (value: VoicePersona) => {
    stopAudio(); setPlaying(null); setPersona(value); setPreferredVoicePersona(value); setDeviceURI('');
  };
  const test = async (value: VoicePersona, device = false) => {
    const key = device ? 'device' : value;
    setPlaying(key);
    if (device) await playEnglishAudio(VOICE_PROFILES.find(v => v.id === persona)!.sampleSentence, 1, undefined, true);
    else await testPlayVoice(value);
    setPlaying(current => current === key ? null : current);
  };
  const selectedVoice = selectDeviceVoice(voices, persona, deviceURI);
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
      <section role="dialog" aria-modal="true" aria-labelledby="voice-settings-title" className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full max-h-[90dvh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800">
        <header className="p-5 bg-gradient-to-r from-teal-900 to-indigo-950 text-white relative">
          <button type="button" aria-label={l('Close')} onClick={onClose} className="absolute right-3 top-3 p-2 rounded-lg hover:bg-white/10"><X className="w-5 h-5" /></button>
          <h2 id="voice-settings-title" className="text-xl font-bold pr-8">{l('Choose your audio voice')}</h2>
          <p className="text-sm text-teal-100 mt-2">{l('Listen to a sample and choose the voice you prefer.')}</p>
        </header>
        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300" role="status">
            {l(status.cloudEnabled && !deviceURI ? 'Natural lesson audio is available. Other text uses your device voice.' : 'Audio currently uses the English voices installed on your device.')}
          </p>
          <div className="space-y-2" role="group" aria-label={l('Voice preference')}>
            {VOICE_PROFILES.map(profile => (
              <div key={profile.id} className={`flex gap-2 items-center rounded-xl border p-3 ${persona === profile.id ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40' : 'border-slate-200 dark:border-slate-700'}`}>
                <button type="button" onClick={() => choose(profile.id)} aria-pressed={persona === profile.id} className="flex-1 flex items-center gap-2 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  <span className="w-5 shrink-0">{persona === profile.id && <Check className="w-5 h-5 text-teal-600" />}</span>{l(profile.label)}
                </button>
                <button type="button" onClick={() => void test(profile.id)} disabled={playing === profile.id} aria-label={l('Listen to a voice sample') + ': ' + l(profile.label)} className="flex items-center gap-1 p-2 rounded-lg text-xs font-bold text-teal-800 dark:text-teal-200 bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-800">
                  <Volume2 className="w-4 h-4" />{l(playing === profile.id ? 'Speaking…' : 'Listen')}
                </button>
              </div>
            ))}
          </div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white" htmlFor="device-voice">{l('Device voice')}</label>
          <select id="device-voice" value={deviceURI} onChange={e => { stopAudio(); setPlaying(null); setDeviceURI(e.target.value); setPreferredDeviceVoice(e.target.value); }} className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white">
            <option value="">{l('Automatic selection')}</option>
            {voices.map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
          </select>
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">{l('Selected device voice')}: {selectedVoice?.name || l('Browser default')}. {l('Voice availability varies by device. Accent and gender are preferences.')}</p>
            <button type="button" onClick={() => void test(persona, true)} disabled={playing === 'device'} className="shrink-0 p-2 text-xs font-bold text-teal-700 dark:text-teal-300">{l(playing === 'device' ? 'Speaking…' : 'Listen')}</button>
          </div>
          {status.engine === 'unavailable' && <p role="alert" className="text-sm text-amber-800 dark:text-amber-200">{l('Audio could not play. Try another voice or check your browser audio settings.')} {status.lastError && <code>{status.lastError}</code>}</p>}
          {status.fallback && <p role="status" className="text-xs text-amber-800 dark:text-amber-200">{l('Natural audio was unavailable for this text. Your device voice is playing.')}</p>}
          <button type="button" onClick={onClose} className="w-full p-3 rounded-xl font-semibold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">{l('Save and continue')}</button>
        </div>
      </section>
    </div>
  );
};
