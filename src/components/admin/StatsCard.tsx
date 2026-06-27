import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
}

export default function StatsCard({ title, value, description, icon: Icon, trend, trendType = 'neutral' }: StatsCardProps) {
  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.02)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_12px_35px_-8px_rgba(0,0,0,0.04)] flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{title}</span>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight block">{value}</span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-red-50 text-[#cc0000] flex items-center justify-center shrink-0 border border-red-100/50 shadow-sm">
          <Icon size={22} />
        </div>
      </div>
      {(description || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center flex-wrap gap-1.5 text-xs">
          {trend && (
            <span className={`font-bold ${
              trendType === 'up' 
                ? 'text-emerald-600' 
                : trendType === 'down' 
                  ? 'text-rose-600' 
                  : 'text-slate-400'
            }`}>
              {trend}
            </span>
          )}
          {description && <span className="text-slate-500 font-light">{description}</span>}
        </div>
      )}
    </div>
  );
}
