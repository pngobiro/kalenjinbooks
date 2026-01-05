'use client';

import { useState, useEffect } from 'react';
import { Book, Upload, ArrowLeft, FileText, DollarSign, Globe, Tag, Image, Save } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

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
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || !formData.bookFile) {
        throw new Error('Please fill in all required fields and upload a book file.');
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
      
      // Redirect to author dashboard with success message
      router.push('/dashboard/author?bookUploaded=true');

    } catch (err) {
      console.error('Book upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload book');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-500/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/dashboard/author" className="flex items-center gap-3 text-neutral-brown-600 hover:text-primary">
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <Book className="text-primary" size={24} />
              <span className="text-xl font-bold text-neutral-brown-900 font-heading">Upload New Book</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload size={40} className="text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-2">Upload Your Book</h1>
            <p className="text-neutral-brown-600">Share your story with thousands of readers</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-neutral-brown-900 flex items-center gap-2">
                <FileText size={20} />
                Book Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your book title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                    ISBN (Optional)
                  </label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="978-0-123456-78-9"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Describe your book, its themes, and what readers can expect..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                    Language *
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {languages.map((language) => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    onChange={handleTagsChange}
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="culture, tradition, story (comma separated)"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-neutral-brown-900 flex items-center gap-2">
                <DollarSign size={20} />
                Pricing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
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
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="299.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                    Rental Price (KES/day) - Optional
                  </label>
                  <input
                    type="number"
                    name="rentalPrice"
                    value={formData.rentalPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="29.00"
                  />
                </div>
              </div>
            </div>

            {/* File Uploads */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-neutral-brown-900 flex items-center gap-2">
                <Upload size={20} />
                Files
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                    Cover Image
                  </label>
                  <div className="border-2 border-dashed border-neutral-brown-200 rounded-xl p-6 text-center hover:border-primary transition-colors">
                    <Image size={32} className="mx-auto text-neutral-brown-400 mb-2" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'coverImage')}
                      className="hidden"
                      id="coverImage"
                    />
                    <label htmlFor="coverImage" className="cursor-pointer">
                      <span className="text-primary font-medium">Choose cover image</span>
                      <p className="text-sm text-neutral-brown-500 mt-1">PNG, JPG up to 5MB</p>
                    </label>
                    {formData.coverImage && (
                      <p className="text-sm text-accent-green mt-2">✓ {formData.coverImage.name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                    Book File *
                  </label>
                  <div className="border-2 border-dashed border-neutral-brown-200 rounded-xl p-6 text-center hover:border-primary transition-colors">
                    <Book size={32} className="mx-auto text-neutral-brown-400 mb-2" />
                    <input
                      type="file"
                      accept=".pdf,.epub,.mobi"
                      onChange={(e) => handleFileChange(e, 'bookFile')}
                      className="hidden"
                      id="bookFile"
                      required
                    />
                    <label htmlFor="bookFile" className="cursor-pointer">
                      <span className="text-primary font-medium">Choose book file</span>
                      <p className="text-sm text-neutral-brown-500 mt-1">PDF, EPUB, MOBI up to 50MB</p>
                    </label>
                    {formData.bookFile && (
                      <p className="text-sm text-accent-green mt-2">✓ {formData.bookFile.name}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6">
              <Link
                href="/dashboard/author"
                className="flex-1 bg-neutral-brown-100 hover:bg-neutral-brown-200 text-neutral-brown-900 font-semibold px-6 py-4 rounded-xl transition-all text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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