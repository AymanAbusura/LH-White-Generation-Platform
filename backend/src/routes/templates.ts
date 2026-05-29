import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  getTemplates, getTemplateById, createTemplate, deleteTemplate, getTaskById
} from '../db/database';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const templates = await getTemplates();
  // Don't return html_content in list
  const list = templates.map(({ html_content: _, ...t }) => t);
  res.json({ success: true, data: list });
});

router.get('/:id', async (req: Request, res: Response) => {
  const template = await getTemplateById(req.params.id);
  if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
  res.json({ success: true, data: template });
});

router.post('/from-task/:taskId', async (req: Request, res: Response) => {
  const { name, tags } = req.body;
  const task = await getTaskById(req.params.taskId);

  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  if (task.status !== 'completed' || !task.result_path) {
    return res.status(400).json({ success: false, message: 'Task not completed' });
  }

  const fs = await import('fs');
  const path = await import('path');
  const htmlPath = path.join(task.result_path, 'index.html');

  if (!fs.existsSync(htmlPath)) {
    return res.status(404).json({ success: false, message: 'HTML file not found' });
  }

  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  const template = await createTemplate({
    id: uuidv4(),
    name: name || task.title,
    niche: task.niche,
    description: task.description,
    html_content: htmlContent,
    tags: JSON.stringify(tags || []),
    created_at: new Date().toISOString(),
  });

  const { html_content: _, ...templateWithoutHtml } = template;
  res.status(201).json({ success: true, data: templateWithoutHtml });
});

router.delete('/:id', async (req: Request, res: Response) => {
  const template = await getTemplateById(req.params.id);
  if (!template) return res.status(404).json({ success: false, message: 'Template not found' });

  await deleteTemplate(req.params.id);
  res.json({ success: true, message: 'Template deleted' });
});

export default router;