import { config } from 'dotenv';
config({ path: '.env.local' });
config();
import translateHandler from './api/translate';
import speechHandler from './api/speech';
import transcribeHandler from './api/transcribe';
import express from 'express';
import chatHandler from './api/chat';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.get('/api/transcribe', transcribeHandler);
app.post('/api/transcribe', express.json({ limit: '1500kb' }), transcribeHandler);
app.use(express.json({ limit: '32kb' }));
app.post('/api/translate', translateHandler);
app.get('/api/speech', speechHandler);
app.post('/api/speech', speechHandler);

// Share the same tutor handler in AI Studio and serverless deployments.
app.post('/api/chat', chatHandler);

// API failures must remain JSON, rather than falling through to the SPA.
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY?.trim()),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'API route not found.' }));
app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = error?.type === 'entity.too.large' ? 413 : error instanceof SyntaxError ? 400 : 500;
  res.status(status).json({ error: status === 413 ? 'Request too large.' : status === 400 ? 'Invalid JSON request.' : 'Server request failed.' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // In dev mode, mount Vite middleware to serve client SPA
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built dist folder
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
