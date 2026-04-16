import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, TrainerStudentRelationship } from '../types';

export interface CreateUserParams {
  nome: string;
  email: string;
  tipo: 'aluno' | 'treinador' | 'admin';
  treinador_id: string;
  password?: string;
  birthDate?: string;
  phone?: string;
  protocolo?: string;
}

export interface CreateStudentRelationshipParams {
  usuario_id: string;
  treinador_id: string;
  status: 'ativo' | 'inativo';
}

export async function verificarEmailExistente(email: string): Promise<boolean> {
  const q = query(collection(db, 'users'), where('email', '==', email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

export async function criarUsuario(params: CreateUserParams): Promise<UserProfile> {
  const studentId = doc(collection(db, 'users')).id;
  
  const newUser: UserProfile = {
    uid: studentId,
    fullName: params.nome,
    email: params.email,
    phone: params.phone || '',
    password: params.password || '',
    birthDate: params.birthDate || '',
    gender: 'Masculino',
    cpf: '',
    objective: 'Hipertrofia',
    role: params.tipo === 'aluno' ? 'user' : params.tipo === 'treinador' ? 'trainer' : 'admin',
    tipo: params.tipo,
    xp: 0,
    level: 1,
    onboardingComplete: false,
    currentPhase: 1,
    treinadorId: params.treinador_id,
    protocolo: params.protocolo || '',
    status: 'invited',
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'users', studentId), newUser);
  return newUser;
}

export async function criarAluno(params: CreateStudentRelationshipParams): Promise<TrainerStudentRelationship> {
  const id = doc(collection(db, 'trainer_student_relationships')).id;
  
  const relationship: TrainerStudentRelationship = {
    id,
    userId: params.usuario_id,
    trainerId: params.treinador_id,
    status: params.status,
    createdAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'trainer_student_relationships', id), relationship);
  return relationship;
}

export function temPermissao(usuario: UserProfile, acao: string): boolean {
  const permissoes: Record<string, string[]> = {
    admin: ["tudo"],
    treinador: ["gerenciar_alunos", "financeiro", "treinos"],
    aluno: ["ver_treino", "executar_treino"]
  };

  if (usuario.tipo === 'admin') return true;
  return permissoes[usuario.tipo]?.includes(acao) || false;
}
