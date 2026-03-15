import React from 'react';
import { useEditorStore } from '../../hooks/useEditor';
import { useCompanyStore } from '../../hooks/useCompany';

const VaultView: React.FC = () => {
  const { 
    documents, activeId, setActiveId, addDocument, deleteDocument,
    updateActiveContent, updateActiveTitle,
    isAnalyzing, feedbacks, runAIAnalysis, autoFillFromVault 
  } = useEditorStore();
  const { profile } = useCompanyStore();
  
  const activeDoc = documents.find(d => d.id === activeId) || null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  // --- 1. 문서 사령부 (List View) ---
  if (!activeId) {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-950 dark:text-white mb-2 text-primary">문서 사령부</h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold">진행 중인 모든 전략 프로젝트를 관리합니다.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 신규 생성 카드 (첫 번째 아이템) */}
          <div 
            onClick={() => addDocument('새로운 전략 프로젝트')}
            className="group h-[280px] rounded-[40px] border-4 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-500"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-3xl">add</span>
            </div>
            <p className="text-sm font-black text-slate-400 group-hover:text-primary transition-colors">새로운 전략 초기화</p>
          </div>

          {/* 기존 문서 카드들 */}
          {documents.map((doc) => (
            <div 
              key={doc.id}
              onClick={() => setActiveId(doc.id)}
              className="group h-[280px] bg-white dark:bg-slate-900 rounded-[40px] border-2 border-slate-100 dark:border-slate-800 p-8 flex flex-col justify-between cursor-pointer hover:border-primary/50 hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
            >
              {/* 카드 상단 데코 */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-150" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">article</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteDocument(doc.id); }}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {doc.title}
                </h3>
              </div>

              <div className="flex justify-between items-end relative z-10">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">상태</p>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase">
                    {doc.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">최종 수정</p>
                  <p className="text-[11px] font-bold text-slate-500">{formatDate(doc.lastModified)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- 2. 전술 에디터 (Edit View) ---
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 animate-in zoom-in-95 duration-500">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveId(null)}
            className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/50 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <input 
              type="text" 
              value={activeDoc?.title || ''}
              onChange={(e) => updateActiveTitle(e.target.value)}
              className="bg-transparent text-3xl font-black text-slate-950 dark:text-white outline-none focus:ring-0"
              placeholder="프로젝트 제목"
            />
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Editing Mode</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => autoFillFromVault(profile)}
            disabled={isAnalyzing}
            className="px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-xs flex items-center gap-2 hover:bg-slate-200 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">magic_button</span>
            AI 초안 생성
          </button>
          <button 
            onClick={() => runAIAnalysis(profile)}
            disabled={isAnalyzing}
            className="px-8 py-3 rounded-2xl bg-primary text-white font-black text-xs flex items-center gap-2 hover:scale-[1.02] shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">bolt</span>
            {isAnalyzing ? '전략 분석 중...' : 'AI 전략 진단'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* Editor Center */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-[48px] border-2 border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden flex flex-col transition-all duration-700">
          {/* Header Bar */}
          <div className="h-14 border-b border-slate-50 dark:border-slate-800 flex items-center px-8 justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex gap-6 text-slate-400">
              <span className="material-symbols-outlined text-xl cursor-pointer hover:text-primary transition-colors">format_bold</span>
              <span className="material-symbols-outlined text-xl cursor-pointer hover:text-primary transition-colors">format_italic</span>
              <span className="material-symbols-outlined text-xl cursor-pointer hover:text-primary transition-colors">format_list_bulleted</span>
              <div className="w-[1px] h-5 bg-slate-200 dark:bg-slate-800" />
              <span className="material-symbols-outlined text-xl cursor-pointer hover:text-primary transition-colors">attach_file</span>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Words: {activeDoc?.content.length || 0}</span>
          </div>
          
          <textarea 
            value={activeDoc?.content || ''}
            onChange={(e) => updateActiveContent(e.target.value)}
            className="flex-1 w-full p-12 bg-transparent text-slate-700 dark:text-slate-300 font-bold leading-relaxed resize-none outline-none control-tower-scrollbar text-lg"
            placeholder="사업계획서 내용을 작성하세요. 상단의 'AI 초안 생성'을 누르면 자동으로 작성을 시작합니다."
          />

          {isAnalyzing && (
            <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center gap-6">
              <div className="w-20 h-20 border-8 border-primary border-t-transparent rounded-full animate-spin shadow-2xl" />
              <p className="text-xl font-black text-primary animate-pulse tracking-tight">AI가 승리 전략을 분석 중입니다...</p>
            </div>
          )}
        </div>

        {/* AI Strategic Intelligence Panel (Right) */}
        <aside className="w-96 flex flex-col animate-in slide-in-from-right-8 duration-700">
          <div className="flex-1 bg-slate-950 p-8 rounded-[48px] text-white space-y-8 overflow-y-auto control-tower-scrollbar shadow-2xl border-4 border-slate-900">
            <header className="flex items-center gap-4 border-b border-white/10 pb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">psychology</span>
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary">Strategic Guide</h3>
            </header>
            
            {feedbacks.length === 0 && !isAnalyzing && (
              <div className="py-24 text-center space-y-6 opacity-30">
                <span className="material-symbols-outlined text-6xl">analytics</span>
                <p className="text-xs font-black leading-relaxed">
                  진단 버튼을 누르면 AI가<br />
                  현재 문서의 합격 확률을 분석하고<br />
                  가점 획득을 위한 전략을 제시합니다.
                </p>
              </div>
            )}

            <div className="space-y-6">
              {feedbacks.map((f) => (
                <div key={f.id} className={`p-6 rounded-3xl border-l-8 transition-all hover:bg-white/5 animate-in fade-in slide-in-from-right-4 duration-500 ${
                  f.type === 'Success' ? 'border-primary bg-primary/10' :
                  f.type === 'Warning' ? 'border-accent bg-accent/10' :
                  'border-slate-600 bg-slate-800'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                      f.type === 'Success' ? 'bg-primary text-white' :
                      f.type === 'Warning' ? 'bg-accent text-white' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {f.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[13px] font-bold leading-relaxed">{f.message}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default VaultView;
