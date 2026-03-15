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
  isCustom?: boolean; // 커스텀 여부
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
  removeDocument: (id: string) => Promise<void>;
  resetDocuments: () => Promise<void>;
  addCustomDocument: (name: string, category: Document['category']) => Promise<void>;
  deleteCustomDocument: (id: string) => Promise<void>;
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
      if (docSnap.exists() && docSnap.data().items) {
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
      console.error("Firestore loading error:", error);
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

  removeDocument: async (id) => {
    const user = auth.currentUser;
    const updatedDocuments = get().documents.map(doc => 
      doc.id === id ? { ...doc, status: 'Missing' as const, lastUpdated: '' } : doc
    );

    set({ documents: updatedDocuments });

    if (user) {
      try {
        const docRef = doc(db, 'documents', user.uid);
        await setDoc(docRef, { items: updatedDocuments });
      } catch (error) {
        console.error("Error removing document:", error);
      }
    }
  },

  addCustomDocument: async (name, category) => {
    const user = auth.currentUser;
    const newDoc: Document = {
      id: `custom-${Math.random().toString(36).substring(7)}`,
      name: name || '제목 없는 서류',
      category,
      status: 'Missing',
      isEssential: false,
      isCustom: true
    };
    
    const updatedDocuments = [...get().documents, newDoc];
    set({ documents: updatedDocuments });

    if (user) {
      try {
        const docRef = doc(db, 'documents', user.uid);
        await setDoc(docRef, { items: updatedDocuments }, { merge: true });
      } catch (error) {
        console.error("Error adding custom document:", error);
      }
    }
  },

  deleteCustomDocument: async (id) => {
    const user = auth.currentUser;
    const updatedDocuments = get().documents.filter(doc => doc.id !== id);
    set({ documents: updatedDocuments });

    if (user) {
      try {
        const docRef = doc(db, 'documents', user.uid);
        await setDoc(docRef, { items: updatedDocuments });
      } catch (error) {
        console.error("Error deleting custom document:", error);
      }
    }
  },

  resetDocuments: async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (confirm('모든 서류 데이터를 초기화하시겠습니까? 클라우드 데이터가 삭제됩니다.')) {
      set({ documents: defaultDocuments });
      try {
        const docRef = doc(db, 'documents', user.uid);
        await setDoc(docRef, { items: defaultDocuments });
        alert('데이터가 성공적으로 초기화되었습니다.');
      } catch (error) {
        console.error("Error resetting documents:", error);
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
