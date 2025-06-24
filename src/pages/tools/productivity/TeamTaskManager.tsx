
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, ArrowLeft } from 'lucide-react';
import { TeamMemberCard } from '@/components/productivity/TeamMemberCard';
import { AddTeamMemberForm } from '@/components/productivity/AddTeamMemberForm';
import { AddTaskForm } from '@/components/productivity/AddTaskForm';
import { TaskCard } from '@/components/productivity/TaskCard';
import { TaskFilters } from '@/components/productivity/TaskFilters';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

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

interface NewTask {
  title: string;
  description: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

const TeamTaskManager = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'You', email: 'you@example.com', role: 'Manager' },
    { id: '2', name: 'Alice Johnson', email: 'alice@example.com', role: 'Developer' },
    { id: '3', name: 'Bob Smith', email: 'bob@example.com', role: 'Designer' }
  ]);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<NewTask>({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as const,
    dueDate: ''
  });
  const [newMember, setNewMember] = useState({ name: '', email: '', role: '' });
  const [filterAssignee, setFilterAssignee] = useState('all');

  const addTeamMember = () => {
    if (!newMember.name.trim() || !newMember.email.trim()) return;

    const member: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role || 'Member'
    };

    setTeamMembers([...teamMembers, member]);
    setNewMember({ name: '', email: '', role: '' });
  };

  const addTask = () => {
    if (!newTask.title.trim() || !newTask.assignedTo) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      priority: newTask.priority,
      status: 'todo',
      dueDate: newTask.dueDate,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const getAssigneeName = (assigneeId: string) => {
    const member = teamMembers.find(m => m.id === assigneeId);
    return member ? member.name : 'Unassigned';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTasks = tasks.filter(task => 
    filterAssignee === 'all' || task.assignedTo === filterAssignee
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Link to="/tools/productivity" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Productivity Tools
              </Link>
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Team Task Manager</h1>
                  <p className="text-gray-600">Assign and track tasks across team members</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Team Members & Add Task */}
              <div className="space-y-6">
                {/* Team Members */}
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {teamMembers.map((member) => (
                      <TeamMemberCard
                        key={member.id}
                        member={member}
                        getInitials={getInitials}
                      />
                    ))}
                    
                    <AddTeamMemberForm
                      newMember={newMember}
                      setNewMember={setNewMember}
                      onAddMember={addTeamMember}
                    />
                  </CardContent>
                </Card>

                {/* Add Task */}
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Task</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AddTaskForm
                      newTask={newTask}
                      setNewTask={setNewTask}
                      teamMembers={teamMembers}
                      onAddTask={addTask}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Tasks */}
              <div className="lg:col-span-3 space-y-6">
                <TaskFilters
                  teamMembers={teamMembers}
                  tasks={tasks}
                  filterAssignee={filterAssignee}
                  setFilterAssignee={setFilterAssignee}
                />

                {/* Task List */}
                <div className="space-y-4">
                  {filteredTasks.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          {filterAssignee === 'all' 
                            ? 'No tasks yet. Add your first task!' 
                            : `No tasks assigned to ${getAssigneeName(filterAssignee)}.`
                          }
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        getAssigneeName={getAssigneeName}
                        getInitials={getInitials}
                        getPriorityColor={getPriorityColor}
                        getStatusColor={getStatusColor}
                        onStatusChange={updateTaskStatus}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TeamTaskManager;
