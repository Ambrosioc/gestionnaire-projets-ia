'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KanbanBoard } from '@/components/tasks/kanban-board';
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog';
import { TaskFilters } from '@/components/tasks/task-filters';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Task, TaskStatus, getTaskStatuses } from '@/lib/tasks';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statuses, setStatuses] = useState<TaskStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    deadline: null as Date | null,
    search: '',
  });

  useEffect(() => {
    fetchTasks();
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const statusList = await getTaskStatuses();
      setStatuses(statusList);
    } catch (error) {
      toast.error('Erreur lors du chargement des statuts');
    }
  };

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          project:projects(name),
          tags:task_tags(tag:tags(*))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des tâches');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks([newTask, ...tasks]);
    setIsDialogOpen(false);
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.deadline && task.deadline) {
      const taskDate = new Date(task.deadline);
      const filterDate = new Date(filters.deadline);
      if (
        taskDate.getFullYear() !== filterDate.getFullYear() ||
        taskDate.getMonth() !== filterDate.getMonth() ||
        taskDate.getDate() !== filterDate.getDate()
      ) {
        return false;
      }
    }
    if (
      filters.search &&
      !task.title.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tâches</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle tâche
        </Button>
      </div>

      <TaskFilters filters={filters} onFiltersChange={setFilters} />

      <KanbanBoard
        tasks={filteredTasks}
        statuses={statuses}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleTaskDeleted}
      />

      <CreateTaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}