export interface TrainerFinancialHistory {
  id: string;
  trainerId: string;
  mes: string;
  faturamento: number;
  alunos: number;
  ticketMedio: number;
  createdAt: string;
}

export interface UserAnalysis {
  id: string;
  userId: string;
  aderencia: number;
  risco: number;
  prontidao: number;
  perfil: string;
  createdAt: string;
}

export interface TrainerStudentRelationship {
  id: string;
  userId: string;
  trainerId: string;
  status: 'ativo' | 'inativo';
  createdAt: string;
}

export interface TrainerInvite {
  id: string;
  userId: string;
  inviteCode: string;
  plan: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  birthDate: string;
  email: string;
  password?: string; // Added as per request, though usually handled by Auth
  gender: 'Masculino' | 'Feminino' | 'Outro';
  phone: string;
  cpf: string;
  objective: 'Emagrecimento' | 'Hipertrofia' | 'Recomposição' | 'Performance';
  evoScore?: number;
  userProfile?: string; // e.g. "Executor Oscilador"
  role: 'user' | 'trainer' | 'admin';
  tipo: 'aluno' | 'treinador' | 'admin';
  xp: number;
  level: number;
  badges?: string[];
  achievements?: {
    id: string;
    title: string;
    icon: string;
    unlockedAt: string;
  }[];
  onboardingComplete: boolean;
  scores?: {
    adherence: number;
    risk: number;
    readiness: number;
    evolution: number; // Added
    behavioral: number; // Added
    movement?: number;
    dimensions: {
      acao: number;
      consistencia: number;
      emocional: number;
      cognitivo: number;
      motivacao: number;
      treino: number;
    }
  };
  currentPhase: number;
  stepGoal?: number;
  consecutiveDaysMet?: number;
  iwtPhase?: number;
  trainingTime?: number;
  lastReevaluation?: string;
  height?: number;
  weight?: number;
  bodyPhoto?: string;
  lastBodyAnalysis?: BodyAnalysis;
  treinadorId?: string;
  protocolo?: string; // Added as per request
  inviteCode?: string;
  status?: 'invited' | 'active' | 'inactive';
  plan?: 'free' | 'pro' | 'premium';
  subscriptionStatus?: 'active' | 'past_due' | 'canceled';
  bio?: string;
  instagram?: string;
  createdAt?: string; // Added as per request
}

export interface TrainerPlan {
  id: 'free' | 'pro' | 'premium';
  name: string;
  price: number;
  studentLimit: number;
  features: string[];
}

export const TRAINER_PLANS: TrainerPlan[] = [
  {
    id: 'free',
    name: 'Plano Free',
    price: 0,
    studentLimit: 5,
    features: ['Até 5 alunos', 'Funcionalidades básicas', 'Suporte via comunidade']
  },
  {
    id: 'pro',
    name: 'Plano Pro',
    price: 97,
    studentLimit: 9999,
    features: ['Alunos ilimitados', 'Acesso completo', 'Análise avançada', 'Suporte prioritário']
  },
  {
    id: 'premium',
    name: 'Plano Premium',
    price: 197,
    studentLimit: 9999,
    features: ['Tudo do Pro', 'Branding próprio', 'Recursos avançados', 'Consultoria mensal']
  }
];

export interface BodyAnalysis {
  id?: string;
  userId: string;
  date: string;
  photoUrl: string;
  estimatedBF: number;
  bfClassification: 'baixo' | 'moderado' | 'alto';
  boneStructure: 'pequeno porte' | 'médio' | 'grande porte';
  muscleMass: 'baixa' | 'moderada' | 'boa';
  proportions: {
    upperVsLower: string;
    shoulderWidth: string;
    symmetry: string;
  };
  strengths: string[];
  weaknesses: string[];
  scores?: {
    muscleMass: number;
    proportions: number;
    symmetry: number;
    bfScore: number;
    definition: number;
  };
  createdAt: string;
}

export interface DailyActivity {
  id?: string;
  userId: string;
  date: string;
  steps: number;
  stepGoal: number;
  iwtMinutes: number;
  iwtPhase: number;
  calories: number;
  movementScore: number;
  workoutCompleted: boolean;
  createdAt: string;
}

export interface WeeklyCheckIn {
  id?: string;
  userId: string;
  date: string;
  feeling: 'excelente' | 'bom' | 'regular' | 'cansado' | 'exaurido';
  energy: number; // 1-10
  pain: number; // 1-10
  motivation: number; // 1-10
  sleepQuality: number; // 1-10
  stressLevel: number; // 1-10
  notes?: string;
  aiFeedback?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'workout_reminder' | 'absence_alert' | 'incentive' | 'system';
  read: boolean;
  createdAt: string;
}

export interface CommunityPost {
  id?: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  mediaUrl?: string;
  type: 'workout_complete' | 'achievement' | 'text' | 'photo';
  likes: string[]; // Array of user UIDs
  comments: {
    userId: string;
    userName: string;
    text: string;
    createdAt: string;
  }[];
  createdAt: string;
}

export interface TrainerAlert {
  id?: string;
  studentId: string;
  studentName: string;
  type: 'high_risk' | 'low_adherence' | 'pain_reported';
  message: string;
  resolved: boolean;
  createdAt: string;
}

export interface PhysicalAssessment {
  id?: string;
  userId: string;
  date: string;
  height: number;
  weight: number;
  age: number;
  neck: number;
  shoulder: number;
  chest: number;
  armR: number;
  armL: number;
  forearmR: number;
  forearmL: number;
  waist: number;
  abdomen: number;
  hip: number;
  thighR: number;
  thighL: number;
  calfR: number;
  calfL: number;
  bodyFat?: number;
  asymmetries?: string[];
}

export interface Exercise {
  nome: string;
  series: number;
  repeticoes: number | string;
  descanso: string;
  intensidade: string;
  rpe: number;
  metodo: string;
  gifUrl?: string;
  tip?: string;
  muscleGroup?: 'peito' | 'costas' | 'pernas' | 'ombro' | 'biceps' | 'triceps' | 'core' | 'outros';
}

export interface DayWorkout {
  nome: string;
  exercicios: Exercise[];
  isRest?: boolean;
}

export interface WeeklyPlan {
  id?: string;
  userId: string;
  name: string;
  protocol?: 'PRAXIS LIFT' | 'PRAXIS EVOLUTION' | 'HÍBRIDO';
  days: {
    segunda: DayWorkout;
    terca: DayWorkout;
    quarta: DayWorkout;
    quinta: DayWorkout;
    sexta: DayWorkout;
    sabado: DayWorkout;
    domingo: DayWorkout;
  };
  adjustments: string[];
  createdAt: string;
}

export interface Workout {
  id?: string;
  userId: string;
  name: string;
  exercises: Exercise[];
  completedAt?: string;
  effortFeedback?: number; // 1-10
}

export interface EvolutionEntry {
  id?: string;
  userId: string;
  date: string;
  sleep: number; // 1-10
  stress: number; // 1-10
  fatigue: number; // 1-10
  water: number; // Liters
  foodQuality: number; // 1-10
}

export interface BehavioralData {
  discipline: number;
  routine: number;
  energy: number;
  stress: number;
  consistency: number;
}

export interface AIAnalysis {
  diagnosis: string;
  recommendations: string[];
  riskAlerts: string[];
  score: number;
  profile: string;
}

export interface SetLog {
  carga: number;
  reps: number;
  sensacao?: string;
}

export interface ExerciseLog {
  exerciseName: string;
  sets: SetLog[];
  completed: boolean;
  completedAt?: string;
}

export interface WorkoutLog {
  id?: string;
  userId: string;
  workoutName: string;
  date: string;
  exercises: ExerciseLog[];
  totalDuration?: number;
  completed: boolean;
  createdAt: string;
}

export interface Challenge {
  id?: string;
  trainerId: string;
  name: string;
  duration: string; // e.g. "30 dias"
  rules: string;
  objective: string;
  participants: string[]; // Array of student UIDs
  createdAt: string;
  status: 'active' | 'completed';
}

export interface TrainerObservation {
  id?: string;
  studentId: string;
  trainerId: string;
  text: string;
  createdAt: string;
}

export interface TrainerWorkout {
  id?: string;
  trainerId: string;
  name: string;
  division: string; // e.g. "Push/Pull/Legs"
  days: {
    segunda: DayWorkout;
    terca: DayWorkout;
    quarta: DayWorkout;
    quinta: DayWorkout;
    sexta: DayWorkout;
    sabado: DayWorkout;
    domingo: DayWorkout;
  };
  createdAt: string;
}

export interface FinancialHistoryEntry {
  month: string;
  totalRevenue: number;
  personalRevenue: number;
  consultancyRevenue: number;
  studentCount: number;
  averageTicket: number;
  goal: number;
}

export interface TrainerFinanceData {
  id?: string;
  trainerId: string;
  fixedCosts: {
    rent: number;
    electricity: number;
    water: number;
    internet: number;
    transport: number;
    others: number;
  };
  hourlyRateGoal: number;
  monthlyGoal: number;
  consultancy: {
    currentPrice: number;
    studentCount: number;
  };
  capacity: {
    maxConsultingStudents: number;
    maxPersonalSessions: number;
  };
  history?: FinancialHistoryEntry[];
  aiInsights?: {
    analysis: string;
    recommendations: string[];
    priceSuggestions: {
      service: string;
      current: number;
      suggested: number;
      reason: string;
    }[];
  };
  updatedAt: string;
}
