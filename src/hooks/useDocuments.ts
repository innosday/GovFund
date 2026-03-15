import { create } from 'zustand';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface Document {
  id: string;
  name: string;
  category: 'Company' | 'Financial' | 'Tech' | 'Other';
  status: 'Missing' | 'Expired' | 'Valid';
  expiryDate?: string;
  isEssential: boolean;
  lastUpdated?: string;
}

const defaultDocuments: Document[] = [
  { id: 'doc-1', name: '사업자등록증', category: 'Company', status: 'Missing', isEssential: true },
  { id: 'doc-2', name: '법인인감증명서', category: 'Company', status: 'Missing', isEssential: true },
  { id: 'doc-3', name: '부가가치세과세표준증명', category: 'Financial', status: 'Missing', isEssential: true },
  { id: 'doc-4', name: '재무제표 (최근 3년)', category: 'Financial', status: 'Missing', isEssential: true },
  { id: 'doc-5', name: '특허증/실용신안권', category: 'Tech', status: 'Missing', isEssential: false },
  { id: 'doc-6', name: '고용보험 완납증명서', category: 'Company', status: 'Missing', isEssential: true },
];

interface DocumentsState {
  documents: Document[];
  isLoading: boolean;
  loadDocuments: () => Promise<void>;
  updateDocumentStatus: (id: string, status: Document['status'], date?: string) => Promise<void>;
  getCompletionRate: () => number;
}

export const useDocumentsStore = create<DocumentsState>((set, get) => ({
  documents: defaultDocuments,
  isLoading: false,

  loadDocuments: async () => {
    const user = auth.currentUser;
    if (!user) return;

    set({ isLoading: true });
    try {
      const docRef = doc(db, 'documents', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        set({ documents: docSnap.data().items as Document[] });
      } else {
        try {
          await setDoc(docRef, { items: defaultDocuments });
        } catch (e) {
          console.warn("Could not save initial documents (offline?)", e);
        }
        set({ documents: defaultDocuments });
      }
    } catch (error: any) {
      console.error("Firestore loading error (documents):", error);
      // 에러 발생 시(오프라인 등) 기본 리스트 유지
      set({ documents: defaultDocuments });
    } finally {
      set({ isLoading: false });
    }
  },

  updateDocumentStatus: async (id, status, date) => {
    const user = auth.currentUser;
    const updatedDocuments = get().documents.map(doc => 
      doc.id === id ? { ...doc, status, lastUpdated: date || new Date().toISOString().split('T')[0] } : doc
    );

    // UI 즉시 업데이트 (Optimistic)
    set({ documents: updatedDocuments });

    if (user) {
      try {
        const docRef = doc(db, 'documents', user.uid);
        await setDoc(docRef, { items: updatedDocuments }, { merge: true });
      } catch (error) {
        console.error("Error saving documents:", error);
      }
    }
  },

  getCompletionRate: () => {
    const docs = get().documents;
    const essentialDocs = docs.filter(d => d.isEssential);
    const validEssentialDocs = essentialDocs.filter(d => d.status === 'Valid');
    if (essentialDocs.length === 0) return 0;
    return Math.round((validEssentialDocs.length / essentialDocs.length) * 100);
  }
}));
