import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar
} from 'recharts';
import { Card } from './Card';
import { TrendingUp, Activity, Target } from 'lucide-react';

const data = [
  { name: 'Seg', carga: 60, consistencia: 100, frequencia: 1 },
  { name: 'Ter', carga: 62, consistencia: 100, frequencia: 1 },
  { name: 'Qua', carga: 62, consistencia: 0, frequencia: 0 },
  { name: 'Qui', carga: 65, consistencia: 100, frequencia: 1 },
  { name: 'Sexta', carga: 68, consistencia: 100, frequencia: 1 },
  { name: 'Sáb', carga: 70, consistencia: 100, frequencia: 1 },
  { name: 'Dom', carga: 70, consistencia: 0, frequencia: 0 },
];

interface PerformanceChartsProps {
  userId: string;
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ userId }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Carga Progress */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-500">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight">Evolução de Carga</h3>
                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">Média dos exercícios principais</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-emerald-500">+16%</p>
              <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">Este mês</p>
            </div>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCarga" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#52525b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#52525b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}kg`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #18181b', borderRadius: '12px' }}
                  itemStyle={{ color: '#4f46e5', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="carga" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCarga)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Consistency Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600/10 rounded-xl flex items-center justify-center text-emerald-500">
                <Activity size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight">Consistência</h3>
                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">Aderência ao plano semanal</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-indigo-400">92%</p>
              <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">Score Semanal</p>
            </div>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#52525b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#52525b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  hide
                />
                <Tooltip 
                  cursor={{ fill: '#18181b' }}
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #18181b', borderRadius: '12px' }}
                />
                <Bar 
                  dataKey="consistencia" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Frequency Chart */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-600/10 rounded-xl flex items-center justify-center text-amber-500">
                <Target size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight">Frequência Mensal</h3>
                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">Dias treinados vs Planejados</p>
              </div>
            </div>
          </div>
          
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#52525b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #18181b', borderRadius: '12px' }}
                />
                <Line 
                  type="stepAfter" 
                  dataKey="frequencia" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#000' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
