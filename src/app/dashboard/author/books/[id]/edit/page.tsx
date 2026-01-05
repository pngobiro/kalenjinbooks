'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Book, Save, Eye, Upload, X, AlertTriangle,
  DollarSign, Tag, Globe, FileText, Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface BookData {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  price: number;
  rentalPrice: number | null;
  category: string;
  language: string;
  previewPages: number;
  isPublished: boolean;
  isFeatured: boolean;
  tags: string[];
  isbn: string | null;
}

const categories = [
  'Fiction', 'Non-Fiction', 'Folklore', 'History', 
  'Poetry', 'Children', 'Education', 'Biography'
];

const languages = ['English', 'Swahili', 'Kalenjin'];

export default function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [bookId, setBookId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
  const [formData, setFormData] = useState<BookData>({
    id: '',
    title: '',
    description: '',
    coverImage: null,
    price: 0,
    rentalPrice: null,
    category: 'Fiction',
    language: 'English',
    previewPages: 5,
    isPublished: false,
    isFeatured: false,
    tags: [],
    isbn: null,
  });

  // File upload
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      setBookId(resolvedParams.id);
      await fetchBookData(resolvedParams.id);
    }
    
    getParams();
  }, [params]);

  const fetchBookData = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('kaleereads_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(`https://kalenjin-books-worker.pngobiro.workers.dev/api/books/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch book data');
      }

      const data: any = await response.json();
      const book = data.data;

      // Parse tags if they exist
      let tags = [];
      try {
        tags = book.tags ? JSON.parse(book.tags) : [];
      } catch (e) {
        tags = [];
      }

      setFormData({
        id: book.id,
        title: book.title,
        description: book.description || '',
        coverImage: book.coverImage,
        price: book.price,
        rentalPrice: book.rentalPrice,
        category: book.category || 'Fiction',
        language: book.language || 'English',
        previewPages: book.previewPages || 5,
        isPublished: book.isPublished,
        isFeatured: book.isFeatured,
        tags,
        isbn: book.isbn,
      });

    } catch (err) {
      console.error('Error fetching book:', err);
      setError(err instanceof Error ? err.message : 'Failed to load book');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof BookData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Cover image must be smaller than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const token = localStorage.getItem('kaleereads_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      // Prepare form data for multipart upload if there's a new cover
      let requestBody;
      let headers: any = {
        'Authorization': `Bearer ${token}`,
      };

      if (coverFile) {
        // Use FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price.toString());
        if (formData.rentalPrice) {
          formDataToSend.append('rentalPrice', formData.rentalPrice.toString());
        }
        formDataToSend.append('category', formData.category);
        formDataToSend.append('language', formData.language);
        formDataToSend.append('previewPages', formData.previewPages.toString());
        formDataToSend.append('isPublished', formData.isPublished.toString());
        formDataToSend.append('isFeatured', formData.isFeatured.toString());
        formDataToSend.append('tags', JSON.stringify(formData.tags));
        if (formData.isbn) {
          formDataToSend.append('isbn', formData.isbn);
        }
        formDataToSend.append('coverImage', coverFile);

        requestBody = formDataToSend;
      } else {
        // Use JSON for text-only updates
        headers['Content-Type'] = 'application/json';
        requestBody = JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: formData.price,
          rentalPrice: formData.rentalPrice,
          category: formData.category,
          language: formData.language,
          previewPages: formData.previewPages,
          isPublished: formData.isPublished,
          isFeatured: formData.isFeatured,
          tags: formData.tags,
          isbn: formData.isbn,
        });
      }

      const response = await fetch(`https://kalenjin-books-worker.pngobiro.workers.dev/api/books/${bookId}`, {
        method: 'PUT',
        headers,
        body: requestBody,
      });

      if (!response.ok) {
        throw new Error('Failed to update book');
      }

      alert('Book updated successfully!');
      
      // Clear cover file state
      setCoverFile(null);
      setCoverPreview(null);

      // Refresh book data
      await fetchBookData(bookId);

    } catch (err) {
      console.error('Error saving book:', err);
      setError(err instanceof Error ? err.message : 'Failed to save book');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('kaleereads_token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const response = await fetch(`https://kalenjin-books-worker.pngobiro.workers.dev/api/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete book');
      }

      alert('Book deleted successfully');
      router.push('/dashboard/author/books');

    } catch (err) {
      console.error('Error deleting book:', err);
      alert('Failed to delete book');
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
          <p className="text-red-600 font-medium mb-2">Error loading book</p>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button 
            onClick={() => fetchBookData(bookId)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-500/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/dashboard/author" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
                <Book className="text-primary" size={24} />
              </div>
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
            </Link>

            <Link href="/dashboard/author/books" className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors">
              <div className="w-10 h-10 rounded-lg bg-white border border-neutral-brown-200 flex items-center justify-center shadow-sm">
                <ArrowLeft size={20} />
              </div>
              <span className="hidden sm:inline">Back to Books</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading">Edit Book</h1>
            <p className="text-neutral-brown-600 mt-1">Update your book details and settings</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href={`/books/${bookId}`}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-brown-200 rounded-lg hover:bg-neutral-brown-50 transition-colors"
            >
              <Eye size={18} />
              <span className="hidden sm:inline">Preview</span>
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-neutral-brown-900 mb-4 flex items-center gap-2">
                <FileText size={20} /> Basic Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Book Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Enter book title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    placeholder="Describe your book..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Language</label>
                    <select
                      value={formData.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-brown-700 mb-1">ISBN (Optional)</label>
                  <input
                    type="text"
                    value={formData.isbn || ''}
                    onChange={(e) => handleInputChange('isbn', e.target.value || null)}
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Enter ISBN number"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-neutral-brown-900 mb-4 flex items-center gap-2">
                <DollarSign size={20} /> Pricing
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Purchase Price (KES)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', Number(e.target.value))}
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-brown-700 mb-1">24-Hour Rental (KES)</label>
                  <input
                    type="number"
                    value={formData.rentalPrice || ''}
                    onChange={(e) => handleInputChange('rentalPrice', e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Preview Pages</label>
                <input
                  type="number"
                  value={formData.previewPages}
                  onChange={(e) => handleInputChange('previewPages', Number(e.target.value))}
                  className="w-full sm:w-32 px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  min="1"
                  max="20"
                />
                <p className="text-sm text-neutral-brown-500 mt-1">Number of pages readers can preview for free</p>
              </div>
            </div>

            {/* Publishing Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-neutral-brown-900 mb-4 flex items-center gap-2">
                <Globe size={20} /> Publishing Settings
              </h2>
              
              <div className="space-y-4">
                <label className="flex items-start gap-4 p-4 bg-neutral-cream rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-neutral-brown-300 text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="font-medium text-neutral-brown-900">Published</p>
                    <p className="text-sm text-neutral-brown-600">Make this book visible to readers</p>
                  </div>
                </label>

                <label className="flex items-start gap-4 p-4 bg-neutral-cream rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-neutral-brown-300 text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="font-medium text-neutral-brown-900">Featured</p>
                    <p className="text-sm text-neutral-brown-600">Show this book in the featured section</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cover Image */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-neutral-brown-900 mb-4 flex items-center gap-2">
                <ImageIcon size={18} /> Cover Image
              </h2>
              
              <div className="space-y-4">
                {/* Current/Preview Image */}
                <div className="aspect-3/4 rounded-lg overflow-hidden bg-neutral-cream border-2 border-dashed border-neutral-brown-200">
                  {coverPreview || formData.coverImage ? (
                    <img 
                      src={coverPreview || formData.coverImage || ''} 
                      alt="Book cover" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon size={32} className="text-neutral-brown-300 mx-auto mb-2" />
                        <p className="text-sm text-neutral-brown-500">No cover image</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div>
                  <input
                    type="file"
                    id="cover-upload"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="cover-upload"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-neutral-brown-200 rounded-lg hover:bg-neutral-brown-50 cursor-pointer transition-colors"
                  >
                    <Upload size={18} />
                    Upload New Cover
                  </label>
                </div>

                {coverFile && (
                  <div className="flex items-center justify-between p-3 bg-accent-green/10 rounded-lg">
                    <span className="text-sm text-accent-green font-medium">{coverFile.name}</span>
                    <button
                      onClick={() => {
                        setCoverFile(null);
                        setCoverPreview(null);
                      }}
                      className="text-neutral-brown-400 hover:text-neutral-brown-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-500">
              <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                <AlertTriangle size={18} /> Danger Zone
              </h2>
              
              <p className="text-sm text-neutral-brown-600 mb-4">
                Deleting this book will permanently remove all associated data, including sales history.
              </p>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <AlertTriangle size={18} />
                Delete Book
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-brown-900 text-center mb-2">Delete Book?</h3>
            <p className="text-neutral-brown-600 text-center mb-6">
              This action cannot be undone. The book "{formData.title}" and all its data will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 border border-neutral-brown-200 rounded-lg font-medium hover:bg-neutral-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}