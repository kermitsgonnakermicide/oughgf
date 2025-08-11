/*
  # Create users and listings tables

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `username` (text, unique)
      - `avatar` (text, optional)
      - `created_at` (timestamp)
    - `listings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `type` (text, 'book' or 'clothing')
      - `title` (text)
      - `author` (text, for books)
      - `brand` (text, for clothing)
      - `genre` (text, for books)
      - `size` (text, for clothing)
      - `category` (text, for clothing)
      - `condition` (text)
      - `color` (text)
      - `material` (text, for clothing)
      - `isbn` (text, for books)
      - `description` (text)
      - `listing_type` (text, 'trade', 'giveaway', or 'rent')
      - `price` (numeric, optional for rent)
      - `images` (text array)
      - `created_at` (timestamp)
    - `trade_proposals`
      - `id` (uuid, primary key)
      - `from_user_id` (uuid, references profiles)
      - `to_user_id` (uuid, references profiles)
      - `target_listing_id` (uuid, references listings)
      - `offered_listing_id` (uuid, references listings)
      - `message` (text)
      - `status` (text, 'pending', 'accepted', 'declined')
      - `created_at` (timestamp)
    - `messages`
      - `id` (uuid, primary key)
      - `from_user_id` (uuid, references profiles)
      - `to_user_id` (uuid, references profiles)
      - `listing_id` (uuid, references listings)
      - `content` (text)
      - `read` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE NOT NULL,
  avatar text,
  created_at timestamptz DEFAULT now()
);

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('book', 'clothing')),
  title text NOT NULL,
  author text,
  brand text,
  genre text,
  size text,
  category text,
  condition text NOT NULL CHECK (condition IN ('new', 'like-new', 'good', 'fair', 'poor')),
  color text NOT NULL,
  material text,
  isbn text,
  description text NOT NULL,
  listing_type text NOT NULL CHECK (listing_type IN ('trade', 'giveaway', 'rent')),
  price numeric,
  images text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create trade_proposals table
CREATE TABLE IF NOT EXISTS trade_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  to_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  target_listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  offered_listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  to_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Listings policies
CREATE POLICY "Anyone can view listings"
  ON listings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own listings"
  ON listings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listings"
  ON listings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own listings"
  ON listings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trade proposals policies
CREATE POLICY "Users can view their trade proposals"
  ON trade_proposals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can create trade proposals"
  ON trade_proposals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update trade proposals they received"
  ON trade_proposals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = to_user_id);

-- Messages policies
CREATE POLICY "Users can view their messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update messages they received"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = to_user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS listings_user_id_idx ON listings(user_id);
CREATE INDEX IF NOT EXISTS listings_type_idx ON listings(type);
CREATE INDEX IF NOT EXISTS listings_listing_type_idx ON listings(listing_type);
CREATE INDEX IF NOT EXISTS listings_created_at_idx ON listings(created_at DESC);
CREATE INDEX IF NOT EXISTS trade_proposals_from_user_id_idx ON trade_proposals(from_user_id);
CREATE INDEX IF NOT EXISTS trade_proposals_to_user_id_idx ON trade_proposals(to_user_id);
CREATE INDEX IF NOT EXISTS messages_from_user_id_idx ON messages(from_user_id);
CREATE INDEX IF NOT EXISTS messages_to_user_id_idx ON messages(to_user_id);
CREATE INDEX IF NOT EXISTS messages_listing_id_idx ON messages(listing_id);