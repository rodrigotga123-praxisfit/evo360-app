import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';
import { supabase } from '../supabase';

export const alunoService = {
  async getAlunos(trainerId: string, callback: (alunos: UserProfile[]) => void) {
    const q = query(collection(db, 'users'), where('treinadorId', '==', trainerId));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => d.data() as UserProfile));
    });
  },

  async createAluno(alunoData: Partial<UserProfile>) {
    if (!alunoData.uid) throw new Error("UID is required");
    const docRef = doc(db, 'users', alunoData.uid);
    await setDoc(docRef, alunoData);
    return alunoData;
  },

  async updateAluno(uid: string, data: Partial<UserProfile>) {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, data);
  },

  async fetchAlunosFromApi() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    try {
      const token = session.access_token;
      const response = await fetch("/api/alunos", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error("Error fetching students from API:", error);
    }
    return null;
  }
};

export const fetchAlunos = alunoService.fetchAlunosFromApi;
