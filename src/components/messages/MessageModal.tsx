import React, { useState } from 'react';
import { X, Send, ArrowRightLeft } from 'lucide-react';
import { Listing } from '../../types';
import { useMessages } from '../../hooks/useMessages';
import { useListings } from '../../hooks/useListings';
import { useAuth } from '../../contexts/AuthContext';

interface MessageModalProps {
  listing: Listing;
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ listing, onClose }) => {
  const [message, setMessage] = useState('');
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedListingForTrade, setSelectedListingForTrade] = useState<string>('');
  const [tradeMessage, setTradeMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { sendMessage, sendTradeProposal, getMessagesForListing } = useMessages();
  const { getUserListings } = useListings();
  const { user } = useAuth();

  const userListings = user ? getUserListings(user.id) : [];
  const messages = getMessagesForListing(listing.id);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    setIsLoading(true);
    const success = await sendMessage(listing.userId, listing.id, message.trim());
    if (success) {
      setMessage('');
    }
    setIsLoading(false);
  };

  const handleSendTradeProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingForTrade || !user) return;

    const offeredListing = userListings.find(l => l.id === selectedListingForTrade);
    if (!offeredListing) return;

    setIsLoading(true);
    const success = await sendTradeProposal(
      listing.userId,
      listing.username,
      listing.id,
      selectedListingForTrade,
      tradeMessage || `I'd like to trade my "${offeredListing.title}" for your "${listing.title}"`
    );

    if (success) {
      setShowTradeModal(false);
      setSelectedListingForTrade('');
      setTradeMessage('');
      onClose();
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-pink-100">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{listing.title}</h3>
            <p className="text-pink-600 text-sm">by {listing.username}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.fromUserId === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-2xl ${
                    msg.fromUserId === user?.id
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                    msg.fromUserId === user?.id ? 'text-pink-100' : 'text-gray-500'
                  }`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-pink-100 space-y-3">
          {listing.listingType === 'trade' && userListings.length > 0 && (
            <button
              onClick={() => setShowTradeModal(true)}
              className="w-full bg-blue-100 text-blue-600 py-3 px-4 rounded-xl font-medium hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Propose Trade
            </button>
          )}

          {/* Message Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="bg-pink-500 text-white p-3 rounded-xl hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Trade Modal */}
      {showTradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Propose Trade</h3>
              <button
                onClick={() => setShowTradeModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSendTradeProposal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select item to trade
                </label>
                <select
                  value={selectedListingForTrade}
                  onChange={(e) => setSelectedListingForTrade(e.target.value)}
                  className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  required
                >
                  <option value="">Choose an item...</option>
                  {userListings
                    .filter(l => l.listingType === 'trade')
                    .map(l => (
                      <option key={l.id} value={l.id}>
                        {l.title}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (optional)
                </label>
                <textarea
                  value={tradeMessage}
                  onChange={(e) => setTradeMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-none"
                  placeholder="Add a message about your trade proposal..."
                />
              </div>

              <button
                type="submit"
                disabled={!selectedListingForTrade || isLoading}
                className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Sending...' : 'Send Trade Proposal'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageModal;