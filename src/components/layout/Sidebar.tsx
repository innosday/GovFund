import React from 'react';
import { useEditorStore } from '../../hooks/useEditor';

const Sidebar: React.FC = () => {
  const { currentView, setView } = useEditorStore();

  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: 'grid_view' },
    { id: 'matching', label: 'AI 스마트 매칭', icon: 'psychology' },
    { id: 'vault', label: '전략 수립 에디터', icon: 'inventory_2' },
    { id: 'settings', label: '계정 설정', icon: 'settings' },
  ];

  return (
    <div className="h-full flex flex-col p-8 space-y-12 bg-white dark:bg-slate-900">
      {/* Brand Logo Section - 시인성 대폭 강화 및 테마별 배경 최적화 */}
      <header className="flex flex-col items-start gap-8 px-2">
        <div className="flex flex-col gap-4">
          <div className="w-20 h-20 bg-slate-950 dark:bg-white rounded-[32px] flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] p-3 border-4 border-white dark:border-slate-800 overflow-hidden group-hover:scale-105 transition-transform duration-500">
            <img src="/logo.svg" alt="GovFund Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter leading-none italic flex items-center gap-1">
              GOV<span className="text-primary">FUND</span>
            </h1>
            <div className="flex items-center gap-2 mt-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-75" />
              </div>
              <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">전략 운영 사령부</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation - Borders 제거 및 Floating 디자인 */}
      <nav className="flex-1 space-y-4 px-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-4">주요 관제 메뉴</p>
        <ul className="space-y-3">
          {menuItems.map((item) => {
            // membership 뷰도 settings 메뉴의 활성화 상태로 간주
            const isActive = currentView === item.id || (item.id === 'settings' && currentView === 'membership');
            return (
              <li key={item.id}>
                <button
                  onClick={() => setView(item.id as any)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-[24px] transition-all duration-300 group ${
                    isActive 
                      ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.05]' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-white'
                  }`}
                >
                  <span className={`material-symbols-outlined text-2xl ${isActive ? 'text-white' : 'group-hover:text-primary'}`}>
                    {item.icon}
                  </span>
                  <span className="font-black text-sm tracking-tight">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Profile Area - Card 스타일로 승급 */}
      <footer className="mt-auto">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">현재 멤버십</span>
            <span className="text-[10px] font-black text-primary px-2 py-0.5 bg-primary/10 rounded-full">프로 플랜</span>
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-2/3" />
          </div>
          <p className="text-[10px] font-bold text-slate-400">기업의 성장을 응원합니다.</p>
        </div>
      </footer>
    </div>
  );
};

export default Sidebar;
