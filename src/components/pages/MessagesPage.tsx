import React from 'react';
import { MessageCircle, ArrowRightLeft, Clock, Check, X } from 'lucide-react';
import { useMessages } from '../../hooks/useMessages';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const MessagesPage: React.FC = () => {
  const { getTradeProposalsForUser } = useMessages();
  const { user } = useAuth();

  const tradeProposals = getTradeProposalsForUser();
  const incomingProposals = tradeProposals.filter(p => p.toUserId === user?.id);
  const outgoingProposals = tradeProposals.filter(p => p.fromUserId === user?.id);

  const handleProposalAction = async (proposalId: string, status: 'accepted' | 'declined') => {
    try {
      const { error } = await supabase
        .from('trade_proposals')
        .update({ status })
        .eq('id', proposalId);

      if (error) throw error;
      
      // Reload the page to show updated status
      window.location.reload();
    } catch (error) {
      console.error('Error updating proposal:', error);
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'declined': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <Check className="w-4 h-4" />;
      case 'declined': return <X className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Messages & Trades</h1>
        <p className="text-gray-600">Manage your trade proposals and messages</p>
      </div>

      {/* Incoming Proposals */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-blue-600" />
          Incoming Trade Proposals
        </h2>

        {incomingProposals.length > 0 ? (
          <div className="space-y-3">
            {incomingProposals.map(proposal => (
              <div key={proposal.id} className="bg-white rounded-2xl p-4 shadow-lg border border-pink-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Trade proposal from {proposal.fromUsername}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(proposal.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(proposal.status)}`}>
                    {getStatusIcon(proposal.status)}
                    {proposal.status}
                  </div>
                </div>

                <div className="bg-pink-50 rounded-xl p-3 mb-3">
                  <p className="text-gray-700 text-sm">{proposal.message}</p>
                </div>

                {proposal.status === 'pending' && (
                  <div className="flex gap-2">
                    <button className="flex-1 bg-green-100 text-green-600 py-2 px-4 rounded-xl font-medium hover:bg-green-200 transition-colors">
                      onClick={() => handleProposalAction(proposal.id, 'accepted')}
                      Accept
                    </button>
                    <button className="flex-1 bg-red-100 text-red-600 py-2 px-4 rounded-xl font-medium hover:bg-red-200 transition-colors">
                      onClick={() => handleProposalAction(proposal.id, 'declined')}
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100 text-center">
            <div className="text-4xl mb-3">📫</div>
            <h3 className="font-semibold text-gray-800 mb-2">No incoming proposals</h3>
            <p className="text-gray-600 text-sm">Trade proposals from other users will appear here</p>
          </div>
        )}
      </div>

      {/* Outgoing Proposals */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-purple-600" />
          Your Trade Proposals
        </h2>

        {outgoingProposals.length > 0 ? (
          <div className="space-y-3">
            {outgoingProposals.map(proposal => (
              <div key={proposal.id} className="bg-white rounded-2xl p-4 shadow-lg border border-pink-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Trade proposal to {proposal.toUsername}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(proposal.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(proposal.status)}`}>
                    {getStatusIcon(proposal.status)}
                    {proposal.status}
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-gray-700 text-sm">{proposal.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100 text-center">
            <div className="text-4xl mb-3">💌</div>
            <h3 className="font-semibold text-gray-800 mb-2">No outgoing proposals</h3>
            <p className="text-gray-600 text-sm">Your trade proposals will appear here</p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 border border-pink-200">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          💡 Trading Tips
        </h3>
        <ul className="space-y-2 text-gray-700 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-pink-500 mt-0.5">•</span>
            <span>Be clear and friendly in your trade proposals</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-500 mt-0.5">•</span>
            <span>Include photos of your items to build trust</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-500 mt-0.5">•</span>
            <span>Consider meeting in safe, public places for exchanges</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MessagesPage;