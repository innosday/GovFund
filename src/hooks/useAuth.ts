import { create } from 'zustand';
import { type User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },
}));

// 초기화 시 사용자 인증 상태 추적
onAuthStateChanged(auth, (user) => {
  useAuth.getState().setUser(user);
});
