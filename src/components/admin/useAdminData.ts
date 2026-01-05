import { useState, useEffect } from 'react';

interface Author {
  id: string;
  userId: string;
  bio: string | null;
  profileImage: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  totalEarnings: number | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
}

interface BookData {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  price: number;
  rentalPrice: number | null;
  category: string | null;
  language: string;
  isPublished: boolean;
  isFeatured: boolean;
  featuredOrder: number | null;
  rating: number;
  reviewCount: number;
  publishedAt: string | null;
  author: {
    id: string;
    user: {
      name: string | null;
    };
  };
}

interface PendingBook {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  category: string | null;
  language: string;
  price: number;
  rentalPrice: number | null;
  tags: string[];
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface Stats {
  totalAuthors: number;
  pendingApplications: number;
  totalBooks: number;
  pendingBooks: number;
  featuredBooks: number;
  totalRevenue: number;
}

export function useAdminData() {
  const [stats, setStats] = useState<Stats>({
    totalAuthors: 0,
    pendingApplications: 0,
    totalBooks: 0,
    pendingBooks: 0,
    featuredBooks: 0,
    totalRevenue: 0,
  });
  const [pendingAuthors, setPendingAuthors] = useState<Author[]>([]);
  const [rejectedAuthors, setRejectedAuthors] = useState<Author[]>([]);
  const [allAuthors, setAllAuthors] = useState<Author[]>([]);
  const [allBooks, setAllBooks] = useState<BookData[]>([]);
  const [pendingBooks, setPendingBooks] = useState<PendingBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get auth token from localStorage
      const token = localStorage.getItem('kaleereads_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Fetch author applications
      const applicationsResponse = await fetch('https://kalenjin-books-worker.pngobiro.workers.dev/api/admin/authors/applications', {
        headers
      });
      
      if (!applicationsResponse.ok) {
        const errorText = await applicationsResponse.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch author applications: ${applicationsResponse.status} ${errorText}`);
      }
      
      const applicationsData = await applicationsResponse.json();
      console.log('Applications API Response:', applicationsData);
      const applications = (applicationsData as any).data?.applications || [];
      console.log('Parsed applications:', applications);
      
      // Separate pending, rejected, and approved authors
      const pending = applications.filter((app: any) => app.status === 'PENDING');
      const rejected = applications.filter((app: any) => app.status === 'REJECTED');
      const approved = applications.filter((app: any) => app.status === 'APPROVED');
      
      setPendingAuthors(pending);
      setRejectedAuthors(rejected);
      setAllAuthors(applications);

      // Fetch books
      const booksResponse = await fetch('https://kalenjin-books-worker.pngobiro.workers.dev/api/books');
      if (!booksResponse.ok) throw new Error('Failed to fetch books');
      const booksData = await booksResponse.json();
      
      const books = (booksData as any).data || [];
      setAllBooks(books);

      // Fetch pending books
      const pendingBooksResponse = await fetch('https://kalenjin-books-worker.pngobiro.workers.dev/api/admin/books/pending', {
        headers
      });
      if (!pendingBooksResponse.ok) throw new Error('Failed to fetch pending books');
      const pendingBooksData = await pendingBooksResponse.json();
      
      const pendingBooksArray = (pendingBooksData as any).data?.books || [];
      setPendingBooks(pendingBooksArray);

      // Calculate stats
      const featuredBooks = books.filter((book: BookData) => book.isFeatured).length;
      
      setStats({
        totalAuthors: approved.length,
        pendingApplications: pending.length,
        totalBooks: books.length,
        pendingBooks: pendingBooksArray.length,
        featuredBooks,
        totalRevenue: 0, // TODO: Calculate from actual sales data
      });

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    stats,
    pendingAuthors,
    rejectedAuthors,
    allAuthors,
    allBooks,
    pendingBooks,
    isLoading,
    error,
    refetch: fetchData,
  };
}