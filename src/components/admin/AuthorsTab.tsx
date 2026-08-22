'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Edit, Ban, Power, Users, Shield, X, Save } from 'lucide-react';

interface Author {
  id: string;
  userId: string;
  bio: string | null;
  profileImage: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  totalEarnings: number | null;
  isActive?: boolean;
  location?: string | null;
  nationality?: string | null;
  genres?: string | null;
  languages?: string | null;
  paymentMethods?: string[] | null;
  mpesaPaybill?: string | null;
  mpesaPaybillName?: string | null;
  website?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  phoneNumber?: string | null;
  education?: string | null;
  occupation?: string | null;
  writingStyle?: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    isAdmin?: boolean;
  };
}

interface AuthorsTabProps {
  allAuthors: Author[];
  onToggleAuthorStatus: (authorId: string, currentStatus: boolean) => void;
  onMakeAdmin: (authorId: string, userEmail: string) => void;
  onUpdated?: () => void;
}

const WORKER_URL = 'https://kalenjin-books-worker.pngobiro.workers.dev';

export default function AuthorsTab({ allAuthors, onToggleAuthorStatus, onMakeAdmin, onUpdated }: AuthorsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editing, setEditing] = useState<Author | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-brown-900">All Authors</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-brown-400" size={18} />
            <input
              type="search"
              placeholder="Search authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {allAuthors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-cream border-b border-neutral-brown-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Author</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-brown-900">Earnings</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-brown-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-brown-100">
                {allAuthors
                  .filter((author) =>
                    !searchQuery ||
                    author.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    author.user.email?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((author) => (
                  <tr key={author.id} className="hover:bg-neutral-cream/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                          {author.profileImage ? (
                            <img src={author.profileImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-primary font-bold text-sm">
                              {author.user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-brown-900">
                            {author.user.name || 'Unknown'}
                          </p>
                          <p className="text-sm text-neutral-brown-600">{author.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                          author.status === 'APPROVED'
                            ? 'bg-accent-green/20 text-accent-green'
                            : author.status === 'REJECTED'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {author.status.toLowerCase()}
                        </span>
                        {author.isActive !== undefined && (
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            author.isActive
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {author.isActive ? 'Active' : 'Disabled'}
                          </span>
                        )}
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          author.user.role === 'ADMIN' || author.user.isAdmin
                            ? 'bg-purple-100 text-purple-600'
                            : author.user.role === 'AUTHOR'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {author.user.role === 'ADMIN' || author.user.isAdmin ? 'Admin' : author.user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-accent-green">KES {(author.totalEarnings || 0).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* View public profile */}
                        <Link
                          href={`/authors/${author.id}`}
                          target="_blank"
                          className="p-2 text-neutral-brown-600 hover:bg-neutral-brown-100 rounded"
                          title="View public profile"
                        >
                          <Eye size={16} />
                        </Link>
                        {/* Edit author */}
                        <button
                          onClick={() => setEditing(author)}
                          className="p-2 text-primary hover:bg-primary/10 rounded"
                          title="Edit author"
                        >
                          <Edit size={16} />
                        </button>
                        {author.status === 'APPROVED' && (
                          <button
                            onClick={() => onToggleAuthorStatus(author.id, author.isActive !== false)}
                            className={`p-2 rounded transition-colors ${
                              author.isActive !== false
                                ? 'text-red-600 hover:bg-red-100'
                                : 'text-green-600 hover:bg-green-100'
                            }`}
                            title={author.isActive !== false ? 'Disable Author' : 'Enable Author'}
                          >
                            {author.isActive !== false ? <Ban size={16} /> : <Power size={16} />}
                          </button>
                        )}
                        {author.status === 'APPROVED' && author.isActive !== false && author.user.role !== 'ADMIN' && !author.user.isAdmin && (
                          <button
                            onClick={() => onMakeAdmin(author.id, author.user.email)}
                            className="p-2 text-purple-600 hover:bg-purple-100 rounded transition-colors"
                            title="Make Admin"
                          >
                            <Shield size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-neutral-brown-500">
            <Users size={48} className="mx-auto mb-4 text-neutral-brown-300" />
            <p className="text-lg font-medium mb-2">No authors found</p>
            <p className="text-sm">Authors will appear here once they register.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <EditAuthorModal
          author={editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={async (data) => {
            setSaving(true);
            try {
              const token = localStorage.getItem('kaleereads_token');
              let res: Response;

              if (data.profileImage instanceof File) {
                const fd = new FormData();
                fd.append('authorId', editing.id);
                for (const [k, v] of Object.entries(data)) {
                  if (k === 'profileImage') continue;
                  if (v !== undefined && v !== null) fd.append(k, String(v));
                }
                fd.append('profileImage', data.profileImage as File);
                res = await fetch(`${WORKER_URL}/api/admin/authors/update`, {
                  method: 'POST',
                  headers: { Authorization: `Bearer ${token}` },
                  body: fd,
                });
              } else {
                res = await fetch(`${WORKER_URL}/api/admin/authors/update`, {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ authorId: editing.id, ...data }),
                });
              }
              if (!res.ok) throw new Error('Failed to update author');
              onUpdated?.();
              setEditing(null);
            } catch (e) {
              alert(e instanceof Error ? e.message : 'Failed to update author');
            } finally {
              setSaving(false);
            }
          }}
        />
      )}
    </div>
  );
}

function EditAuthorModal({
  author,
  saving,
  onClose,
  onSave,
}: {
  author: Author;
  saving: boolean;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => void | Promise<void>;
}) {
  const [name, setName] = useState(author.user.name || '');
  const [bio, setBio] = useState(author.bio || '');
  const [location, setLocation] = useState(author.location || '');
  const [nationality, setNationality] = useState(author.nationality || '');
  const [genres, setGenres] = useState(
    Array.isArray(author.genres) ? (author.genres as string[]).join(', ') : (author.genres || '')
  );
  const [languages, setLanguages] = useState(
    Array.isArray(author.languages) ? (author.languages as string[]).join(', ') : (author.languages || '')
  );
  const [phoneNumber, setPhoneNumber] = useState(author.phoneNumber || '');
  const [website, setWebsite] = useState(author.website || '');
  const [twitter, setTwitter] = useState(author.twitter || '');
  const [facebook, setFacebook] = useState(author.facebook || '');
  const [instagram, setInstagram] = useState(author.instagram || '');
  const [linkedin, setLinkedin] = useState(author.linkedin || '');
  const [education, setEducation] = useState(author.education || '');
  const [occupation, setOccupation] = useState(author.occupation || '');
  const [writingStyle, setWritingStyle] = useState(author.writingStyle || '');
  const [status, setStatus] = useState<string>(author.status);
  const [payMethods, setPayMethods] = useState<string[]>(
    author.paymentMethods && author.paymentMethods.length > 0 ? author.paymentMethods : ['mpesa', 'stripe', 'paypal']
  );
  const [mpesaPaybill, setMpesaPaybill] = useState(author.mpesaPaybill || '');
  const [mpesaPaybillName, setMpesaPaybillName] = useState(author.mpesaPaybillName || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(author.profileImage);

  const paymentMethodOptions: { key: string; label: string; hint: string }[] = [
    { key: 'mpesa', label: 'M-Pesa', hint: 'Mobile money' },
    { key: 'stripe', label: 'Card (Stripe)', hint: 'Visa, Mastercard' },
    { key: 'paypal', label: 'PayPal', hint: 'International' },
    { key: 'bank', label: 'Bank Transfer', hint: 'Direct deposit' },
  ];

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function csvToArray(input: string): string {
    return input.split(',').map((g) => g.trim()).filter(Boolean).join(',');
  }

  const labelCls = 'block text-sm font-medium text-neutral-brown-900 mb-1.5';
  const inputCls =
    'w-full px-3.5 py-2.5 border border-neutral-brown-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-neutral-brown-900">Edit Author</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-brown-100 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Image + Name + Status */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="text-center">
              <label className={labelCls}>Profile Image</label>
              <label htmlFor="author-image-upload" className="cursor-pointer group block">
                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-neutral-brown-100 group-hover:border-primary/50 transition-colors relative" style={{ backgroundColor: '#F5F1E8' }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-brown-400 font-bold text-2xl">
                      {(author.user.name || 'U').split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Edit size={22} className="text-white" />
                  </div>
                </div>
                <p className="text-xs text-neutral-brown-500 mt-1.5">Click to upload (JPG/PNG/WebP, max 5MB)</p>
              </label>
              <input
                id="author-image-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className={labelCls}>Display Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input
                  type="email"
                  value={author.user.email}
                  disabled
                  className={`${inputCls} bg-neutral-brown-50 text-neutral-brown-400`}
                />
              </div>
              <div>
                <label className={labelCls}>Account Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputCls} bg-white`}>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className={labelCls}>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Short author biography..."
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Eldoret, Kenya" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Nationality</label>
              <input type="text" value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="Kenyan" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Phone Number</label>
              <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+254..." className={inputCls} />
            </div>
          </div>

          {/* Writing info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Genres (comma separated)</label>
              <input type="text" value={genres} onChange={(e) => setGenres(e.target.value)} placeholder="Fiction, History" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Languages (comma separated)</label>
              <input type="text" value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="Kalenjin, English, Swahili" className={inputCls} />
            </div>
          </div>

          {/* Professional */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Education</label>
              <input type="text" value={education} onChange={(e) => setEducation(e.target.value)} placeholder="PhD in African History" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Occupation</label>
              <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="Author, Historian" className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Writing Style</label>
            <input
              type="text"
              value={writingStyle}
              onChange={(e) => setWritingStyle(e.target.value)}
              placeholder="e.g. Narrative non-fiction rooted in oral tradition"
              className={inputCls}
            />
          </div>

          {/* Social links */}
          <div>
            <label className={labelCls}>Social Links</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website URL" className={inputCls} />
              <input type="text" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="Twitter username" className={inputCls} />
              <input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="Facebook page or username" className={inputCls} />
              <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="Instagram username" className={inputCls} />
              <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="LinkedIn username" className={inputCls} />
            </div>
          </div>

          {/* Payment methods */}
          <div>
            <label className={labelCls}>Payment Methods (checkout options for this author's books)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {paymentMethodOptions.map((pm) => {
                const checked = payMethods.includes(pm.key);
                return (
                  <label
                    key={pm.key}
                    className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      checked ? 'border-primary bg-orange-50/60' : 'border-neutral-brown-200 hover:bg-neutral-brown-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) =>
                        setPayMethods((prev) =>
                          e.target.checked ? [...prev, pm.key] : prev.filter((m) => m !== pm.key)
                        )
                      }
                      className="mt-0.5 accent-[#D97846]"
                    />
                    <span>
                      <span className="block text-sm font-medium text-neutral-brown-900">{pm.label}</span>
                      <span className="block text-xs text-neutral-brown-500">{pm.hint}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            {payMethods.length === 0 && (
              <p className="text-xs text-red-500 mt-1.5">At least one payment method is recommended — otherwise checkout falls back to defaults.</p>
            )}
          </div>

          {/* M-Pesa Receiving Details */}
          <div>
            <label className={labelCls}>M-Pesa Receiving Details (where funds are funneled)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  value={mpesaPaybill}
                  onChange={(e) => setMpesaPaybill(e.target.value.replace(/[^\d]/g, ''))}
                  placeholder="Paybill number, e.g. 4123890"
                  maxLength={12}
                  className={inputCls}
                />
                <p className="text-xs text-neutral-brown-500 mt-1">Shown to buyers at checkout when M-Pesa is selected.</p>
              </div>
              <input
                type="text"
                value={mpesaPaybillName}
                onChange={(e) => setMpesaPaybillName(e.target.value)}
                placeholder="Account name, e.g. KIBET KITUR PUBLICATIONS"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8 sticky bottom-0 bg-white pt-4 border-t border-neutral-brown-100">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-neutral-brown-200 rounded-lg font-semibold text-sm text-neutral-brown-700 hover:bg-neutral-brown-50"
          >
            Cancel
          </button>
          <button
            disabled={saving}
            onClick={() =>
              onSave({
                name,
                bio,
                location,
                nationality,
                phoneNumber,
                genres: csvToArray(genres),
                languages: csvToArray(languages),
                website,
                twitter,
                facebook,
                instagram,
                linkedin,
                education,
                occupation,
                writingStyle,
                status,
                paymentMethods: payMethods,
                mpesaPaybill,
                mpesaPaybillName,
                profileImage: imageFile ?? undefined,
              })
            }
            className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm text-white bg-primary hover:bg-primary-dark transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
