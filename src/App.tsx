import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MusicProvider } from './contexts/MusicContext';
import PageTransition from './components/layout/PageTransition';
import './i18n/i18n';

// Import your pages
import Home from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GuestHomePage from './pages/GuestHomePage';
import PackagesPage from './pages/PackagesPage';
import CurrencyTransactionsPage from './pages/CurrencyTransactionsPage';
import PackageTransactionsPage from './pages/PackageTransactionsPage';
import TransactionDetailPage from './pages/TransactionDetailPage';
import PackageOrderPage from './pages/PackageOrderPage';
import HomePage from './pages/HomePage';

// Admin pages
import UserManagementPage from './pages/admin/UserManagementPage';
import PackageManagementPage from './pages/admin/PackageManagementPage';
import CurrencyManagementPage from './pages/admin/CurrencyManagementPage';
import TransactionManagementPage from './pages/admin/TransactionManagementPage';

// Protected route component for authenticated users
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/" replace />;
};

const GuestRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/admin/users" replace /> : element;
};

// Admin route component for admin users only
const AdminRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, user } = useAuth();

  console.log(user);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // if (user?.user.role !== 'admin') {
  //   return <Navigate to="/admin/users" replace />;
  // }

  return element;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Guest routes - redirect to admin if logged in */}
        <Route path="/" element={
          <GuestRoute element={
            <PageTransition>
              <LoginPage />
            </PageTransition>
          } />
        } />

        {/* App routes - require authentication */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute element={
            <Layout>
              <PageTransition>
                <HomePage />
              </PageTransition>
            </Layout>
          } />
        } />

        {/* Packages routes - require authentication */}
        <Route path="/packages" element={
          <ProtectedRoute element={
            <Layout>
              <PageTransition>
                <PackagesPage />
              </PageTransition>
            </Layout>
          } />
        } />

        <Route path="/packages/:packageId" element={
          <ProtectedRoute element={
            <Layout>
              <PageTransition>
                <PackagesPage />
              </PageTransition>
            </Layout>
          } />
        } />

        {/* Package Order Page */}
        <Route path="/packages/order/:packageId" element={
          <ProtectedRoute element={
            <Layout>
              <PageTransition>
                <HomePage />
              </PageTransition>
            </Layout>
          } />
        } />

        <Route path="/admin/transactions" element={
          <AdminRoute element={
            <Layout>
              <PageTransition>
                <TransactionManagementPage />
              </PageTransition>
            </Layout>
          } />
        } />

        {/* Transaction routes */}
        <Route path="/transactions/currency" element={
          <ProtectedRoute element={
            <Layout>
              <PageTransition>
                <CurrencyTransactionsPage />
              </PageTransition>
            </Layout>
          } />
        } />

        <Route path="/transactions/:transactionId" element={
          <ProtectedRoute element={
            <Layout>
              <PageTransition>
                <TransactionDetailPage />
              </PageTransition>
            </Layout>
          } />
        } />

        {/* Default transactions route redirects to currency transactions */}
        <Route path="/transactions" element={
          <ProtectedRoute element={
            <Layout>
              <PageTransition>
                <PackageTransactionsPage />
              </PageTransition>
            </Layout>
          } />
        } />

        <Route path="/admin/currency" element={
          <AdminRoute element={
            <Layout>
              <PageTransition>
                <CurrencyManagementPage />
              </PageTransition>
            </Layout>
          } />
        } />

        {/* Admin routes - require admin role */}
        <Route path="/admin/users" element={
          <AdminRoute element={
            <Layout>
              <PageTransition>
                <UserManagementPage />
              </PageTransition>
            </Layout>
          } />
        } />

        <Route path="/admin/packages" element={
          <AdminRoute element={
            <Layout>
              <PageTransition>
                <PackageManagementPage />
              </PageTransition>
            </Layout>
          } />
        } />

        {/* Admin dashboard redirect */}
        <Route path="/admin" element={
          <AdminRoute element={
            <Navigate to="/admin/users" replace />
          } />
        } />

        {/* Fallback route - redirect to admin users or login */}
        <Route path="*" element={
          isAuthenticated ? <Navigate to="/admin/users" replace /> : <Navigate to="/" replace />
        } />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MusicProvider>
          <AppRoutes />
        </MusicProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
