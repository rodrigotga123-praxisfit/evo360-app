import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase';

export const treinoService = {
  async getWorkouts(trainerId: string, callback: (workouts: any[]) => void) {
    const q = query(collection(db, 'workouts'), where('trainerId', '==', trainerId));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  },

  async createWorkout(workoutData: any) {
    const docRef = await addDoc(collection(db, 'workouts'), workoutData);
    return { id: docRef.id, ...workoutData };
  },

  async updateWorkout(workoutId: string, data: any) {
    const docRef = doc(db, 'workouts', workoutId);
    await updateDoc(docRef, data);
  },

  async deleteWorkout(workoutId: string) {
    const docRef = doc(db, 'workouts', workoutId);
    await deleteDoc(docRef);
  },

  async assignWorkoutToStudent(studentId: string, workoutId: string) {
    const studentRef = doc(db, 'users', studentId);
    await updateDoc(studentRef, { currentWorkoutId: workoutId });
  }
};
