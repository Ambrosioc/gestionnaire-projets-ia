'use client';

import { useMemo } from 'react';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { KanbanTask } from './kanban-task';
import { Task, TaskStatus } from '@/lib/tasks';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskDeleted: (taskId: string) => void;
}

export function KanbanColumn({ status, tasks, onTaskDeleted }: KanbanColumnProps) {
  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  return (
    <div className="flex flex-col gap-4 min-w-[300px]">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{status.name}</h3>
        <span className="text-muted-foreground text-sm">
          {tasks.length} tâche{tasks.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg min-h-[500px]">
        <SortableContext items={tasksIds} strategy={rectSortingStrategy}>
          <div className="flex flex-col gap-2">
            {tasks.map((task) => (
              <KanbanTask
                key={task.id}
                task={task}
                onDelete={onTaskDeleted}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}