import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar?: string | null;
          created_at?: string;
        };
      };
      listings: {
        Row: {
          id: string;
          user_id: string;
          type: 'book' | 'clothing';
          title: string;
          author: string | null;
          brand: string | null;
          genre: string | null;
          size: string | null;
          category: string | null;
          condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
          color: string;
          material: string | null;
          isbn: string | null;
          description: string;
          listing_type: 'trade' | 'giveaway' | 'rent';
          price: number | null;
          images: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'book' | 'clothing';
          title: string;
          author?: string | null;
          brand?: string | null;
          genre?: string | null;
          size?: string | null;
          category?: string | null;
          condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
          color: string;
          material?: string | null;
          isbn?: string | null;
          description: string;
          listing_type: 'trade' | 'giveaway' | 'rent';
          price?: number | null;
          images?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'book' | 'clothing';
          title?: string;
          author?: string | null;
          brand?: string | null;
          genre?: string | null;
          size?: string | null;
          category?: string | null;
          condition?: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
          color?: string;
          material?: string | null;
          isbn?: string | null;
          description?: string;
          listing_type?: 'trade' | 'giveaway' | 'rent';
          price?: number | null;
          images?: string[];
          created_at?: string;
        };
      };
      trade_proposals: {
        Row: {
          id: string;
          from_user_id: string;
          to_user_id: string;
          target_listing_id: string;
          offered_listing_id: string;
          message: string;
          status: 'pending' | 'accepted' | 'declined';
          created_at: string;
        };
        Insert: {
          id?: string;
          from_user_id: string;
          to_user_id: string;
          target_listing_id: string;
          offered_listing_id: string;
          message: string;
          status?: 'pending' | 'accepted' | 'declined';
          created_at?: string;
        };
        Update: {
          id?: string;
          from_user_id?: string;
          to_user_id?: string;
          target_listing_id?: string;
          offered_listing_id?: string;
          message?: string;
          status?: 'pending' | 'accepted' | 'declined';
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          from_user_id: string;
          to_user_id: string;
          listing_id: string;
          content: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          from_user_id: string;
          to_user_id: string;
          listing_id: string;
          content: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          from_user_id?: string;
          to_user_id?: string;
          listing_id?: string;
          content?: string;
          read?: boolean;
          created_at?: string;
        };
      };
    };
  };
};