'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const projects = [
  {
    name: 'Website Redesign',
    lastUpdated: '2h ago',
    tasks: 12,
    completed: 8,
  },
  {
    name: 'Mobile App Development',
    lastUpdated: '4h ago',
    tasks: 24,
    completed: 16,
  },
  {
    name: 'Marketing Campaign',
    lastUpdated: '1d ago',
    tasks: 8,
    completed: 5,
  },
];

export function RecentProjects() {
  return (
    <div className="space-y-8">
      {projects.map((project) => (
        <div key={project.name} className="flex items-center">
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
              {project.completed} of {project.tasks} tasks completed
            </p>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            {project.lastUpdated}
          </div>
        </div>
      ))}
    </div>
  );
}