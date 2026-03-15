import React from 'react';
import { useCompanyStore } from '../../hooks/useCompany';
import { useDocumentsStore } from '../../hooks/useDocuments';
import { useEditorStore } from '../../hooks/useEditor';

const DashboardView: React.FC = () => {
  const { profile } = useCompanyStore();
  const { getCompletionRate } = useDocumentsStore();
  const { documents, activeId, setView } = useEditorStore();
  
  // 활성화된 문서 제목 가져오기
  const activeProposal = documents.find(d => d.id === activeId)?.title || '진행 중인 프로젝트 없음';
  const completionRate = getCompletionRate();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* 1. Top Section: Strategic Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-primary dark:bg-slate-950 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl transition-colors duration-500">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          
          <div className="relative z-10 space-y-8">
            <header className="flex justify-between items-start">
              <div>
                <h2 className="text-sm font-black text-white/60 uppercase tracking-[0.3em] mb-2">Company Strategic Health</h2>
                <h1 className="text-4xl font-black">{profile.name}</h1>
              </div>
              <div className="bg-white/20 text-white border border-white/30 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                Operational Status: Ready
              </div>
            </header>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <div>
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Success Probability</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">84</span>
                  <span className="text-xl font-black text-white/60">%</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Active Proposals</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">{documents.length.toString().padStart(2, '0')}</span>
                  <span className="text-xl font-black text-white/40">/ 03</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">R&D Investment</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">{profile.rndInvestment}</span>
                  <span className="text-xl font-black text-accent-dark">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Document Status Card */}
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[48px] p-10 flex flex-col justify-between shadow-sm group hover:border-primary transition-all duration-500">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">inventory_2</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Vault Readiness</h3>
            <p className="text-sm font-bold text-slate-500">필수 서류의 {completionRate}%가 준비되었습니다.</p>
          </div>
          
          <div className="space-y-4">
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${completionRate}%` }} />
            </div>
            <button 
              onClick={() => setView('documents_vault')}
              className="w-full py-4 rounded-2xl bg-primary dark:bg-slate-800 text-white font-black text-xs hover:bg-primary-dark transition-colors cursor-pointer shadow-lg shadow-primary/20"
            >
              문서 금고 관리하기
            </button>
          </div>
        </div>
      </section>

      {/* 2. Middle Section: Funding Roadmap & Intelligence */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[48px] p-10 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Funding Roadmap</h3>
            <span className="material-symbols-outlined text-slate-300">timeline</span>
          </div>
          <div className="space-y-6">
            {[
              { title: '창업성장기술개발사업', date: 'Mar 24', status: 'In Progress', active: true },
              { title: '초기창업패키지', date: 'Apr 12', status: 'Ready', active: false },
              { title: '수출바우처 사업', date: 'May 05', status: 'Pending', active: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 group cursor-pointer">
                <div className={`w-3 h-3 rounded-full ${item.active ? 'bg-primary ring-4 ring-primary/20' : 'bg-slate-200 dark:bg-slate-700'}`} />
                <div className="flex-1 flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-800 group-hover:border-primary/30 transition-all">
                  <div>
                    <p className={`text-sm font-black ${item.active ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{item.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</p>
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full ${item.active ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary/5 border-2 border-primary/20 rounded-[48px] p-10 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">AI Strategy Insight</h3>
            </div>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
              "현재 업력 5년차이며 벤처인증을 보유하고 있습니다. 차기 <strong>'디딤돌 지원사업'</strong>에서 기술 가점 5점을 추가로 획득할 수 있는 전략을 수립했습니다."
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl mt-6">
            <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
              <span>Active Proposal Target</span>
              <span className="text-primary">85% Match</span>
            </div>
            <p className="text-sm font-black text-slate-800 dark:text-white truncate">{activeProposal}</p>
          </div>
        </div>
      </section>

      {/* 3. Bottom Section: Asset Management Stats */}
      <section className="bg-slate-50 dark:bg-slate-950 p-4 flex gap-4 overflow-x-auto control-tower-scrollbar">
        {[
          { label: 'Total Patents', value: profile.patents, icon: 'military_tech' },
          { label: 'Est. Funding Cap', value: '₩1.2B', icon: 'payments' },
          { label: 'Risk Factor', value: 'Low', icon: 'verified_user' },
          { label: 'Expert Review', value: 'Ready', icon: 'chat_bubble' },
        ].map((stat, i) => (
          <div key={i} className="min-w-[200px] flex-1 bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <span className="material-symbols-outlined text-xl">{stat.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-lg font-black text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default DashboardView;
