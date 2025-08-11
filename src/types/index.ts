export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
}

export interface BookListing {
  id: string;
  type: 'book';
  userId: string;
  username: string;
  title: string;
  author: string;
  genre: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  color: string;
  isbn?: string;
  description: string;
  listingType: 'trade' | 'giveaway' | 'rent';
  price?: number; // for rent
  images: string[];
  createdAt: string;
}

export interface ClothingListing {
  id: string;
  type: 'clothing';
  userId: string;
  username: string;
  title: string;
  brand: string;
  size: string;
  category: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  color: string;
  material?: string;
  description: string;
  listingType: 'trade' | 'giveaway' | 'rent';
  price?: number; // for rent
  images: string[];
  createdAt: string;
}

export type Listing = BookListing | ClothingListing;

export interface TradeProposal {
  id: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  toUsername: string;
  targetListingId: string;
  offeredListingId: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  listingId: string;
  content: string;
  createdAt: string;
  read: boolean;
}