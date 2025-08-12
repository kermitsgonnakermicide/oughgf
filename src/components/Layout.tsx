import React from 'react';
import { ArrowRightLeft, Book, Shirt, Plus, MessageCircle, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const navItems = [
    { id: 'home', icon: ArrowRightLeft, label: 'Home' },
    { id: 'books', icon: Book, label: 'Books' },
    { id: 'clothes', icon: Shirt, label: 'Clothes' },
    { id: 'create', icon: Plus, label: 'Create' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-purple-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-400 to-pink-500 text-white p-4 shadow-lg">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-pink-500" />
            </div>
            <h1 className="text-xl font-bold tracking-wide">Trade Hub</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-200 px-2 py-2 shadow-lg">
        <div className="flex justify-around items-center">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${
                currentPage === id
                  ? 'bg-pink-100 text-pink-600'
                  : 'text-gray-400 hover:text-pink-500'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;