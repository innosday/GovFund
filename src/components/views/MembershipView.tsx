import React from 'react';
import { useEditorStore } from '../../hooks/useEditor';

const MembershipView: React.FC = () => {
  const { currentPlan, setPlan, setView } = useEditorStore();

  const plans = [
    { 
      name: 'Standard', 
      price: 'Free', 
      features: ['AI 생성 월 10회', '서류 보관 500MB', '기본 템플릿 제공'] 
    },
    { 
      name: 'Pro', 
      price: '₩49,000/mo', 
      features: ['AI 생성 무제한', '서류 보관 10GB', '전문가 리뷰 1회', '우선 지원'] 
    },
    { 
      name: 'Max', 
      price: '₩129,000/mo', 
      features: ['협업 멤버 무제한', '커스텀 R&D 템플릿', '전담 매니저 매칭', '용량 무제한'] 
    }
  ];

  return (
    <div className="h-full overflow-y-auto control-tower-scrollbar p-8 bg-slate-50 dark:bg-slate-950">
      <section className="max-w-6xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-500 pb-20">
        <header className="flex justify-between items-center">
          <button 
            onClick={() => setView('settings')}
            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-black text-sm"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            설정으로 돌아가기
          </button>
          <div className="text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Membership Management
          </div>
        </header>

        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">전략을 가속화하세요</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">기업의 규모와 목적에 맞는 최적의 플랜을 선택하세요.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`p-10 rounded-[48px] border-4 transition-all duration-500 flex flex-col justify-between relative group ${
                currentPlan === plan.name 
                  ? 'border-primary bg-white dark:bg-slate-900 shadow-2xl shadow-primary/20 scale-105 z-10' 
                  : 'bg-white dark:bg-slate-900 border-transparent hover:border-slate-200 dark:hover:border-slate-800 shadow-sm opacity-80 hover:opacity-100'
              }`}
            >
              {currentPlan === plan.name && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-black px-6 py-2 rounded-full shadow-lg">
                  현재 활성화됨
                </div>
              )}
              
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">{plan.price.split('/')[0]}</span>
                  {plan.price !== 'Free' && <span className="text-slate-400 font-bold">/월</span>}
                </div>
                
                <ul className="space-y-5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-[13px] text-slate-600 dark:text-slate-300 font-bold">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[14px]">check</span>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => {
                  setPlan(plan.name as any);
                  alert(`${plan.name} 플랜으로 변경되었습니다.`);
                }}
                disabled={currentPlan === plan.name}
                className={`w-full mt-12 py-5 rounded-3xl font-black text-sm transition-all ${
                  currentPlan === plan.name 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default' 
                    : 'bg-slate-950 dark:bg-primary text-white hover:scale-[1.02] shadow-xl group-hover:bg-primary'
                }`}
              >
                {currentPlan === plan.name ? '현재 이용 중인 플랜' : '플랜 선택하기'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MembershipView;
