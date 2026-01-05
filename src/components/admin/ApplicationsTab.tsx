'use client';

import { useState } from 'react';
import { Search, CheckCircle, XCircle, UserCheck } from 'lucide-react';

interface Author {
  id: string;
  userId: string;
  bio: string | null;
  profileImage: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  totalEarnings: number | null;
  createdAt: string;
  appliedAt: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  nationality?: string;
  location?: string;
  education?: string;
  occupation?: string;
  writingExperience?: string;
  previousPublications?: string;
  awards?: string;
  genres?: string[];
  languages?: string[];
  writingStyle?: string;
  inspirations?: string;
  targetAudience?: string;
  publishingGoals?: string;
  website?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  paymentMethod?: string;
  howDidYouHear?: string;
  additionalInfo?: string;
  agreeToMarketing?: boolean;
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
}

interface ApplicationsTabProps {
  pendingAuthors: Author[];
  onApproveAuthor: (authorId: string) => void;
  onRejectAuthor: (authorId: string) => void;
}

export default function ApplicationsTab({
  pendingAuthors,
  onApproveAuthor,
  onRejectAuthor,
}: ApplicationsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-brown-900">Author Applications</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-brown-400" size={18} />
            <input
              type="search"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {pendingAuthors.length > 0 ? (
          <div className="divide-y divide-neutral-brown-100">
            {pendingAuthors
              .filter((author: any) => 
                !searchQuery || 
                author.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                author.user.email?.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((author: any) => (
              <div key={author.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {author.profileImage ? (
                        <img src={author.profileImage} alt={author.user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-primary font-bold text-xl">
                          {author.user.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-brown-900">{author.user.name}</h3>
                      <p className="text-neutral-brown-600">{author.user.email}</p>
                      <p className="text-sm text-neutral-brown-500">
                        Applied {new Date(author.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onApproveAuthor(author.id)}
                      className="flex items-center gap-2 bg-accent-green text-white px-4 py-2 rounded-lg hover:bg-accent-green/90 transition-colors"
                    >
                      <CheckCircle size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() => onRejectAuthor(author.id)}
                      className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-neutral-brown-900">Personal Information</h4>
                    <div className="space-y-2 text-sm">
                      {author.phoneNumber && (
                        <p><span className="text-neutral-brown-600">Phone:</span> {author.phoneNumber}</p>
                      )}
                      {author.dateOfBirth && (
                        <p><span className="text-neutral-brown-600">Date of Birth:</span> {new Date(author.dateOfBirth).toLocaleDateString()}</p>
                      )}
                      {author.nationality && (
                        <p><span className="text-neutral-brown-600">Nationality:</span> {author.nationality}</p>
                      )}
                      {author.location && (
                        <p><span className="text-neutral-brown-600">Location:</span> {author.location}</p>
                      )}
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-neutral-brown-900">Professional Background</h4>
                    <div className="space-y-2 text-sm">
                      {author.occupation && (
                        <p><span className="text-neutral-brown-600">Occupation:</span> {author.occupation}</p>
                      )}
                      {author.education && (
                        <p><span className="text-neutral-brown-600">Education:</span> {author.education}</p>
                      )}
                      {author.writingExperience && (
                        <p><span className="text-neutral-brown-600">Writing Experience:</span> {author.writingExperience}</p>
                      )}
                    </div>
                  </div>

                  {/* Writing Information */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-neutral-brown-900">Writing Details</h4>
                    <div className="space-y-2 text-sm">
                      {author.genres && author.genres.length > 0 && (
                        <div>
                          <span className="text-neutral-brown-600">Genres:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {author.genres.map((genre: string) => (
                              <span key={genre} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                                {genre}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {author.languages && author.languages.length > 0 && (
                        <div>
                          <span className="text-neutral-brown-600">Languages:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {author.languages.map((language: string) => (
                              <span key={language} className="bg-accent-green/10 text-accent-green px-2 py-1 rounded text-xs">
                                {language}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {author.paymentMethod && (
                        <p><span className="text-neutral-brown-600">Payment Method:</span> {author.paymentMethod.toUpperCase()}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {author.bio && (
                  <div className="mt-4 p-4 bg-neutral-cream rounded-lg">
                    <h4 className="font-semibold text-neutral-brown-900 mb-2">Author Bio</h4>
                    <p className="text-sm text-neutral-brown-700">{author.bio}</p>
                  </div>
                )}

                {/* Additional Information */}
                {(author.previousPublications || author.awards || author.publishingGoals) && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {author.previousPublications && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-1">Previous Publications</h5>
                        <p className="text-sm text-blue-700">{author.previousPublications}</p>
                      </div>
                    )}
                    {author.awards && (
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <h5 className="font-medium text-yellow-900 mb-1">Awards & Recognition</h5>
                        <p className="text-sm text-yellow-700">{author.awards}</p>
                      </div>
                    )}
                    {author.publishingGoals && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h5 className="font-medium text-green-900 mb-1">Publishing Goals</h5>
                        <p className="text-sm text-green-700">{author.publishingGoals}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-neutral-brown-500">
            <UserCheck size={48} className="mx-auto mb-4 text-neutral-brown-300" />
            <p className="text-lg font-medium mb-2">No pending applications</p>
            <p className="text-sm">All author applications have been processed.</p>
          </div>
        )}
      </div>
    </div>
  );
}