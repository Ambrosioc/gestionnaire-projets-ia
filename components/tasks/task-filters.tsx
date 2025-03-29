'use client';

import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TaskStatus, TaskPriority, getTaskStatuses, getTaskPriorities } from '@/lib/tasks';

interface TaskFiltersProps {
  filters: {
    status: string;
    priority: string;
    deadline: Date | null;
    search: string;
  };
  onFiltersChange: (filters: {
    status: string;
    priority: string;
    deadline: Date | null;
    search: string;
  }) => void;
}

export function TaskFilters({ filters, onFiltersChange }: TaskFiltersProps) {
  const [statuses, setStatuses] = useState<TaskStatus[]>([]);
  const [priorities, setPriorities] = useState<TaskPriority[]>([]);

  useEffect(() => {
    fetchFiltersData();
  }, []);

  const fetchFiltersData = async () => {
    try {
      const [statusList, priorityList] = await Promise.all([
        getTaskStatuses(),
        getTaskPriorities(),
      ]);
      setStatuses(statusList);
      setPriorities(priorityList);
    } catch (error) {
      console.error('Erreur lors du chargement des filtres :', error);
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Input
        placeholder="Rechercher une tâche..."
        value={filters.search}
        onChange={(e) =>
          onFiltersChange({ ...filters, search: e.target.value })
        }
        className="max-w-xs"
      />

      <Select
        value={filters.status}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, status: value })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Tous les statuts</SelectItem>
          {statuses.map((status) => (
            <SelectItem key={status.id} value={status.id}>
              {status.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.priority}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, priority: value })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Priorité" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Toutes les priorités</SelectItem>
          {priorities.map((priority) => (
            <SelectItem key={priority.id} value={priority.id}>
              {priority.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-[240px] justify-start text-left font-normal ${
              !filters.deadline && 'text-muted-foreground'
            }`}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {filters.deadline ? (
              format(filters.deadline, 'PPP', { locale: fr })
            ) : (
              <span>Date limite</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={filters.deadline}
            onSelect={(date) =>
              onFiltersChange({ ...filters, deadline: date })
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {(filters.status || filters.priority || filters.deadline || filters.search) && (
        <Button
          variant="ghost"
          onClick={() =>
            onFiltersChange({
              status: '',
              priority: '',
              deadline: null,
              search: '',
            })
          }
        >
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  );
}