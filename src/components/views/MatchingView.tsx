import React, { useMemo, useState } from 'react';
import { useCompanyStore } from '../../hooks/useCompany';
import { useEditorStore } from '../../hooks/useEditor';
import { mockGrants } from '../../lib/grants';
import type { Grant } from '../../lib/grants';

const MatchingView: React.FC = () => {
  const { profile, calculateSuccessScore } = useCompanyStore();
  const { setView, addDocument } = useEditorStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
    addDocument(`${grantTitle} 전략 수립`);
    setView('vault');
  };

  // 공고 정렬 로직 (1순위: 자격 충족, 2순위: 합격 확률 높은 순, 3순위: 마감 임박 순)
  const sortedGrants = useMemo(() => {
    return [...mockGrants].map(grant => ({
      ...grant,
      isEligible: checkEligibility(grant),
      score: calculateSuccessScore(grant.requirements)
    })).sort((a, b) => {
      if (a.isEligible && !b.isEligible) return -1;
      if (!a.isEligible && b.isEligible) return 1;
      
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      
      return a.dDay - b.dDay;
    });
  }, [profile, yearsSinceEstablishment]);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 상단 고정 영역 (Fixed) */}
      <div className="flex-shrink-0 space-y-8 pb-6">
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
        <section className="bg-primary/5 border-2 border-primary/20 p-8 rounded-[48px] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-3xl">psychology</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">AI 매칭 엔진 가동 중</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">총 3,421개의 정부 공고 중 {sortedGrants.filter(g => g.isEligible).length}개의 최적 사업을 발견했습니다.</p>
            </div>
          </div>
        </section>
      </div>

      {/* 공고 리스트 (Scrollable Area) */}
      <div className="flex-1 overflow-y-auto control-tower-scrollbar pr-4 -mr-4 pb-10 space-y-8 relative">
        {/* 상단 그라데이션 블러 효과 */}
        <div className="sticky top-0 left-0 right-0 h-6 bg-gradient-to-b from-slate-50 dark:from-slate-950 to-transparent pointer-events-none z-10 -mt-2" />
        
        {sortedGrants.map((grant) => {
          const isExpanded = expandedId === grant.id;
          const { isEligible, score } = grant;

          return (
            <div 
              key={grant.id} 
              className={`group relative rounded-[48px] border-2 transition-all duration-500 overflow-hidden ${
                isExpanded 
                  ? 'bg-white dark:bg-slate-900 border-primary shadow-2xl scale-[1.02]' 
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-xl cursor-pointer'
              } ${!isEligible && !isExpanded ? 'opacity-60 grayscale' : ''}`}
              onClick={() => !isExpanded && setExpandedId(grant.id)}
            >
              {/* 공고 요약 헤더 (항상 보임) */}
              <div className="p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      {grant.agency}
                    </span>
                    <span className={`text-sm font-black ${grant.dDay <= 7 ? 'text-accent' : 'text-primary'}`}>
                      D-{grant.dDay}
                    </span>
                  </div>
                  <h3 className={`text-2xl font-black transition-colors ${isExpanded ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                    {grant.title}
                  </h3>
                </div>

                <div className="flex items-center gap-12">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">지원 규모</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">{grant.amount}</p>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">합격 확률</p>
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-4xl font-black text-primary">{score}</span>
                      <span className="text-sm font-black text-slate-400">%</span>
                    </div>
                  </div>
                  {isExpanded && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setExpandedId(null); }}
                      className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-red-500 transition-all"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 확장된 상세 정보 영역 */}
              {isExpanded && (
                <div className="px-10 pb-10 animate-in slide-in-from-top-4 duration-500 space-y-10">
                  <div className="h-[2px] bg-slate-50 dark:bg-slate-800" />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* 왼쪽: AI 정밀 분석 */}
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">psychology</span>
                        AI Strategic Analysis
                      </h4>
                      <div className="bg-primary text-white rounded-[40px] p-8 space-y-6 relative overflow-hidden shadow-xl shadow-primary/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[100px] -mr-8 -mt-8" />
                        <p className="text-sm font-bold leading-relaxed relative z-10">
                          "{profile.name}님, 분석 결과 본 사업은 귀사의 **현재 업력({yearsSinceEstablishment}년)**과 **보유 특허 {profile.patents}건**을 활용한 기술 혁신형 과제에 매우 적합합니다. 벤처기업 인증 정보를 에디터에 포함하면 합격 확률이 더욱 상승할 것입니다."
                        </p>
                      </div>
                    </div>

                    {/* 오른쪽: 상세 조건 리스트 */}
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">assignment</span>
                        Detailed Requirements
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { label: '주관 기관', value: grant.agency },
                          { label: '공고 분류', value: grant.category },
                          { label: '업력 요건', value: `${grant.requirements.maxYears || '전체'}년 이하` },
                          { label: '필수 인증', value: grant.requirements.needsVenture ? '벤처기업 인증' : '해당 없음' },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                            <span className="text-xs text-slate-400 font-black uppercase">{item.label}</span>
                            <span className="text-sm font-black text-slate-900 dark:text-white">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 하단 액션 버튼 */}
                  <div className="flex flex-col md:flex-row gap-4 pt-6">
                    {!isEligible && (
                      <div className="flex-1 flex items-center gap-3 bg-red-50 dark:bg-red-900/10 text-red-500 p-6 rounded-3xl border border-red-100 dark:border-red-900/30">
                        <span className="material-symbols-outlined">warning</span>
                        <p className="text-xs font-black">자격 요건이 부족합니다: {yearsSinceEstablishment > (grant.requirements.maxYears || 99) ? '업력 초과' : '기타 조건 미달'}</p>
                      </div>
                    )}
                    <button 
                      onClick={() => handleStartStrategy(grant.title)}
                      className="flex-1 py-6 rounded-3xl bg-slate-950 dark:bg-primary text-white font-black text-sm flex items-center justify-center gap-3 hover:scale-[1.02] shadow-2xl transition-all"
                    >
                      <span className="material-symbols-outlined">rocket_launch</span>
                      이 공고로 즉시 전략 수립 시작
                    </button>
                    <button 
                      onClick={() => setExpandedId(null)}
                      className="px-8 py-6 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-black text-sm hover:bg-slate-200 transition-all"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchingView;
