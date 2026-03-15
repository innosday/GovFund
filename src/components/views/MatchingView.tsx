import React, { useMemo } from 'react';
import { useCompanyStore } from '../../hooks/useCompany';
import { useEditorStore } from '../../hooks/useEditor';
import { mockGrants } from '../../lib/grants';
import type { Grant } from '../../lib/grants';

const MatchingView: React.FC = () => {
  const { profile, calculateSuccessScore } = useCompanyStore();
  const { setView, addDocument, setActiveId } = useEditorStore();

  // 업력 계산 (현재 날짜 기준)
  const yearsSinceEstablishment = useMemo(() => {
    const estDate = new Date(profile.establishmentDate);
    const today = new Date();
    const diff = today.getTime() - estDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  }, [profile.establishmentDate]);

  // 자격 요건 필터링 로직
  const checkEligibility = (grant: Grant) => {
    const req = grant.requirements;
    if (req.maxYears && yearsSinceEstablishment > req.maxYears) return false;
    if (req.minYears && yearsSinceEstablishment < req.minYears) return false;
    if (req.minRevenue && profile.revenue < req.minRevenue) return false;
    if (req.needsVenture && !profile.hasVentureCert) return false;
    if (req.industry && !req.industry.includes(profile.industry)) return false;
    return true;
  };

  const handleStartStrategy = (grantTitle: string) => {
    // 1. 새로운 문서를 생성 (내부에서 activeId도 설정됨)
    const newDocId = addDocument(`${grantTitle} 전략 수립`);
    
    // 2. 에디터 뷰로 이동
    setView('vault');
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-950 dark:text-white mb-2">전략적 매칭</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">
            {profile.name}님의 기업 데이터를 기반으로 정밀 분석한 추천 공고입니다.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">현재 업력</span>
            <span className="text-xl font-black text-primary">{yearsSinceEstablishment}년차</span>
          </div>
          <div className="w-[1px] h-10 bg-slate-200 dark:bg-slate-800" />
          <div className="text-right">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">보유 특허</span>
            <span className="text-xl font-black text-primary">{profile.patents}건</span>
          </div>
        </div>
      </header>

      {/* 매칭 엔진 요약 카드 */}
      <section className="bg-primary/5 border-2 border-primary/20 p-8 rounded-[48px] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white text-3xl">psychology</span>
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">AI 매칭 엔진 가동 중</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">총 3,421개의 정부 공고 중 {mockGrants.length}개의 최적 사업을 발견했습니다.</p>
          </div>
        </div>
        <div className="flex -space-x-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800" />
          ))}
          <div className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-primary flex items-center justify-center text-[10px] font-black text-white">+8</div>
        </div>
      </section>

      {/* 추천 공고 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {mockGrants.map((grant) => {
          const isEligible = checkEligibility(grant);
          const score = calculateSuccessScore(grant.requirements);

          return (
            <div 
              key={grant.id} 
              className={`group relative p-10 rounded-[48px] border-2 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl overflow-hidden ${
                isEligible 
                  ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-primary/50' 
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-900 opacity-60 grayscale'
              }`}
            >
              {/* 배경 장식 (합격 확률 강조) */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

              <div className="flex justify-between items-start mb-8 relative z-10">
                <span className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {grant.agency}
                </span>
                <div className="text-right">
                  <span className={`text-sm font-black ${grant.dDay <= 7 ? 'text-accent' : 'text-primary'}`}>
                    D-{grant.dDay}
                  </span>
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 leading-tight group-hover:text-primary transition-colors">
                {grant.title}
              </h3>

              <div className="flex items-end justify-between relative z-10">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">지원 규모</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{grant.amount}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">합격 확률</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-black ${isEligible ? 'text-primary' : 'text-slate-400'}`}>
                      {isEligible ? score : '0'}
                    </span>
                    <span className="text-sm font-black text-slate-400">%</span>
                  </div>
                </div>
              </div>

              {/* 자격 미달 시 안내 문구 */}
              {!isEligible && (
                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-black text-red-500">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  자격 요건 미달: {yearsSinceEstablishment > (grant.requirements.maxYears || 99) ? '업력 초과' : '인증 부족 등'}
                </div>
              )}

              {/* 액션 버튼 */}
              {isEligible && (
                <button 
                  onClick={() => handleStartStrategy(grant.title)}
                  className="w-full mt-10 py-5 rounded-[24px] bg-slate-900 dark:bg-primary text-white font-black text-sm flex items-center justify-center gap-2 hover:bg-primary transition-colors"
                >
                  <span className="material-symbols-outlined">rocket_launch</span>
                  전략 수립 시작
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchingView;
