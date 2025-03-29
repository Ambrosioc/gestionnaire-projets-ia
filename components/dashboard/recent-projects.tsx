'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Project {
  id: string;
  name: string;
  status: string;
  updated_at: string;
  tasks: {
    status: string;
  }[];
}

export function RecentProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchRecentProjects();
  }, []);

  const fetchRecentProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          status,
          updated_at,
          tasks:tasks(status)
        `)
        .order('updated_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des projets récents:', error);
    }
  };

  return (
    <div className="space-y-8">
      {projects.map((project) => {
        const totalTasks = project.tasks?.length || 0;
        const completedTasks = project.tasks?.filter(t => t.status === 'done').length || 0;

        return (
          <div key={project.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarFallback>
                {project.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{project.name}</p>
              <p className="text-sm text-muted-foreground">
                {completedTasks} sur {totalTasks} tâches complétées
              </p>
            </div>
            <div className="ml-auto text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(project.updated_at), {
                addSuffix: true,
                locale: fr,
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}