import { create } from 'zustand';
import { generateAIDraft } from '../api/ai';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AIFeedback {
  id: string;
  type: 'Success' | 'Warning' | 'Info';
  message: string;
}

export interface ProposalDoc {
  id: string;
  title: string;
  content: string;
  lastModified: string;
  status: 'Draft' | 'Review' | 'Complete';
}

interface EditorState {
  currentView: 'dashboard' | 'matching' | 'vault' | 'settings' | 'membership' | 'documents_vault';
  documents: ProposalDoc[];
  activeId: string | null;
  isAnalyzing: boolean;
  isLoading: boolean;
  feedbacks: AIFeedback[];
  currentPlan: 'Standard' | 'Pro' | 'Max';
  
  // Actions
  setView: (view: 'dashboard' | 'matching' | 'vault' | 'settings' | 'membership' | 'documents_vault') => void;
  setActiveId: (id: string | null) => void;
  loadProposals: () => Promise<void>;
  addDocument: (title?: string) => string;
  updateActiveContent: (content: string) => Promise<void>;
  updateActiveTitle: (title: string) => Promise<void>;
  completeActiveDocument: () => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  setPlan: (plan: 'Standard' | 'Pro' | 'Max') => void;
  runAIAnalysis: (companyData: any) => Promise<void>;
  autoFillFromVault: (companyData: any) => Promise<void>;
}

const syncToFirestore = async (docs: ProposalDoc[]) => {
  const user = auth.currentUser;
  if (!user) return;
  try {
    const docRef = doc(db, 'proposals', user.uid);
    await setDoc(docRef, { items: docs }, { merge: true });
  } catch (error) {
    console.error("Firestore Sync Error:", error);
  }
};

export const useEditorStore = create<EditorState>((set, get) => ({
  currentView: 'dashboard',
  documents: [],
  activeId: null,
  isAnalyzing: false,
  isLoading: false,
  feedbacks: [],
  currentPlan: 'Pro',

  setView: (view) => set({ currentView: view }),
  setActiveId: (id) => set({ activeId: id, feedbacks: [] }),
  
  loadProposals: async () => {
    const user = auth.currentUser;
    if (!user) return;
    set({ isLoading: true });
    try {
      const docRef = doc(db, 'proposals', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        set({ documents: docSnap.data().items as ProposalDoc[] });
      }
    } catch (error) {
      console.error("Error loading proposals:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addDocument: (title) => {
    const newId = Math.random().toString(36).substring(7);
    const newDoc: ProposalDoc = {
      id: newId,
      title: title || '제목 없는 문서',
      content: '',
      lastModified: new Date().toISOString(),
      status: 'Draft'
    };
    const updatedDocs = [newDoc, ...get().documents];
    set({ documents: updatedDocs, activeId: newId });
    syncToFirestore(updatedDocs);
    return newId;
  },

  updateActiveContent: async (content) => {
    const updatedDocs = get().documents.map(d => 
      d.id === get().activeId ? { ...d, content, lastModified: new Date().toISOString() } : d
    );
    set({ documents: updatedDocs });
    syncToFirestore(updatedDocs);
  },

  updateActiveTitle: async (title) => {
    const updatedDocs = get().documents.map(d => 
      d.id === get().activeId ? { ...d, title, lastModified: new Date().toISOString() } : d
    );
    set({ documents: updatedDocs });
    syncToFirestore(updatedDocs);
  },

  completeActiveDocument: async () => {
    const updatedDocs = get().documents.map(d => 
      d.id === get().activeId ? { ...d, status: 'Complete' as const, lastModified: new Date().toISOString() } : d
    );
    set({ documents: updatedDocs });
    syncToFirestore(updatedDocs);
  },

  deleteDocument: async (id) => {
    const updatedDocs = get().documents.filter(d => d.id !== id);
    const nextActiveId = get().activeId === id ? null : get().activeId;
    set({ documents: updatedDocs, activeId: nextActiveId });
    syncToFirestore(updatedDocs);
  },

  setPlan: (plan) => set({ currentPlan: plan }),
  
  runAIAnalysis: async (companyData) => {
    const { documents, activeId, isAnalyzing } = get();
    const activeDoc = documents.find(d => d.id === activeId);
    if (!activeDoc?.content || isAnalyzing) return;

    set({ isAnalyzing: true });
    
    try {
      const analysisPrompt = `
        다음 사업계획서 초안을 분석하여 합격 확률을 높이기 위한 전략적 피드백 3가지를 주세요.
        내용: ${activeDoc.content.substring(0, 1000)}...
        
        응답 형식 (반드시 지켜주세요):
        [SUCCESS] 완료된 긍정적인 요소 1가지
        [WARNING] 보완이 시급한 위험 요소 1가지
        [INFO] 가점을 받을 수 있는 전략적 팁 1가지
      `;
      
      const rawFeedback = await generateAIDraft(analysisPrompt, companyData);
      const lines = rawFeedback.split('\n');
      const newFeedbacks: AIFeedback[] = lines
        .filter(line => line.includes('[SUCCESS]') || line.includes('[WARNING]') || line.includes('[INFO]'))
        .map((line, index) => {
          if (line.includes('[SUCCESS]')) return { id: `f-${index}`, type: 'Success', message: line.replace('[SUCCESS]', '').trim() };
          if (line.includes('[WARNING]')) return { id: `f-${index}`, type: 'Warning', message: line.replace('[WARNING]', '').trim() };
          return { id: `f-${index}`, type: 'Info', message: line.replace('[INFO]', '').trim() };
        });

      set({ feedbacks: newFeedbacks });
    } catch (error) {
      console.error("AI Analysis Error:", error);
    } finally {
      set({ isAnalyzing: false });
    }
  },

  autoFillFromVault: async (companyData) => {
    const { isAnalyzing } = get();
    if (isAnalyzing) return;

    set({ isAnalyzing: true });
    try {
      const draft = await generateAIDraft("사업계획서 도입부 및 기술성 개요", companyData);
      get().updateActiveContent(draft);
    } catch (error) {
      console.error("Auto Fill Error:", error);
    } finally {
      set({ isAnalyzing: false });
    }
  }
}));
