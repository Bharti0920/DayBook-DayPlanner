import { type ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useRouter } from '@/context/RouterContext';

const QUOTES = [
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Focus is not about saying yes — it is about saying no.', author: 'Steve Jobs' },
  { text: 'A good plan today is better than a perfect plan tomorrow.', author: 'George Patton' },
  { text: 'You don\'t have to see the whole staircase, just take the first step.', author: 'MLK Jr.' },
];

const QUOTE = QUOTES[new Date().getDate() % QUOTES.length];

const FEATURES = [
  'One honest task list — important things first',
  'Kanban board to watch work move forward',
  'Pomodoro timer for deep, distraction-free focus',
  'Time blocking to own every hour of your day',
  'Goal tracking to keep the bigger picture close',
];

export function AuthLayout({
  children,
  heading,
  subheading,
}: {
  children: ReactNode;
  heading: string;
  subheading: string;
}) {
  const { navigate } = useRouter();

  return (
    <div className="min-h-screen bg-[#f4f1eb] flex flex-col lg:flex-row">

      {/* ── Left panel ── */}
      <div className="flex-1 flex flex-col px-6 py-10 sm:px-12 lg:px-16 xl:px-24">

        {/* Brand */}
        <button
          onClick={() => navigate('landing')}
          className="flex items-center gap-3 mb-14 group w-fit"
        >
          <span className="size-11 rounded-full bg-[#214f43] text-white flex items-center justify-center group-hover:bg-[#183d34] transition-colors">
            <span className="size-3 rounded-full bg-[#f4f1eb]" />
          </span>
          <span>
            <span className="block font-serif text-2xl leading-none">Daybook</span>
            <span className="block text-[9px] uppercase tracking-[0.26em] text-[#938d83] mt-1">
              Daily workspace
            </span>
          </span>
        </button>

        {/* Form area */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="w-full max-w-[400px] animate-float-in">

            <p className="text-[11px] uppercase tracking-[0.28em] text-[#938d83] mb-5">
              Your workspace awaits
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl leading-tight mb-3">
              {heading}
            </h1>
            <p className="text-[#817b72] mb-9">{subheading}</p>

            {children}
          </div>
        </div>

        <p className="text-[11px] text-[#b2ada4] mt-10">
          Daybook — A daily workspace for doing less, better.
        </p>
      </div>

      {/* ── Right panel ── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden bg-[#214f43] flex-col justify-between p-14 xl:p-18">
        {/* Decorative rings */}
        <div className="absolute -right-28 -top-28 size-96 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -left-36 bottom-0 size-[480px] rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute right-24 bottom-32 size-52 rounded-full border border-white/[0.07] pointer-events-none" />

        {/* Top: back link */}
        <div className="relative flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/50">
            {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}
          </p>
          <button
            onClick={() => navigate('landing')}
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/90 transition-colors"
          >
            Back to home <ArrowUpRight className="size-3.5" />
          </button>
        </div>

        {/* Middle: quote */}
        <div className="relative my-12">
          <p className="font-serif text-4xl xl:text-5xl leading-[1.12] text-[#f6f2e9]">
            "{QUOTE.text}"
          </p>
          <p className="mt-6 text-sm text-white/50">— {QUOTE.author}</p>
        </div>

        {/* Bottom: feature list */}
        <div className="relative">
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/40 mb-6">
            Everything in one place
          </p>
          <ul className="space-y-3.5">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <span className="mt-1.5 size-1.5 rounded-full bg-[#6abfa3] shrink-0" />
                <span className="text-sm text-white/70 leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
