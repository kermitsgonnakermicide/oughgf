import React from 'react';
import { User, LogOut, Heart, Package, Star, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useListings } from '../../hooks/useListings';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { getUserListings } = useListings();

  const userListings = user ? getUserListings(user.id) : [];
  const stats = {
    totalListings: userListings.length,
    books: userListings.filter(l => l.type === 'book').length,
    clothes: userListings.filter(l => l.type === 'clothing').length,
    trades: userListings.filter(l => l.listingType === 'trade').length
  };

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-pink-400 to-purple-500 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <User className="w-10 h-10 text-pink-500" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{user?.username}</h1>
            <p className="text-pink-100 text-sm mb-2">{user?.email}</p>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-300 fill-current" />
              <Star className="w-4 h-4 text-yellow-300 fill-current" />
              <Star className="w-4 h-4 text-yellow-300 fill-current" />
              <Star className="w-4 h-4 text-yellow-300 fill-current" />
              <Star className="w-4 h-4 text-yellow-300 fill-current" />
              <span className="text-pink-100 text-sm ml-2">5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-pink-100 text-center">
          <div className="w-12 h-12 bg-pink-100 rounded-full mx-auto mb-3 flex items-center justify-center">
            <Package className="w-6 h-6 text-pink-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{stats.totalListings}</div>
          <p className="text-gray-600 text-sm">Total Listings</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg border border-pink-100 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
            <Heart className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{stats.trades}</div>
          <p className="text-gray-600 text-sm">Trade Items</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg border border-pink-100 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-xl">📚</span>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{stats.books}</div>
          <p className="text-gray-600 text-sm">Books Shared</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg border border-pink-100 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-xl">👗</span>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{stats.clothes}</div>
          <p className="text-gray-600 text-sm">Clothes Shared</p>
        </div>
      </div>

      {/* Recent Listings */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Your Recent Listings</h2>
        
        {userListings.length > 0 ? (
          <div className="space-y-3">
            {userListings.slice(-5).map(listing => (
              <div
                key={listing.id}
                className="bg-white rounded-2xl p-4 shadow-lg border border-pink-100 flex items-center space-x-4"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center text-xl">
                  {listing.type === 'book' ? '📚' : '👗'}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{listing.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {listing.type === 'book' ? (listing as any).author : (listing as any).brand}
                  </p>
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
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100 text-center">
            <div className="text-4xl mb-3">📦</div>
            <h3 className="font-semibold text-gray-800 mb-2">No listings yet</h3>
            <p className="text-gray-600 text-sm">Start sharing your items with the community!</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button className="w-full bg-white text-gray-700 py-4 px-6 rounded-2xl font-medium hover:bg-gray-50 transition-colors shadow-lg border border-pink-100 flex items-center justify-center gap-3">
          <Settings className="w-5 h-5" />
          Account Settings
        </button>

        <button
          onClick={logout}
          className="w-full bg-gradient-to-r from-red-400 to-red-500 text-white py-4 px-6 rounded-2xl font-medium hover:from-red-500 hover:to-red-600 transition-all shadow-lg flex items-center justify-center gap-3"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>

      {/* App Info */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 border border-pink-200 text-center">
        <div className="text-3xl mb-2">💖</div>
        <p className="text-gray-700 text-sm font-medium">Kawaii Trade v1.0</p>
        <p className="text-gray-600 text-xs mt-1">Made with love for the community</p>
      </div>
    </div>
  );
};

export default ProfilePage;