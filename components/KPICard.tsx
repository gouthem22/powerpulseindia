import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number; // Percentage change
  icon?: React.ReactNode;
  color?: 'blue' | 'orange' | 'green' | 'purple';
}

const KPICard: React.FC<KPICardProps> = ({ title, value, unit, trend, icon, color = 'blue' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'orange': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'green': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'purple': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <div className={`p-2 rounded-lg ${getColorClasses()}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-slate-100">{value}</span>
        {unit && <span className="text-slate-400 text-sm mb-1">{unit}</span>}
      </div>
      {trend !== undefined && (
        <div className={`flex items-center mt-2 text-sm ${trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-red-400' : 'text-slate-400'}`}>
          {trend > 0 ? <ArrowUpRight size={16} className="mr-1" /> : trend < 0 ? <ArrowDownRight size={16} className="mr-1" /> : <Minus size={16} className="mr-1" />}
          <span>{Math.abs(trend).toFixed(1)}% vs prev year</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;