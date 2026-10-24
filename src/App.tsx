import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { RouterProvider, useRouter, type Route } from '@/context/RouterContext';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { TodosPage } from '@/pages/TodosPage';
import { KanbanPage } from '@/pages/KanbanPage';
import { PomodoroPage } from '@/pages/PomodoroPage';
import { PlannerPage } from '@/pages/PlannerPage';
import { GoalsPage } from '@/pages/GoalsPage';
import { NotesPage } from '@/pages/NotesPage';

const PROTECTED: Route[] = [
  'dashboard',
  'todos',
  'kanban',
  'pomodoro',
  'planner',
  'goals',
  'notes',
];

function AppContent() {
  const { user, loading } = useAuth();
  const { route, navigate } = useRouter();

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.replace('#', '') as Route;
      if (hash) navigate(hash);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  const isProtected = PROTECTED.includes(route);

  if (isProtected && !user) {
    return <LoginPage />;
  }

  switch (route) {
    case 'landing':
      return <LandingPage />;
    case 'login':
      return <LoginPage />;
    case 'register':
      return <RegisterPage />;
    case 'dashboard':
      return <DashboardPage />;
    case 'todos':
      return <TodosPage />;
    case 'kanban':
      return <KanbanPage />;
    case 'pomodoro':
      return <PomodoroPage />;
    case 'planner':
      return <PlannerPage />;
    case 'goals':
      return <GoalsPage />;
    case 'notes':
      return <NotesPage />;
    default:
      return <LandingPage />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </AuthProvider>
  );
}
