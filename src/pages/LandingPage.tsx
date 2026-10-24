import {
  ArrowUpRight,
  CalendarClock,
  CheckSquare2,
  Clock3,
  KanbanSquare,
  LogOut,
  NotebookPen,
  Target,
  Timer,
} from 'lucide-react';
import { useRouter } from '@/context/RouterContext';
import { useAuth } from '@/context/AuthContext';

const FEATURE_CARDS = [
  {
    number: '01',
    icon: CheckSquare2,
    title: 'Task list',
    description: 'One honest list, the important things first.',
    metric: '0 open · 0 done',
    image: 'https://images.pexels.com/photos/326511/pexels-photo-326511.jpeg?auto=compress&cs=tinysrgb&h=500&w=900',
    route: 'todos' as const,
  },
  {
    number: '02',
    icon: Clock3,
    title: 'Time blocking',
    description: 'Give every hour a job before it picks one.',
    metric: '0 of 24 hours planned',
    image: 'https://images.pexels.com/photos/36123565/pexels-photo-36123565.jpeg?auto=compress&cs=tinysrgb&h=500&w=900',
    route: 'planner' as const,
  },
  {
    number: '03',
    icon: KanbanSquare,
    title: 'Work in motion',
    description: 'Move ideas forward, one clear step at a time.',
    metric: 'A calmer way to make progress',
    image: 'https://images.pexels.com/photos/7055/desk-computer-imac-home.jpg?auto=compress&cs=tinysrgb&h=500&w=900',
    route: 'kanban' as const,
  },
  {
    number: '04',
    icon: Timer,
    title: 'Focus sessions',
    description: 'A little structure for your deepest work.',
    metric: 'Start a 25 minute session',
    image: 'https://images.pexels.com/photos/2912515/pexels-photo-2912515.jpeg?auto=compress&cs=tinysrgb&h=500&w=900',
    route: 'pomodoro' as const,
  },
  {
    number: '05',
    icon: Target,
    title: 'Daily goals',
    description: 'Keep the bigger picture close without the pressure.',
    metric: 'Small steps count',
    image: 'https://images.pexels.com/photos/584179/pexels-photo-584179.jpeg?auto=compress&cs=tinysrgb&h=500&w=900',
    route: 'goals' as const,
  },
  {
    number: '06',
    icon: NotebookPen,
    title: 'Notes to keep',
    description: 'A soft place for thoughts, plans, and loose ends.',
    metric: 'Make space for ideas',
    image: 'https://images.pexels.com/photos/3563697/pexels-photo-3563697.jpeg?auto=compress&cs=tinysrgb&h=500&w=900',
    route: 'notes' as const,
  },
];

function formattedDate() {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());
}

export function LandingPage() {
  const { navigate } = useRouter();
  const { user, signOut } = useAuth();
  const displayName = user?.email?.split('@')[0]?.toUpperCase() ?? 'FRIEND';

  return (
    <div className="min-h-screen bg-[#f4f1eb] text-[#20231f]">
      <nav className="border-b border-[#d9d4cb] px-5 sm:px-10 lg:px-12">
        <div className="max-w-[1180px] mx-auto h-24 flex items-center justify-between">
          <button onClick={() => navigate(user ? 'dashboard' : 'landing')} className="flex items-center gap-4 text-left">
            <span className="size-12 rounded-full bg-[#214f43] text-white flex items-center justify-center">
              <span className="size-3.5 rounded-full bg-[#f4f1eb]" />
            </span>
            <span>
              <span className="block font-serif text-3xl leading-none tracking-tight">Daybook</span>
              <span className="block text-[11px] uppercase tracking-[0.28em] text-[#8c8880] mt-1.5">Daily workspace</span>
            </span>
          </button>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:block text-sm uppercase tracking-[0.18em] text-[#827d74]">{displayName}</span>
                <button
                  onClick={signOut}
                  className="inline-flex items-center gap-2 rounded-full border border-[#d9d4cb] px-4 py-2.5 text-sm text-[#625e57] hover:bg-white transition-colors"
                >
                  <LogOut className="size-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('login')} className="px-3 py-2 text-sm text-[#625e57] hover:text-[#214f43] transition-colors">
                  Sign in
                </button>
                <button onClick={() => navigate('register')} className="rounded-full bg-[#214f43] text-white px-5 py-2.5 text-sm hover:bg-[#183d34] transition-colors">
                  Begin your day
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-[1180px] mx-auto px-5 sm:px-10 lg:px-12 py-12 sm:py-16">
        <section className="rounded-[2.5rem] bg-[#fffdfa] border border-[#e7e2db] px-8 py-10 sm:px-12 sm:py-14 lg:px-16 lg:py-16 shadow-[0_12px_45px_rgba(65,55,40,0.05)]">
          <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-[#938d83] mb-8">{formattedDate()}</p>
          <h1 className="font-serif text-6xl sm:text-8xl leading-[0.88] tracking-[-0.045em] max-w-3xl">
            Make room
            <br />
            <em>for what matters.</em>
          </h1>
          <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm sm:text-base text-[#777168]">
            <span className="font-medium text-[#2c302b]">A slower, clearer way to plan your day.</span>
            <span className="hidden sm:block text-[#c3beb5]">/</span>
            <span>Your tasks, time, and thoughts in one place.</span>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <button
              onClick={() => navigate(user ? 'dashboard' : 'register')}
              className="inline-flex items-center gap-2 rounded-full bg-[#214f43] text-white px-6 py-3.5 text-sm font-medium hover:bg-[#183d34] transition-colors"
            >
              {user ? 'Open your workspace' : 'Create your workspace'}
              <ArrowUpRight className="size-4" />
            </button>
            {!user && (
              <button onClick={() => navigate('login')} className="rounded-full border border-[#d9d4cb] px-6 py-3.5 text-sm text-[#625e57] hover:bg-[#f4f1eb] transition-colors">
                I already have an account
              </button>
            )}
          </div>

          <div className="mt-14 relative overflow-hidden rounded-[1.75rem] h-48 sm:h-64">
            <img
              src="https://images.pexels.com/photos/36123565/pexels-photo-36123565.jpeg?auto=compress&cs=tinysrgb&h=650&w=1200"
              alt="A calm desk ready for planning the day"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#214f43]/40 to-transparent" />
            <p className="absolute bottom-5 left-6 text-white text-sm tracking-wide">A little structure. A lot more breathing room.</p>
          </div>
        </section>

        <section className="mt-6 rounded-[2.5rem] bg-[#214f43] text-[#f6f2e9] px-8 py-12 sm:px-12 sm:py-16 lg:px-16 relative overflow-hidden">
          <div className="absolute -right-20 -top-28 size-72 rounded-full border border-white/10" />
          <div className="absolute -left-24 -bottom-44 size-80 rounded-full border border-white/10" />
          <p className="relative text-xs sm:text-sm uppercase tracking-[0.28em] text-white/60 mb-10">One thought for today</p>
          <blockquote className="relative font-serif text-4xl sm:text-6xl leading-[1.05] max-w-4xl">
            “The secret of getting ahead is getting started.”
          </blockquote>
          <p className="relative mt-6 text-sm text-white/60">— Mark Twain</p>
        </section>

        <section className="mt-16 sm:mt-24">
          <div className="flex items-end justify-between mb-8 px-1">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#938d83] mb-3">Your everyday tools</p>
              <h2 className="font-serif text-4xl sm:text-5xl tracking-tight">A place for the whole day.</h2>
            </div>
            <button onClick={() => navigate(user ? 'dashboard' : 'register')} className="hidden sm:inline-flex items-center gap-2 text-sm text-[#214f43] hover:gap-3 transition-all">
              Explore workspace <ArrowUpRight className="size-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {FEATURE_CARDS.map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.number}
                  onClick={() => navigate(user ? feature.route : 'register')}
                  className="text-left rounded-[2rem] overflow-hidden bg-[#fffdfa] border border-[#e7e2db] shadow-[0_8px_25px_rgba(65,55,40,0.04)] hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(65,55,40,0.09)] transition-all duration-300"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img src={feature.image} alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#fffdfa] to-transparent" />
                  </div>
                  <div className="px-8 pb-8 -mt-3 relative">
                    <div className="flex items-center justify-between mb-7">
                      <span className="size-14 rounded-2xl bg-[#eaf0ed] text-[#214f43] flex items-center justify-center">
                        <Icon className="size-6" strokeWidth={1.7} />
                      </span>
                      <span className="font-mono text-xs tracking-[0.24em] text-[#b2ada4]">{feature.number}</span>
                    </div>
                    <h3 className="font-serif text-3xl mb-2">{feature.title}</h3>
                    <p className="text-[#817b72] leading-relaxed max-w-sm">{feature.description}</p>
                    <span className="mt-8 inline-flex items-center gap-2 text-[#214f43] text-sm">
                      {feature.metric} <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-16 sm:mt-24 mb-6 rounded-[2.5rem] bg-[#e8e1d7] px-8 py-12 sm:px-14 sm:py-16 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-[#938d83] mb-5">Start with one small thing</p>
          <h2 className="font-serif text-4xl sm:text-5xl max-w-2xl mx-auto leading-tight">Your clearest day can begin here.</h2>
          <button onClick={() => navigate(user ? 'dashboard' : 'register')} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#214f43] text-white px-6 py-3.5 text-sm font-medium hover:bg-[#183d34] transition-colors">
            {user ? 'Open Daybook' : 'Make it yours'} <ArrowUpRight className="size-4" />
          </button>
        </section>
      </main>

      <footer className="border-t border-[#d9d4cb] py-8 text-center text-xs uppercase tracking-[0.22em] text-[#938d83]">
        Daybook · A daily workspace for doing less, better.
      </footer>
    </div>
  );
}
