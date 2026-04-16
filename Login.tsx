import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

interface LoginProps {
  onSwitch: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSwitch }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await authService.login(email, password);
    } catch (err: any) {
      setError('Email ou senha inválidos.');
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Por favor, digite seu email primeiro.');
      return;
    }
    setResetLoading(true);
    setError('');
    setSuccess('');
    try {
      await authService.resetPassword(email);
      setSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (err: any) {
      setError('Erro ao enviar email de recuperação.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authService.googleLogin();
    } catch (err: any) {
      setError('Erro ao entrar com Google.');
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
          <h1 className="text-4xl font-black text-white tracking-tighter">EVO 360</h1>
          <p className="text-zinc-500 font-medium">A plataforma definitiva para treinadores de elite.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-4">
            <Input 
              label="Email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="seu@email.com"
              required
            />
            <Input 
              label="Senha" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-rose-500 text-xs font-bold text-center">{error}</p>}
          {success && <p className="text-emerald-500 text-xs font-bold text-center">{success}</p>}

          <div className="flex flex-col gap-4">
            <Button 
              type="submit" 
              loading={loading}
              className="w-full py-4"
            >
              Entrar
            </Button>

            <button 
              type="button"
              onClick={handleResetPassword}
              disabled={resetLoading}
              className="text-xs font-black text-zinc-500 uppercase tracking-widest hover:text-indigo-400 transition-colors disabled:opacity-50"
            >
              {resetLoading ? 'Enviando...' : 'Esqueci minha senha'}
            </button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-950 px-2 text-zinc-500 font-black tracking-widest">Ou continue com</span></div>
        </div>

        <Button 
          onClick={handleGoogleLogin} 
          variant="secondary"
          className="w-full flex items-center justify-center gap-3 py-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </Button>

        <p className="text-center text-sm text-zinc-500">
          Não tem uma conta?{' '}
          <button 
            onClick={() => {
              console.log("Ir para cadastro");
              navigate("/register");
            }} 
            className="text-indigo-400 font-bold hover:underline"
          >
            Criar conta
          </button>
        </p>
      </motion.div>
    </div>
  );
};
