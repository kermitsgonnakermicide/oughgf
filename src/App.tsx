import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthForm from './components/auth/AuthForm';
import Layout from './components/Layout';
import HomePage from './components/pages/HomePage';
import BooksPage from './components/pages/BooksPage';
import ClothesPage from './components/pages/ClothesPage';
import CreateListing from './components/listings/CreateListing';
import MessagesPage from './components/pages/MessagesPage';
import ProfilePage from './components/pages/ProfilePage';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-purple-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-2xl">⚡</span>
          </div>
          <p className="text-pink-600 font-medium">Loading TradeHub...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'books':
        return <BooksPage />;
      case 'clothes':
        return <ClothesPage />;
      case 'create':
        return <CreateListing onBack={() => setCurrentPage('home')} />;
      case 'messages':
        return <MessagesPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;