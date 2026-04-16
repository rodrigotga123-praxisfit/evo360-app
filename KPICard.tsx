import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface KPICardProps {
  label: string;
  value: string | number;
  color: 'indigo' | 'emerald' | 'rose' | 'amber' | 'zinc' | 'blue';
  icon: LucideIcon;
}

export const KPICard: React.FC<KPICardProps> = ({ label, value, color, icon: Icon }) => {
  const colors = {
    indigo: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    rose: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    zinc: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20"
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="premium-card p-6 flex flex-col justify-between"
    >
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 border", colors[color])}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black tracking-tighter text-white">{value}</p>
      </div>
    </motion.div>
  );
};
