import React from 'react';

interface Props {
  title: string;
  subtitle: string;
  number: string;
}

export const SectionHeader: React.FC<Props> = ({ title, subtitle, number }) => {
  return (
    <div className="mb-12 border-b border-border pb-6">
      <div className="flex items-baseline gap-4 mb-2">
        <span className="font-mono text-accent text-sm font-bold tracking-widest">{number}</span>
        <h2 className="text-3xl font-bold tracking-tighter text-white">{title}</h2>
      </div>
      <p className="text-slate-600 max-w-2xl text-lg font-light leading-relaxed pl-[3rem]">
        {subtitle}
      </p>
    </div>
  );
};