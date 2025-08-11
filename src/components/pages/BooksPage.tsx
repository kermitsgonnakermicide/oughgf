import React, { useState } from 'react';
import { Search, Filter, Book } from 'lucide-react';
import { useListings } from '../../hooks/useListings';
import { BookListing } from '../../types';
import ListingCard from '../listings/ListingCard';
import MessageModal from '../messages/MessageModal';

const BooksPage: React.FC = () => {
  const { getBookListings } = useListings();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedListing, setSelectedListing] = useState<BookListing | null>(null);

  const books = getBookListings();
  
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.genre.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || book.listingType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <Book className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Book Marketplace</h1>
        <p className="text-gray-600">Find books to trade, rent, or get for free</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search books, authors, or genres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent shadow-sm"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
          {[
            { value: 'all', label: 'All Books' },
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

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredBooks.map(book => (
            <ListingCard
              key={book.id}
              listing={book}
              onMessage={(listing) => setSelectedListing(listing as BookListing)}
              onTrade={(listing) => setSelectedListing(listing as BookListing)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Book className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No books found</h3>
          <p className="text-gray-600">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Be the first to list a book!'
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

export default BooksPage;