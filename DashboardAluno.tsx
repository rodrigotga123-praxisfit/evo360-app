import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, 
  TrendingUp, 
  Calendar, 
  Zap, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu, 
  User as UserIcon, 
  Trophy,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Star
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { KPICard } from '../components/KPICard';
import { WeeklyCheckInModal } from '../components/WeeklyCheckInModal';
import { CommunityFeed } from '../components/CommunityFeed';
import { PerformanceCharts } from '../components/PerformanceCharts';

export const DashboardAluno: React.FC = () => {
  const { profile, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'workout' | 'community' | 'progress'>('overview');

  // Check if check-in is needed (e.g. once a week)
  useEffect(() => {
    // Logic to check last check-in date
    // For demo, let's show it if they haven't done one today
    setShowCheckIn(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row overflow-y-auto" style={{ overflowY: "auto" }}>
      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-zinc-950 border-r border-zinc-900 transition-transform duration-300 lg:translate-x-0",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="min-h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Dumbbell className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase">EVO 360</h1>
          </div>

          <nav className="flex-1 space-y-2">
            {[
              { id: 'overview', label: 'Início', icon: LayoutDashboard },
              { id: 'workout', label: 'Meu Treino', icon: Dumbbell },
              { id: 'community', label: 'Comunidade', icon: MessageSquare },
              { id: 'progress', label: 'Evolução', icon: TrendingUp },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all",
                  activeTab === item.id 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                    : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-zinc-900">
            <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-900 mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                {profile?.level || 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{profile?.fullName}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500" 
                      style={{ width: `${(profile?.xp || 0) % 100}%` }} 
                    />
                  </div>
                  <span className="text-[10px] font-black text-zinc-500 uppercase">XP</span>
                </div>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-rose-500 hover:bg-rose-500/10 transition-all"
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-zinc-900 p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-black tracking-tight uppercase">
              {activeTab === 'overview' && 'Minha Performance'}
              {activeTab === 'workout' && 'Treino do Dia'}
              {activeTab === 'community' && 'Feed da Comunidade'}
              {activeTab === 'progress' && 'Minha Evolução'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 rounded-full border border-indigo-500/20">
              <Star className="text-indigo-400" size={16} />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Evo Score: {profile?.evoScore || 85}</span>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard label="Consistência" value="92%" color="indigo" icon={CheckCircle2} />
                <KPICard label="Nível" value={profile?.level || 1} color="amber" icon={Trophy} />
                <KPICard label="Treinos/Mês" value="18" color="emerald" icon={Dumbbell} />
                <KPICard label="Evo Score" value={profile?.evoScore || 85} color="indigo" icon={Zap} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="p-6 bg-indigo-600/5 border-indigo-500/20">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                        <Zap size={24} />
                      </div>
                      <div>
                        <h3 className="font-black uppercase tracking-tight">Insight da IA</h3>
                        <p className="text-xs text-zinc-500">Baseado no seu último check-in</p>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                      "Sua energia está alta, mas o sono foi irregular. Recomendamos manter a intensidade do treino, mas focar em 15 min de mobilidade e relaxamento antes de dormir hoje."
                    </p>
                    <Button variant="secondary" className="text-xs">Ver recomendações completas</Button>
                  </Card>

                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Próximo Treino</h3>
                    <Card className="p-6 flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-indigo-500 border border-zinc-800">
                          <Dumbbell size={28} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Treino A</p>
                          <h4 className="text-xl font-black uppercase tracking-tight">Peito e Tríceps</h4>
                          <p className="text-xs text-zinc-500">6 exercícios • 45-60 min</p>
                        </div>
                      </div>
                      <Button variant="primary" className="rounded-full w-12 h-12 p-0">
                        <ChevronRight size={24} />
                      </Button>
                    </Card>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Conquistas</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className={cn(
                        "aspect-square rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all",
                        i <= 3 ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400" : "bg-zinc-950 border-zinc-900 text-zinc-800"
                      )}>
                        <Trophy size={20} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Badge {i}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="secondary" className="w-full text-xs">Ver todas as medalhas</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'community' && <CommunityFeed />}
          {activeTab === 'progress' && <PerformanceCharts userId={profile?.uid || ''} />}
          {activeTab === 'workout' && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Dumbbell size={64} className="mx-auto text-zinc-800" />
                <h3 className="text-xl font-black uppercase tracking-tight">Área de Treino</h3>
                <p className="text-zinc-500 max-w-xs mx-auto">Em breve: Cronômetro, registro de carga e feedback em tempo real.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {showCheckIn && (
          <WeeklyCheckInModal 
            isOpen={showCheckIn} 
            onClose={() => setShowCheckIn(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
