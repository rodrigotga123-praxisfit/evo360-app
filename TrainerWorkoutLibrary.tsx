import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Plus, X, ClipboardList } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { TrainerWorkout, DayWorkout } from '../types';
import { Input } from './Input';
import { Button } from './Button';
import { handleFirestoreError, OperationType } from '../lib/error-handling';

export const TrainerWorkoutLibrary: React.FC<{ trainerId: string }> = ({ trainerId }) => {
  const [workouts, setWorkouts] = useState<TrainerWorkout[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [division, setDivision] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'trainer_workouts'), where('trainerId', '==', trainerId), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setWorkouts(snap.docs.map(d => ({ id: d.id, ...d.data() } as TrainerWorkout)));
      setLoading(false);
    }, async (error) => await handleFirestoreError(error, OperationType.LIST, 'trainer_workouts'));
    return () => unsubscribe();
  }, [trainerId]);

  const handleCreateWorkout = async () => {
    if (!name || !division) return;
    setSubmitting(true);
    try {
      const emptyDay = { nome: '', exercicios: [], isRest: true };
      await addDoc(collection(db, 'trainer_workouts'), {
        trainerId,
        name,
        division,
        days: {
          segunda: { ...emptyDay, nome: 'Treino A', isRest: false },
          terca: { ...emptyDay, nome: 'Treino B', isRest: false },
          quarta: { ...emptyDay, isRest: true },
          quinta: { ...emptyDay, nome: 'Treino C', isRest: false },
          sexta: { ...emptyDay, nome: 'Treino D', isRest: false },
          sabado: { ...emptyDay, isRest: true },
          domingo: { ...emptyDay, isRest: true },
        },
        createdAt: new Date().toISOString()
      });
      setIsModalOpen(false);
      setName('');
      setDivision('');
    } catch (error) {
      await handleFirestoreError(error, OperationType.CREATE, 'trainer_workouts');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este treino?')) return;
    try {
      alert('Funcionalidade de exclusão em desenvolvimento.');
    } catch (error) {
      await handleFirestoreError(error, OperationType.DELETE, `trainer_workouts/${id}`);
    }
  };

  if (!workouts) {
    return <div style={{color: "white"}}>Carregando...</div>;
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-black tracking-tighter uppercase">Biblioteca de Treinos ({(workouts || []).length})</h3>
          <p className="text-zinc-500 font-medium">Crie e gerencie protocolos profissionais para seus alunos.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-8 py-4"
        >
          <Plus size={20} />
          <span>Novo Treino</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(workouts || []).length === 0 ? (
          <div className="col-span-full py-32 text-center premium-card border-dashed border-2">
            <Dumbbell size={64} className="mx-auto text-zinc-800 mb-6" />
            <p className="text-zinc-500 font-black uppercase tracking-widest">Nenhum treino criado ainda.</p>
            <p className="text-zinc-600 text-sm mt-2">Comece criando seu primeiro protocolo profissional.</p>
          </div>
        ) : (
          (workouts || []).map(workout => (
            <div key={workout.id} className="premium-card p-8 flex flex-col justify-between group hover:border-indigo-500/50 transition-all">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400">
                    <Dumbbell size={24} />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors">
                      <ClipboardList size={18} />
                    </button>
                    <button onClick={() => handleDelete(workout.id!)} className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-rose-500 transition-colors">
                      <X size={18} />
                    </button>
                  </div>
                </div>
                <h4 className="text-xl font-black tracking-tight uppercase mb-1">{workout.name}</h4>
                <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6">{workout.division}</p>
                <div className="space-y-3">
                  {Object.entries((workout.days || {}) as Record<string, DayWorkout>).filter(([_, d]) => d && !d.isRest).map(([day, d]) => (
                    <div key={day} className="flex items-center justify-between text-sm py-2 border-b border-zinc-900 last:border-0">
                      <span className="text-zinc-500 font-black uppercase text-[10px] tracking-widest">{day}</span>
                      <span className="font-bold text-zinc-300">{(d.exercicios || []).length} exercícios</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="mt-8 w-full py-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-black text-xs uppercase tracking-widest text-zinc-500 hover:text-white hover:border-indigo-500 transition-all">
                Visualizar Detalhes
              </button>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-zinc-950 border border-zinc-800 rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl"
          >
            <div className="p-10 border-b border-zinc-900 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black tracking-tighter uppercase">Novo Protocolo</h3>
                <p className="text-zinc-500 text-sm font-medium">Defina a estrutura base do treinamento.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-zinc-900 rounded-2xl transition-all">
                <X size={24} />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <div className="space-y-6">
                <Input 
                  label="Nome do Protocolo" 
                  placeholder="Ex: Hipertrofia Avançada A/B" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input 
                  label="Divisão" 
                  placeholder="Ex: Push / Pull / Legs" 
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-5 bg-zinc-900 border border-zinc-800 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all"
                >
                  Cancelar
                </button>
                <Button 
                  onClick={handleCreateWorkout}
                  loading={submitting}
                  disabled={!name || !division}
                  className="flex-1 py-5"
                >
                  Criar Estrutura
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
