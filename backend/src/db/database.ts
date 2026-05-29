import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs';

export interface Task {
  id: string;
  title: string;
  niche: string;
  description?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  job_id?: string;
  result_path?: string;
  error?: string;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  name: string;
  niche: string;
  description?: string;
  html_content: string;
  tags: string;
  created_at: string;
}

interface DbSchema {
  tasks: Task[];
  templates: Template[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const adapter = new JSONFile<DbSchema>(path.join(DATA_DIR, 'db.json'));
const db = new Low<DbSchema>(adapter, { tasks: [], templates: [] });

export async function initDb() {
  await db.read();
  db.data ||= { tasks: [], templates: [] };
  await db.write();
}

export async function getTasks(): Promise<Task[]> {
  await db.read();
  return [...(db.data?.tasks || [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getTaskById(id: string): Promise<Task | undefined> {
  await db.read();
  return db.data?.tasks.find((t) => t.id === id);
}

export async function createTask(task: Task): Promise<Task> {
  await db.read();
  db.data!.tasks.push(task);
  await db.write();
  return task;
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
  await db.read();
  const idx = db.data!.tasks.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  db.data!.tasks[idx] = {
    ...db.data!.tasks[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  await db.write();
  return db.data!.tasks[idx];
}

export async function deleteTask(id: string): Promise<boolean> {
  await db.read();
  const before = db.data!.tasks.length;
  db.data!.tasks = db.data!.tasks.filter((t) => t.id !== id);
  await db.write();
  return db.data!.tasks.length < before;
}

export async function getTemplates(): Promise<Template[]> {
  await db.read();
  return [...(db.data?.templates || [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getTemplateById(id: string): Promise<Template | undefined> {
  await db.read();
  return db.data?.templates.find((t) => t.id === id);
}

export async function createTemplate(template: Template): Promise<Template> {
  await db.read();
  db.data!.templates.push(template);
  await db.write();
  return template;
}

export async function deleteTemplate(id: string): Promise<boolean> {
  await db.read();
  const before = db.data!.templates.length;
  db.data!.templates = db.data!.templates.filter((t) => t.id !== id);
  await db.write();
  return db.data!.templates.length < before;
}

export default db;