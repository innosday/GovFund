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
  const { documents } = useDocumentsStore();
  const { setView } = useEditorStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [results, setResults] = useState<{ id: string | number; title: string; type: string }[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    const filteredGrants = grants
      .filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(g => ({ ...g, id: `grant-${g.id}` }));
    
    const filteredDocs = documents
      .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(d => ({ id: `doc-${d.id}`, title: d.name, type: '서류' }));

    setResults([...filteredGrants, ...filteredDocs].slice(0, 5));
  }, [searchQuery, documents]);

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="text-primary font-black bg-primary/10 px-0.5 rounded">{part}</span>
          ) : part
        )}
      </span>
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowPreview(value.trim().length > 0);
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

  const handleResultClick = (type: string) => {
    if (type === '서류') setView('vault');
    else setView('dashboard');
    setShowPreview(false);
    setSearchQuery('');
  };

  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-[var(--card)] sticky top-0 z-50">
      <div className="flex items-center gap-4 flex-1 relative" ref={previewRef}>
        <div className="relative w-full max-w-xl">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery.trim().length > 0 && setShowPreview(true)}
            placeholder="공고, 서류 또는 AI 가이드 검색..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border-none focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold"
          />

          {showPreview && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="p-2">
                {results.length > 0 ? (
                  results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.type)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left group"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        result.type === '공고' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        <span className="material-symbols-outlined text-lg">
                          {result.type === '공고' ? 'campaign' : 'description'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate group-hover:text-primary transition-colors text-slate-700 dark:text-slate-200">
                          {highlightText(result.title, searchQuery)}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">
                          {result.type}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-sm font-bold">결과가 없습니다.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="text-right hidden sm:block font-bold">
            <p className="text-sm font-black">{user?.displayName || '사용자'}</p>
            <button onClick={logout} className="text-[10px] text-red-500 font-bold hover:underline block ml-auto">로그아웃</button>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold uppercase border-2 border-white dark:border-slate-800 shadow-sm">
            {user?.displayName?.slice(0, 1) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
