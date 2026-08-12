import React, { useState } from 'react';
import { HelpCircle, Info } from 'lucide-react';

interface TooltipHintProps {
  term: string;
  hint: string;
  category?: string;
  icon?: 'help' | 'info';
  children?: React.ReactNode;
}

export const TooltipHint: React.FC<TooltipHintProps> = ({
  term,
  hint,
  category = 'J-2 DIRECTIVE',
  icon = 'info',
  children
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span 
      className="relative inline-flex items-center gap-1 group cursor-help"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)}
    >
      {children || <span className="underline decoration-dotted decoration-teal-400/60 underline-offset-4">{term}</span>}
      {icon === 'help' ? (
        <HelpCircle className="w-3.5 h-3.5 text-teal-600/70 inline-block shrink-0 transition-colors group-hover:text-teal-600" />
      ) : (
        <Info className="w-3.5 h-3.5 text-slate-400 inline-block shrink-0 transition-colors group-hover:text-teal-600" />
      )}

      {isVisible && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white rounded-lg shadow-xl border border-slate-700 z-[100] text-xs pointer-events-none animate-in fade-in duration-150">
          <span className="block font-mono text-[9px] font-bold uppercase tracking-wider text-teal-400 mb-1 border-b border-slate-800 pb-1">
            {category}: {term}
          </span>
          <span className="block font-sans text-slate-300 leading-normal text-[11px]">
            {hint}
          </span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </span>
      )}
    </span>
  );
};
