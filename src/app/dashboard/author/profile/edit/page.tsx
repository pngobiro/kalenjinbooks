'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, User, Loader2, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { getMyAuthorProfile, Author } from '@/lib/api/authors';
import { useAuth } from '@/lib/auth-context';
import { AuthorProfileHeader } from '@/components/author/AuthorProfileHeader';

interface FormData {
  // Basic Information
  bio: string;
  phoneNumber: string;
  
  // Personal Information
  dateOfBirth: string;
  nationality: string;
  location: string;
  
  // Professional Information
  education: string;
  occupation: string;
  writingExperience: string;
  previousPublications: string;
  awards: string;
  
  // Writing Information
  genres: string[];
  languages: string[];
  writingStyle: string;
  inspirations: string;
  targetAudience: string;
  publishingGoals: string;
  
  // Social Media & Online Presence
  website: string;
  twitter: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  
  // Additional Information
  additionalInfo: string;
  agreeToMarketing: boolean;
}

const availableGenres = [
  'Fiction', 'Non-Fiction', 'Folklore', 'History', 'Poetry', 'Children', 
  'Education', 'Biography', 'Romance', 'Mystery', 'Thriller', 'Fantasy',
  'Science Fiction', 'Drama', 'Comedy', 'Adventure', 'Self-Help'
];

const availableLanguages = [
  'English', 'Swahili', 'Kalenjin', 'Kikuyu', 'Luo', 'Luhya', 'Kamba',
  'Kisii', 'Meru', 'Embu', 'Taita', 'Turkana', 'Maasai'
];

export default function EditProfilePage() {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    bio: '',
    phoneNumber: '',
    dateOfBirth: '',
    nationality: '',
    location: '',
    education: '',
    occupation: '',
    writingExperience: '',
    previousPublications: '',
    awards: '',
    genres: [],
    languages: [],
    writingStyle: '',
    inspirations: '',
    targetAudience: '',
    publishingGoals: '',
    website: '',
    twitter: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    additionalInfo: '',
    agreeToMarketing: false,
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await getMyAuthorProfile();
        if (response.success && response.data) {
          const authorData = response.data as any;
          setAuthor(authorData);
          
          // Parse JSON fields safely
          let genres = [];
          let languages = [];
          try {
            genres = authorData.genres ? JSON.parse(authorData.genres) : [];
            languages = authorData.languages ? JSON.parse(authorData.languages) : [];
          } catch (e) {
            console.error('Error parsing JSON fields:', e);
          }

          setFormData({
            bio: authorData.bio || '',
            phoneNumber: authorData.phoneNumber || '',
            dateOfBirth: authorData.dateOfBirth || '',
            nationality: authorData.nationality || '',
            location: authorData.location || '',
            education: authorData.education || '',
            occupation: authorData.occupation || '',
            writingExperience: authorData.writingExperience || '',
            previousPublications: authorData.previousPublications || '',
            awards: authorData.awards || '',
            genres,
            languages,
            writingStyle: authorData.writingStyle || '',
            inspirations: authorData.inspirations || '',
            targetAudience: authorData.targetAudience || '',
            publishingGoals: authorData.publishingGoals || '',
            website: authorData.website || '',
            twitter: authorData.twitter || '',
            facebook: authorData.facebook || '',
            instagram: authorData.instagram || '',
            linkedin: authorData.linkedin || '',
            additionalInfo: authorData.additionalInfo || '',
            agreeToMarketing: authorData.agreeToMarketing || false,
          });
        } else {
          setError(response.error || 'Failed to load profile');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Profile image must be smaller than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = () => setProfileImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const token = localStorage.getItem('kaleereads_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      // Prepare form data for multipart upload if there's a profile image
      let requestBody;
      let headers: any = {
        'Authorization': `Bearer ${token}`,
      };

      const dataToSend = {
        ...formData,
        genres: JSON.stringify(formData.genres),
        languages: JSON.stringify(formData.languages),
      };

      if (profileImage) {
        // Use FormData for file upload
        const formDataToSend = new FormData();
        Object.entries(dataToSend).forEach(([key, value]) => {
          formDataToSend.append(key, value.toString());
        });
        formDataToSend.append('profileImage', profileImage);
        requestBody = formDataToSend;
      } else {
        // Use JSON for text-only updates
        headers['Content-Type'] = 'application/json';
        requestBody = JSON.stringify(dataToSend);
      }

      const response = await fetch('https://kalenjin-books-worker.pngobiro.workers.dev/api/authors/me', {
        method: 'PUT',
        headers,
        body: requestBody,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      alert('Profile updated successfully!');
      router.push('/dashboard/author/profile');

    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (error && !author) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-2">Error Loading Profile</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-sm font-semibold hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/author/profile" className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors">
            <div className="w-10 h-10 rounded-lg bg-white border border-neutral-brown-200 flex items-center justify-center shadow-sm">
              <ArrowLeft size={20} />
            </div>
          </Link>
          <div className="flex-1">
            <AuthorProfileHeader 
              variant="compact" 
              showEmail={false} 
              showStatus={true}
              className="mb-2"
            />
            <h1 className="text-3xl font-bold text-neutral-brown-900">Edit Profile</h1>
            <p className="text-neutral-brown-700 mt-1">Update your author profile information</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Image */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">Profile Image</h3>
            
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent-green/20 flex items-center justify-center mb-4">
                {profileImagePreview || author?.profileImage ? (
                  <img 
                    src={profileImagePreview || author?.profileImage || ''} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-neutral-brown-400" />
                )}
              </div>

              <div>
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="profile-upload"
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-neutral-brown-200 rounded-lg hover:bg-neutral-brown-50 cursor-pointer transition-colors"
                >
                  <Upload size={18} />
                  Upload New Image
                </label>
              </div>

              {profileImage && (
                <div className="flex items-center justify-between p-3 bg-accent-green/10 rounded-lg mt-3 w-full">
                  <span className="text-sm text-accent-green font-medium">{profileImage.name}</span>
                  <button
                    onClick={() => {
                      setProfileImage(null);
                      setProfileImagePreview(null);
                    }}
                    className="text-neutral-brown-400 hover:text-neutral-brown-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Biography</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  placeholder="Tell readers about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Your phone number"
                />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Nationality</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Your nationality"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Occupation</label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Your profession"
                />
              </div>
            </div>
          </div>

          {/* Professional Background */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">Professional Background</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Education</label>
                <textarea
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  placeholder="Your educational background..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Writing Experience</label>
                <textarea
                  value={formData.writingExperience}
                  onChange={(e) => handleInputChange('writingExperience', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  placeholder="Describe your writing experience..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Previous Publications</label>
                <textarea
                  value={formData.previousPublications}
                  onChange={(e) => handleInputChange('previousPublications', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  placeholder="List your previous publications..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Awards & Recognition</label>
                <textarea
                  value={formData.awards}
                  onChange={(e) => handleInputChange('awards', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  placeholder="Any awards or recognition you've received..."
                />
              </div>
            </div>
          </div>

          {/* Writing Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">Writing Information</h3>
            
            <div className="space-y-6">
              {/* Genres */}
              <div>
                <label className="block text-sm font-medium text-neutral-brown-700 mb-2">Genres</label>
                <div className="flex flex-wrap gap-2">
                  {availableGenres.map(genre => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        formData.genres.includes(genre)
                          ? 'bg-primary text-white'
                          : 'bg-neutral-brown-100 text-neutral-brown-700 hover:bg-neutral-brown-200'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-neutral-brown-700 mb-2">Languages</label>
                <div className="flex flex-wrap gap-2">
                  {availableLanguages.map(language => (
                    <button
                      key={language}
                      type="button"
                      onClick={() => handleLanguageToggle(language)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        formData.languages.includes(language)
                          ? 'bg-accent-green text-white'
                          : 'bg-neutral-brown-100 text-neutral-brown-700 hover:bg-neutral-brown-200'
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Writing Style</label>
                  <textarea
                    value={formData.writingStyle}
                    onChange={(e) => handleInputChange('writingStyle', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    placeholder="Describe your writing style..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Inspirations</label>
                  <textarea
                    value={formData.inspirations}
                    onChange={(e) => handleInputChange('inspirations', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    placeholder="What inspires your writing..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Target Audience</label>
                  <textarea
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    placeholder="Who do you write for..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Publishing Goals</label>
                  <textarea
                    value={formData.publishingGoals}
                    onChange={(e) => handleInputChange('publishingGoals', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    placeholder="Your publishing goals..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Media & Online Presence */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">Social Media & Online Presence</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Twitter Username</label>
                <input
                  type="text"
                  value={formData.twitter}
                  onChange={(e) => handleInputChange('twitter', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="username (without @)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Facebook</label>
                <input
                  type="text"
                  value={formData.facebook}
                  onChange={(e) => handleInputChange('facebook', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Facebook profile/page name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Instagram Username</label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="username (without @)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-brown-700 mb-1">LinkedIn</label>
                <input
                  type="text"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="LinkedIn profile username"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-neutral-brown-900 mb-4">Additional Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Additional Information</label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  placeholder="Any additional information you'd like to share..."
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeToMarketing}
                  onChange={(e) => handleInputChange('agreeToMarketing', e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-neutral-brown-300 text-primary focus:ring-primary"
                />
                <div>
                  <p className="font-medium text-neutral-brown-900">Marketing Communications</p>
                  <p className="text-sm text-neutral-brown-600">I agree to receive marketing communications and updates about KaleeReads</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}