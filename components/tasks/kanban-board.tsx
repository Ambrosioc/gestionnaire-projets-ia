'use client';

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { KanbanColumn } from './kanban-column';
import { KanbanTask } from './kanban-task';
import { Task, TaskStatus, updateTaskStatus } from '@/lib/tasks';
import { toast } from 'sonner';

interface KanbanBoardProps {
  tasks: Task[];
  statuses: TaskStatus[];
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

export function KanbanBoard({
  tasks,
  statuses,
  onTaskUpdated,
  onTaskDeleted,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: { active: { id: string } }) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    const overStatus = over.id;

    if (activeTask && activeTask.status !== overStatus) {
      try {
        await updateTaskStatus(activeTask.id, overStatus as string);
        onTaskUpdated({ ...activeTask, status: overStatus as string });
      } catch (error) {
        toast.error('Erreur lors de la mise à jour du statut');
      }
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statuses.map((status) => (
          <KanbanColumn
            key={status.id}
            status={status}
            tasks={tasks.filter((task) => task.status === status.id)}
            onTaskDeleted={onTaskDeleted}
          />
        ))}
      </div>

      <DragOverlay>
        {activeId ? (
          <KanbanTask
            task={tasks.find((task) => task.id === activeId)!}
            onDelete={onTaskDeleted}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}