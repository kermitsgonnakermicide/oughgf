import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Listing, BookListing, ClothingListing } from '../types';

export const useListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles (
            username
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedListings: Listing[] = data.map(listing => ({
        id: listing.id,
        type: listing.type as 'book' | 'clothing',
        userId: listing.user_id,
        username: listing.profiles?.username || 'Unknown User',
        title: listing.title,
        author: listing.author || '',
        brand: listing.brand || '',
        genre: listing.genre || '',
        size: listing.size || '',
        category: listing.category || '',
        condition: listing.condition,
        color: listing.color,
        material: listing.material || '',
        isbn: listing.isbn || '',
        description: listing.description,
        listingType: listing.listing_type as 'trade' | 'giveaway' | 'rent',
        price: listing.price || undefined,
        images: listing.images || [],
        createdAt: listing.created_at
      }));

      setListings(formattedListings);
    } catch (error) {
      console.error('Error loading listings:', error);
      // Set empty array on error to prevent undefined state
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const addListing = async (listing: Omit<Listing, 'id' | 'createdAt' | 'userId' | 'username'>) => {
    if (!user) return;

    try {
      const listingData = {
        user_id: user.id,
        type: listing.type,
        title: listing.title,
        author: listing.type === 'book' ? (listing as BookListing).author : null,
        brand: listing.type === 'clothing' ? (listing as ClothingListing).brand : null,
        genre: listing.type === 'book' ? (listing as BookListing).genre : null,
        size: listing.type === 'clothing' ? (listing as ClothingListing).size : null,
        category: listing.type === 'clothing' ? (listing as ClothingListing).category : null,
        condition: listing.condition,
        color: listing.color,
        material: listing.type === 'clothing' ? (listing as ClothingListing).material : null,
        isbn: listing.type === 'book' ? (listing as BookListing).isbn : null,
        description: listing.description,
        listing_type: listing.listingType,
        price: listing.price || null,
        images: listing.images
      };

      const { error } = await supabase
        .from('listings')
        .insert(listingData);

      if (error) throw error;

      // Reload listings to get the new one
      await loadListings();
    } catch (error) {
      console.error('Error adding listing:', error);
    }
  };

  const getBookListings = (): BookListing[] => {
    return listings.filter(listing => listing.type === 'book') as BookListing[];
  };

  const getClothingListings = (): ClothingListing[] => {
    return listings.filter(listing => listing.type === 'clothing') as ClothingListing[];
  };

  const getUserListings = (userId: string): Listing[] => {
    return listings.filter(listing => listing.userId === userId);
  };

  return {
    listings,
    loading,
    addListing,
    getBookListings,
    getClothingListings,
    getUserListings
  };
};