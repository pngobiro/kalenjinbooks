export interface Author {
  id: string;
  userId: string;
  bio: string | null;
  profileImage: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  totalEarnings: number | null;
  createdAt: string;
  appliedAt: string;
  updatedAt: string;
  approvedAt?: string | null;
  rejectionReason?: string | null;
  isActive?: boolean;
  
  // Personal Information
  phoneNumber?: string | null;
  dateOfBirth?: string | null;
  nationality?: string | null;
  location?: string | null;
  
  // Professional Information
  education?: string | null;
  occupation?: string | null;
  writingExperience?: string | null;
  previousPublications?: string | null;
  awards?: string | null;
  
  // Writing Information
  genres?: string[] | null;
  languages?: string[] | null;
  writingStyle?: string | null;
  inspirations?: string | null;
  targetAudience?: string | null;
  publishingGoals?: string | null;
  
  // Social Media & Online Presence
  website?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  
  // Payment Information
  paymentMethod?: string | null;
  paymentDetails?: any;
  
  // Additional Information
  howDidYouHear?: string | null;
  additionalInfo?: string | null;
  agreeToMarketing?: boolean;
  
  // Relations
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    image?: string | null;
  };
}

export interface BookData {
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
  isActive?: boolean;
  author: {
    id: string;
    user: {
      name: string | null;
    };
  };
}

export interface PendingBook {
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

export interface Stats {
  totalAuthors: number;
  pendingApplications: number;
  totalBooks: number;
  pendingBooks: number;
  featuredBooks: number;
  totalRevenue: number;
}