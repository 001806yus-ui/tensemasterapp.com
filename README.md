# TenseMaster

An English-first study application for the 12 English tenses. The published membership price is **$5.99 USD/month**.

## Run locally

Use Node.js 24 (the version used for validation):

```sh
npm install
npm run dev
```

Open `http://localhost:3000`. No API key is needed for the English course, local practice, or built-in interface translations.

To enable the conversational tutor and additional full-content translations, copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` on the server. Never put that key in a `VITE_` variable or a public repository. Generative API usage is separate from AI Studio editing credits and may be metered. No generative API calls were made while preparing this revision.

```sh
npm run lint
npm test
npm run build
```

Use `NODE_ENV=production npm start` to serve the production build with its API routes. On Vercel, the `api/chat.ts`, `api/translate.ts`, `api/speech.ts`, and `api/transcribe.ts` functions provide the API routes. `vite preview` serves only the static frontend; it does not run those API routes.

## Voice playback

The original voice menu promised human/neural audio while using browser speech synthesis. The new menu lists real English device voices, offers samples and saves a specific voice selection. Automatic selection prioritizes voices labeled Natural, Neural, Enhanced or Premium. Gender and accent are preferences because Web Speech has no gender/quality metadata. Pitch stays at 1 and playback uses the requested speed without a second slowdown. Cancellation settles pending playback, aborts audio requests, stops downloaded audio and prevents stale callbacks from restarting speech. The unofficial Google Translate TTS URL and its 200-character truncation have been removed.

Optional AI lesson audio uses Google's official Interactions REST API, with a warm conversational style and separate American/British preferences. `TTS_ENABLED=false` is the default. Nothing calls the paid speech provider while disabled. To run a controlled preview on a server, configure `GEMINI_API_KEY`, select a TTS model available to that project (`GEMINI_TTS_MODEL`), then explicitly enable `TTS_ENABLED=true`. See https://ai.google.dev/gemini-api/docs/speech-generation. Enabling this can incur metered usage; no live generation or listening test was performed for this revision.

This preview accepts only built-in lesson examples and voice samples. Dynamic chatbot replies and other texts continue to use device voices until real accounts and durable per-account quotas are implemented. There are short-text limits, two concurrent generations, a default ten-generation limit per server instance, and bounded server/browser memory caches. These limits reset across instances/restarts and are **not** a production spending cap. Configure provider spending controls and durable shared quotas before enabling public AI audio. Failed AI playback falls back to device speech and the voice panel reports the fallback. Replay cached audio reuses the clip and changes speed without changing pitch.

The status route (`GET /api/speech`) reports availability; `POST /api/speech` returns WAV audio. No credentials are sent to the browser. Voice quality and exact accent still need a listening test on real devices. In Android/iOS webviews, test autoplay, audio and speech recognition separately before release.

## Language behavior

- New visits use English. The previous preview-only language preference is migrated to a new preference key so the revised English-first experience starts correctly.
- The Navbar selects one of 14 supported languages. A selector is also available inside lessons, where the Navbar is hidden.
- Interface strings, grammar formulas, descriptions, exercise instructions, feedback, glossary explanations, and menus use one localization path.
- English learning sentences, target answers, scrambled English words, recordings, and user-authored chat text remain in English. Example translations use the individual sentence rather than repeating the first sentence's translation.
- Built-in navigation and membership translations work without an API key. The expanded English course text also works without one. Additional full-content translations use `/api/translate` and are cached on the learner's device. First-time expanded translations require a working online API route and server key. Cached translations can be reused offline.
- An unavailable translation service leaves English text available and displays a retry message. Translation cache keys are derived from content, so new releases cannot reuse a translation for unrelated text.
- Arabic sets `lang="ar"` and `dir="rtl"` on the document.

Add or update English source mappings in `src/i18n/englishSource.json`, then run `npm run catalog`. Core membership translations are in `src/i18n/membershipTranslations.json`. The server accepts only known public content keys and imposes per-instance limits; production deployment still needs account-based quotas and provider spending limits.

## Billing status — not ready for paid enrollment

The original application used simulated card fields and activated membership without processing a payment. That flow has been removed. Stored demo subscriptions and the public owner PIN cannot grant production access.

Until verified billing is implemented, the membership panel shows **Enrollment opens soon**, with the current price and access to two free lessons. It does not accept card details, redirect to a test payment link, or pretend that a payment succeeded.

Paid enrollment still requires:

1. Real user sign-in and a server-side user/subscription store.
2. A recurring $5.99 USD/month product associated with the signed-in user, using the payment route appropriate to each platform. Stripe can handle website payments; mobile app purchases need a separate store billing design.
3. Server-verified payment notifications/receipts that provision or revoke access, including webhooks for website billing and store notifications for mobile purchases.
4. A working billing portal for cancellation and renewals, plus an appropriate failed-payment flow.
5. Account-based access controls and quotas for the AI tutor and translation routes.

`VITE_BILLING_READY` remains false. Do not enable it until those flows are implemented and tested. The optional `VITE_STRIPE_PAYMENT_LINK` must be an HTTPS production `buy.stripe.com` link. A link alone does not implement membership verification.

Owner preview can be enabled only in development with `VITE_ENABLE_OWNER_PREVIEW=true`. It is a local preview convenience and never authenticates a production account.

## Validation

TypeScript checking, production build, and DOM interaction tests cover English startup, old $1.99 price migration, all 14 locale selections, preference persistence, Arabic direction, a language selector inside lessons, individual example translations, English target answers, disabled unverified checkout, and translation request validation.

Live Gemini responses, live Stripe payments, account provisioning, browser audio permissions, and visual layout across devices still require deployment-level testing. The existing forum, duels, and leaderboard use local sample data rather than a connected multiplayer/community service.

Speech tests additionally cover English-only voice selection, gender-name matching, exact requested rate, long text, cancellation during a network request, downloaded-audio cleanup, replay caching, disabled generation, public-content restrictions, invalid quotas and WAV response handling with a mocked provider. Automated tests cannot verify how human a voice sounds.

## Website and mobile release order

The user owns `www.tensemasterapp.com` and has not opened Stripe, PayPal, Google Play or Apple developer accounts for this project. The published page was inspected on 2026-10-11 and still showed the older Spanish interface, $1/$1.99 prices and the original voice promises. This ZIP has not been deployed there.

1. Identify the current hosting/project and deploy the revised version to a preview before changing the public domain. Activate and listen to a controlled natural-audio sample if desired.
2. Add real account creation/sign-in, a server user store and progress sync. Add durable account quotas for AI use.
3. Implement membership across website, Android and iOS with verified entitlement state. Choose website billing after deciding the native-store purchasing flow; no payment account needs to be opened merely to test this ZIP.
4. Build and test Android/iOS distributions, then prepare store listings, privacy/data declarations and account deletion. Developer account enrollment and publication still require the owner's participation.

For subscriptions consumed inside apps, plan for Google Play Billing and Apple In-App Purchase as the baseline. Regional alternative-billing/link programs have their own requirements; do not assume that a Stripe link alone satisfies every storefront. Current official policies: https://support.google.com/googleplay/android-developer/answer/9858738 and https://developer.apple.com/app-store/review/guidelines/ . Review them again before submitting.

## Dictado del tutor: grabación alternativa

El botón «Record a voice message» permite grabar hasta 20 segundos y enviar el audio a `/api/transcribe`. Gemini devuelve una transcripción; el alumno la revisa y pulsa Enviar. No se guardan grabaciones en la aplicación. El consentimiento de micrófono del navegador sigue siendo necesario.

El dictado queda habilitado por defecto si el servidor tiene `GEMINI_API_KEY`. Una variable `DICTATION_ENABLED` ausente o vacía no bloquea las copias importadas. Para apagarlo explícitamente, configura `DICTATION_ENABLED=false`; los valores no reconocidos también lo desactivan. Grabar requiere pulsar Speak y conceder permiso al micrófono. Utiliza cuota de la API Gemini y puede tener costo; no necesita un upgrade del editor de AI Studio. El límite `DICTATION_MAX_REQUESTS=10` es por instancia de servidor y se reinicia con ella: no es un presupuesto durable ni un límite global de gasto. Mantener desactivado para el lanzamiento público hasta añadir cuentas y cuotas persistentes. Modelo configurable mediante `GEMINI_DICTATION_MODEL`.

Se han comprobado respuestas simuladas, validación y límites, pero falta una prueba real con audio y la configuración del proyecto. Los errores de cuota/configuración se muestran sin respuestas inventadas.

## Release 2026.10.13.1 — preview candidate, paid launch blocked

The footer displays this version so an AI Studio import can be verified without guessing by its project name. Express and Vercel now use the same chat handler. Chat validates bounded messages/history and language settings, times out requests, validates provider feedback, and has a per-process preview cap (`CHAT_MAX_REQUESTS=100`, two concurrent calls). These protections are not durable account-based quotas. Sample community/ranking/opponent features are visibly labeled; AI features are not described as offline.

For a preview: build with `npm run build`, run `NODE_ENV=production npm start`, and set server secrets through the hosting dashboard. Select an available Gemini model for the project; the tested owner's configuration uses `gemini-3.8-flash`. Do not put keys in client variables. Verify the footer version, one full voice conversation, a lesson, and mobile layout before replacing the public site. Do not use `vite preview` as a full-stack deployment.

Remaining owner/deployment decisions: identify the hosting project for tensemasterapp.com, choose/configure an account and persistent database service, connect a verified payment account and recurring product, implement/test webhooks and server entitlements, and configure durable AI quotas. Paid enrollment remains off. Operator contact details and actual production data handling must be supplied before finalizing privacy/terms pages. Android/iOS packages and store submissions are separate from this website preview.
