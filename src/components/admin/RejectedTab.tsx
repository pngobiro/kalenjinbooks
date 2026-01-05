'use client';

import { useState } from 'react';
import { Search, XCircle } from 'lucide-react';

interface Author {
  id: string;
  userId: string;
  bio: string | null;
  profileImage: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  appliedAt: string;
  updatedAt: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  nationality?: string;
  location?: string;
  education?: string;
  occupation?: string;
  writingExperience?: string;
  genres?: string[];
  languages?: string[];
  paymentMethod?: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
}

interface RejectedTabProps {
  rejectedAuthors: Author[];
}

export default function RejectedTab({ rejectedAuthors }: RejectedTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-brown-900">Rejected Applications</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-brown-400" size={18} />
            <input
              type="search"
              placeholder="Search rejected applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {rejectedAuthors.length > 0 ? (
          <div className="divide-y divide-neutral-brown-100">
            {rejectedAuthors
              .filter((author: any) => 
                !searchQuery || 
                author.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                author.user.email?.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((author: any) => (
              <div key={author.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center overflow-hidden">
                      {author.profileImage ? (
                        <img src={author.profileImage} alt={author.user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-red-600 font-bold text-xl">
                          {author.user.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-brown-900">{author.user.name}</h3>
                      <p className="text-neutral-brown-600">{author.user.email}</p>
                      <p className="text-sm text-neutral-brown-500">
                        Applied {new Date(author.appliedAt).toLocaleDateString()} • 
                        Rejected {new Date(author.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                      Rejected
                    </span>
                  </div>
                </div>

                {/* Rejection Reason */}
                {author.rejectionReason && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">Rejection Reason</h4>
                    <p className="text-red-700 text-sm">{author.rejectionReason}</p>
                  </div>
                )}

                {/* Author Details - Condensed Version */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 text-sm">
                    <h4 className="font-semibold text-neutral-brown-900">Contact</h4>
                    <p><span className="text-neutral-brown-600">Email:</span> {author.user.email}</p>
                    {author.phoneNumber && (
                      <p><span className="text-neutral-brown-600">Phone:</span> {author.phoneNumber}</p>
                    )}
                    {author.location && (
                      <p><span className="text-neutral-brown-600">Location:</span> {author.location}</p>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <h4 className="font-semibold text-neutral-brown-900">Background</h4>
                    {author.occupation && (
                      <p><span className="text-neutral-brown-600">Occupation:</span> {author.occupation}</p>
                    )}
                    {author.education && (
                      <p><span className="text-neutral-brown-600">Education:</span> {author.education}</p>
                    )}
                    {author.writingExperience && (
                      <p><span className="text-neutral-brown-600">Experience:</span> {author.writingExperience}</p>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <h4 className="font-semibold text-neutral-brown-900">Writing</h4>
                    {author.genres && author.genres.length > 0 && (
                      <div>
                        <span className="text-neutral-brown-600">Genres:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {author.genres.slice(0, 3).map((genre: string) => (
                            <span key={genre} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                              {genre}
                            </span>
                          ))}
                          {author.genres.length > 3 && (
                            <span className="text-xs text-gray-500">+{author.genres.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {author.bio && (
                  <div className="mt-4 p-4 bg-neutral-cream rounded-lg">
                    <h4 className="font-semibold text-neutral-brown-900 mb-2">Author Bio</h4>
                    <p className="text-sm text-neutral-brown-700">{author.bio}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-neutral-brown-500">
            <XCircle size={48} className="mx-auto mb-4 text-neutral-brown-300" />
            <p className="text-lg font-medium mb-2">No rejected applications</p>
            <p className="text-sm">Rejected author applications will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}