import { supabase } from './supabase';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  project_id: string;
  deadline?: string;
  tags?: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface TaskStatus {
  id: string;
  name: string;
  order: number;
}

export interface TaskPriority {
  id: string;
  name: string;
  color: string;
  order: number;
}

export async function generateTasksFromProjectName(projectName: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en gestion de projet. Tu dois générer une liste de tâches pertinentes pour un projet en fonction de son nom."
        },
        {
          role: "user",
          content: `Génère une liste de 5 à 10 tâches essentielles pour le projet : ${projectName}. Réponds uniquement avec la liste des tâches, une par ligne.`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const tasks = response.choices[0].message.content?.split('\n').filter(Boolean) || [];
    return tasks;
  } catch (error) {
    console.error('Erreur lors de la génération des tâches :', error);
    return [];
  }
}

export async function getTaskStatuses(): Promise<TaskStatus[]> {
  const { data, error } = await supabase
    .from('task_statuses')
    .select('*')
    .order('order');

  if (error) throw error;
  return data;
}

export async function getTaskPriorities(): Promise<TaskPriority[]> {
  const { data, error } = await supabase
    .from('task_priorities')
    .select('*')
    .order('order');

  if (error) throw error;
  return data;
}

export async function getUserTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function createTag(name: string, color: string): Promise<Tag> {
  const { data, error } = await supabase
    .from('tags')
    .insert({ name, color })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTaskStatus(taskId: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId);

  if (error) throw error;
}

export async function updateTaskPriority(taskId: string, priority: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .update({ priority })
    .eq('id', taskId);

  if (error) throw error;
}

export async function updateTaskTags(taskId: string, tagIds: string[]): Promise<void> {
  const { error: deleteError } = await supabase
    .from('task_tags')
    .delete()
    .eq('task_id', taskId);

  if (deleteError) throw deleteError;

  if (tagIds.length > 0) {
    const taskTags = tagIds.map(tagId => ({
      task_id: taskId,
      tag_id: tagId
    }));

    const { error: insertError } = await supabase
      .from('task_tags')
      .insert(taskTags);

    if (insertError) throw insertError;
  }
}