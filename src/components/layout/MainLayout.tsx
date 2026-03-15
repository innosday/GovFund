import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import StatusPanel from './StatusPanel';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* 1. Left (Sidebar): 고정 내비게이션 - 경계선 제거 및 그림자 추가 */}
      <aside className="w-80 h-full flex-shrink-0 z-30 bg-white dark:bg-slate-900 shadow-[20px_0_40px_rgba(0,0,0,0.02)] dark:shadow-[20px_0_40px_rgba(0,0,0,0.2)]">
        <Sidebar />
      </aside>

      {/* 2. Center (Main Feed): 가변 작업 영역 */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header />
        <main className="flex-1 overflow-y-auto control-tower-scrollbar px-10 py-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* 3. Right (Status Panel): 고정 현황판 */}
      <aside className="w-96 h-full border-l border-slate-100 dark:border-slate-800 flex-shrink-0 z-20 bg-white dark:bg-slate-900 overflow-y-auto control-tower-scrollbar">
        <StatusPanel />
      </aside>
    </div>
  );
};

export default MainLayout;
