import { supabase } from './supabase';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import OpenAI from 'openai';
import emailjs from '@emailjs/browser';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

interface WeeklySummary {
  completedTasks: number;
  totalTasks: number;
  productivityRate: number;
  completedProjects: number;
  activeProjects: number;
  upcomingDeadlines: {
    taskTitle: string;
    projectName: string;
    deadline: string;
  }[];
  aiSuggestions: string[];
}

export async function generateWeeklySummary(userId: string): Promise<WeeklySummary> {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });

  // Récupérer les statistiques de la semaine
  const { data: weekStats, error: weekError } = await supabase
    .from('tasks')
    .select(`
      *,
      project:projects(name)
    `)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .eq('user_id', userId);

  if (weekError) throw weekError;

  // Récupérer les projets
  const { data: projects, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId);

  if (projectError) throw projectError;

  // Récupérer les tâches avec deadline proche
  const { data: upcomingTasks, error: deadlineError } = await supabase
    .from('tasks')
    .select(`
      title,
      deadline,
      project:projects(name)
    `)
    .eq('user_id', userId)
    .gt('deadline', new Date().toISOString())
    .lte('deadline', endDate.toISOString())
    .order('deadline');

  if (deadlineError) throw deadlineError;

  // Calculer les statistiques
  const completedTasks = weekStats?.filter(t => t.status === 'done').length || 0;
  const totalTasks = weekStats?.length || 0;
  const productivityRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;
  const activeProjects = projects?.filter(p => p.status === 'active').length || 0;

  // Formater les deadlines à venir
  const upcomingDeadlines = upcomingTasks?.map(task => ({
    taskTitle: task.title,
    projectName: task.project.name,
    deadline: format(new Date(task.deadline), 'dd MMMM yyyy', { locale: fr }),
  })) || [];

  // Générer des suggestions IA
  const aiSuggestions = await generateAISuggestions(weekStats || [], projects || []);

  return {
    completedTasks,
    totalTasks,
    productivityRate,
    completedProjects,
    activeProjects,
    upcomingDeadlines,
    aiSuggestions,
  };
}

async function generateAISuggestions(weekTasks: any[], projects: any[]): Promise<string[]> {
  try {
    const prompt = `En tant qu'expert en gestion de projet, analyse ces données :
    - ${weekTasks.length} tâches cette semaine
    - ${projects.length} projets en cours
    - Taux de complétion : ${weekTasks.filter(t => t.status === 'done').length / weekTasks.length * 100}%

    Génère 3 suggestions concrètes pour améliorer la productivité et la gestion des projets.
    Réponds uniquement avec les suggestions, une par ligne.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en gestion de projet qui donne des conseils concis et actionnables."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return response.choices[0].message.content?.split('\n').filter(Boolean) || [];
  } catch (error) {
    console.error('Erreur lors de la génération des suggestions :', error);
    return [
      'Planifiez vos tâches en début de semaine',
      'Faites des points réguliers sur l\'avancement',
      'Priorisez les tâches importantes',
    ];
  }
}

export async function sendWeeklySummaryEmail(userId: string, userEmail: string) {
  try {
    const summary = await generateWeeklySummary(userId);

    const templateParams = {
      to_email: userEmail,
      completed_tasks: summary.completedTasks,
      total_tasks: summary.totalTasks,
      productivity_rate: Math.round(summary.productivityRate),
      active_projects: summary.activeProjects,
      upcoming_deadlines: summary.upcomingDeadlines
        .map(d => `${d.taskTitle} (${d.projectName}) - ${d.deadline}`)
        .join('\n'),
      ai_suggestions: summary.aiSuggestions.join('\n'),
    };

    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      templateParams,
      {
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      }
    );
  } catch (error) {
    console.error('Erreur lors de l\'envoi du résumé hebdomadaire :', error);
    throw error;
  }
}