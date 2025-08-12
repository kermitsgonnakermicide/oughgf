import React, { useState } from 'react';
import { Book, Shirt, ArrowLeft, Plus } from 'lucide-react';
import { useListings } from '../../hooks/useListings';
import { useAuth } from '../../contexts/AuthContext';

interface CreateListingProps {
  onBack: () => void;
}

const CreateListing: React.FC<CreateListingProps> = ({ onBack }) => {
  const [step, setStep] = useState<'type' | 'form'>('type');
  const [listingType, setListingType] = useState<'book' | 'clothing'>('book');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    brand: '',
    genre: '',
    size: '',
    category: '',
    condition: 'good' as const,
    color: '',
    material: '',
    isbn: '',
    description: '',
    listingType: 'trade' as const,
    price: ''
  });

  const { addListing } = useListings();
  const { user } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    if (listingType === 'book') {
      await addListing({
        type: 'book',
        title: formData.title,
        condition: formData.condition,
        color: formData.color,
        description: formData.description,
        listingType: formData.listingType,
        price: formData.price ? parseFloat(formData.price) : undefined,
        images: [],
        author: formData.author,
        genre: formData.genre,
        isbn: formData.isbn
      });
    } else {
      await addListing({
        type: 'clothing',
        title: formData.title,
        condition: formData.condition,
        color: formData.color,
        description: formData.description,
        listingType: formData.listingType,
        price: formData.price ? parseFloat(formData.price) : undefined,
        images: [],
        brand: formData.brand,
        size: formData.size,
        category: formData.category,
        material: formData.material
      });
    }

    // Reset form and go back
    setFormData({
      title: '',
      author: '',
      brand: '',
      genre: '',
      size: '',
      category: '',
      condition: 'good',
      color: '',
      material: '',
      isbn: '',
      description: '',
      listingType: 'trade',
      price: ''
    });
    setStep('type');
    onBack();
    setIsLoading(false);
  };

  if (step === 'type') {
    return (
      <div className="p-4">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 ml-2">Create Listing</h1>
        </div>

        <div className="space-y-4">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">What would you like to list?</h2>
            <p className="text-pink-600">Choose the type of item you want to share</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => {
                setListingType('book');
                setStep('form');
              }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100 hover:border-pink-300 group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Book className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Books</h3>
                <p className="text-gray-600 text-sm">Share your favorite reads with others</p>
              </div>
            </button>

            <button
              onClick={() => {
                setListingType('clothing');
                setStep('form');
              }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100 hover:border-pink-300 group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shirt className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Clothing</h3>
                <p className="text-gray-600 text-sm">Share your stylish pieces with the community</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={() => setStep('type')}
          className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 ml-2">
          Create {listingType === 'book' ? 'Book' : 'Clothing'} Listing
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                placeholder={listingType === 'book' ? 'Book title' : 'Item name'}
                required
              />
            </div>

            {listingType === 'book' ? (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                    placeholder="Author name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre
                  </label>
                  <select
                    value={formData.genre}
                    onChange={(e) => handleInputChange('genre', e.target.value)}
                    className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  >
                    <option value="">Select genre</option>
                    <option value="fiction">Fiction</option>
                    <option value="non-fiction">Non-Fiction</option>
                    <option value="romance">Romance</option>
                    <option value="mystery">Mystery</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="sci-fi">Sci-Fi</option>
                    <option value="biography">Biography</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ISBN (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => handleInputChange('isbn', e.target.value)}
                    className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                    placeholder="ISBN number"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand *
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                    placeholder="Brand name"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size *
                    </label>
                    <select
                      value={formData.size}
                      onChange={(e) => handleInputChange('size', e.target.value)}
                      className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                      required
                    >
                      <option value="">Size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                    >
                      <option value="">Category</option>
                      <option value="tops">Tops</option>
                      <option value="bottoms">Bottoms</option>
                      <option value="dresses">Dresses</option>
                      <option value="outerwear">Outerwear</option>
                      <option value="shoes">Shoes</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material
                  </label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => handleInputChange('material', e.target.value)}
                    className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                    placeholder="e.g., Cotton, Polyester, Silk"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition *
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  required
                >
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color *
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  placeholder="Primary color"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Listing Details */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Listing Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Listing Type *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['trade', 'giveaway', 'rent'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleInputChange('listingType', type)}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      formData.listingType === type
                        ? 'bg-pink-500 text-white'
                        : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {formData.listingType === 'rent' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per day ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-none"
                placeholder="Tell others about your item..."
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white py-4 rounded-2xl font-medium hover:from-pink-500 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Create Listing
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;