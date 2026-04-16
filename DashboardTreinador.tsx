import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  Users, 
  Dumbbell, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  Lock, 
  Zap, 
  LayoutDashboard, 
  Library, 
  Settings, 
  LogOut, 
  Menu, 
  User as UserIcon, 
  Target,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { UserProfile } from '../types';
import { TRAINER_PLANS } from '../constants';
import { cn } from '../lib/utils';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { TrainerWorkoutLibrary } from '../components/TrainerWorkoutLibrary';
import { TrainerStudentDetail } from '../components/TrainerStudentDetail';
import { KPICard } from '../components/KPICard';
import { verificarEmailExistente, criarUsuario, criarAluno } from '../services/userService';
import { fetchAlunos } from '../services/alunoService';
import { Biblioteca } from './Biblioteca';
import { Avaliacao } from './Avaliacao';
import { aiService } from '../services/aiService';

export const DashboardTreinador: React.FC = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [alunos, setAlunos] = useState<UserProfile[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending'>('all');
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [aiAlerts, setAiAlerts] = useState<any[]>([]);

  // Manual student form state
  const [manualStudent, setManualStudent] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    birthDate: '',
    protocolo: '',
    tipo: 'aluno' as const
  });
  const [manualError, setManualError] = useState('');
  const [manualSuccess, setManualSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function carregarAlunos() {
    try {
      const response = await fetchAlunos();
      setAlunos(response || []);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      setAlunos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarAlunos();
    setAiAlerts([
      { id: 1, type: 'risk', student: 'João Silva', message: 'Risco alto de evasão. Frequência caiu 40% na última semana.', severity: 'high' },
      { id: 2, type: 'progress', student: 'Maria Oliveira', message: 'Evolução excepcional de carga (+15%). Sugerir novo protocolo.', severity: 'low' }
    ]);
  }, []);

  const trainerPlan = TRAINER_PLANS.find(p => p.id === (profile?.planId || 'free')) || TRAINER_PLANS[0];
  const studentLimit = trainerPlan.studentLimit;
  const currentStudentsCount = (alunos || []).length;
  const isLimitReached = currentStudentsCount >= studentLimit;

  const filteredAlunos = (alunos || []).filter(aluno => {
    const matchesSearch = (aluno.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (aluno.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || aluno.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSalvarAluno = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.uid) return;
    setManualError('');
    setManualSuccess('');
    setIsSubmitting(true);
    try {
      if (!manualStudent.fullName || !manualStudent.email || !manualStudent.password || !manualStudent.birthDate) {
        throw new Error("Preencha todos os campos obrigatórios");
      }
      const emailExistente = await verificarEmailExistente(manualStudent.email);
      if (emailExistente) throw new Error("Este e-mail já está em uso");
      const usuario = await criarUsuario({
        nome: manualStudent.fullName,
        email: manualStudent.email,
        tipo: "aluno",
        treinador_id: profile.uid,
        password: manualStudent.password,
        birthDate: manualStudent.birthDate,
        phone: manualStudent.phone,
        protocolo: manualStudent.protocolo
      });
      await criarAluno({
        usuario_id: usuario.uid,
        treinador_id: profile.uid,
        status: "ativo"
      });
      setAlunos(prev => [...(prev || []), usuario]);
      setManualSuccess("Aluno cadastrado com sucesso!");
      setTimeout(() => {
        setIsAddingStudent(false);
        setManualSuccess('');
        setManualStudent({
          fullName: '', email: '', phone: '', password: '', birthDate: '', protocolo: '', tipo: 'aluno'
        });
      }, 2000);
    } catch (error: any) {
      setManualError(error.message || "Erro ao cadastrar aluno");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (alunos === null || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 font-black uppercase tracking-widest animate-pulse">Sincronizando dados...</p>
        </div>
      </div>
    );
  }

  if (selectedStudent) {
    return (
      <div className="min-h-screen bg-black text-white p-4 md:p-8">
        <TrainerStudentDetail 
          student={selectedStudent} 
          onBack={() => setSelectedStudent(null)} 
          trainerId={profile?.uid || ''}
        />
      </div>
    );
  }

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
            <h1 className="text-xl font-black tracking-tighter uppercase">PRAXIS EVO</h1>
          </div>

          <nav className="flex-1 space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
              { id: 'alunos', label: 'Meus Alunos', icon: Users, path: '/dashboard/alunos' },
              { id: 'biblioteca', label: 'Biblioteca', icon: Library, path: '/dashboard/biblioteca' },
              { id: 'avaliacao', label: 'Avaliações', icon: ClipboardList, path: '/dashboard/avaliacao' },
              { id: 'configuracoes', label: 'Configurações', icon: Settings, path: '/dashboard/configuracoes' },
            ].map(item => {
              const isActive = location.pathname === item.path || (item.id === 'dashboard' && location.pathname === '/dashboard');
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all",
                    isActive 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                      : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
                  )}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-zinc-900">
            <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-900 mb-4">
              <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500">
                <UserIcon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{profile?.fullName}</p>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{trainerPlan.name} Plan</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-rose-500 hover:bg-rose-500/10 transition-all"
            >
              <LogOut size={20} />
              Sair da Conta
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
              {location.pathname === '/dashboard' && 'Visão Geral'}
              {location.pathname === '/dashboard/alunos' && `Meus Alunos (${(alunos || []).length})`}
              {location.pathname === '/dashboard/biblioteca' && 'Biblioteca de Treinos'}
              {location.pathname === '/dashboard/avaliacao' && 'Avaliações'}
              {location.pathname === '/dashboard/configuracoes' && 'Configurações'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full border border-zinc-800">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sistema Online</span>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
          <Routes>
            <Route path="/" element={
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* AI Alerts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {aiAlerts.map(alert => (
                    <div key={alert.id} className={cn(
                      "p-4 rounded-2xl border flex items-start gap-4 animate-in slide-in-from-top-2",
                      alert.severity === 'high' ? "bg-rose-500/5 border-rose-500/20" : "bg-emerald-500/5 border-emerald-500/20"
                    )}>
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        alert.severity === 'high' ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                      )}>
                        {alert.severity === 'high' ? <AlertCircle size={20} /> : <Zap size={20} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-black uppercase tracking-widest text-zinc-500">{alert.student}</p>
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                            alert.severity === 'high' ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"
                          )}>
                            {alert.type === 'risk' ? 'Risco' : 'Destaque'}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-zinc-300">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <KPICard label="Total Alunos" value={currentStudentsCount} color="indigo" icon={Users} />
                  <KPICard label="Faturamento" value={`R$ ${currentStudentsCount * 150}`} color="emerald" icon={TrendingUp} />
                  <KPICard label="Ativos" value={(alunos || []).filter(a => a.status === 'active').length} color="emerald" icon={CheckCircle2} />
                  <KPICard label="Evo Score Médio" value="84" color="amber" icon={TrendingUp} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Alunos Recentes</h3>
                      <button onClick={() => navigate('/dashboard/alunos')} className="text-xs font-bold text-indigo-400 hover:text-indigo-300">Ver todos</button>
                    </div>
                    <div className="space-y-3">
                      {(alunos || []).length === 0 ? (
                        <div className="text-center py-12 bg-zinc-950 rounded-[2rem] border border-zinc-900 border-dashed">
                          <Users size={48} className="mx-auto text-zinc-800 mb-4" />
                          <p className="text-zinc-500 font-medium">Nenhum aluno cadastrado</p>
                        </div>
                      ) : (
                        (alunos || []).slice(0, 5).map(aluno => (
                          <Card 
                            key={aluno.uid} 
                            onClick={() => setSelectedStudent(aluno)}
                            className="p-4 flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-700 border border-zinc-800">
                                <UserIcon size={24} />
                              </div>
                              <div>
                                <p className="font-bold">{aluno.fullName}</p>
                                <p className="text-xs text-zinc-500">{aluno.email}</p>
                              </div>
                            </div>
                            <ChevronRight size={20} className="text-zinc-800 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                          </Card>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Status do Plano</h3>
                    <div className="premium-card p-8 bg-indigo-600/5 border-indigo-500/20">
                      <div className="flex items-center justify-between mb-6">
                        <p className="text-xs font-black uppercase tracking-widest text-indigo-400">Capacidade</p>
                        <p className="text-xs font-black text-zinc-500">{currentStudentsCount}/{studentLimit}</p>
                      </div>
                      <div className="h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 mb-6">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(currentStudentsCount / studentLimit) * 100}%` }}
                          className="h-full bg-indigo-500" 
                        />
                      </div>
                      {isLimitReached ? (
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl mb-6">
                          <div className="flex items-center gap-2 text-amber-500 mb-2">
                            <AlertCircle size={16} />
                            <p className="text-xs font-black uppercase">Limite Atingido</p>
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed">Faça o upgrade para adicionar mais alunos e desbloquear recursos premium.</p>
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-500 mb-6 italic">Você ainda pode adicionar {studentLimit - currentStudentsCount} alunos.</p>
                      )}
                      <Button variant="primary" className="w-full py-4">
                        Fazer Upgrade
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            } />

            <Route path="/alunos" element={
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 max-w-md relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <input 
                      type="text"
                      placeholder="Buscar aluno por nome ou e-mail..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2">
                      <Filter size={18} className="text-zinc-500" />
                      <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="bg-transparent text-sm font-bold outline-none cursor-pointer"
                      >
                        <option value="all">Todos</option>
                        <option value="active">Ativos</option>
                        <option value="pending">Pendentes</option>
                      </select>
                    </div>
                    <Button 
                      variant="primary" 
                      onClick={() => setIsAddingStudent(true)}
                      disabled={isLimitReached}
                      className="px-8 flex items-center gap-2"
                    >
                      <Plus size={20} />
                      <span>Novo Aluno</span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(filteredAlunos || []).length === 0 ? (
                    <div className="col-span-full text-center py-24 bg-zinc-950 rounded-[3rem] border border-zinc-900 border-dashed">
                      <Search size={64} className="mx-auto text-zinc-800 mb-6" />
                      <h3 className="text-xl font-black uppercase tracking-tight mb-2">Nenhum aluno encontrado</h3>
                      <p className="text-zinc-500 max-w-xs mx-auto">Tente ajustar sua busca ou filtros para encontrar o que procura.</p>
                    </div>
                  ) : (
                    (filteredAlunos || []).map(aluno => (
                      <Card 
                        key={aluno.uid}
                        onClick={() => setSelectedStudent(aluno)}
                        className="p-6 group relative overflow-hidden"
                      >
                        <div className="flex items-start justify-between mb-6">
                          <div className="w-16 h-16 bg-zinc-900 rounded-[1.5rem] flex items-center justify-center text-zinc-700 border border-zinc-800 group-hover:border-indigo-500/50 transition-all">
                            <UserIcon size={32} />
                          </div>
                          <button className="p-2 text-zinc-700 hover:text-white transition-colors">
                            <MoreVertical size={20} />
                          </button>
                        </div>
                        <div className="space-y-1 mb-6">
                          <h4 className="text-xl font-black tracking-tight uppercase">{aluno.fullName}</h4>
                          <p className="text-xs text-zinc-500 font-medium">{aluno.email}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900">
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Evo Score</p>
                            <p className="text-lg font-black text-indigo-400">{aluno.evoScore || '--'}</p>
                          </div>
                          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900">
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Fase</p>
                            <p className="text-lg font-black text-zinc-300">{aluno.currentPhase || 1}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                            aluno.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          )}>
                            {aluno.status === 'active' ? 'Ativo' : 'Pendente'}
                          </span>
                          <ChevronRight size={18} className="text-zinc-800 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            } />

            <Route path="/biblioteca" element={<Biblioteca />} />
            <Route path="/avaliacao" element={<Avaliacao />} />

            <Route path="/configuracoes" element={
              <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="premium-card p-8">
                  <h3 className="text-lg font-black uppercase tracking-tight mb-8">Perfil Profissional</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] flex items-center justify-center text-zinc-700 border-2 border-zinc-800">
                        <UserIcon size={48} />
                      </div>
                      <Button variant="secondary" className="text-xs">Alterar Foto</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Nome Completo" value={profile?.fullName} disabled />
                      <Input label="E-mail" value={profile?.email} disabled />
                      <Input label="Especialidade" placeholder="Ex: Hipertrofia, Emagrecimento" />
                      <Input label="CREF" placeholder="000000-G/SP" />
                    </div>
                    <Button variant="primary" className="w-full">Salvar Alterações</Button>
                  </div>
                </div>

                <div className="premium-card p-8 border-indigo-500/20 bg-indigo-600/5">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black uppercase tracking-tight">Assinatura</h3>
                    <span className="px-4 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">{trainerPlan.name}</span>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                      <div>
                        <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">Próxima Cobrança</p>
                        <p className="font-bold">15 de Abril, 2026</p>
                      </div>
                      <p className="text-xl font-black tracking-tighter">R$ {trainerPlan.price},00</p>
                    </div>
                    <div className="flex gap-4">
                      <Button variant="secondary" className="flex-1">Gerenciar Faturas</Button>
                      <Button variant="primary" className="flex-1">Mudar Plano</Button>
                    </div>
                  </div>
                </div>
              </div>
            } />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>

      {/* Modal Add Student */}
      <AnimatePresence>
        {isAddingStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingStudent(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-zinc-950 border border-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500">
                      <Plus size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tighter uppercase">Novo Aluno</h3>
                      <p className="text-sm text-zinc-500 font-medium">Cadastre um novo aluno manualmente</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsAddingStudent(false)}
                    className="p-3 hover:bg-zinc-900 rounded-2xl transition-colors text-zinc-500 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSalvarAluno} className="space-y-6">
                  {manualError && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 animate-in fade-in slide-in-from-top-2">
                      <AlertCircle size={20} />
                      <p className="text-sm font-bold">{manualError}</p>
                    </div>
                  )}
                  
                  {manualSuccess && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-500 animate-in fade-in slide-in-from-top-2">
                      <CheckCircle2 size={20} />
                      <p className="text-sm font-bold">{manualSuccess}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Nome Completo" 
                      placeholder="Ex: João Silva" 
                      value={manualStudent.fullName}
                      onChange={(e) => setManualStudent({...manualStudent, fullName: e.target.value})}
                      required
                    />
                    <Input 
                      label="E-mail" 
                      type="email" 
                      placeholder="joao@email.com" 
                      value={manualStudent.email}
                      onChange={(e) => setManualStudent({...manualStudent, email: e.target.value})}
                      required
                    />
                    <Input 
                      label="WhatsApp" 
                      placeholder="(11) 99999-9999" 
                      value={manualStudent.phone}
                      onChange={(e) => setManualStudent({...manualStudent, phone: e.target.value})}
                    />
                    <Input 
                      label="Data de Nascimento" 
                      type="date" 
                      value={manualStudent.birthDate}
                      onChange={(e) => setManualStudent({...manualStudent, birthDate: e.target.value})}
                      required
                    />
                    <Input 
                      label="Senha Inicial" 
                      type="password" 
                      placeholder="••••••••" 
                      value={manualStudent.password}
                      onChange={(e) => setManualStudent({...manualStudent, password: e.target.value})}
                      required
                    />
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Protocolo Inicial</label>
                      <select 
                        value={manualStudent.protocolo}
                        onChange={(e) => setManualStudent({...manualStudent, protocolo: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 text-sm outline-none focus:border-indigo-500 transition-all cursor-pointer"
                      >
                        <option value="">Nenhum</option>
                        <option value="praxis">Praxis Evolution</option>
                        <option value="hipertrofia">Hipertrofia Máxima</option>
                        <option value="emagrecimento">Emagrecimento Acelerado</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <Button 
                      type="button" 
                      variant="secondary" 
                      className="flex-1 py-4"
                      onClick={() => setIsAddingStudent(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="flex-1 py-4" 
                      loading={isSubmitting}
                    >
                      Cadastrar Aluno
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
