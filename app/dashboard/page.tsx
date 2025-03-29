'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Overview } from '@/components/dashboard/overview';
import { RecentProjects } from '@/components/dashboard/recent-projects';
import { supabase } from '@/lib/supabase';
import { format, subDays } from 'date-fns';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  productivityScore: number;
  tasksByDay: { date: string; total: number }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    productivityScore: 0,
    tasksByDay: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const today = new Date();
      const lastWeek = subDays(today, 7);

      // Récupérer les statistiques des projets
      const { data: projectStats, error: projectError } = await supabase
        .from('projects')
        .select('status', { count: 'exact' });

      if (projectError) throw projectError;

      const activeProjects = projectStats?.filter(p => p.status === 'active').length || 0;
      const completedProjects = projectStats?.filter(p => p.status === 'completed').length || 0;

      // Récupérer les statistiques des tâches
      const { data: taskStats, error: taskError } = await supabase
        .from('tasks')
        .select('status, created_at')
        .gte('created_at', lastWeek.toISOString());

      if (taskError) throw taskError;

      const completedTasks = taskStats?.filter(t => t.status === 'done').length || 0;
      const totalTasks = taskStats?.length || 0;

      // Calculer les tâches par jour
      const tasksByDay = Array.from({ length: 7 }, (_, i) => {
        const date = format(subDays(today, i), 'yyyy-MM-dd');
        const tasksForDay = taskStats?.filter(t => 
          t.created_at.startsWith(date)
        ).length || 0;
        return {
          date,
          total: tasksForDay,
        };
      }).reverse();

      // Calculer le score de productivité (tâches complétées / total des tâches * 100)
      const productivityScore = totalTasks > 0 
        ? Math.round((completedTasks / totalTasks) * 100) 
        : 0;

      setStats({
        totalProjects: activeProjects + completedProjects,
        activeProjects,
        completedProjects,
        totalTasks,
        completedTasks,
        productivityScore,
        tasksByDay,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              sur {stats.totalProjects} projets
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tâches complétées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              sur {stats.totalTasks} tâches
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets terminés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productivityScore}%</div>
            <p className="text-xs text-muted-foreground">
              cette semaine
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tâches par jour</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={stats.tasksByDay} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Projets récents</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentProjects />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}