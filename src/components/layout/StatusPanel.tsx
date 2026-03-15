import React from 'react';
import { useDocumentsStore } from '../../hooks/useDocuments';
import { useEditorStore } from '../../hooks/useEditor';

const StatusPanel: React.FC = () => {
  const { documents, getCompletionRate, updateDocumentStatus } = useDocumentsStore();
  const { activeId, completeActiveDocument, setView } = useEditorStore();
  const [isLaunching, setIsLaunching] = React.useState(false);
  
  const completionRate = getCompletionRate();
  const isAllEssentialValid = completionRate === 100;

  const handleLaunch = async () => {
    if (!isAllEssentialValid || isLaunching) return;
    
    setIsLaunching(true);
    
    // 발사 시퀀스 시뮬레이션 (3초)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    if (activeId) {
      await completeActiveDocument();
    }
    
    setIsLaunching(false);
    alert('🚀 미션 성공! 지원서가 정부 서버로 안전하게 발사되었습니다.');
    setView('dashboard'); // 대시보드로 이동하여 성공 확인
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 업로드 성공 시뮬레이션: 상태를 Valid로 변경하고 오늘 날짜로 업데이트
      const today = new Date().toISOString().split('T')[0];
      await updateDocumentStatus(docId, 'Valid', today);
      console.log(`${file.name} uploaded and synced to Firestore.`);
    }
  };

  return (
    <div className="p-8 space-y-10 flex flex-col h-full bg-white dark:bg-slate-900">
      <header>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">제출 준비 현황</h2>
          <span className="text-primary font-black text-2xl">{completionRate}%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-1000 ease-out shadow-lg shadow-primary/30" 
            style={{ width: `${completionRate}%` }} 
          />
        </div>
      </header>

      {/* 필수 서류 체크리스트 */}
      <section className="flex-1 space-y-8">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">필수 서류 체크리스트</h3>
        <div className="space-y-2">
          {documents.filter(doc => doc.isEssential).map((doc) => (
            <label 
              key={doc.id} 
              className="flex items-start gap-4 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-3 -mx-3 rounded-2xl transition-colors relative"
            >
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileUpload(e, doc.id)} 
              />
              <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                doc.status === 'Valid' 
                  ? 'bg-primary border-primary text-white' 
                  : doc.status === 'Expired'
                  ? 'border-accent text-accent'
                  : 'border-slate-200 dark:border-slate-700 text-transparent group-hover:border-primary/50'
              }`}>
                <span className="material-symbols-outlined text-[14px]">
                  {doc.status === 'Valid' ? 'check' : doc.status === 'Expired' ? 'warning' : 'upload'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className={`text-sm font-black transition-colors ${
                    doc.status === 'Valid' ? 'text-slate-900 dark:text-white' : 'text-slate-500 group-hover:text-primary'
                  }`}>
                    {doc.name}
                  </p>
                  {doc.status !== 'Valid' && (
                    <span className="text-[10px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      업로드
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-1">
                  {doc.status === 'Valid' ? `최종 업데이트: ${doc.lastUpdated}` : doc.status === 'Expired' ? '유효기간 만료 (재업로드 필요)' : '클릭하여 서류 업로드'}
                </p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* 최종 제출 버튼 (Action Zone) */}
      <footer className="pt-8 border-t border-slate-100 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] mb-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">전략 사령부 지시</p>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-300 leading-relaxed">
            {isAllEssentialValid 
              ? "모든 필수 서류가 준비되었습니다. 이제 지원 사격을 개시할 수 있습니다." 
              : "필수 서류 중 누락되었거나 만료된 항목이 있습니다. 서류를 클릭하여 업로드해주세요."}
          </p>
        </div>
        
        <button 
          onClick={handleLaunch}
          disabled={!isAllEssentialValid || isLaunching}
          className={`w-full py-6 rounded-[24px] font-black text-sm flex items-center justify-center gap-3 transition-all ${
            isAllEssentialValid && !isLaunching
              ? 'bg-accent text-white hover:scale-[1.02] shadow-xl shadow-accent/20 cursor-pointer' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-50'
          }`}
        >
          <span className={`material-symbols-outlined ${isLaunching ? 'animate-bounce' : ''}`}>
            {isLaunching ? 'rocket' : 'rocket_launch'}
          </span>
          {isLaunching ? '지원서 발사 중...' : '최종 지원서 발사 (Submit)'}
        </button>
      </footer>
    </div>
  );
};

export default StatusPanel;
