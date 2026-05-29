import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  getTasks, getTaskById, createTask, deleteTask
} from '../db/database';
import whiteGenQueue from '../queue/queue';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const tasks = await getTasks();
  res.json({ success: true, data: tasks });
});

router.get('/:id', async (req: Request, res: Response) => {
  const task = await getTaskById(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  res.json({ success: true, data: task });
});

router.post('/', async (req: Request, res: Response) => {
  const { title, niche, description, templateId } = req.body;
  if (!title || !niche) {
    return res.status(400).json({ success: false, message: 'Title and niche are required' });
  }

  const taskId = uuidv4();
  const now = new Date().toISOString();

  const task = await createTask({
    id: taskId,
    title,
    niche,
    description: description || undefined,
    status: 'pending',
    created_at: now,
    updated_at: now,
  });

  const job = await whiteGenQueue.add(
    'generate-white',
    { taskId, title, niche, description, templateId },
    { jobId: taskId }
  );

  await import('../db/database').then(({ updateTask }) =>
    updateTask(taskId, { job_id: job.id })
  );

  res.status(201).json({ success: true, data: { ...task, job_id: job.id } });
});

router.delete('/:id', async (req: Request, res: Response) => {
  const task = await getTaskById(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

  await deleteTask(req.params.id);

  if (task.result_path && fs.existsSync(task.result_path)) {
    fs.rmSync(task.result_path, { recursive: true, force: true });
  }

  res.json({ success: true, message: 'Task deleted' });
});

router.get('/:id/download', async (req: Request, res: Response) => {
  const task = await getTaskById(req.params.id);

  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  if (task.status !== 'completed' || !task.result_path) {
    return res.status(400).json({ success: false, message: 'Task not completed yet' });
  }

  const archive = archiver('zip', { zlib: { level: 9 } });
  const filename = `${task.title.replace(/[^a-zA-Z0-9]/g, '_')}.zip`;

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  archive.pipe(res);
  archive.directory(task.result_path, false);
  await archive.finalize();
});

router.get('/:id/preview/:file', async (req: Request, res: Response) => {
  const task = await getTaskById(req.params.id);

  if (!task || task.status !== 'completed' || !task.result_path) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }

  const allowedFiles = ['index.html', 'privacy.html', 'terms.html'];
  const file = req.params.file;

  if (!allowedFiles.includes(file)) {
    return res.status(400).json({ success: false, message: 'Invalid file' });
  }

  const filePath = path.join(task.result_path, file);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'File not found' });
  }

  res.setHeader('Content-Type', 'text/html');
  res.sendFile(filePath);
});

export default router;