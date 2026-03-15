import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useEditorStore } from '../../hooks/useEditor';
import { useCompanyStore } from '../../hooks/useCompany';

const SettingsView: React.FC = () => {
  const { user } = useAuth();
  const { currentPlan, setView } = useEditorStore();
  const { profile, updateProfile } = useCompanyStore();

  const [formData, setFormData] = useState(profile);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    // 매칭 엔진 재분석 시뮬레이션 (사용자 체감용 연출)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await updateProfile(formData);
    
    setIsUpdating(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                type === 'number' ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  return (
    <div className="h-full overflow-y-auto control-tower-scrollbar p-8 bg-slate-50 dark:bg-slate-950 font-black relative">
      
      {/* 매칭 엔진 재가동 오버레이 */}
      {isUpdating && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-32 h-32 relative mb-8">
            <div className="absolute inset-0 border-8 border-primary/20 rounded-full" />
            <div className="absolute inset-0 border-8 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-primary animate-pulse">psychology</span>
            </div>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mb-2">매칭 엔진 재분석 중</h2>
          <p className="text-slate-400 font-bold">입력된 데이터를 바탕으로 합격 확률을 다시 계산하고 있습니다...</p>
        </div>
      )}

      <section className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">설정 및 프로필 관리</h1>
        
        <div className="space-y-10">
          
          {/* 기업 프로필 수정 섹션 */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border-2 border-slate-100 dark:border-slate-800 space-y-8 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-xl text-slate-900 dark:text-white">기업 핵심 데이터 (매칭 기준)</h2>
              {showSuccess && (
                <div className="flex items-center gap-2 text-primary animate-in slide-in-from-right-4 font-black text-sm">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  데이터가 성공적으로 갱신되었습니다
                </div>
              )}
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
              
              <div className="space-y-4 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[32px]">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">기업 자격 인증</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-6 rounded-2xl border-2 flex justify-between items-center transition-all ${formData.hasVentureCert ? 'bg-white dark:bg-slate-900 border-primary/30' : 'bg-slate-100 dark:bg-slate-800 border-transparent'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.hasVentureCert ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                        <span className="material-symbols-outlined">verified</span>
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">벤처기업 인증</p>
                        <p className="text-[10px] font-bold text-slate-400">{formData.hasVentureCert ? '인증 완료' : '인증 전'}</p>
                      </div>
                    </div>
                    <label className="cursor-pointer">
                      <input type="file" className="hidden" accept=".pdf,.png,.jpg" onChange={() => setFormData(prev => ({ ...prev, hasVentureCert: true }))} />
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${formData.hasVentureCert ? 'bg-green-100 text-green-600' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}>
                        {formData.hasVentureCert ? '재인증' : '인증하기'}
                      </span>
                    </label>
                  </div>

                  <div className={`p-6 rounded-2xl border-2 flex justify-between items-center transition-all ${formData.hasInnoBizCert ? 'bg-white dark:bg-slate-900 border-primary/30' : 'bg-slate-100 dark:bg-slate-800 border-transparent'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.hasInnoBizCert ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                        <span className="material-symbols-outlined">workspace_premium</span>
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">이노비즈(Inno-Biz)</p>
                        <p className="text-[10px] font-bold text-slate-400">{formData.hasInnoBizCert ? '인증 완료' : '인증 전'}</p>
                      </div>
                    </div>
                    <label className="cursor-pointer">
                      <input type="file" className="hidden" accept=".pdf,.png,.jpg" onChange={() => setFormData(prev => ({ ...prev, hasInnoBizCert: true }))} />
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${formData.hasInnoBizCert ? 'bg-green-100 text-green-600' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}>
                        {formData.hasInnoBizCert ? '재인증' : '인증하기'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="px-8 py-4 rounded-2xl bg-primary text-white font-black text-sm hover:scale-[1.02] shadow-xl shadow-primary/30 transition-all flex items-center gap-3 disabled:opacity-50 disabled:scale-100"
                >
                  <span className="material-symbols-outlined">rocket_launch</span>
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
          </div>

          {/* 계정 정보 섹션 */}
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsView;
