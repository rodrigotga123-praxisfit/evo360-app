import React, { Component, ReactNode, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { DashboardTreinador } from './pages/DashboardTreinador';
import { DashboardAluno } from './pages/DashboardAluno';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { NovaSenha } from './pages/NovaSenha';
import { Biblioteca } from './pages/Biblioteca';
import { Avaliacao } from './pages/Avaliacao';

class ErrorBoundary extends Component<any, any> {
  state: any;
  props: any;
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ERRO DETALHADO:", error);
    console.error("STACK:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
          <div className="space-y-4">
            <h1 className="text-rose-500 text-2xl font-black uppercase tracking-tighter">Erro no app</h1>
            <p className="text-zinc-500 text-sm">Ocorreu um erro inesperado. Tente recarregar a página.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all"
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    window.onerror = function(message, source, lineno, colno, error) {
      console.error("Erro global:", message, source, lineno, colno, error);
    };
  }, []);

  // Controle de Loading Global
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 font-black uppercase tracking-widest animate-pulse">Carregando autenticação...</p>
        </div>
      </div>
    );
  }

  const isTrainer = profile?.role === 'trainer' || profile?.tipo === 'treinador';

  return (
    <ErrorBoundary>
      <Routes>
        {!user ? (
          <>
            <Route path="/login" element={<Login onSwitch={() => {}} />} />
            <Route path="/register" element={<Cadastro onSwitch={() => {}} />} />
            <Route path="/nova-senha" element={<NovaSenha />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route 
              path="/dashboard/*" 
              element={isTrainer ? <DashboardTreinador /> : <DashboardAluno />} 
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </ErrorBoundary>
  );
}
