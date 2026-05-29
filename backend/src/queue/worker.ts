import { Worker, Job } from 'bullmq';
import { redisConnection, QUEUE_NAME } from './queue';
import { generateWhitePage } from '../services/aiService';
import { getTaskById, updateTask, getTemplateById } from '../db/database';
import fs from 'fs';
import path from 'path';

export interface WhiteGenJobData {
  taskId: string;
  title: string;
  niche: string;
  description?: string;
  templateId?: string;
}

const OUTPUT_DIR = path.join(process.cwd(), 'output');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

export function createWorker() {
  const worker = new Worker<WhiteGenJobData>(
    QUEUE_NAME,
    async (job: Job<WhiteGenJobData>) => {
      const { taskId, title, niche, description, templateId } = job.data;

      console.log(`🔄 Processing task ${taskId}: "${title}"`);

      await updateTask(taskId, { status: 'processing', job_id: job.id });
      await job.updateProgress(10);

      let templateHtml: string | undefined;
      if (templateId) {
        const template = await getTemplateById(templateId);
        templateHtml = template?.html_content;
      }

      await job.updateProgress(20);

      const result = await generateWhitePage({ title, niche, description, templateHtml });

      await job.updateProgress(80);

      const taskDir = path.join(OUTPUT_DIR, taskId);
      fs.mkdirSync(taskDir, { recursive: true });

      fs.writeFileSync(path.join(taskDir, 'index.html'), result.mainHtml, 'utf-8');
      fs.writeFileSync(path.join(taskDir, 'privacy.html'), result.privacyHtml, 'utf-8');
      fs.writeFileSync(path.join(taskDir, 'terms.html'), result.termsHtml, 'utf-8');

      await job.updateProgress(95);

      await updateTask(taskId, { status: 'completed', result_path: taskDir });

      await job.updateProgress(100);
      console.log(`✅ Task ${taskId} completed`);

      return { taskId, resultPath: taskDir };
    },
    { connection: redisConnection, concurrency: 2 }
  );

  worker.on('failed', async (job, err) => {
    if (job) {
      console.error(`❌ Task ${job.data.taskId} failed:`, err.message);
      await updateTask(job.data.taskId, { status: 'failed', error: err.message });
    }
  });

  worker.on('error', (err) => console.error('Worker error:', err));

  console.log('🚀 Worker started');
  return worker;
}