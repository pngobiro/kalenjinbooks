'use client';

import { useState, useEffect } from 'react';
import { Book, User, Phone, FileText, ArrowRight, CheckCircle, Clock, MapPin, Globe, Calendar, Award, PenTool, Mail } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

type RegistrationStep = 'personal' | 'professional' | 'writing' | 'payment' | 'pending';

interface FormData {
  // Personal Information
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  nationality: string;
  location: string;
  bio: string;
  profileImage: string;
  
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
  
  // Payment Information
  paymentMethod: 'mpesa' | 'stripe' | 'bank';
  mpesaNumber: string;
  bankDetails: string;
  
  // Additional Information
  howDidYouHear: string;
  additionalInfo: string;
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

const genres = [
  'Fiction', 'Non-Fiction', 'Poetry', 'Drama', 'Folklore', 'History', 
  'Biography', 'Children\'s Books', 'Educational', 'Religious', 'Romance', 'Mystery'
];

const languages = [
  'English', 'Swahili', 'Kalenjin', 'Kikuyu', 'Luo', 'Luhya', 'Kamba', 'Kisii', 'Meru', 'Other'
];

export default function AuthorRegisterPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<RegistrationStep>('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    nationality: 'Kenyan',
    location: '',
    bio: '',
    profileImage: '',
    education: '',
    occupation: '',
    writingExperience: '',
    previousPublications: '',
    awards: '',
    genres: [],
    languages: ['English'],
    writingStyle: '',
    inspirations: '',
    targetAudience: '',
    publishingGoals: '',
    website: '',
    twitter: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    paymentMethod: 'mpesa',
    mpesaNumber: '',
    bankDetails: '',
    howDidYouHear: '',
    additionalInfo: '',
    agreeToTerms: false,
    agreeToMarketing: false,
  });

  // Initialize form with user data when available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        profileImage: user.image || '',
      }));
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-brown-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  const handleNext = () => {
    if (step === 'personal') {
      const missing: string[] = [];
      if (!formData.fullName.trim()) missing.push('Full Name');
      if (!formData.email.trim()) missing.push('Email Address');
      if (!formData.phoneNumber.trim()) missing.push('Phone Number');
      if (!formData.bio.trim()) missing.push('Author Bio');
      if (missing.length > 0) {
        alert(`Please fill in the following required fields before continuing:\n• ${missing.join('\n• ')}`);
        return;
      }
    }
    const steps: RegistrationStep[] = ['personal', 'professional', 'writing', 'payment', 'pending'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: RegistrationStep[] = ['personal', 'professional', 'writing', 'payment', 'pending'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
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

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms of Service to continue.');
      return;
    }

    // Validate required fields
    const missing: string[] = [];
    if (!formData.fullName.trim()) missing.push('Full Name');
    if (!formData.email.trim()) missing.push('Email Address');
    if (!formData.phoneNumber.trim()) missing.push('Phone Number');
    if (!formData.bio.trim()) missing.push('Author Bio');
    if (missing.length > 0) {
      alert(`Please fill in the following required fields:\n• ${missing.join('\n• ')}\n\nGo back to the Personal step if needed.`);
      setStep('personal');
      return;
    }

    setIsLoading(true);

    try {
      // Use the current authenticated user
      const userForAPI = {
        name: user.name || formData.fullName,
        email: user.email || formData.email,
        image: user.image || formData.profileImage || '',
      };

      const response = await fetch('https://kalenjin-books-worker.pngobiro.workers.dev/api/authors/apply', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          googleUser: userForAPI,
        }),
      });

      const result = await response.json() as { error?: string };

      if (response.ok) {
        router.push('/dashboard/author?registered=true');
      } else {
        alert(result.error || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Application submission failed:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepNumber = () => {
    const steps = ['personal', 'professional', 'writing', 'payment', 'pending'];
    return steps.indexOf(step) + 1;
  };

  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-500/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
                <Book className="text-primary" size={24} />
              </div>
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
            </Link>
            
            {step !== 'pending' && (
              <div className="text-sm text-neutral-brown-600">
                Step {getStepNumber()} of 4
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-12 overflow-x-auto">
          {['Personal', 'Professional', 'Writing', 'Payment', 'Approval'].map((label, index) => {
            const stepNames: RegistrationStep[] = ['personal', 'professional', 'writing', 'payment', 'pending'];
            const currentStepIndex = stepNames.indexOf(step);
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            
            return (
              <div key={label} className="flex items-center">
                <div className={`flex items-center gap-2 ${isActive ? 'text-primary' : isCompleted ? 'text-accent-green' : 'text-neutral-brown-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isActive ? 'bg-primary text-white' : 
                    isCompleted ? 'bg-accent-green text-white' : 
                    'bg-neutral-brown-200 text-neutral-brown-500'
                  }`}>
                    {isCompleted ? <CheckCircle size={16} /> : index + 1}
                  </div>
                  <span className="font-medium text-sm hidden sm:block">{label}</span>
                </div>
                {index < 4 && <div className="w-8 h-0.5 bg-neutral-brown-200 mx-2" />}
              </div>
            );
          })}
        </div>

        {/* Step 1: Personal Information */}
        {step === 'personal' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                {user.image ? (
                  <img src={user.image} alt={user.name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-primary" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-neutral-brown-900 font-heading mb-1">Welcome, {user.name}!</h1>
              <p className="text-neutral-brown-600">Complete your author profile</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                    <User size={16} className="inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                    <Phone size={16} className="inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+254 7XX XXX XXX"
                    required
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                    <Globe size={16} className="inline mr-2" />
                    Nationality
                  </label>
                  <select
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Kenyan">Kenyan</option>
                    <option value="Ugandan">Ugandan</option>
                    <option value="Tanzanian">Tanzanian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                    <MapPin size={16} className="inline mr-2" />
                    Location (City, Country)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Nairobi, Kenya"
                    required
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                  <FileText size={16} className="inline mr-2" />
                  Author Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell readers about yourself, your background, and what inspires your writing..."
                  rows={4}
                  required
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              <div className="bg-neutral-cream rounded-xl p-6">
                <h3 className="font-bold text-neutral-brown-900 mb-4">Why become an author?</h3>
                <ul className="space-y-3 text-sm text-neutral-brown-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-accent-green mt-0.5" />
                    <span>Reach thousands of readers interested in Kalenjin literature</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-accent-green mt-0.5" />
                    <span>Keep 70% of your book sales revenue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-accent-green mt-0.5" />
                    <span>Easy M-Pesa payouts directly to your phone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={18} className="text-accent-green mt-0.5" />
                    <span>Full analytics and sales tracking dashboard</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/dashboard/author"
                  className="flex-1 bg-neutral-brown-100 hover:bg-neutral-brown-200 text-neutral-brown-900 font-semibold px-6 py-4 rounded-xl transition-all text-center"
                >
                  Cancel
                </Link>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Professional Information */}
        {step === 'professional' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={40} className="text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-brown-900 font-heading mb-1">Professional Background</h1>
              <p className="text-neutral-brown-600">Your education and experience</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                  Education Background
                </label>
                <textarea
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  placeholder="Your educational qualifications, degrees, certifications..."
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                  Current Occupation
                </label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="e.g., Teacher, Journalist, Student, etc."
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                  Writing Experience
                </label>
                <textarea
                  value={formData.writingExperience}
                  onChange={(e) => setFormData({ ...formData, writingExperience: e.target.value })}
                  placeholder="How long have you been writing? What type of writing do you do?"
                  rows={3}
                  required
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                  Previous Publications
                </label>
                <textarea
                  value={formData.previousPublications}
                  onChange={(e) => setFormData({ ...formData, previousPublications: e.target.value })}
                  placeholder="List any books, articles, or other works you've published (if any)"
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                  Awards & Recognition
                </label>
                <textarea
                  value={formData.awards}
                  onChange={(e) => setFormData({ ...formData, awards: e.target.value })}
                  placeholder="Any writing awards, competitions, or recognition you've received"
                  rows={2}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-neutral-brown-100 hover:bg-neutral-brown-200 text-neutral-brown-900 font-semibold px-6 py-4 rounded-xl transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Writing Information */}
        {step === 'writing' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool size={40} className="text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-brown-900 font-heading mb-1">Writing Details</h1>
              <p className="text-neutral-brown-600">Tell us about your writing style and goals</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-brown-900 mb-3">
                  Genres You Write (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => handleGenreToggle(genre)}
                      className={`p-3 border-2 rounded-xl text-sm font-medium transition-all ${
                        formData.genres.includes(genre)
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-neutral-brown-200 hover:border-primary/50 text-neutral-brown-700'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-900 mb-3">
                  Languages You Write In (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {languages.map((language) => (
                    <button
                      key={language}
                      type="button"
                      onClick={() => handleLanguageToggle(language)}
                      className={`p-3 border-2 rounded-xl text-sm font-medium transition-all ${
                        formData.languages.includes(language)
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-neutral-brown-200 hover:border-primary/50 text-neutral-brown-700'
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                  Writing Style & Approach
                </label>
                <textarea
                  value={formData.writingStyle}
                  onChange={(e) => setFormData({ ...formData, writingStyle: e.target.value })}
                  placeholder="Describe your writing style, themes you explore, and your approach to storytelling..."
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                  Inspirations & Influences
                </label>
                <textarea
                  value={formData.inspirations}
                  onChange={(e) => setFormData({ ...formData, inspirations: e.target.value })}
                  placeholder="Who or what inspires your writing? Favorite authors, cultural influences, personal experiences..."
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="e.g., Young adults, Children, General audience, etc."
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-brown-900 mb-2">
                  Publishing Goals
                </label>
                <textarea
                  value={formData.publishingGoals}
                  onChange={(e) => setFormData({ ...formData, publishingGoals: e.target.value })}
                  placeholder="What do you hope to achieve through publishing on KaleeReads?"
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              <div className="bg-neutral-cream rounded-xl p-4">
                <h3 className="font-bold text-neutral-brown-900 mb-2">Social Media & Online Presence (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-3 py-2 border border-neutral-brown-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Twitter</label>
                    <input
                      type="text"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      placeholder="@yourusername"
                      className="w-full px-3 py-2 border border-neutral-brown-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Facebook</label>
                    <input
                      type="text"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      placeholder="facebook.com/yourpage"
                      className="w-full px-3 py-2 border border-neutral-brown-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Instagram</label>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      placeholder="@yourusername"
                      className="w-full px-3 py-2 border border-neutral-brown-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-neutral-brown-100 hover:bg-neutral-brown-200 text-neutral-brown-900 font-semibold px-6 py-4 rounded-xl transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Payment Information */}
        {step === 'payment' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">💰</span>
              </div>
              <h1 className="text-2xl font-bold text-neutral-brown-900 font-heading mb-1">Payment Information</h1>
              <p className="text-neutral-brown-600">How you'll receive your earnings</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-brown-900 mb-3">
                  Payout Method (How you'll receive earnings)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'mpesa' })}
                    className={`p-6 border-2 rounded-xl text-center transition-all ${formData.paymentMethod === 'mpesa' ? 'border-primary bg-primary/5' : 'border-neutral-brown-200 hover:border-primary/50'}`}
                  >
                    <div className="h-12 flex items-center justify-center mb-3">
                      <span className="text-3xl">📱</span>
                    </div>
                    <span className="text-lg font-medium block">M-Pesa</span>
                    <span className="block text-sm text-neutral-brown-500 mt-1">Kenya Mobile Money</span>
                    <span className="block text-xs text-accent-green mt-2">Recommended</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'stripe' })}
                    className={`p-6 border-2 rounded-xl text-center transition-all ${formData.paymentMethod === 'stripe' ? 'border-primary bg-primary/5' : 'border-neutral-brown-200 hover:border-primary/50'}`}
                  >
                    <div className="h-12 flex items-center justify-center mb-3">
                      <span className="text-3xl">💳</span>
                    </div>
                    <span className="text-lg font-medium block">Stripe</span>
                    <span className="block text-sm text-neutral-brown-500 mt-1">International Cards</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'bank' })}
                    className={`p-6 border-2 rounded-xl text-center transition-all ${formData.paymentMethod === 'bank' ? 'border-primary bg-primary/5' : 'border-neutral-brown-200 hover:border-primary/50'}`}
                  >
                    <div className="h-12 flex items-center justify-center mb-3">
                      <span className="text-3xl">🏦</span>
                    </div>
                    <span className="text-lg font-medium block">Bank Transfer</span>
                    <span className="block text-sm text-neutral-brown-500 mt-1">Wire Transfer</span>
                  </button>
                </div>
              </div>

              {formData.paymentMethod === 'mpesa' && (
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="font-bold text-green-900 mb-4">M-Pesa Details</h3>
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-2">
                      M-Pesa Number
                    </label>
                    <input
                      type="tel"
                      value={formData.mpesaNumber}
                      onChange={(e) => setFormData({ ...formData, mpesaNumber: e.target.value })}
                      placeholder="07XX XXX XXX"
                      required
                      className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-sm text-green-700 mt-3">
                    ✅ Instant payouts • ✅ No minimum amount • ✅ Low fees
                  </p>
                </div>
              )}

              {formData.paymentMethod === 'stripe' && (
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-bold text-blue-900 mb-4">Stripe Connect</h3>
                  <p className="text-sm text-blue-800 mb-4">
                    After approval, you'll be guided to set up your Stripe account to receive international payments directly to your bank account or debit card.
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>✅ Accept international payments</li>
                    <li>✅ Direct bank deposits</li>
                    <li>⚠️ Setup required after approval</li>
                  </ul>
                </div>
              )}

              {formData.paymentMethod === 'bank' && (
                <div className="bg-neutral-cream rounded-xl p-6">
                  <h3 className="font-bold text-neutral-brown-900 mb-4">Bank Transfer</h3>
                  <p className="text-sm text-neutral-brown-600 mb-4">
                    After approval, you'll provide your bank details for wire transfers.
                  </p>
                  <ul className="text-sm text-neutral-brown-600 space-y-1">
                    <li>✅ Direct to bank account</li>
                    <li>⚠️ Minimum payout: $100 USD</li>
                    <li>⚠️ Higher transfer fees</li>
                  </ul>
                </div>
              )}

              <div className="bg-neutral-cream rounded-xl p-6">
                <h3 className="font-bold text-neutral-brown-900 mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-2">
                      How did you hear about KaleeReads?
                    </label>
                    <select
                      value={formData.howDidYouHear}
                      onChange={(e) => setFormData({ ...formData, howDidYouHear: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select an option</option>
                      <option value="social-media">Social Media</option>
                      <option value="friend">Friend/Word of mouth</option>
                      <option value="search-engine">Search Engine</option>
                      <option value="blog-article">Blog/Article</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-2">
                      Additional Information (Optional)
                    </label>
                    <textarea
                      value={formData.additionalInfo}
                      onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                      placeholder="Anything else you'd like us to know about you or your writing?"
                      rows={3}
                      className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                    className="mt-1 w-5 h-5 text-primary border-neutral-brown-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-neutral-brown-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  </span>
                </label>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.agreeToMarketing}
                    onChange={(e) => setFormData({ ...formData, agreeToMarketing: e.target.checked })}
                    className="mt-1 w-5 h-5 text-primary border-neutral-brown-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-neutral-brown-600">
                    I agree to receive marketing emails and updates about KaleeReads (optional)
                  </span>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-neutral-brown-100 hover:bg-neutral-brown-200 text-neutral-brown-900 font-semibold px-6 py-4 rounded-xl transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmitApplication}
                  disabled={isLoading || !formData.agreeToTerms}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 'pending' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-20 h-20 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-accent-green" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-4">Author Account Created!</h1>
            <p className="text-neutral-brown-600 mb-8 max-w-md mx-auto">
              Your author account has been created successfully. You can now start uploading your books and writing blog posts.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link
                href="/dashboard/author/books/new"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-full transition-all"
              >
                Upload Your First Book
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/dashboard/author"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
