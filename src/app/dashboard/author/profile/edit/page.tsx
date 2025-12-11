'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Book, Save, Upload, X, User, Mail, Phone, 
  MapPin, Globe, FileText, Camera, AlertTriangle
} from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  website: string;
  twitter: string;
  facebook: string;
  languages: string[];
  specialties: string[];
  profileImage: string | null;
}

const availableLanguages = ['English', 'Swahili', 'Kalenjin', 'Kikuyu', 'Luo', 'Luhya'];
const availableSpecialties = [
  'Folklore', 'History', 'Children\'s Literature', 'Poetry', 
  'Fiction', 'Non-Fiction', 'Educational', 'Biography'
];

export default function EditProfilePage() {
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Form data - in production, this would be fetched from API
  const [formData, setFormData] = useState<ProfileData>({
    name: 'Dr. Kibet Kitur',
    email: 'kibet.kitur@email.com',
    phone: '+254712345678',
    location: 'Eldoret, Kenya',
    bio: 'Passionate storyteller preserving Kalenjin culture through literature. Published author with focus on traditional folklore and modern narratives that bridge the gap between ancient wisdom and contemporary understanding.',
    website: 'https://kibetkirur.com',
    twitter: '@kibetkirur',
    facebook: 'kibetkirur',
    languages: ['English', 'Kalenjin'],
    specialties: ['Folklore', 'History', 'Non-Fiction'],
    profileImage: '/images/author-kibet-kitur.png'
  });

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Mock save - in production, send to API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSaving(false);
    // Show success message or redirect
  };

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

            <Link href="/dashboard/author/profile" className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors">
              <div className="w-10 h-10 rounded-lg bg-white border border-neutral-brown-200 flex items-center justify-center shadow-sm">
                <ArrowLeft size={20} />
              </div>
              <span className="hidden sm:inline">Back to Profile</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading">Edit Profile</h1>
            <p className="text-neutral-brown-600 mt-1">Update your author profile and public information</p>
          </div>
          
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Image Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-neutral-brown-900 mb-4 flex items-center gap-2">
                <Camera size={18} /> Profile Photo
              </h2>
              
              <div className="space-y-4">
                {/* Current/Preview Image */}
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-neutral-cream border-4 border-white shadow-lg">
                  {imagePreview || formData.profileImage ? (
                    <img 
                      src={imagePreview || formData.profileImage || ''} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <User size={32} className="text-primary" />
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div>
                  <input
                    type="file"
                    id="profile-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="profile-upload"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-neutral-brown-200 rounded-lg hover:bg-neutral-brown-50 cursor-pointer transition-colors"
                  >
                    <Upload size={18} />
                    Upload New Photo
                  </label>
                </div>

                {profileImage && (
                  <div className="flex items-center justify-between p-3 bg-accent-green/10 rounded-lg">
                    <span className="text-sm text-accent-green font-medium">{profileImage.name}</span>
                    <button
                      onClick={() => {
                        setProfileImage(null);
                        setImagePreview(null);
                      }}
                      className="text-neutral-brown-400 hover:text-neutral-brown-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <p className="text-xs text-neutral-brown-500 text-center">
                  Recommended: Square image, at least 200x200px
                </p>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-neutral-brown-900 mb-4 flex items-center gap-2">
                <User size={20} /> Basic Information
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="+254712345678"
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    placeholder="Tell readers about yourself, your writing journey, and what inspires you..."
                  />
                  <p className="text-xs text-neutral-brown-500 mt-1">
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-neutral-brown-900 mb-4 flex items-center gap-2">
                <Globe size={20} /> Social Links
              </h2>
              
              <div className="space-y-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Twitter Handle</label>
                    <input
                      type="text"
                      value={formData.twitter}
                      onChange={(e) => handleInputChange('twitter', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="@yourusername"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Facebook</label>
                    <input
                      type="text"
                      value={formData.facebook}
                      onChange={(e) => handleInputChange('facebook', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="facebook.com/yourpage"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Writing Preferences */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-neutral-brown-900 mb-4 flex items-center gap-2">
                <FileText size={20} /> Writing Preferences
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-brown-700 mb-3">Languages You Write In</label>
                  <div className="flex flex-wrap gap-2">
                    {availableLanguages.map((language) => (
                      <button
                        key={language}
                        onClick={() => handleLanguageToggle(language)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.languages.includes(language)
                            ? 'bg-primary text-white'
                            : 'bg-neutral-brown-100 text-neutral-brown-700 hover:bg-neutral-brown-200'
                        }`}
                      >
                        {language}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-brown-700 mb-3">Writing Specialties</label>
                  <div className="flex flex-wrap gap-2">
                    {availableSpecialties.map((specialty) => (
                      <button
                        key={specialty}
                        onClick={() => handleSpecialtyToggle(specialty)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.specialties.includes(specialty)
                            ? 'bg-accent-green text-white'
                            : 'bg-neutral-brown-100 text-neutral-brown-700 hover:bg-neutral-brown-200'
                        }`}
                      >
                        {specialty}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}