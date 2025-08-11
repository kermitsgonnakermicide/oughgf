// @ts-ignore - React types are available in the project; this suppresses transient lint resolution errors in some environments
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Message, TradeProposal } from '../types';

export const useMessages = () => {
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [tradeProposals, setTradeProposals] = useState<TradeProposal[]>([]);

  useEffect(() => {
    if (!user) {
      setMessages([]);
      setTradeProposals([]);
      return;
    }

    void loadMessages();
    void loadTradeProposals();
  }, [user?.id]);

  const loadMessages = async (): Promise<void> => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          from_profile:profiles!messages_from_user_id_fkey ( username ),
          to_profile:profiles!messages_to_user_id_fkey ( username )
        `)
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formatted: Message[] = (data || []).map((row: any) => ({
        id: row.id,
        fromUserId: row.from_user_id,
        fromUsername: row.from_profile?.username || 'Unknown',
        toUserId: row.to_user_id,
        listingId: row.listing_id,
        content: row.content,
        createdAt: row.created_at,
        read: !!row.read,
      }));

      setMessages(formatted);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error loading messages:', err);
    }
  };

  const loadTradeProposals = async (): Promise<void> => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('trade_proposals')
        .select(`
          *,
          from_profile:profiles!trade_proposals_from_user_id_fkey ( username ),
          to_profile:profiles!trade_proposals_to_user_id_fkey ( username )
        `)
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted: TradeProposal[] = (data || []).map((row: any) => ({
        id: row.id,
        fromUserId: row.from_user_id,
        fromUsername: row.from_profile?.username || 'Unknown',
        toUserId: row.to_user_id,
        toUsername: row.to_profile?.username || 'Unknown',
        targetListingId: row.target_listing_id,
        offeredListingId: row.offered_listing_id,
        message: row.message,
        status: row.status,
        createdAt: row.created_at,
      }));

      setTradeProposals(formatted);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error loading trade proposals:', err);
    }
  };

  const sendMessage = async (
    toUserId: string,
    listingId: string,
    content: string,
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          from_user_id: user.id,
          to_user_id: toUserId,
          listing_id: listingId,
          content,
          read: false,
        })
        .select(`
          *,
          from_profile:profiles!messages_from_user_id_fkey ( username ),
          to_profile:profiles!messages_to_user_id_fkey ( username )
        `)
        .single();

      if (error) throw error;

      const newMessage: Message = {
        id: data.id,
        fromUserId: data.from_user_id,
        fromUsername: data.from_profile?.username || (user.username ?? 'You'),
        toUserId: data.to_user_id,
        listingId: data.listing_id,
        content: data.content,
        createdAt: data.created_at,
        read: !!data.read,
      };

      setMessages((prev: Message[]) => [...prev, newMessage]);
      return true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error sending message:', err);
      return false;
    }
  };

  const sendTradeProposal = async (
    toUserId: string,
    toUsername: string,
    targetListingId: string,
    offeredListingId: string,
    messageText: string,
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('trade_proposals')
        .insert({
          from_user_id: user.id,
          to_user_id: toUserId,
          target_listing_id: targetListingId,
          offered_listing_id: offeredListingId,
          message: messageText,
        })
        .select('*')
        .single();

      if (error) throw error;

      const newProposal: TradeProposal = {
        id: data.id,
        fromUserId: data.from_user_id,
        fromUsername: user.username ?? 'You',
        toUserId: data.to_user_id,
        toUsername,
        targetListingId: data.target_listing_id,
        offeredListingId: data.offered_listing_id,
        message: data.message,
        status: data.status,
        createdAt: data.created_at,
      };

      setTradeProposals((prev: TradeProposal[]) => [newProposal, ...prev]);
      return true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error sending trade proposal:', err);
      return false;
    }
  };

  const getMessagesForListing = (listingId: string): Message[] => {
    return messages
      .filter((m: Message) => m.listingId === listingId)
      .sort((a: Message, b: Message) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const getTradeProposalsForUser = (): TradeProposal[] => {
    return tradeProposals
      .slice()
      .sort((a: TradeProposal, b: TradeProposal) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  return {
    sendMessage,
    sendTradeProposal,
    getMessagesForListing,
    getTradeProposalsForUser,
  };
};