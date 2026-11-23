import { ArrowUpRight } from 'lucide-react';

interface LiveProjectButtonProps {
  href: string;
  label?: string;
}

export function LiveProjectButton({
  href,
  label = 'Live Project',
}: LiveProjectButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-[#D7E2EA]/35 bg-white/[0.03] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-[#E6EEF4] backdrop-blur-md transition-all duration-300 hover:border-[#D7E2EA]/80 hover:bg-white/[0.08] hover:shadow-[0_0_24px_rgba(180,220,255,0.16)] sm:px-9 sm:py-3.5 sm:text-sm"
    >
      <span>{label}</span>
      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}
