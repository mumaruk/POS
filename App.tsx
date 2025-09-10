
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import ReportsPage from './pages/ReportsPage';
import AIInsightsPage from './pages/AIInsightsPage';
import Sidebar from './components/layout/Sidebar';
import PageWrapper from './components/layout/PageWrapper';
import { UserRole } from './types';

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-bolt-dark text-bolt-light">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <PageWrapper>
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            {user.role === UserRole.Admin && (
              <>
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/ai-insights" element={<AIInsightsPage />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </PageWrapper>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
