import React, { useEffect } from 'react';
import MainLayout from './components/layout/MainLayout';
import AuthPage from './components/auth/AuthPage';
import { useEditorStore } from './hooks/useEditor';
import { useAuth } from './hooks/useAuth';
import { useCompanyStore } from './hooks/useCompany';
import { useDocumentsStore } from './hooks/useDocuments';
import { useTheme } from './hooks/useTheme';

import DashboardView from './components/views/DashboardView';
import MatchingView from './components/views/MatchingView';
import VaultView from './components/views/VaultView';
import SettingsView from './components/views/SettingsView';
import MembershipView from './components/views/MembershipView';
import DocumentsVaultView from './components/views/DocumentsVaultView';

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const { currentView, loadProposals } = useEditorStore();
  const { loadProfile } = useCompanyStore();
  const { loadDocuments } = useDocumentsStore();
  const { initTheme } = useTheme();

  // 1. 테마 초기화
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // 2. 사용자 데이터 로드
  useEffect(() => {
    if (user) {
      loadProfile();
      loadDocuments();
      loadProposals();
    }
  }, [user, loadProfile, loadDocuments, loadProposals]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center animate-pulse bg-slate-50 dark:bg-slate-950">
        <img src="/logo.svg" className="h-12" alt="Loading..." />
      </div>
    );
  }

  if (!user) return <AuthPage />;

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'matching': return <MatchingView />;
      case 'vault': return <VaultView />;
      case 'settings': return <SettingsView />;
      case 'membership': return <MembershipView />;
      case 'documents_vault': return <DocumentsVaultView />;
      default: return <DashboardView />;
    }
  };

  return (
    <MainLayout>
      {renderView()}
    </MainLayout>
  );
};

export default App;
