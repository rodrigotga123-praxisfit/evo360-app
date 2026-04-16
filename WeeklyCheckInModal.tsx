import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Zap, Heart, Brain, Activity, Send, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';

interface WeeklyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WeeklyCheckInModal: React.FC<WeeklyCheckInModalProps> = ({ isOpen, onClose }) => {
  const { profile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [data, setData] = useState({
    feeling: 'bom' as any,
    energy: 7,
    pain: 2,
    motivation: 8,
    sleepQuality: 7,
    stressLevel: 4,
    notes: ''
  });

  const handleSubmit = async () => {
    if (!profile?.uid) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'weekly_checkins'), {
        ...data,
        userId: profile.uid,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      });
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (error) {
      console.error("Error saving check-in:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-xl bg-zinc-950 border border-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 md:p-12">
          {!success ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter uppercase">Check-in Semanal</h3>
                    <p className="text-sm text-zinc-500 font-medium">Como foi sua semana, {profile?.fullName.split(' ')[0]}?</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-3 hover:bg-zinc-900 rounded-2xl transition-colors text-zinc-500">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8">
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-4">
                      <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Como você se sente hoje?</label>
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          { val: 'exaurido', label: '😫' },
                          { val: 'cansado', label: '😔' },
                          { val: 'regular', label: '😐' },
                          { val: 'bom', label: '🙂' },
                          { val: 'excelente', label: '🔥' }
                        ].map(f => (
                          <button
                            key={f.val}
                            onClick={() => setData({...data, feeling: f.val})}
                            className={cn(
                              "aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all",
                              data.feeling === f.val ? "bg-indigo-600/10 border-indigo-500 text-2xl" : "bg-zinc-900 border-zinc-800 text-xl grayscale opacity-50"
                            )}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      {[
                        { id: 'energy', label: 'Nível de Energia', icon: Zap, color: 'text-amber-400' },
                        { id: 'motivation', label: 'Motivação', icon: Heart, color: 'text-rose-400' },
                        { id: 'sleepQuality', label: 'Qualidade do Sono', icon: Brain, color: 'text-indigo-400' }
                      ].map(item => (
                        <div key={item.id} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <item.icon size={16} className={item.color} />
                              <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">{item.label}</span>
                            </div>
                            <span className="text-xs font-black text-indigo-400">{(data as any)[item.id]}/10</span>
                          </div>
                          <input 
                            type="range" 
                            min="1" 
                            max="10" 
                            value={(data as any)[item.id]}
                            onChange={(e) => setData({...data, [item.id]: parseInt(e.target.value)})}
                            className="w-full h-1.5 bg-zinc-900 rounded-full appearance-none cursor-pointer accent-indigo-500"
                          />
                        </div>
                      ))}
                    </div>

                    <Button variant="primary" className="w-full py-4" onClick={() => setStep(2)}>
                      Próximo Passo
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity size={16} className="text-rose-500" />
                          <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Nível de Dor/Desconforto</span>
                        </div>
                        <span className="text-xs font-black text-rose-500">{data.pain}/10</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="10" 
                        value={data.pain}
                        onChange={(e) => setData({...data, pain: parseInt(e.target.value)})}
                        className="w-full h-1.5 bg-zinc-900 rounded-full appearance-none cursor-pointer accent-rose-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Observações Adicionais</label>
                      <textarea 
                        value={data.notes}
                        onChange={(e) => setData({...data, notes: e.target.value})}
                        placeholder="Algum comentário para seu treinador?"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm outline-none focus:border-indigo-500 transition-all min-h-[120px] resize-none"
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button variant="secondary" className="flex-1 py-4" onClick={() => setStep(1)}>
                        Voltar
                      </Button>
                      <Button 
                        variant="primary" 
                        className="flex-1 py-4" 
                        onClick={handleSubmit}
                        loading={loading}
                      >
                        Enviar Check-in
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="py-12 text-center space-y-6 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center text-emerald-500 mx-auto">
                <CheckCircle2 size={48} />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">Check-in Enviado!</h3>
                <p className="text-zinc-500 font-medium">Sua performance está sendo analisada pela IA.</p>
              </div>
              <div className="p-4 bg-indigo-600/5 border border-indigo-500/10 rounded-2xl">
                <p className="text-xs text-indigo-400 font-bold italic">"Ótimo trabalho! Sua consistência é a chave para o resultado."</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
