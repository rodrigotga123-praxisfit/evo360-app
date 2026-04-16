import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { authService } from '../services/authService';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';

interface CadastroProps {
  onSwitch: () => void;
  invitingTrainer?: UserProfile | null;
}

export const Cadastro: React.FC<CadastroProps> = ({ onSwitch, invitingTrainer }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'user' | 'trainer' | null>(invitingTrainer ? 'user' : 'trainer');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [error, setError] = useState('');

  const validate = () => {
    const errors: any = {};
    if (!fullName || fullName.length < 3) errors.fullName = "Nome deve ter pelo menos 3 caracteres";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Email inválido";
    if (!password || password.length < 6) errors.password = "Senha deve ter no mínimo 6 caracteres";
    if (!role) errors.role = "Selecione se você é aluno ou treinador";
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await authService.register(email, password, fullName);
      if (!user) throw new Error("Erro ao criar usuário");
      
      const newProfile: UserProfile = {
        uid: user.id,
        fullName,
        birthDate: '',
        email,
        gender: 'Masculino',
        phone: '',
        cpf: '',
        objective: 'Hipertrofia',
        role: role as any,
        tipo: role === 'trainer' ? 'treinador' : 'aluno',
        xp: 0,
        level: 1,
        onboardingComplete: false,
        currentPhase: 1,
        treinadorId: invitingTrainer?.uid || undefined,
        status: invitingTrainer ? 'active' : undefined
      };
      await setDoc(doc(db, 'users', user.id), newProfile);
    } catch (err: any) {
      setError('Erro ao criar conta. Verifique se o email já está em uso.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 p-6 overflow-y-auto" style={{ overflowY: "auto" }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 py-12"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Comece como Treinador</h1>
          {invitingTrainer ? (
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                {invitingTrainer.bodyPhoto ? (
                  <img src={invitingTrainer.bodyPhoto} alt="" className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon size={24} />
                )}
              </div>
              <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Convite de Aluno</p>
                <p className="text-sm font-bold text-white">Você foi convidado por <span className="text-indigo-400">{invitingTrainer.fullName}</span></p>
              </div>
            </div>
          ) : (
            <p className="text-zinc-500 font-medium">Gerencie seus alunos com inteligência artificial.</p>
          )}
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-4">
            <Input 
              label="Nome Completo" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              placeholder="Seu nome"
              error={fieldErrors.fullName}
            />
            <Input 
              label="Email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="seu@email.com"
              error={fieldErrors.email}
            />
            <Input 
              label="Senha" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Mínimo 6 caracteres"
              error={fieldErrors.password}
            />
            
            <div className="space-y-2">
              <label className={cn(
                "text-xs font-black uppercase tracking-widest ml-1 transition-colors",
                fieldErrors.role ? "text-rose-500" : "text-zinc-500"
              )}>
                Você é:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setRole('user')}
                  className={cn(
                    "py-3 rounded-2xl border-2 font-bold transition-all text-sm",
                    role === 'user' ? "bg-indigo-600/10 border-indigo-500 text-indigo-400" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700",
                    fieldErrors.role && role !== 'user' ? "border-rose-500/50" : ""
                  )}
                >
                  Aluno
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('trainer')}
                  className={cn(
                    "py-3 rounded-2xl border-2 font-bold transition-all text-sm",
                    role === 'trainer' ? "bg-indigo-600/10 border-indigo-500 text-indigo-400" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700",
                    fieldErrors.role && role !== 'trainer' ? "border-rose-500/50" : ""
                  )}
                >
                  Treinador
                </button>
              </div>
              {fieldErrors.role && <p className="text-[10px] font-bold text-rose-500 ml-1 uppercase tracking-widest">{fieldErrors.role}</p>}
            </div>
          </div>

          {error && <p className="text-rose-500 text-xs font-bold text-center">{error}</p>}

          <Button 
            type="submit" 
            loading={loading}
            className="w-full py-4"
          >
            Criar Conta
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-500">
          Já tem uma conta?{' '}
          <button 
            onClick={() => navigate("/login")} 
            className="text-indigo-400 font-bold hover:underline"
          >
            Entrar
          </button>
        </p>
      </motion.div>
    </div>
  );
};
