import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  User as UserIcon, 
  MessageSquare, 
  Plus, 
  Brain, 
  Camera, 
  Dumbbell, 
  TrendingUp, 
  Heart, 
  AlertCircle, 
  Zap, 
  Trophy, 
  Activity, 
  Shield, 
  CheckCircle2, 
  Calendar, 
  Repeat, 
  ClipboardList, 
  Share2, 
  Target, 
  Info, 
  X 
} from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, TrainerObservation } from '../types';
import { KPICard } from './KPICard';
import { cn } from '../lib/utils';
import { handleFirestoreError, OperationType } from '../lib/error-handling';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface TrainerStudentDetailProps {
  student: UserProfile;
  onBack: () => void;
  trainerId: string;
}

export const TrainerStudentDetail: React.FC<TrainerStudentDetailProps> = ({ student, onBack, trainerId }) => {
  const [activeTab, setActiveTab] = useState<'dados' | 'diagnostico' | 'corporal' | 'treino' | 'performance'>('diagnostico');
  const [observations, setObservations] = useState<TrainerObservation[]>([]);
  const [newObservation, setNewObservation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'trainer_observations'), 
      where('studentId', '==', student.uid),
      where('trainerId', '==', trainerId),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      setObservations(snap.docs.map(d => ({ id: d.id, ...d.data() } as TrainerObservation)));
    }, async (error) => await handleFirestoreError(error, OperationType.LIST, 'trainer_observations'));
    return () => unsubscribe();
  }, [student.uid, trainerId]);

  const handleAddObservation = async () => {
    if (!newObservation.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'trainer_observations'), {
        studentId: student.uid,
        trainerId,
        text: newObservation,
        createdAt: new Date().toISOString()
      });
      setNewObservation('');
    } catch (error) {
      await handleFirestoreError(error, OperationType.CREATE, 'trainer_observations');
    } finally {
      setLoading(false);
    }
  };

  const handlePhaseChange = async (newPhase: number) => {
    try {
      await updateDoc(doc(db, 'users', student.uid), { currentPhase: newPhase });
      alert(`Fase alterada para ${newPhase}`);
    } catch (error) {
      await handleFirestoreError(error, OperationType.UPDATE, `users/${student.uid}`);
    }
  };

  const handleSendMessage = () => {
    const message = `Olá ${student.fullName}! Aqui é seu treinador. Como estão os treinos?`;
    const url = `https://wa.me/${student.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-500 font-black uppercase tracking-widest animate-pulse">Carregando Biblioteca...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 hover:bg-zinc-900 rounded-2xl transition-all bg-zinc-900/50 border border-zinc-800">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-zinc-900 rounded-[2rem] overflow-hidden border-2 border-zinc-800 shadow-2xl">
              {student.bodyPhoto ? (
                <img src={student.bodyPhoto} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-900">
                  <UserIcon size={40} />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black tracking-tighter uppercase">{student.fullName}</h2>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                  student.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                )}>
                  {student.status === 'active' ? 'Ativo' : 'Pendente'}
                </span>
              </div>
              <p className="text-zinc-500 font-medium">{student.email}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSendMessage}
            className="p-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl hover:bg-emerald-500/20 transition-all flex items-center gap-2 font-bold text-sm"
          >
            <MessageSquare size={20} />
            <span className="hidden md:inline">WhatsApp</span>
          </button>
          <button className="premium-button px-8 py-4 flex items-center gap-2">
            <Plus size={20} />
            <span>Atribuir Treino</span>
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: 'diagnostico', label: 'Diagnóstico EVO 360', icon: Brain },
          { id: 'corporal', label: 'Análise Corporal', icon: Camera },
          { id: 'treino', label: 'Treino Atual', icon: Dumbbell },
          { id: 'performance', label: 'Performance', icon: TrendingUp },
          { id: 'dados', label: 'Dados Gerais', icon: UserIcon }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap border-2",
              activeTab === tab.id 
                ? "bg-indigo-600/10 border-indigo-500 text-indigo-400" 
                : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
            )}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'diagnostico' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPICard label="Aderência" value={`${student.scores?.adherence || 0}%`} color="emerald" icon={Heart} />
                <KPICard label="Risco" value={`${student.scores?.risk || 0}%`} color="rose" icon={AlertCircle} />
                <KPICard label="Prontidão" value={`${student.scores?.readiness || 0}%`} color="indigo" icon={Zap} />
                <KPICard label="Evo Score" value={student.evoScore || 0} color="amber" icon={Trophy} />
              </div>
              <div className="premium-card p-8">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Perfil Comportamental</h4>
                  <div className="px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                    <p className="text-indigo-400 font-black tracking-tighter uppercase">{student.userProfile || 'Não definido'}</p>
                  </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {student.scores?.dimensions && Object.entries((student.scores.dimensions || {}) as Record<string, number>).map(([key, val]: [string, any]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        <span>{key}</span>
                        <span>{(val || 0).toFixed(1)}/5.0</span>
                      </div>
                      <div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${((val || 0) / 5) * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-indigo-500" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
 </div>
              </div>
            </div>
          )}

          {activeTab === 'corporal' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {student.lastBodyAnalysis ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <KPICard label="BF Estimado" value={`${student.lastBodyAnalysis.estimatedBF}%`} color="indigo" icon={Activity} />
                    <KPICard label="Estrutura" value={student.lastBodyAnalysis.boneStructure} color="zinc" icon={Shield} />
                    <KPICard label="Massa Muscular" value={student.lastBodyAnalysis.muscleMass} color="emerald" icon={Dumbbell} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="premium-card p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                          <CheckCircle2 size={18} />
                        </div>
                        <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest">Pontos Fortes</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(student.lastBodyAnalysis.strengths || []).map((s, i) => (
                          <span key={i} className="px-3 py-1.5 bg-emerald-500/5 text-emerald-500 border border-emerald-500/10 rounded-xl text-xs font-bold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="premium-card p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-rose-500/10 rounded-lg flex items-center justify-center text-rose-500">
                          <AlertCircle size={18} />
                        </div>
                        <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest">Pontos Fracos</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(student.lastBodyAnalysis.weaknesses || []).map((w, i) => (
                          <span key={i} className="px-3 py-1.5 bg-rose-500/5 text-rose-500 border border-rose-500/10 rounded-xl text-xs font-bold">
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="premium-card p-12 text-center border-dashed">
                  <Camera size={48} className="mx-auto text-zinc-800 mb-4" />
                  <p className="text-zinc-500 font-medium">Nenhuma análise corporal realizada ainda.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'treino' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="premium-card p-8 bg-zinc-900/30">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Fase Atual</p>
                      <p className="text-3xl font-black tracking-tighter uppercase">FASE {student.currentPhase}</p>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3].map(p => (
                        <button
                          key={p}
                          onClick={() => handlePhaseChange(p)}
                          className={cn(
                            "w-12 h-12 rounded-2xl font-black transition-all border-2",
                            student.currentPhase === p 
                              ? "bg-indigo-600 border-indigo-500 text-white" 
                              : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Protocolo Ativo</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-black tracking-tight uppercase text-indigo-400">PRAXIS EVOLUTION</p>
                      <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="premium-card p-8 flex flex-col justify-between">
                  <h4 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-4">Divisão Semanal</h4>
                  <div className="space-y-2">
                    {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map(day => (
                      <div key={day} className="flex items-center justify-between py-1 border-b border-zinc-900 last:border-0">
                        <span className="text-[10px] font-black text-zinc-600 uppercase">{day}</span>
                        <span className="text-xs font-bold text-zinc-300">{day === 'Qua' || day === 'Dom' ? 'Descanso' : 'Treino A'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 premium-button py-4 flex items-center justify-center gap-2">
                  <ClipboardList size={20} />
                  Editar Treino Atual
                </button>
                <button className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl py-4 font-bold text-sm hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
                  <Plus size={20} />
                  Novo Protocolo
                </button>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPICard label="Treinos" value="24" color="indigo" icon={Dumbbell} />
                <KPICard label="Freq. Semanal" value="4.2x" color="emerald" icon={Calendar} />
                <KPICard label="Volume" value="12.5t" color="amber" icon={TrendingUp} />
                <KPICard label="Consistência" value="92%" color="emerald" icon={Repeat} />
              </div>
              <div className="premium-card p-8">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Evolução de Carga</h4>
                  <div className="flex items-center gap-2 text-emerald-500">
                    <TrendingUp size={16} />
                    <span className="text-xs font-black uppercase">+12% este mês</span>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { date: 'Sem 1', carga: 40 },
                      { date: 'Sem 2', carga: 45 },
                      { date: 'Sem 3', carga: 42 },
                      { date: 'Sem 4', carga: 50 },
                      { date: 'Sem 5', carga: 55 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="date" stroke="#71717a" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis stroke="#71717a" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="carga" 
                        stroke="#6366f1" 
                        strokeWidth={4} 
                        dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#18181b' }} 
                        activeDot={{ r: 8, fill: '#818cf8' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dados' && (
            <div className="premium-card p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-8">
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Idade</p>
                  <p className="text-xl font-bold">{student.birthDate ? (new Date().getFullYear() - new Date(student.birthDate).getFullYear()) : 'N/A'} anos</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Objetivo</p>
                  <p className="text-xl font-bold">{student.objective}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Tempo de Treino</p>
                  <p className="text-xl font-bold">{student.trainingTime || 0} meses</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Peso Atual</p>
                  <p className="text-xl font-bold">{student.weight || 'N/A'} kg</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Altura</p>
                  <p className="text-xl font-bold">{student.height || 'N/A'} cm</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Gênero</p>
                  <p className="text-xl font-bold">{student.gender}</p>
                </div>
              </div>
              <div className="pt-8 border-t border-zinc-900">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Informações de Contato</p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                    <MessageSquare size={16} className="text-zinc-600" />
                    {student.phone || 'Telefone não informado'}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                    <Target size={16} className="text-zinc-600" />
                    {student.email}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="premium-card p-6">
            <h4 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-6">Ações do Treinador</h4>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => setActiveTab('treino')}
                className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-bold text-sm hover:border-indigo-500 transition-all group"
              >
                <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <ClipboardList size={18} />
                </div>
                Editar Treino
              </button>
              <button 
                onClick={() => setActiveTab('treino')}
                className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-bold text-sm hover:border-indigo-500 transition-all group"
              >
                <div className="w-10 h-10 bg-amber-600/10 rounded-xl flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Zap size={18} />
                </div>
                Alterar Fase
              </button>
              <button 
                onClick={handleSendMessage}
                className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-bold text-sm hover:border-emerald-500 transition-all group"
              >
                <div className="w-10 h-10 bg-emerald-600/10 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <MessageSquare size={18} />
                </div>
                Enviar Mensagem
              </button>
            </div>
          </div>

          <div className="premium-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Observações</h4>
              <span className="px-2 py-0.5 bg-zinc-900 rounded-lg text-[10px] font-black text-zinc-500">{(observations || []).length}</span>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={newObservation}
                  onChange={(e) => setNewObservation(e.target.value)}
                  placeholder="Nova nota sobre o aluno..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm outline-none focus:border-indigo-500 transition-all h-24 resize-none"
                />
                <button 
                  onClick={handleAddObservation}
                  disabled={loading || !newObservation.trim()}
                  className="absolute bottom-3 right-3 w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {(observations || []).length === 0 ? (
                  <div className="py-12 text-center">
                    <Info size={32} className="mx-auto text-zinc-800 mb-2" />
                    <p className="text-xs text-zinc-600 font-medium italic">Nenhuma observação registrada.</p>
                  </div>
                ) : (
                  (observations || []).map(obs => (
                    <div key={obs.id} className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 group">
                      <p className="text-sm text-zinc-300 leading-relaxed">{obs.text}</p>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">
                          {obs.createdAt ? new Date(obs.createdAt).toLocaleDateString('pt-BR') : '--/--/----'}
                        </p>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-rose-500/50 hover:text-rose-500">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
