import { create } from 'zustand';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface CompanyProfile {
  name: string;
  establishmentDate: string; // YYYY-MM-DD
  industry: 'Software' | 'Manufacturing' | 'Bio' | 'Energy' | 'Other';
  revenue: number; // 단위: 억원
  employees: number;
  rndInvestment: number; // R&D 투자 비중 (%)
  patents: number; // 특허 보유 수
  hasVentureCert: boolean; // 벤처기업 인증 여부
  hasInnoBizCert: boolean; // 이노비즈 인증 여부
}

const defaultProfile: CompanyProfile = {
  name: '데모 테크놀로지',
  establishmentDate: '2023-05-10',
  industry: 'Software',
  revenue: 5,
  employees: 12,
  rndInvestment: 15,
  patents: 3,
  hasVentureCert: true,
  hasInnoBizCert: false,
};

interface CompanyState {
  profile: CompanyProfile;
  isAnalyzing: boolean;
  isLoading: boolean;
  loadProfile: () => Promise<void>;
  updateProfile: (profile: Partial<CompanyProfile>) => Promise<void>;
  calculateSuccessScore: (grantRequirements: any) => number;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  profile: defaultProfile,
  isAnalyzing: false,
  isLoading: false,
  
  loadProfile: async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    set({ isLoading: true });
    try {
      const docRef = doc(db, 'companies', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        set({ profile: docSnap.data() as CompanyProfile });
      } else {
        // 첫 로그인 시 기본 프로필 저장 시도 (실패해도 앱은 계속 작동)
        try {
          await setDoc(docRef, defaultProfile);
        } catch (e) {
          console.warn("Could not save initial profile (offline?)", e);
        }
        set({ profile: defaultProfile });
      }
    } catch (error: any) {
      console.error("Firestore loading error:", error);
      // 오프라인이거나 에러 발생 시 기본값 유지
      if (error.code === 'unavailable' || error.message.includes('offline')) {
        console.log("Running in offline mode with default/cached data.");
      }
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (newProfile) => {
    const user = auth.currentUser;
    const updatedProfile = { ...get().profile, ...newProfile };
    
    // UI 즉시 업데이트 (Optimistic Update)
    set({ profile: updatedProfile });
    
    if (user) {
      try {
        const docRef = doc(db, 'companies', user.uid);
        await setDoc(docRef, updatedProfile, { merge: true });
      } catch (error) {
        console.error("Error saving company profile:", error);
      }
    }
  },

  calculateSuccessScore: (_grantRequirements) => {
    const { profile } = get();
    let score = 70;
    if (profile.hasVentureCert) score += 10;
    if (profile.patents > 2) score += 5;
    if (profile.rndInvestment > 10) score += 5;
    return Math.min(score, 99);
  }
}));
