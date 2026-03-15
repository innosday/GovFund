import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useDocumentsStore } from '../../hooks/useDocuments';
import { useEditorStore } from '../../hooks/useEditor';

const grants = [
  { id: 1, title: '2026년 스타트업 기술개발 지원사업', type: '공고' },
  { id: 2, title: 'AI 혁신 바우처 지원 사업', type: '공고' },
  { id: 3, title: 'SaaS 글로벌 진출 지원 사업', type: '공고' },
];

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { documents: vaultDocs } = useDocumentsStore();
  const { documents: proposalDocs, setView, setActiveId } = useEditorStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [results, setResults] = useState<{ id: string | number; title: string; type: string; originalId?: string }[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setResults([]);
      return;
    }

    let searchType: 'all' | '공고' | '서류' | '프로젝트' = 'all';
    let cleanQuery = query;

    // 접두어 감지 로직
    if (query.startsWith('서류:')) {
      searchType = '서류';
      cleanQuery = query.replace('서류:', '').trim();
    } else if (query.startsWith('공고:')) {
      searchType = '공고';
      cleanQuery = query.replace('공고:', '').trim();
    } else if (query.startsWith('프로젝트:')) {
      searchType = '프로젝트';
      cleanQuery = query.replace('프로젝트:', '').trim();
    }

    // 1. 공고 검색
    const filteredGrants = (searchType === 'all' || searchType === '공고') 
      ? grants.filter(g => g.title.toLowerCase().includes(cleanQuery)).map(g => ({ ...g, id: `grant-${g.id}`, type: '공고' }))
      : [];
    
    // 2. 금고 서류 검색
    const filteredVault = (searchType === 'all' || searchType === '서류')
      ? vaultDocs.filter(d => d.name.toLowerCase().includes(cleanQuery)).map(d => ({ id: `vault-${d.id}`, title: d.name, type: '서류' }))
      : [];

    // 3. 프로젝트 검색
    const filteredProposals = (searchType === 'all' || searchType === '프로젝트')
      ? proposalDocs.filter(p => p.title.toLowerCase().includes(cleanQuery)).map(p => ({ id: `prop-${p.id}`, title: p.title, type: '프로젝트', originalId: p.id }))
      : [];

    setResults([...filteredGrants, ...filteredVault, ...filteredProposals].slice(0, 10));
  }, [searchQuery, vaultDocs, proposalDocs]);

  const handleResultClick = (result: any) => {
    if (result.type === '프로젝트') {
      setActiveId(result.originalId);
      setView('vault');
    } else if (result.type === '서류') {
      setView('documents_vault');
    } else {
      setView('matching');
    }
    setShowPreview(false);
    setSearchQuery('');
  };

  const highlightText = (text: string, query: string) => {
    const cleanQuery = query.includes(':') ? query.split(':')[1].trim() : query;
    if (!cleanQuery) return text;
    const parts = text.split(new RegExp(`(${cleanQuery})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === cleanQuery.toLowerCase() ? (
            <span key={i} className="text-primary font-black bg-primary/10 px-0.5 rounded">{part}</span>
          ) : part
        )}
      </span>
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowPreview(e.target.value.trim().length > 0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (previewRef.current && !previewRef.current.contains(event.target as Node)) {
        setShowPreview(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b dark:border-slate-800 flex items-center justify-between px-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-4 flex-1 relative" ref={previewRef}>
        <div className="relative w-full max-w-xl">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery.trim().length > 0 && setShowPreview(true)}
            placeholder="공고:, 서류:, 프로젝트: 접두어로 필터링 가능..."
            className="w-full pl-12 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold text-slate-900 dark:text-white"
          />

          {showPreview && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 z-50">
              <div className="p-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-2">검색 결과 ({results.length})</p>
                <div className="max-h-[400px] overflow-y-auto control-tower-scrollbar">
                  {results.length > 0 ? (
                    results.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors text-left group"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          result.type === '프로젝트' ? 'bg-purple-100 text-purple-600' :
                          result.type === '서류' ? 'bg-orange-100 text-orange-600' : 
                          'bg-blue-100 text-blue-600'
                        }`}>
                          <span className="material-symbols-outlined text-lg">
                            {result.type === '프로젝트' ? 'auto_stories' :
                             result.type === '서류' ? 'description' : 'campaign'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-black text-slate-700 dark:text-slate-200 truncate">
                            {highlightText(result.title, searchQuery)}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{result.type}</p>
                        </div>
                        <span className="material-symbols-outlined text-sm text-slate-300 group-hover:text-primary transition-colors">
                          north_east
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="py-10 text-center space-y-2">
                      <span className="material-symbols-outlined text-3xl text-slate-200">search_off</span>
                      <p className="text-xs font-bold text-slate-400">일치하는 결과가 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        <div className="flex items-center gap-4 pl-6 border-l dark:border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900 dark:text-white leading-none mb-1">
              {user?.displayName || '사용자'}
            </p>
            <button 
              onClick={logout}
              className="text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              Sign Out
            </button>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-sm border-2 border-white dark:border-slate-800 shadow-lg">
            {user?.displayName?.slice(0, 1) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
