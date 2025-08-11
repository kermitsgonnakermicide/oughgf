import React, { useState } from 'react';
import { Search, Filter, Shirt } from 'lucide-react';
import { useListings } from '../../hooks/useListings';
import { ClothingListing } from '../../types';
import ListingCard from '../listings/ListingCard';
import MessageModal from '../messages/MessageModal';

const ClothesPage: React.FC = () => {
  const { getClothingListings } = useListings();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedListing, setSelectedListing] = useState<ClothingListing | null>(null);

  const clothes = getClothingListings();
  
  const filteredClothes = clothes.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || item.listingType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <Shirt className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Clothing Marketplace</h1>
        <p className="text-gray-600">Trade, rent, or find free clothing items</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search clothes, brands, or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent shadow-sm"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
          {[
            { value: 'all', label: 'All Items' },
            { value: 'trade', label: 'Trade' },
            { value: 'giveaway', label: 'Free' },
            { value: 'rent', label: 'Rent' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilterType(value)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                filterType === value
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-pink-100 shadow-sm'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Clothes Grid */}
      {filteredClothes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredClothes.map(item => (
            <ListingCard
              key={item.id}
              listing={item}
              onMessage={(listing) => setSelectedListing(listing as ClothingListing)}
              onTrade={(listing) => setSelectedListing(listing as ClothingListing)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Shirt className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No clothes found</h3>
          <p className="text-gray-600">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Be the first to list clothing!'
            }
          </p>
        </div>
      )}

      {/* Message Modal */}
      {selectedListing && (
        <MessageModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </div>
  );
};

export default ClothesPage;