
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Task {
  id: string;
  assignedTo: string;
}

interface TaskFiltersProps {
  teamMembers: TeamMember[];
  tasks: Task[];
  filterAssignee: string;
  setFilterAssignee: (assignee: string) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  teamMembers,
  tasks,
  filterAssignee,
  setFilterAssignee
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterAssignee === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterAssignee('all')}
          >
            All Tasks ({tasks.length})
          </Button>
          {teamMembers.map(member => (
            <Button
              key={member.id}
              variant={filterAssignee === member.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterAssignee(member.id)}
            >
              {member.name} ({tasks.filter(t => t.assignedTo === member.id).length})
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
