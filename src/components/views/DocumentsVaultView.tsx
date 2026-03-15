import React, { useState } from 'react';
import { useDocumentsStore } from '../../hooks/useDocuments';
import type { Document } from '../../hooks/useDocuments';
import { useEditorStore } from '../../hooks/useEditor';

const DocumentsVaultView: React.FC = () => {
  const { documents, updateDocumentStatus, removeDocument, resetDocuments, addCustomDocument, deleteCustomDocument } = useDocumentsStore();
  const { setView } = useEditorStore();

  const [addingToCategory, setAddingToCategory] = useState<Document['category'] | null>(null);
  const [newDocName, setNewDocName] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const today = new Date().toISOString().split('T')[0];
      await updateDocumentStatus(docId, 'Valid', today);
    }
  };

  const submitNewDocument = async () => {
    if (newDocName.trim() && addingToCategory) {
      await addCustomDocument(newDocName.trim(), addingToCategory);
      setNewDocName('');
      setAddingToCategory(null);
    }
  };

  const categories: Document['category'][] = ['Company', 'Financial', 'Tech', 'Other'];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 font-black">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setView('dashboard')}
            className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/50 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-950 dark:text-white mb-1">기업 문서 금고</h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm text-primary">모든 법인 서류 통합 관제 시스템</p>
          </div>
        </div>
      </header>

      {categories.map((category) => (
        <section key={category} className="space-y-6">
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-3 ml-2">
            <div className="w-2 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(26,115,232,0.5)]" />
            {category === 'Company' ? '기업 일반' : 
             category === 'Financial' ? '재무/세무' : 
             category === 'Tech' ? '기술/특허' : '기타 서류'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 기존 서류 카드들 */}
            {documents.filter(d => d.category === category).map((doc) => (
              <div 
                key={doc.id}
                className="bg-white dark:bg-slate-900 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 p-8 hover:border-primary/50 hover:shadow-xl transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    doc.status === 'Valid' ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    <span className="material-symbols-outlined text-2xl font-black">
                      {doc.category === 'Financial' ? 'account_balance' : 
                       doc.category === 'Tech' ? 'military_tech' : 'article'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      doc.status === 'Valid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {doc.status}
                    </span>
                    <button 
                      onClick={() => {
                        if (confirm(doc.isCustom ? '서류 항목을 완전히 삭제하시겠습니까?' : '서류 상태를 초기화하시겠습니까?')) {
                          doc.isCustom ? deleteCustomDocument(doc.id) : removeDocument(doc.id);
                        }
                      }}
                      className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-sm">{doc.isCustom ? 'close' : 'delete'}</span>
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{doc.name}</h3>
                <p className="text-xs font-bold text-slate-400 mb-8">
                  {doc.status === 'Valid' ? `최종 업데이트: ${doc.lastUpdated}` : '서류를 업로드해주세요'}
                </p>

                <label className="block w-full">
                  <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, doc.id)} />
                  <div className={`w-full py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    doc.status === 'Valid' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600' : 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02]'
                  }`}>
                    <span className="material-symbols-outlined text-sm">{doc.status === 'Valid' ? 'refresh' : 'upload'}</span>
                    {doc.status === 'Valid' ? '서류 갱신하기' : '파일 업로드'}
                  </div>
                </label>
              </div>
            ))}

            {/* 새로운 서류 추가 인라인 폼 카드 */}
            {addingToCategory === category ? (
              <div className="bg-primary/5 rounded-[32px] border-2 border-primary p-8 animate-in zoom-in-95 duration-300">
                <h3 className="text-sm font-black text-primary mb-4 uppercase tracking-widest">신규 서류 정의</h3>
                <input 
                  autoFocus
                  type="text" 
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitNewDocument()}
                  placeholder="서류 이름 입력..."
                  className="w-full bg-white dark:bg-slate-800 p-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary mb-6 font-bold text-sm text-slate-900 dark:text-white"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={submitNewDocument}
                    className="flex-1 py-3 bg-primary text-white rounded-xl text-xs font-black hover:bg-primary-dark transition-colors"
                  >
                    항목 추가
                  </button>
                  <button 
                    onClick={() => { setAddingToCategory(null); setNewDocName(''); }}
                    className="px-4 py-3 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-xl text-xs font-black hover:bg-slate-300 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => setAddingToCategory(category)}
                className="group h-[240px] rounded-[32px] border-4 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <span className="material-symbols-outlined text-2xl font-black">add</span>
                </div>
                <p className="text-xs font-black text-slate-400 group-hover:text-primary transition-colors">새로운 서류 항목 추가</p>
              </div>
            )}
          </div>
        </section>
      ))}

      <footer className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Management</p>
        <button onClick={resetDocuments} className="text-xs font-black text-slate-400 hover:text-red-500 transition-colors underline underline-offset-4">
          클라우드 서류 데이터 강제 초기화
        </button>
      </footer>
    </div>
  );
};

export default DocumentsVaultView;
