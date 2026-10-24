import { type ReactNode } from 'react';
import {
  LayoutDashboard,
  ListTodo,
  KanbanSquare,
  Timer,
  CalendarClock,
  Target,
  StickyNote,
  LogOut,
  Menu,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, type Route } from '@/context/RouterContext';
import { useState } from 'react';

const NAV_ITEMS: { route: Route; label: string; icon: typeof LayoutDashboard }[] = [
  { route: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { route: 'todos', label: 'Tasks', icon: ListTodo },
  { route: 'kanban', label: 'Kanban', icon: KanbanSquare },
  { route: 'pomodoro', label: 'Focus Timer', icon: Timer },
  { route: 'planner', label: 'Day Planner', icon: CalendarClock },
  { route: 'goals', label: 'Goals', icon: Target },
  { route: 'notes', label: 'Notes', icon: StickyNote },
];

export function AppShell({
  children,
  active,
  title,
  subtitle,
}: {
  children: ReactNode;
  active: Route;
  title: string;
  subtitle?: string;
}) {
  const { user, signOut } = useAuth();
  const { navigate } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = (user?.email ?? '?').slice(0, 2).toUpperCase();

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <button
        onClick={() => navigate('dashboard')}
        className="flex items-center gap-3 px-2 py-1 mb-10 text-left"
      >
        <div className="size-10 rounded-full bg-[#214f43] flex items-center justify-center">
          <span className="size-3 rounded-full bg-[#f4f1eb]" />
        </div>
        <span>
          <span className="block font-serif text-2xl leading-none">Daybook</span>
          <span className="block text-[9px] uppercase tracking-[0.25em] text-[#938d83] mt-1">Daily workspace</span>
        </span>
      </button>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.route;
          return (
            <button
              key={item.route}
              onClick={() => {
                navigate(item.route);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#e4eee9] text-[#214f43]'
                  : 'text-[#777168] hover:text-[#214f43] hover:bg-[#ebe7df]'
              }`}
            >
              <Icon className="size-[18px]" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-[#d9d4cb]">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="size-9 rounded-full bg-[#e4eee9] flex items-center justify-center text-sm font-semibold text-[#214f43]">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate text-[#3d403b]">{user?.email}</p>
            <p className="text-xs text-[#938d83]">Daily workspace</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#777168] hover:text-[#9a554b] hover:bg-[#f1e6e1] transition-colors"
        >
          <LogOut className="size-[18px]" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#f4f1eb]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-[#d9d4cb] bg-[#f4f1eb] p-5 fixed h-screen">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-[#f4f1eb] p-5 animate-float-in">
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-64 min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 glass border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-[var(--surface-2)]"
          >
            <Menu className="size-5" />
          </button>
          <span className="font-serif text-2xl">Daybook</span>
          <div className="size-8" />
        </div>

        <main className="px-5 sm:px-8 lg:px-14 py-8 lg:py-12 max-w-6xl mx-auto">
          <header className="mb-9 animate-float-in border-b border-[#d9d4cb] pb-7">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#938d83] mb-3">Daily workspace</p>
            <h1 className="font-serif text-4xl sm:text-5xl tracking-tight">{title}</h1>
            {subtitle && <p className="text-[#817b72] mt-2">{subtitle}</p>}
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
