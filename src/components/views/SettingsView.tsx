import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useEditorStore } from '../../hooks/useEditor';
import { useCompanyStore } from '../../hooks/useCompany';

const SettingsView: React.FC = () => {
  const { user } = useAuth();
  const { currentPlan, setPlan, setView } = useEditorStore();
  const { profile, updateProfile } = useCompanyStore();

  const [formData, setFormData] = useState(profile);
  const [isSaved, setIsSaved] = useState(false);

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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                type === 'number' ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  return (
    <div className="h-full overflow-y-auto control-tower-scrollbar p-8 bg-slate-50 dark:bg-slate-950 font-black">
      <section className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">설정 및 프로필 관리</h1>
        
        <div className="space-y-10">
          
          {/* 기업 프로필 수정 섹션 */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border-2 border-slate-100 dark:border-slate-800 space-y-8 shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-xl text-slate-900 dark:text-white">기업 핵심 데이터 (매칭 기준)</h2>
              {isSaved && <span className="text-primary text-sm animate-pulse">✓ 성공적으로 저장되었습니다</span>}
            </div>
            
            <form onSubmit={handleSaveProfile} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-bold">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">기업명</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">설립일 (YYYY-MM-DD)</label>
                  <input type="date" name="establishmentDate" value={formData.establishmentDate} onChange={handleChange} required className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">주요 산업군</label>
                  <select name="industry" value={formData.industry} onChange={handleChange} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary transition-all">
                    <option value="Software">Software & IT</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Bio">Bio & Health</option>
                    <option value="Energy">Energy & Environment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">최근 연매출 (억원)</label>
                  <input type="number" name="revenue" value={formData.revenue} onChange={handleChange} min="0" required className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">임직원 수 (명)</label>
                  <input type="number" name="employees" value={formData.employees} onChange={handleChange} min="1" required className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">보유 특허 수 (건)</label>
                  <input type="number" name="patents" value={formData.patents} onChange={handleChange} min="0" required className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">R&D 투자 비중 (%)</label>
                  <input type="number" name="rndInvestment" value={formData.rndInvestment} onChange={handleChange} min="0" max="100" required className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary transition-all" />
                </div>
              </div>
              
              <div className="flex gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="hasVentureCert" checked={formData.hasVentureCert} onChange={handleChange} className="w-5 h-5 accent-primary rounded" />
                  <span className="text-sm font-black text-slate-700 dark:text-slate-300">벤처기업 인증 보유</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="hasInnoBizCert" checked={formData.hasInnoBizCert} onChange={handleChange} className="w-5 h-5 accent-primary rounded" />
                  <span className="text-sm font-black text-slate-700 dark:text-slate-300">이노비즈 인증 보유</span>
                </label>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="px-8 py-4 rounded-2xl bg-primary text-white font-black text-sm hover:scale-[1.02] shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">save</span>
                  데이터 저장 및 매칭 엔진 업데이트
                </button>
              </div>
            </form>
          </div>

          {/* 멤버십 요약 섹션 */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border-2 border-slate-100 dark:border-slate-800 space-y-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px]" />
            
            <div className="flex justify-between items-center relative z-10">
              <div>
                <h2 className="font-black text-xl text-slate-900 dark:text-white mb-2">현재 멤버십</h2>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-primary">{currentPlan}</span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Active</span>
                </div>
              </div>
              <button 
                onClick={() => setView('membership')}
                className="px-8 py-4 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white font-black text-sm hover:bg-primary transition-all flex items-center gap-2 shadow-lg"
              >
                <span className="material-symbols-outlined text-sm">payments</span>
                멤버십 변경 및 관리
              </button>
            </div>
            
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 relative z-10">
              {currentPlan === 'Standard' ? '기본 기능을 이용 중입니다. 더 강력한 AI 분석을 위해 업그레이드하세요.' : 
               currentPlan === 'Pro' ? '프로 플랜의 모든 프리미엄 기능을 이용하고 계십니다.' :
               '엔터프라이즈급 무제한 서비스를 이용 중입니다.'}
            </p>
          </div>

          {/* 계정 기본 정보 섹션 */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border-2 border-slate-100 dark:border-slate-800 space-y-8 shadow-sm">
            <h2 className="font-black text-xl text-slate-900 dark:text-white">계정 기본 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-bold">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">로그인된 이름</label>
                <input type="text" readOnly value={user?.displayName || '사용자'} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-black text-slate-900 dark:text-white outline-none opacity-70 cursor-not-allowed" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">로그인된 이메일</label>
                <input type="text" readOnly value={user?.email || ''} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-black text-slate-900 dark:text-white outline-none opacity-70 cursor-not-allowed" />
              </div>
            </div>
            <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
              <h2 className="font-black text-xl mb-6 text-red-500">위험 구역</h2>
              <button 
                onClick={() => confirm('정말로 계정을 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')}
                className="text-sm font-black text-slate-400 hover:text-red-500 underline underline-offset-4 transition-colors"
              >
                계정 영구 삭제
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsView;
