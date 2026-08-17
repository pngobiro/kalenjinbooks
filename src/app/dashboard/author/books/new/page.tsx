'use client';

import { useState, useEffect } from 'react';
import { Book, Upload, ArrowLeft, FileText, DollarSign, Globe, Tag, Image, Save } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { AuthorProfileHeader } from '@/components/author/AuthorProfileHeader';

interface BookFormData {
  title: string;
  description: string;
  category: string;
  language: string;
  price: number;
  rentalPrice: number;
  isbn: string;
  tags: string[];
  coverImage: File | null;
  bookFile: File | null;
}

const categories = [
  'Fiction', 'Non-Fiction', 'Poetry', 'Drama', 'Folklore', 'History', 
  'Biography', 'Children\'s Books', 'Educational', 'Religious', 'Romance', 'Mystery'
];

const languages = [
  'English', 'Swahili', 'Kalenjin', 'Kikuyu', 'Luo', 'Luhya', 'Kamba', 'Kisii', 'Meru'
];

export default function NewBookPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    description: '',
    category: '',
    language: 'English',
    price: 0,
    rentalPrice: 0,
    isbn: '',
    tags: [],
    coverImage: null,
    bookFile: null,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'rentalPrice' ? parseFloat(value) || 0 : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'coverImage' | 'bookFile') => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields with specific messages
      const missingFields = [];
      if (!formData.title) missingFields.push('Book Title');
      if (!formData.description) missingFields.push('Description');
      if (!formData.category) missingFields.push('Category');
      if (!formData.bookFile) missingFields.push('Book File');
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      }

      const token = localStorage.getItem('kaleereads_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Create FormData for file upload
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('category', formData.category);
      uploadData.append('language', formData.language);
      uploadData.append('price', formData.price.toString());
      uploadData.append('rentalPrice', formData.rentalPrice.toString());
      uploadData.append('isbn', formData.isbn);
      uploadData.append('tags', JSON.stringify(formData.tags));
      
      if (formData.coverImage) {
        uploadData.append('coverImage', formData.coverImage);
      }
      if (formData.bookFile) {
        uploadData.append('bookFile', formData.bookFile);
      }

      const response = await fetch('https://kalenjin-books-worker.pngobiro.workers.dev/api/books/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadData,
      });

      if (!response.ok) {
        const errorData: any = await response.json();
        throw new Error(errorData.error || 'Failed to upload book');
      }

      const result = await response.json();
      
      // Redirect to books list with success message
      router.push('/dashboard/author/books');

    } catch (err) {
      console.error('Book upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload book');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFCF5' }}>
        <div className="relative">
          <div className="w-16 h-16 border-4 rounded-full" style={{ borderColor: '#F5E6D3' }}></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#D97846' }}></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFCF5' }}>
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b" style={{ borderColor: '#E5D5C3' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard/author" className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors">
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <Book style={{ color: '#D97846' }} size={24} />
              <span className="text-xl font-bold hidden sm:inline" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>Upload New Book</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-xl p-8 shadow-lg" style={{ backgroundColor: '#FFFCF5', border: '1px solid #E5D5C3' }}>
          <div className="text-center mb-10">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#FEF3E7' }}>
              <Upload size={48} style={{ color: '#D97846' }} />
            </div>
            <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
              Upload Your Book
            </h1>
            <p className="text-lg text-gray-600">Share your story with thousands of readers worldwide</p>
          </div>

          {error && (
            <div className="rounded-xl p-6 mb-8 shadow-md" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5' }}>
              <p className="text-red-600 font-semibold text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                <FileText size={24} style={{ color: '#D97846' }} />
                Book Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#2C2416' }}>
                    Book Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 focus:outline-none transition-all"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E5D5C3', color: '#2C2416' }}
                    placeholder="Enter your book title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#2C2416' }}>
                    ISBN (Optional)
                  </label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 focus:outline-none transition-all"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E5D5C3', color: '#2C2416' }}
                    placeholder="978-0-123456-78-9"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#2C2416' }}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 focus:outline-none resize-none transition-all"
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#E5D5C3', color: '#2C2416' }}
                  placeholder="Describe your book, its themes, and what readers can expect..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#2C2416' }}>
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 focus:outline-none transition-all"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E5D5C3', color: '#2C2416' }}
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#2C2416' }}>
                    Language *
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 focus:outline-none transition-all"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E5D5C3', color: '#2C2416' }}
                  >
                    {languages.map((language) => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#2C2416' }}>
                    Tags
                  </label>
                  <input
                    type="text"
                    onChange={handleTagsChange}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 focus:outline-none transition-all"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E5D5C3', color: '#2C2416' }}
                    placeholder="culture, tradition, story"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                <DollarSign size={24} style={{ color: '#D97846' }} />
                Pricing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#2C2416' }}>
                    Purchase Price (KES) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 focus:outline-none transition-all"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E5D5C3', color: '#2C2416' }}
                    placeholder="299.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#2C2416' }}>
                    Rental Price (KES/day)
                  </label>
                  <input
                    type="number"
                    name="rentalPrice"
                    value={formData.rentalPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 focus:outline-none transition-all"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E5D5C3', color: '#2C2416' }}
                    placeholder="29.00"
                  />
                </div>
              </div>
            </div>

            {/* File Uploads */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2C2416' }}>
                <Upload size={24} style={{ color: '#D97846' }} />
                Files
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: '#2C2416' }}>
                    Cover Image
                  </label>
                  <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-orange-400 transition-colors cursor-pointer" style={{ borderColor: formData.coverImage ? '#7A9B76' : '#E5D5C3', backgroundColor: formData.coverImage ? '#E8F5E9' : '#FFFCF5' }}>
                    <Image size={40} className="mx-auto mb-3" style={{ color: formData.coverImage ? '#7A9B76' : '#D97846' }} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'coverImage')}
                      className="hidden"
                      id="coverImage"
                    />
                    <label htmlFor="coverImage" className="cursor-pointer">
                      <span className="font-bold block mb-1" style={{ color: '#D97846' }}>
                        {formData.coverImage ? 'Change cover image' : 'Choose cover image'}
                      </span>
                      <p className="text-sm text-gray-600">PNG, JPG up to 5MB</p>
                    </label>
                    {formData.coverImage && (
                      <p className="text-sm font-semibold mt-3" style={{ color: '#7A9B76' }}>✓ {formData.coverImage.name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-3" style={{ color: '#2C2416' }}>
                    Book File * {!formData.bookFile && <span className="text-red-500 text-xs">(Required)</span>}
                  </label>
                  <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-orange-400 transition-colors cursor-pointer" style={{ borderColor: formData.bookFile ? '#7A9B76' : '#E5D5C3', backgroundColor: formData.bookFile ? '#E8F5E9' : '#FFFCF5' }}>
                    <Book size={40} className="mx-auto mb-3" style={{ color: formData.bookFile ? '#7A9B76' : '#D97846' }} />
                    <input
                      type="file"
                      accept=".pdf,.epub,.mobi"
                      onChange={(e) => handleFileChange(e, 'bookFile')}
                      className="hidden"
                      id="bookFile"
                    />
                    <label htmlFor="bookFile" className="cursor-pointer">
                      <span className="font-bold block mb-1" style={{ color: '#D97846' }}>
                        {formData.bookFile ? 'Change book file' : 'Choose book file'}
                      </span>
                      <p className="text-sm text-gray-600">PDF, EPUB, MOBI up to 50MB</p>
                    </label>
                    {formData.bookFile && (
                      <p className="text-sm font-semibold mt-3" style={{ color: '#7A9B76' }}>✓ {formData.bookFile.name}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link
                href="/dashboard/author"
                className="flex-1 text-center px-6 py-4 rounded-xl font-bold transition-all hover:shadow-md"
                style={{ backgroundColor: '#F5E6D3', color: '#2C2416' }}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-4 rounded-xl font-bold transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: '#D97846', color: '#FFFFFF' }}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={20} />
                    Upload Book
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}