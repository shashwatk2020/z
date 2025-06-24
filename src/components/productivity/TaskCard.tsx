
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  dueDate: string;
  createdAt: string;
}

interface TaskCardProps {
  task: Task;
  getAssigneeName: (assigneeId: string) => string;
  getInitials: (name: string) => string;
  getPriorityColor: (priority: string) => string;
  getStatusColor: (status: string) => string;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  getAssigneeName,
  getInitials,
  getPriorityColor,
  getStatusColor,
  onStatusChange
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold">{task.title}</h3>
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <Badge className={getStatusColor(task.status)}>
                {task.status}
              </Badge>
            </div>
            
            {task.description && (
              <p className="text-gray-600 text-sm mb-3">{task.description}</p>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {getInitials(getAssigneeName(task.assignedTo))}
                  </AvatarFallback>
                </Avatar>
                <span>{getAssigneeName(task.assignedTo)}</span>
              </div>
              
              {task.dueDate && (
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
              
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="ml-4">
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
