
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckSquare, 
  Calendar, 
  Target, 
  Users, 
  Timer, 
  Clock,
  FileText,
  FolderOpen,
  Bookmark,
  Shield,
  Archive,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Productivity = () => {
  const productivityTools = [
    {
      category: "Task Management",
      tools: [
        {
          title: "Advanced Todo List",
          description: "Create and manage tasks with priorities, due dates, and categories",
          icon: CheckSquare,
          href: "/tools/productivity/todo-list",
          status: "ready"
        },
        {
          title: "Kanban Board",
          description: "Visual project management with drag-and-drop task boards",
          icon: Calendar,
          href: "/tools/productivity/kanban-board", 
          status: "ready"
        },
        {
          title: "Project Planner",
          description: "Plan and track complex projects with milestones and dependencies",
          icon: Target,
          href: "/tools/productivity/project-planner",
          status: "ready"
        },
        {
          title: "Team Task Manager",
          description: "Assign and track tasks across team members",
          icon: Users,
          href: "/tools/productivity/team-task-manager",
          status: "api-required"
        }
      ]
    },
    {
      category: "Goal & Habit Tracking",
      tools: [
        {
          title: "Goal Tracker",
          description: "Set, track, and achieve your personal and professional goals",
          icon: Target,
          href: "/tools/productivity/goal-tracker",
          status: "ready"
        },
        {
          title: "Habit Tracker",
          description: "Build and maintain positive habits with daily tracking",
          icon: CheckSquare,
          href: "/tools/productivity/habit-tracker",
          status: "ready"
        },
        {
          title: "Priority Matrix",
          description: "Organize tasks using the Eisenhower Priority Matrix",
          icon: Target,
          href: "/tools/productivity/priority-matrix",
          status: "ready"
        },
        {
          title: "Milestone Tracker",
          description: "Track important milestones and achievements",
          icon: Target,
          href: "/tools/productivity/milestone-tracker",
          status: "ready"
        }
      ]
    },
    {
      category: "Time Management",
      tools: [
        {
          title: "Time Tracker",
          description: "Track time spent on projects and tasks",
          icon: Timer,
          href: "/tools/productivity/time-tracker",
          status: "ready"
        },
        {
          title: "Pomodoro Timer",
          description: "Boost productivity with the Pomodoro Technique",
          icon: Clock,
          href: "/tools/productivity/pomodoro-timer",
          status: "ready"
        },
        {
          title: "Work Schedule Planner",
          description: "Plan and organize your work schedule",
          icon: Calendar,
          href: "/tools/productivity/work-schedule-planner",
          status: "ready"
        },
        {
          title: "Meeting Scheduler",
          description: "Schedule and manage meetings efficiently",
          icon: Calendar,
          href: "/tools/productivity/meeting-scheduler",
          status: "api-required"
        }
      ]
    },
    {
      category: "Planning & Organization",
      tools: [
        {
          title: "Time Zone Planner",
          description: "Plan meetings across different time zones",
          icon: Clock,
          href: "/tools/productivity/time-zone-planner",
          status: "ready"
        },
        {
          title: "Calendar Sync Tool",
          description: "Synchronize calendars across platforms",
          icon: Calendar,
          href: "/tools/productivity/calendar-sync-tool",
          status: "api-required"
        },
        {
          title: "Deadline Calculator",
          description: "Calculate project deadlines and milestones",
          icon: Calendar,
          href: "/tools/productivity/deadline-calculator",
          status: "ready"
        },
        {
          title: "Time Blocking Tool",
          description: "Organize your day with time blocking techniques",
          icon: Clock,
          href: "/tools/productivity/time-blocking-tool",
          status: "ready"
        }
      ]
    },
    {
      category: "Organization & Storage",
      tools: [
        {
          title: "Digital Note System",
          description: "Create, organize, and search through digital notes",
          icon: FileText,
          href: "/tools/productivity/digital-note-system",
          status: "ready"
        },
        {
          title: "Document Organizer",
          description: "Organize and categorize digital documents",
          icon: FolderOpen,
          href: "/tools/productivity/document-organizer",
          status: "ready"
        },
        {
          title: "Contact Manager",
          description: "Manage personal and professional contacts",
          icon: Users,
          href: "/tools/productivity/contact-manager",
          status: "ready"
        },
        {
          title: "Bookmark Manager",
          description: "Organize and manage web bookmarks",
          icon: Bookmark,
          href: "/tools/productivity/bookmark-manager",
          status: "ready"
        }
      ]
    },
    {
      category: "Security & System",
      tools: [
        {
          title: "Password Organizer",
          description: "Securely organize and manage passwords",
          icon: Shield,
          href: "/tools/productivity/password-organizer",
          status: "ready"
        },
        {
          title: "File Naming System",
          description: "Create consistent file naming conventions",
          icon: FileText,
          href: "/tools/productivity/file-naming-system",
          status: "ready"
        },
        {
          title: "Digital Workspace",
          description: "Create and manage digital workspaces",
          icon: FolderOpen,
          href: "/tools/productivity/digital-workspace",
          status: "ready"
        },
        {
          title: "Archive System",
          description: "Archive and organize old files and projects",
          icon: Archive,
          href: "/tools/productivity/archive-system",
          status: "ready"
        }
      ]
    },
    {
      category: "Team Collaboration",
      tools: [
        {
          title: "Team Collaboration Hub",
          description: "Central hub for team collaboration and communication",
          icon: Users,
          href: "/tools/productivity/team-collaboration-hub",
          status: "api-required"
        },
        {
          title: "Shared Workspace",
          description: "Create shared workspaces for team projects",
          icon: FolderOpen,
          href: "/tools/productivity/shared-workspace",
          status: "api-required"
        },
        {
          title: "Meeting Notes Organizer",
          description: "Organize and share meeting notes",
          icon: FileText,
          href: "/tools/productivity/meeting-notes-organizer",
          status: "ready"
        },
        {
          title: "Team Calendar",
          description: "Shared calendar for team scheduling",
          icon: Calendar,
          href: "/tools/productivity/team-calendar",
          status: "api-required"
        },
        {
          title: "Project Dashboard",
          description: "Overview dashboard for project management",
          icon: Target,
          href: "/tools/productivity/project-dashboard",
          status: "ready"
        },
        {
          title: "Resource Sharing Tool",
          description: "Share resources and files with team members",
          icon: FolderOpen,
          href: "/tools/productivity/resource-sharing-tool",
          status: "api-required"
        },
        {
          title: "Feedback Collection",
          description: "Collect and organize team feedback",
          icon: MessageSquare,
          href: "/tools/productivity/feedback-collection",
          status: "api-required"
        },
        {
          title: "Team Communication",
          description: "Enhanced team communication tools",
          icon: MessageSquare,
          href: "/tools/productivity/team-communication",
          status: "api-required"
        }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge variant="default" className="bg-green-100 text-green-800">Ready</Badge>;
      case "api-required":
        return <Badge variant="secondary">API Required</Badge>;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Productivity Tools
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive productivity tools to help you manage tasks, track goals, organize information, and collaborate effectively.
          </p>
        </div>

        <div className="space-y-12">
          {productivityTools.map((category) => (
            <div key={category.category}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {category.category}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.tools.map((tool) => (
                  <Card key={tool.title} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <tool.icon className="h-8 w-8 text-blue-600 mb-2" />
                        {getStatusBadge(tool.status)}
                      </div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {tool.status === "api-required" ? (
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-yellow-800 font-medium">
                            Tool not working - API integration required
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">
                            Will be available after API setup
                          </p>
                        </div>
                      ) : (
                        <Link 
                          to={tool.href}
                          className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
                        >
                          Use Tool
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Productivity;
