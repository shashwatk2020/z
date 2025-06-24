
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Clock, CheckSquare, Calendar, FileText, Zap, Users } from 'lucide-react';

const tools = [
  {
    name: 'Todo List Manager',
    description: 'Organize tasks, set priorities, and track progress with a powerful todo list system. Features deadlines, categories, and collaboration tools for team productivity.',
    link: '/tools/productivity/advanced-todo-list',
    icon: <CheckSquare className="h-8 w-8 text-blue-500" />
  },
  {
    name: 'Time Tracker',
    description: 'Track time spent on projects and tasks with detailed reporting. Perfect for freelancers, consultants, and teams who need accurate time logging for billing and analysis.',
    link: '/tools/productivity/time-tracker',
    icon: <Clock className="h-8 w-8 text-green-500" />
  },
  {
    name: 'Note Taking System',
    description: 'Create, organize, and search through notes with rich formatting, tagging, and collaboration features. Your digital notebook for ideas, meetings, and projects.',
    link: '/tools/productivity/notes',
    icon: <FileText className="h-8 w-8 text-purple-500" />
  },
  {
    name: 'Calendar Scheduler',
    description: 'Schedule meetings, set reminders, and manage your calendar with smart scheduling features. Integrates with popular calendar systems for seamless workflow.',
    link: '/tools/productivity/calendar',
    icon: <Calendar className="h-8 w-8 text-orange-500" />
  },
  {
    name: 'Project Manager',
    description: 'Plan, track, and manage projects with Gantt charts, milestone tracking, and team collaboration. Keep projects on time and within budget.',
    link: '/tools/productivity/project-planner',
    icon: <Users className="h-8 w-8 text-red-500" />
  },
  {
    name: 'Workflow Automation',
    description: 'Automate repetitive tasks and create efficient workflows. Connect different tools and services to streamline your daily operations.',
    link: '/tools/productivity/automation',
    icon: <Zap className="h-8 w-8 text-indigo-500" />
  },
];

const taskManagementTools = [
    { name: 'Advanced Todo List', description: 'Feature-rich task management with priorities and deadlines.', link: '/tools/productivity/advanced-todo-list' },
    { name: 'Kanban Board', description: 'Visual task management with drag-and-drop workflow.', link: '/tools/productivity/kanban-board' },
    { name: 'Project Planner', description: 'Plan projects with timelines, milestones, and dependencies.', link: '/tools/productivity/project-planner' },
    { name: 'Team Task Manager', description: 'Assign and track tasks across team members.', link: '/tools/productivity/team-task-manager' },
    { name: 'Goal Tracker', description: 'Set and track personal and professional goals.', link: '/tools/productivity/goal-tracker' },
    { name: 'Habit Tracker', description: 'Build positive habits with daily tracking and streaks.', link: '/tools/productivity/habit-tracker' },
    { name: 'Priority Matrix', description: 'Organize tasks using Eisenhower priority matrix.', link: '/tools/productivity/priority-matrix' },
    { name: 'Milestone Tracker', description: 'Track important project and personal milestones.', link: '/tools/productivity/milestone-tracker' },
];

const timeManagementTools = [
    { name: 'Time Tracker', description: 'Track time spent on projects with detailed reporting.', link: '/tools/productivity/time-tracker' },
    { name: 'Pomodoro Timer', description: 'Boost focus with the Pomodoro Technique timer.', link: '/tools/productivity/pomodoro-timer' },
    { name: 'Work Schedule Planner', description: 'Plan and optimize your work schedule and shifts.', link: '/tools/productivity/schedule-planner' },
    { name: 'Meeting Scheduler', description: 'Schedule meetings across time zones with availability.', link: '/tools/productivity/meeting-scheduler' },
    { name: 'Time Zone Planner', description: 'Plan activities across multiple time zones.', link: '/tools/productivity/timezone-planner' },
    { name: 'Calendar Sync Tool', description: 'Synchronize calendars from multiple platforms.', link: '/tools/productivity/calendar-sync' },
    { name: 'Deadline Calculator', description: 'Calculate and track project deadlines and milestones.', link: '/tools/productivity/deadline-calculator' },
    { name: 'Time Blocking Tool', description: 'Block time for focused work and deep work sessions.', link: '/tools/productivity/time-blocking' },
];

const organizationTools = [
    { name: 'Digital Note System', description: 'Organize notes with tags, categories, and search.', link: '/tools/productivity/notes' },
    { name: 'Document Organizer', description: 'Organize and categorize documents and files.', link: '/tools/productivity/document-organizer' },
    { name: 'Contact Manager', description: 'Manage contacts with detailed information and groups.', link: '/tools/productivity/contact-manager' },
    { name: 'Bookmark Manager', description: 'Organize and sync bookmarks across devices.', link: '/tools/productivity/bookmark-manager' },
    { name: 'Password Organizer', description: 'Securely organize and manage passwords.', link: '/tools/productivity/password-organizer' },
    { name: 'File Naming System', description: 'Generate consistent file naming conventions.', link: '/tools/productivity/file-naming' },
    { name: 'Digital Workspace', description: 'Create organized digital workspaces for projects.', link: '/tools/productivity/workspace' },
    { name: 'Archive System', description: 'Archive and organize completed projects and files.', link: '/tools/productivity/archive-system' },
];

const collaborationTools = [
    { name: 'Team Collaboration Hub', description: 'Central hub for team communication and collaboration.', link: '/tools/productivity/collaboration-hub' },
    { name: 'Shared Workspace', description: 'Create shared workspaces for team projects.', link: '/tools/productivity/shared-workspace' },
    { name: 'Meeting Notes Organizer', description: 'Organize and share meeting notes with action items.', link: '/tools/productivity/meeting-notes' },
    { name: 'Team Calendar', description: 'Shared calendar for team events and deadlines.', link: '/tools/productivity/team-calendar' },
    { name: 'Project Dashboard', description: 'Visual dashboard for project status and metrics.', link: '/tools/productivity/dashboard' },
    { name: 'Resource Sharing Tool', description: 'Share files and resources with team members.', link: '/tools/productivity/resource-sharing' },
    { name: 'Feedback Collection', description: 'Collect and organize feedback from team and clients.', link: '/tools/productivity/feedback-collection' },
    { name: 'Team Communication', description: 'Streamlined communication tools for teams.', link: '/tools/productivity/team-communication' },
];

const Productivity = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Professional Productivity Tools
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
                Streamline your workflow, organize your tasks, and boost your efficiency with our comprehensive suite of productivity tools designed for professionals, teams, and individuals.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.map((tool) => (
                <Link to={tool.link} key={tool.name} className="block group">
                  <Card className="h-full hover:shadow-lg hover:border-blue-500 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center space-x-4">
                      <div>{tool.icon}</div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="py-12 md:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">All Our Productivity Tools</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">Comprehensive tools to organize, plan, track, and optimize every aspect of your personal and professional productivity.</p>
                </div>

                <div className="space-y-16">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Task Management</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {taskManagementTools.map((tool) => (
                                <Link to={tool.link} key={tool.name} className="block group">
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Time Management</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {timeManagementTools.map((tool) => (
                                <Link to={tool.link} key={tool.name} className="block group">
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Organization & Planning</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {organizationTools.map((tool) => (
                                <Link to={tool.link} key={tool.name} className="block group">
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Collaboration & Teams</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {collaborationTools.map((tool) => (
                                <Link to={tool.link} key={tool.name} className="block group">
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                    </Card>
                                </Link>
                            ))}
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

export default Productivity;
