import { Activity, Brain, Heart, Zap, Target, Repeat } from 'lucide-react';

export const QUESTIONS = [
  // Ação
  { id: 'q1', text: 'Eu começo meus treinos assim que planejo, sem adiar.', dimension: 'acao' },
  { id: 'q2', text: 'Tenho facilidade em tomar a iniciativa para me exercitar.', dimension: 'acao' },
  { id: 'q3', text: 'Quando decido treinar, nada me impede de começar.', dimension: 'acao' },
  { id: 'q4', text: 'Costumo procrastinar o início da minha rotina de exercícios.', dimension: 'acao', reverse: true },
  { id: 'q5', text: 'Sinto que perco muito tempo pensando antes de começar a treinar.', dimension: 'acao', reverse: true },
  { id: 'q6', text: 'Minha prontidão para agir em relação à saúde é alta.', dimension: 'acao' },

  // Consistência
  { id: 'q7', text: 'Mantenho minha rotina de treinos mesmo em semanas difíceis.', dimension: 'consistencia' },
  { id: 'q8', text: 'Raramente falto aos treinos planejados.', dimension: 'consistencia' },
  { id: 'q9', text: 'A regularidade é um dos meus pontos fortes.', dimension: 'consistencia' },
  { id: 'q10', text: 'Minha frequência de treinos oscila muito dependendo do meu humor.', dimension: 'consistencia', reverse: true },
  { id: 'q11', text: 'Costumo abandonar programas de treino após algumas semanas.', dimension: 'consistencia', reverse: true },
  { id: 'q12', text: 'Consigo manter o foco no longo prazo.', dimension: 'consistencia' },

  // Regulação Emocional
  { id: 'q13', text: 'O exercício me ajuda a controlar meu estresse.', dimension: 'emocional' },
  { id: 'q14', text: 'Sinto que minhas emoções interferem negativamente no meu treino.', dimension: 'emocional', reverse: true },
  { id: 'q15', text: 'Consigo treinar mesmo quando estou triste ou frustrado.', dimension: 'emocional' },
  { id: 'q16', text: 'Uso o treino como uma ferramenta de equilíbrio mental.', dimension: 'emocional' },
  { id: 'q17', text: 'Sinto ansiedade quando penso em treinar.', dimension: 'emocional', reverse: true },
  { id: 'q18', text: 'Minha autoconfiança aumenta após o exercício.', dimension: 'emocional' },

  // Controle Cognitivo
  { id: 'q19', text: 'Planejo meus treinos com antecedência e sigo o plano.', dimension: 'cognitivo' },
  { id: 'q20', text: 'Tenho clareza sobre os exercícios que devo fazer.', dimension: 'cognitivo' },
  { id: 'q21', text: 'Consigo me concentrar totalmente durante a execução dos movimentos.', dimension: 'cognitivo' },
  { id: 'q22', text: 'Me distraio facilmente com o celular ou conversas durante o treino.', dimension: 'cognitivo', reverse: true },
  { id: 'q23', text: 'Entendo a lógica por trás do meu programa de treinamento.', dimension: 'cognitivo' },
  { id: 'q24', text: 'Analiso meu progresso de forma objetiva.', dimension: 'cognitivo' },

  // Motivação
  { id: 'q25', text: 'Sinto prazer genuíno ao me exercitar.', dimension: 'motivacao' },
  { id: 'q26', text: 'Minha motivação para treinar é predominantemente interna.', dimension: 'motivacao' },
  { id: 'q27', text: 'Treino apenas porque me sinto obrigado por outros ou pela estética.', dimension: 'motivacao', reverse: true },
  { id: 'q28', text: 'Vejo o exercício como uma parte essencial da minha identidade.', dimension: 'motivacao' },
  { id: 'q29', text: 'Muitas vezes me sinto desmotivado antes de começar.', dimension: 'motivacao', reverse: true },
  { id: 'q30', text: 'Acredito que os resultados valem o esforço.', dimension: 'motivacao' },

  // Relação com o Treino
  { id: 'q31', text: 'Gosto de aprender novas técnicas e exercícios.', dimension: 'treino' },
  { id: 'q32', text: 'Sinto que o ambiente da academia me motiva.', dimension: 'treino' },
  { id: 'q33', text: 'O treino é o momento mais prazeroso do meu dia.', dimension: 'treino' },
  { id: 'q34', text: 'Acho o treinamento monótono e entediante.', dimension: 'treino', reverse: true },
  { id: 'q35', text: 'Tenho uma boa relação com meu treinador ou parceiros de treino.', dimension: 'treino' },
  { id: 'q36', text: 'Sinto que o treino me desafia na medida certa.', dimension: 'treino' },
  { id: 'q37', text: 'Me sinto exausto mentalmente só de pensar na rotina de treinos.', dimension: 'treino', reverse: true },
  { id: 'q38', text: 'Valorizo a técnica mais do que a carga.', dimension: 'treino' },
];

export const DIMENSIONS = [
  { id: 'acao', label: 'Ação', icon: Zap, color: 'text-amber-500' },
  { id: 'consistencia', label: 'Consistência', icon: Repeat, color: 'text-emerald-500' },
  { id: 'emocional', label: 'Regulação Emocional', icon: Heart, color: 'text-rose-500' },
  { id: 'cognitivo', label: 'Controle Cognitivo', icon: Brain, color: 'text-indigo-500' },
  { id: 'motivacao', label: 'Motivação', icon: Target, color: 'text-orange-500' },
  { id: 'treino', label: 'Relação com Treino', icon: Activity, color: 'text-blue-500' },
];

export const EXERCISE_LIBRARY = [
  {
    id: 'supino_reto',
    nome: 'Supino Reto com Barra',
    categoria: 'Peitoral',
    muscleGroup: 'peito',
    instrucoes: [
      'Deite-se no banco com os pés firmes no chão.',
      'Segure a barra com as mãos um pouco mais largas que os ombros.',
      'Desça a barra lentamente até o meio do peito.',
      'Empurre a barra de volta à posição inicial, estendendo os braços.'
    ],
    dicas: 'Mantenha as escápulas retraídas e não tire os glúteos do banco.',
    videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3ps'
  },
  {
    id: 'agachamento_livre',
    nome: 'Agachamento Livre',
    categoria: 'Pernas',
    muscleGroup: 'pernas',
    instrucoes: [
      'Posicione a barra sobre os trapézios.',
      'Afaste os pés na largura dos ombros.',
      'Desça o quadril como se fosse sentar em uma cadeira.',
      'Mantenha as costas retas e o core ativado.',
      'Suba empurrando pelo calcanhar.'
    ],
    dicas: 'Não deixe os joelhos entrarem (valgo dinâmico) e mantenha o olhar para frente.',
    videoUrl: 'https://www.youtube.com/embed/SW_C1A-rejs'
  },
  {
    id: 'puxada_frente',
    nome: 'Puxada Frente (Pulldown)',
    categoria: 'Costas',
    muscleGroup: 'costas',
    instrucoes: [
      'Sente-se no aparelho e ajuste o suporte das pernas.',
      'Segure a barra com pegada aberta.',
      'Puxe a barra em direção à parte superior do peito.',
      'Retorne lentamente controlando o peso.'
    ],
    dicas: 'Pense em puxar com os cotovelos, não apenas com as mãos.',
    videoUrl: 'https://www.youtube.com/embed/CAwf7n6Luuc'
  },
  {
    id: 'rosca_direta',
    nome: 'Rosca Direta com Barra',
    categoria: 'Bíceps',
    muscleGroup: 'biceps',
    instrucoes: [
      'Fique em pé com os pés na largura dos ombros.',
      'Segure a barra com as palmas voltadas para cima.',
      'Flexione os cotovelos trazendo a barra em direção aos ombros.',
      'Desça lentamente até a posição inicial.'
    ],
    dicas: 'Mantenha os cotovelos fixos ao lado do corpo e evite balançar o tronco.',
    videoUrl: 'https://www.youtube.com/embed/ykJmrZ5v0Oo'
  },
  {
    id: 'elevacao_lateral',
    nome: 'Elevação Lateral',
    categoria: 'Ombros',
    muscleGroup: 'ombro',
    instrucoes: [
      'Segure um halter em cada mão ao lado do corpo.',
      'Eleve os braços lateralmente até a altura dos ombros.',
      'Mantenha uma leve flexão nos cotovelos.',
      'Desça controladamente.'
    ],
    dicas: 'Imagine que está despejando água de uma jarra no topo do movimento.',
    videoUrl: 'https://www.youtube.com/embed/3VcKaXpzqRo'
  },
  {
    id: 'leg_press',
    nome: 'Leg Press 45',
    categoria: 'Pernas',
    muscleGroup: 'pernas',
    instrucoes: [
      'Sente-se no aparelho e apoie os pés na plataforma.',
      'Destrave a plataforma e desça lentamente flexionando os joelhos.',
      'Empurre a plataforma de volta sem estender totalmente os joelhos.',
      'Mantenha o core firme.'
    ],
    dicas: 'Não deixe o quadril sair do banco durante o movimento.',
    videoUrl: 'https://www.youtube.com/embed/IZxyjW7MPJQ'
  },
  {
    id: 'remada_curvada',
    nome: 'Remada Curvada com Barra',
    categoria: 'Costas',
    muscleGroup: 'costas',
    instrucoes: [
      'Incline o tronco para frente mantendo as costas retas.',
      'Segure a barra com as mãos voltadas para baixo.',
      'Puxe a barra em direção ao abdômen.',
      'Retorne lentamente.'
    ],
    dicas: 'Mantenha a coluna neutra e evite usar o impulso das pernas.',
    videoUrl: 'https://www.youtube.com/embed/9efgcAjQW70'
  }
];

export const ROLES = ["admin", "treinador", "aluno"];

export const TRAINER_PLANS = [
  { id: 'free', name: 'Free', studentLimit: 2, price: 0 },
  { id: 'pro', name: 'Pro', studentLimit: 10, price: 97 },
  { id: 'premium', name: 'Premium', studentLimit: 50, price: 197 }
];
