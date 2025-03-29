'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/lib/tasks';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface KanbanTaskProps {
  task: Task;
  onDelete: (taskId: string) => void;
}

export function KanbanTask({ task, onDelete }: KanbanTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', task.id);

      if (error) throw error;
      onDelete(task.id);
      toast.success('Tâche supprimée avec succès');
    } catch (error: any) {
      toast.error('Erreur lors de la suppression de la tâche');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <CardHeader className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base">{task.title}</CardTitle>
              <CardDescription>
                {task.project ? `${task.project.name} - ` : ''}
                {task.deadline &&
                  format(new Date(task.deadline), 'dd MMMM yyyy', {
                    locale: fr,
                  })}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {task.description && (
            <p className="text-sm text-muted-foreground mb-2">
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap gap-1">
            <Badge
              variant="outline"
              style={{
                backgroundColor: getPriorityColor(task.priority),
                color: 'white',
              }}
            >
              {getPriorityLabel(task.priority)}
            </Badge>
            {task.tags?.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                style={{
                  backgroundColor: tag.color,
                  color: 'white',
                }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'low':
      return '#4CAF50';
    case 'medium':
      return '#FF9800';
    case 'high':
      return '#f44336';
    case 'urgent':
      return '#9C27B0';
    default:
      return '#9e9e9e';
  }
}

function getPriorityLabel(priority: string): string {
  switch (priority) {
    case 'low':
      return 'Basse';
    case 'medium':
      return 'Moyenne';
    case 'high':
      return 'Haute';
    case 'urgent':
      return 'Urgente';
    default:
      return priority;
  }
}