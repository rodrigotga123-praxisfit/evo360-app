import React from 'react';
import { ClipboardList, Brain, Target } from 'lucide-react';
import { Card } from '../components/Card';

export const Avaliacao: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase text-white">Avaliações e Diagnósticos</h2>
          <p className="text-zinc-500 font-medium">Gerencie as avaliações físicas e comportamentais de seus alunos.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 space-y-4 border-indigo-500/20 bg-indigo-600/5">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
            <Brain size={24} />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight text-white">Diagnóstico EVO 360</h3>
          <p className="text-zinc-500 text-sm">Análise completa do perfil comportamental e prontidão do aluno.</p>
          <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all">
            Iniciar Novo
          </button>
        </Card>

        <Card className="p-8 space-y-4">
          <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-400">
            <ClipboardList size={24} />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight text-white">Avaliação Antropométrica</h3>
          <p className="text-zinc-500 text-sm">Registro de dobras cutâneas, perímetros e composição corporal.</p>
          <button className="w-full py-3 bg-zinc-900 border border-zinc-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all">
            Registrar Dados
          </button>
        </Card>

        <Card className="p-8 space-y-4">
          <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-400">
            <Target size={24} />
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight text-white">Testes de Carga</h3>
          <p className="text-zinc-500 text-sm">Acompanhamento de 1RM e evolução de força nos exercícios base.</p>
          <button className="w-full py-3 bg-zinc-900 border border-zinc-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all">
            Ver Histórico
          </button>
        </Card>
      </div>

      <div className="premium-card p-8">
        <h4 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-6">Avaliações Recentes</h4>
        <div className="text-center py-12">
          <p className="text-zinc-600 italic">Nenhuma avaliação pendente no momento.</p>
        </div>
      </div>
    </div>
  );
};
