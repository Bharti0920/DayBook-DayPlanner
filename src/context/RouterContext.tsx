import { createContext, useContext, useState, type ReactNode } from 'react';

export type Route =
  | 'landing'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'todos'
  | 'kanban'
  | 'pomodoro'
  | 'planner'
  | 'goals'
  | 'notes';

type RouterContextValue = {
  route: Route;
  navigate: (r: Route) => void;
};

const RouterContext = createContext<RouterContextValue | undefined>(undefined);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => {
    const hash = window.location.hash.replace('#', '') as Route;
    return hash || 'landing';
  });

  const navigate = (r: Route) => {
    window.location.hash = r;
    setRoute(r);
    window.scrollTo(0, 0);
  };

  return <RouterContext.Provider value={{ route, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
