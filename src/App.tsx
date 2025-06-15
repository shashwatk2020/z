
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AgeCalculator from './pages/tools/calculators/AgeCalculator';
import BMICalculator from './pages/tools/calculators/BMICalculator';
import CalorieCalculator from './pages/tools/calculators/CalorieCalculator';
import GPACalculator from './pages/tools/calculators/GPACalculator';
import FuelCostCalculator from './pages/tools/calculators/FuelCostCalculator';
import PaintCalculator from './pages/tools/calculators/PaintCalculator';
import PregnancyCalculator from './pages/tools/calculators/PregnancyCalculator';
import Productivity from './pages/tools/Productivity';
import TodoList from './pages/tools/productivity/TodoList';
import KanbanBoard from './pages/tools/productivity/KanbanBoard';
import ProjectPlanner from './pages/tools/productivity/ProjectPlanner';
import GoalTracker from './pages/tools/productivity/GoalTracker';
import HabitTracker from './pages/tools/productivity/HabitTracker';
import PriorityMatrix from './pages/tools/productivity/PriorityMatrix';
import MilestoneTracker from './pages/tools/productivity/MilestoneTracker';
import TimeTracker from './pages/tools/productivity/TimeTracker';
import PomodoroTimer from './pages/tools/productivity/PomodoroTimer';
import WorkSchedulePlanner from './pages/tools/productivity/WorkSchedulePlanner';
import TimeZonePlanner from './pages/tools/productivity/TimeZonePlanner';
import DeadlineCalculator from './pages/tools/productivity/DeadlineCalculator';
import TimeBlockingTool from './pages/tools/productivity/TimeBlockingTool';
import DigitalNoteSystem from './pages/tools/productivity/DigitalNoteSystem';
import DocumentOrganizer from './pages/tools/productivity/DocumentOrganizer';
import ContactManager from './pages/tools/productivity/ContactManager';
import BookmarkManager from './pages/tools/productivity/BookmarkManager';
import PasswordOrganizer from './pages/tools/productivity/PasswordOrganizer';
import FileNamingSystem from './pages/tools/productivity/FileNamingSystem';
import DigitalWorkspace from './pages/tools/productivity/DigitalWorkspace';
import ArchiveSystem from './pages/tools/productivity/ArchiveSystem';
import MeetingNotesOrganizer from './pages/tools/productivity/MeetingNotesOrganizer';
import ProjectDashboard from './pages/tools/productivity/ProjectDashboard';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Toaster />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Calculator Tools */}
          <Route path="/tools/calculators/age-calculator" element={<AgeCalculator />} />
          <Route path="/tools/calculators/bmi-calculator" element={<BMICalculator />} />
          <Route path="/tools/calculators/calorie-calculator" element={<CalorieCalculator />} />
          <Route path="/tools/calculators/gpa-calculator" element={<GPACalculator />} />
          <Route path="/tools/calculators/fuel-cost-calculator" element={<FuelCostCalculator />} />
          <Route path="/tools/calculators/paint-calculator" element={<PaintCalculator />} />
          <Route path="/tools/calculators/pregnancy-calculator" element={<PregnancyCalculator />} />
          
          {/* Productivity Tools */}
          <Route path="/tools/productivity" element={<Productivity />} />
          <Route path="/tools/productivity/todo-list" element={<TodoList />} />
          <Route path="/tools/productivity/kanban-board" element={<KanbanBoard />} />
          <Route path="/tools/productivity/project-planner" element={<ProjectPlanner />} />
          <Route path="/tools/productivity/goal-tracker" element={<GoalTracker />} />
          <Route path="/tools/productivity/habit-tracker" element={<HabitTracker />} />
          <Route path="/tools/productivity/priority-matrix" element={<PriorityMatrix />} />
          <Route path="/tools/productivity/milestone-tracker" element={<MilestoneTracker />} />
          <Route path="/tools/productivity/time-tracker" element={<TimeTracker />} />
          <Route path="/tools/productivity/pomodoro-timer" element={<PomodoroTimer />} />
          <Route path="/tools/productivity/work-schedule-planner" element={<WorkSchedulePlanner />} />
          <Route path="/tools/productivity/time-zone-planner" element={<TimeZonePlanner />} />
          <Route path="/tools/productivity/deadline-calculator" element={<DeadlineCalculator />} />
          <Route path="/tools/productivity/time-blocking-tool" element={<TimeBlockingTool />} />
          <Route path="/tools/productivity/digital-note-system" element={<DigitalNoteSystem />} />
          <Route path="/tools/productivity/document-organizer" element={<DocumentOrganizer />} />
          <Route path="/tools/productivity/contact-manager" element={<ContactManager />} />
          <Route path="/tools/productivity/bookmark-manager" element={<BookmarkManager />} />
          <Route path="/tools/productivity/password-organizer" element={<PasswordOrganizer />} />
          <Route path="/tools/productivity/file-naming-system" element={<FileNamingSystem />} />
          <Route path="/tools/productivity/digital-workspace" element={<DigitalWorkspace />} />
          <Route path="/tools/productivity/archive-system" element={<ArchiveSystem />} />
          <Route path="/tools/productivity/meeting-notes-organizer" element={<MeetingNotesOrganizer />} />
          <Route path="/tools/productivity/project-dashboard" element={<ProjectDashboard />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
