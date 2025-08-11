import React from 'react';
import { ArrowRightLeft, Book, Shirt, Plus, Gift, Clock, TrendingUp } from 'lucide-react';
import { useListings } from '../../hooks/useListings';
import { useAuth } from '../../contexts/AuthContext';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { listings } = useListings();
  const { user } = useAuth();

  const stats = {
    totalListings: listings.length,
    books: listings.filter(l => l.type === 'book').length,
    clothes: listings.filter(l => l.type === 'clothing').length,
    trades: listings.filter(l => l.listingType === 'trade').length,
    giveaways: listings.filter(l => l.listingType === 'giveaway').length,
    rentals: listings.filter(l => l.listingType === 'rent').length
  };

  const recentListings = listings.slice(-3);

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-400 to-purple-500 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {user?.username}!
            </h2>
            <p className="text-pink-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Ready to start trading?
            </p>
          </div>
          <div className="text-6xl">📈</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-pink-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <Book className="w-5 h-5 text-pink-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.books}</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Books Available</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg border border-pink-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Shirt className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.clothes}</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Clothes Available</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg border border-pink-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.trades}</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Trade Offers</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg border border-pink-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.giveaways}</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Free Items</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('books')}
            className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100 hover:border-pink-300 group text-left"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Book className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">Browse Books</h4>
            <p className="text-gray-600 text-xs">Find your next read</p>
          </button>

          <button
            onClick={() => onNavigate('clothes')}
            className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100 hover:border-pink-300 group text-left"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shirt className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">Browse Clothes</h4>
            <p className="text-gray-600 text-xs">Discover new styles</p>
          </button>

          <button
            onClick={() => onNavigate('create')}
            className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100 hover:border-pink-300 group text-left"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">Create Listing</h4>
            <p className="text-gray-600 text-xs">List your items</p>
          </button>

          <button
            onClick={() => onNavigate('messages')}
            className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100 hover:border-pink-300 group text-left"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowRightLeft className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">Trade Center</h4>
            <p className="text-gray-600 text-xs">Check proposals</p>
          </button>
        </div>
      </div>

      {/* Recent Listings */}
      {recentListings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Recently Added</h3>
          
          <div className="space-y-3">
            {recentListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-xl p-4 shadow-md border border-pink-100 flex items-center space-x-4"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                  {listing.type === 'book' ? (
                    <Book className="w-6 h-6 text-pink-600" />
                  ) : (
                    <Shirt className="w-6 h-6 text-pink-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{listing.title}</h4>
                  <p className="text-gray-600 text-sm">by {listing.username}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  listing.listingType === 'trade' ? 'bg-blue-100 text-blue-600' :
                  listing.listingType === 'giveaway' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {listing.listingType}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Community Message */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-pink-100 text-center">
        <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
          <ArrowRightLeft className="w-6 h-6 text-white" />
        </div>
        <h3 className="font-bold text-gray-800 mb-2">Join our trading community!</h3>
        <p className="text-gray-600 text-sm">
          List your items, discover great deals, and connect with other traders.
        </p>
      </div>
    </div>
  );
};

export default HomePage;