
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface NewTask {
  title: string;
  description: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

interface AddTaskFormProps {
  newTask: NewTask;
  setNewTask: (task: NewTask) => void;
  teamMembers: TeamMember[];
  onAddTask: () => void;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({
  newTask,
  setNewTask,
  teamMembers,
  onAddTask
}) => {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Task title"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
      />
      <Textarea
        placeholder="Description"
        value={newTask.description}
        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        rows={3}
      />
      <select
        value={newTask.assignedTo}
        onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      >
        <option value="">Select assignee</option>
        {teamMembers.map(member => (
          <option key={member.id} value={member.id}>{member.name}</option>
        ))}
      </select>
      <select
        value={newTask.priority}
        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>
      <Input
        type="date"
        value={newTask.dueDate}
        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
      />
      <Button onClick={onAddTask} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Task
      </Button>
    </div>
  );
};
