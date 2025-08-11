import React from 'react';
import { Heart, MessageCircle, ArrowRightLeft, Gift, DollarSign, Clock } from 'lucide-react';
import { Listing } from '../../types';

interface ListingCardProps {
  listing: Listing;
  onMessage: (listing: Listing) => void;
  onTrade?: (listing: Listing) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onMessage, onTrade }) => {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'text-green-600 bg-green-100';
      case 'like-new': return 'text-blue-600 bg-blue-100';
      case 'good': return 'text-yellow-600 bg-yellow-100';
      case 'fair': return 'text-orange-600 bg-orange-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getListingTypeIcon = (type: string) => {
    switch (type) {
      case 'trade': return <ArrowRightLeft className="w-4 h-4" />;
      case 'giveaway': return <Gift className="w-4 h-4" />;
      case 'rent': return <Clock className="w-4 h-4" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  const getListingTypeColor = (type: string) => {
    switch (type) {
      case 'trade': return 'text-blue-600 bg-blue-100';
      case 'giveaway': return 'text-green-600 bg-green-100';
      case 'rent': return 'text-purple-600 bg-purple-100';
      default: return 'text-pink-600 bg-pink-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-pink-100">
      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
        {listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-pink-300 text-6xl">
            {listing.type === 'book' ? '📚' : '👗'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">
              {listing.title}
            </h3>
            <p className="text-pink-600 font-medium text-sm">
              by {listing.username}
            </p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getListingTypeColor(listing.listingType)}`}>
            {getListingTypeIcon(listing.listingType)}
            {listing.listingType}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <p className="text-gray-600 text-sm">
            <span className="font-medium">
              {listing.type === 'book' ? 'Author:' : 'Brand:'}
            </span>{' '}
            {listing.type === 'book' ? (listing as any).author : (listing as any).brand}
          </p>
          
          {listing.type === 'clothing' && (
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Size:</span> {(listing as any).size}
            </p>
          )}

          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm font-medium">Condition:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(listing.condition)}`}>
              {listing.condition}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm font-medium">Color:</span>
            <div className="flex items-center gap-1">
              <div
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: listing.color.toLowerCase() }}
              />
              <span className="text-sm text-gray-700 capitalize">{listing.color}</span>
            </div>
          </div>

          {listing.listingType === 'rent' && listing.price && (
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Price:</span> ${listing.price}/day
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {listing.description}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onMessage(listing)}
            className="flex-1 bg-pink-100 text-pink-600 py-3 px-4 rounded-xl font-medium hover:bg-pink-200 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Message
          </button>
          
          {listing.listingType === 'trade' && onTrade && (
            <button
              onClick={() => onTrade(listing)}
              className="flex-1 bg-blue-100 text-blue-600 py-3 px-4 rounded-xl font-medium hover:bg-blue-200 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Trade
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;