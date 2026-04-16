import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const NovaSenha: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await authService.updatePassword(password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError('Erro ao atualizar senha. O link pode ter expirado.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 p-6 overflow-y-auto" style={{ overflowY: "auto" }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20">
              <ShieldCheck size={40} />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">NOVA SENHA</h1>
          <p className="text-zinc-500 font-medium">Defina sua nova senha de acesso.</p>
        </div>

        {success ? (
          <div className="premium-card p-8 text-center space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight">Senha Atualizada!</h2>
            <p className="text-zinc-500 text-sm">Sua senha foi alterada com sucesso. Você será redirecionado para o login em instantes.</p>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-4">
              <Input 
                label="Nova Senha" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required
              />
              <Input 
                label="Confirmar Nova Senha" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-rose-500 text-xs font-bold text-center">{error}</p>}

            <Button 
              type="submit" 
              loading={loading}
              className="w-full py-4"
            >
              Atualizar Senha
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-zinc-500">
          Lembrou a senha?{' '}
          <button onClick={() => navigate('/login')} className="text-indigo-400 font-bold hover:underline">Voltar para Login</button>
        </p>
      </motion.div>
    </div>
  );
};
