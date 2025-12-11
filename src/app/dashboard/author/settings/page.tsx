'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Book, Bell, Lock, CreditCard, Globe, Trash2,
  Mail, Smartphone, Eye, EyeOff, Save, AlertTriangle
} from 'lucide-react';

export default function AuthorSettingsPage() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'security' | 'payments' | 'preferences'>('notifications');
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailSales: true,
    emailPayouts: true,
    emailMarketing: false,
    pushSales: true,
    pushReviews: true,
    weeklyReport: true,
    monthlyReport: true,
  });

  // Security settings
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  });

  // Payment settings
  const [payments, setPayments] = useState({
    mpesaNumber: '0712345678',
    bankName: '',
    bankAccount: '',
    payoutThreshold: '1000',
    autoPayoutEnabled: true,
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    language: 'en',
    currency: 'KES',
    timezone: 'Africa/Nairobi',
    publicProfile: true,
    showEarnings: false,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: Globe },
  ] as const;

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

            <Link href="/dashboard/author" className="flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors">
              <div className="w-10 h-10 rounded-lg bg-white border border-neutral-brown-200 flex items-center justify-center shadow-sm">
                <ArrowLeft size={20} />
              </div>
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-2">Settings</h1>
        <p className="text-neutral-brown-600 mb-8">Manage your account preferences and settings</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-neutral-brown-700 hover:bg-neutral-brown-100'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-neutral-brown-900 mb-4 flex items-center gap-2">
                  <Mail size={20} /> Email Notifications
                </h2>
                <div className="space-y-4">
                  {[
                    { key: 'emailSales', label: 'New sales', desc: 'Get notified when someone purchases your book' },
                    { key: 'emailPayouts', label: 'Payout updates', desc: 'Receive updates about your payouts' },
                    { key: 'emailMarketing', label: 'Marketing emails', desc: 'Tips and promotional opportunities' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-start gap-4 p-4 bg-neutral-cream rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                        className="mt-1 w-5 h-5 rounded border-neutral-brown-300 text-primary focus:ring-primary"
                      />
                      <div>
                        <p className="font-medium text-neutral-brown-900">{item.label}</p>
                        <p className="text-sm text-neutral-brown-600">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-neutral-brown-900 mb-4 flex items-center gap-2">
                  <Smartphone size={20} /> Push Notifications
                </h2>
                <div className="space-y-4">
                  {[
                    { key: 'pushSales', label: 'Sales alerts', desc: 'Instant notifications for new sales' },
                    { key: 'pushReviews', label: 'New reviews', desc: 'Get notified when readers leave reviews' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-start gap-4 p-4 bg-neutral-cream rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                        className="mt-1 w-5 h-5 rounded border-neutral-brown-300 text-primary focus:ring-primary"
                      />
                      <div>
                        <p className="font-medium text-neutral-brown-900">{item.label}</p>
                        <p className="text-sm text-neutral-brown-600">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-neutral-brown-900 mb-4">Reports</h2>
                <div className="space-y-4">
                  {[
                    { key: 'weeklyReport', label: 'Weekly summary', desc: 'Receive a weekly sales and performance report' },
                    { key: 'monthlyReport', label: 'Monthly report', desc: 'Detailed monthly analytics report' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-start gap-4 p-4 bg-neutral-cream rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                        className="mt-1 w-5 h-5 rounded border-neutral-brown-300 text-primary focus:ring-primary"
                      />
                      <div>
                        <p className="font-medium text-neutral-brown-900">{item.label}</p>
                        <p className="text-sm text-neutral-brown-600">{item.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-neutral-brown-900 mb-4">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={security.currentPassword}
                        onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-brown-400"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-1">New Password</label>
                    <input
                      type="password"
                      value={security.newPassword}
                      onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={security.confirmPassword}
                      onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-brown-100 pt-6">
                <h2 className="text-lg font-bold text-neutral-brown-900 mb-4">Two-Factor Authentication</h2>
                <label className="flex items-start gap-4 p-4 bg-neutral-cream rounded-lg cursor-pointer max-w-md">
                  <input
                    type="checkbox"
                    checked={security.twoFactorEnabled}
                    onChange={(e) => setSecurity({ ...security, twoFactorEnabled: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded border-neutral-brown-300 text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="font-medium text-neutral-brown-900">Enable 2FA</p>
                    <p className="text-sm text-neutral-brown-600">Add an extra layer of security to your account</p>
                  </div>
                </label>
              </div>

              <div className="border-t border-neutral-brown-100 pt-6">
                <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                  <AlertTriangle size={20} /> Danger Zone
                </h2>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-3 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={18} />
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-neutral-brown-900 mb-4">M-Pesa Settings</h2>
                <div className="max-w-md">
                  <label className="block text-sm font-medium text-neutral-brown-700 mb-1">M-Pesa Phone Number</label>
                  <input
                    type="tel"
                    value={payments.mpesaNumber}
                    onChange={(e) => setPayments({ ...payments, mpesaNumber: e.target.value })}
                    placeholder="07XXXXXXXX"
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <p className="text-sm text-neutral-brown-500 mt-1">This is where your payouts will be sent</p>
                </div>
              </div>

              <div className="border-t border-neutral-brown-100 pt-6">
                <h2 className="text-lg font-bold text-neutral-brown-900 mb-4">Bank Account (Optional)</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Bank Name</label>
                    <select
                      value={payments.bankName}
                      onChange={(e) => setPayments({ ...payments, bankName: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="">Select bank</option>
                      <option value="kcb">KCB Bank</option>
                      <option value="equity">Equity Bank</option>
                      <option value="coop">Co-operative Bank</option>
                      <option value="absa">ABSA Bank</option>
                      <option value="stanbic">Stanbic Bank</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Account Number</label>
                    <input
                      type="text"
                      value={payments.bankAccount}
                      onChange={(e) => setPayments({ ...payments, bankAccount: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-brown-100 pt-6">
                <h2 className="text-lg font-bold text-neutral-brown-900 mb-4">Payout Preferences</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Minimum Payout Amount (KES)</label>
                    <select
                      value={payments.payoutThreshold}
                      onChange={(e) => setPayments({ ...payments, payoutThreshold: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="500">KES 500</option>
                      <option value="1000">KES 1,000</option>
                      <option value="2500">KES 2,500</option>
                      <option value="5000">KES 5,000</option>
                    </select>
                  </div>
                  <label className="flex items-start gap-4 p-4 bg-neutral-cream rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={payments.autoPayoutEnabled}
                      onChange={(e) => setPayments({ ...payments, autoPayoutEnabled: e.target.checked })}
                      className="mt-1 w-5 h-5 rounded border-neutral-brown-300 text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="font-medium text-neutral-brown-900">Auto-payout</p>
                      <p className="text-sm text-neutral-brown-600">Automatically send payouts when balance reaches threshold</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="en">English</option>
                    <option value="sw">Swahili</option>
                    <option value="kln">Kalenjin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Currency</label>
                  <select
                    value={preferences.currency}
                    onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="KES">KES - Kenyan Shilling</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-brown-700 mb-1">Timezone</label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="Africa/Nairobi">East Africa Time (EAT)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="Europe/London">London (GMT)</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-neutral-brown-100 pt-6">
                <h2 className="text-lg font-bold text-neutral-brown-900 mb-4">Privacy</h2>
                <div className="space-y-4">
                  <label className="flex items-start gap-4 p-4 bg-neutral-cream rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.publicProfile}
                      onChange={(e) => setPreferences({ ...preferences, publicProfile: e.target.checked })}
                      className="mt-1 w-5 h-5 rounded border-neutral-brown-300 text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="font-medium text-neutral-brown-900">Public author profile</p>
                      <p className="text-sm text-neutral-brown-600">Allow readers to view your author profile page</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-4 p-4 bg-neutral-cream rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.showEarnings}
                      onChange={(e) => setPreferences({ ...preferences, showEarnings: e.target.checked })}
                      className="mt-1 w-5 h-5 rounded border-neutral-brown-300 text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="font-medium text-neutral-brown-900">Show earnings publicly</p>
                      <p className="text-sm text-neutral-brown-600">Display your total earnings on your profile</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-neutral-brown-100 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
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
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-brown-900 text-center mb-2">Delete Account?</h3>
            <p className="text-neutral-brown-600 text-center mb-6">
              This action cannot be undone. All your books, earnings data, and account information will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 border border-neutral-brown-200 rounded-lg font-medium hover:bg-neutral-cream transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
