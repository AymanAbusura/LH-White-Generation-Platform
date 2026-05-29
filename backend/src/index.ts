import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import whiteGenQueue from './queue/queue';
import { createWorker } from './queue/worker';
import { initDb } from './db/database';
import tasksRouter from './routes/tasks';
import templatesRouter from './routes/templates';
import queueRouter from './routes/queue';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');
createBullBoard({ queues: [new BullMQAdapter(whiteGenQueue) as any], serverAdapter });
app.use('/admin/queues', serverAdapter.getRouter());

app.use('/api/tasks', tasksRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/queue', queueRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function start() {
  await initDb();
  createWorker();
  app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`📊 Bull Board: http://localhost:${PORT}/admin/queues`);
    console.log(`🔑 API Key: ${process.env.ANTHROPIC_API_KEY ? '✅ Set' : '❌ Missing - add to .env'}`);
  });
}

start().catch(console.error);