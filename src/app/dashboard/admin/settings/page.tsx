'use client';

import { useState, useEffect } from 'react';
import {
  Globe, Save, Check, CreditCard, ToggleLeft,
  Mail, Tag, Share2, Loader2,
} from 'lucide-react';

const WORKER_URL = 'https://kalenjin-books-worker.pngobiro.workers.dev';

interface PlatformSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  currency: string;
  defaultPaymentMethods: string[];
  freeReadingEnabled: boolean;
  donationsEnabled: boolean;
  hardCopyRequestsEnabled: boolean;
  newRegistrationsEnabled: boolean;
  footerFacebook: string;
  footerTwitter: string;
  footerInstagram: string;
}

const DEFAULTS: PlatformSettings = {
  siteName: 'KaleeReads',
  tagline: 'Preserving Kalenjin heritage through stories',
  contactEmail: '',
  currency: 'KES',
  defaultPaymentMethods: ['mpesa', 'stripe', 'paypal'],
  freeReadingEnabled: true,
  donationsEnabled: true,
  hardCopyRequestsEnabled: true,
  newRegistrationsEnabled: true,
  footerFacebook: '',
  footerTwitter: '',
  footerInstagram: '',
};

const paymentMethodOptions = [
  { key: 'mpesa', label: 'M-Pesa', hint: 'Mobile money' },
  { key: 'stripe', label: 'Card (Stripe)', hint: 'Visa, Mastercard' },
  { key: 'paypal', label: 'PayPal', hint: 'International' },
  { key: 'bank', label: 'Bank Transfer', hint: 'Direct deposit' },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${WORKER_URL}/api/settings`);
        const json: any = await res.json();
        if (json?.data?.settings) {
          setSettings({ ...DEFAULTS, ...json.data.settings });
        }
      } catch (e) {
        console.error('Failed to load settings', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function update<K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function toggleMethod(key: string) {
    setSettings((prev) => ({
      ...prev,
      defaultPaymentMethods: prev.defaultPaymentMethods.includes(key)
        ? prev.defaultPaymentMethods.filter((m) => m !== key)
        : [...prev.defaultPaymentMethods, key],
    }));
    setSaved(false);
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      const token = localStorage.getItem('kaleereads_token');
      const res = await fetch(`${WORKER_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      const json: any = await res.json();
      if (json?.data?.settings) setSettings({ ...DEFAULTS, ...json.data.settings });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  const labelCls = 'block text-sm font-medium text-neutral-brown-900 mb-1.5';
  const inputCls =
    'w-full px-3.5 py-2.5 border border-neutral-brown-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30';

  if (loading) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading">Global Settings</h1>
          <p className="text-neutral-brown-600 mt-1">Platform-wide configuration applied across KaleeReads</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
      )}

      <div className="space-y-6">
        {/* General */}
        <section className="bg-white rounded-xl border border-neutral-brown-200 p-6">
          <h2 className="flex items-center gap-2 font-bold text-lg mb-5" style={{ color: '#2C2416' }}>
            <Globe size={18} style={{ color: '#D97846' }} /> General
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Site Name</label>
                <input type="text" value={settings.siteName} onChange={(e) => update('siteName', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Currency</label>
                <select value={settings.currency} onChange={(e) => update('currency', e.target.value)} className={`${inputCls} bg-white`}>
                  {['KES', 'USD', 'EUR', 'GBP'].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Tagline</label>
              <input type="text" value={settings.tagline} onChange={(e) => update('tagline', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}><Mail size={13} className="inline mr-1" />Contact Email</label>
              <input type="email" value={settings.contactEmail} onChange={(e) => update('contactEmail', e.target.value)} placeholder="hello@kalenjinbooks.com" className={inputCls} />
            </div>
          </div>
        </section>

        {/* Default Payment Methods */}
        <section className="bg-white rounded-xl border border-neutral-brown-200 p-6">
          <h2 className="flex items-center gap-2 font-bold text-lg mb-2" style={{ color: '#2C2416' }}>
            <CreditCard size={18} style={{ color: '#D97846' }} /> Default Payment Methods
          </h2>
          <p className="text-sm text-neutral-brown-500 mb-4">
            Fallback for authors without their own selection. Individual authors can override this in Authors → Edit.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {paymentMethodOptions.map((pm) => {
              const checked = settings.defaultPaymentMethods.includes(pm.key);
              return (
                <button
                  key={pm.key}
                  onClick={() => toggleMethod(pm.key)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    checked ? 'border-primary bg-orange-50/60' : 'border-neutral-brown-200 hover:bg-neutral-brown-50'
                  }`}
                >
                  <span className="block text-sm font-semibold text-neutral-brown-900">{pm.label}</span>
                  <span className="block text-xs text-neutral-brown-500">{pm.hint}</span>
                  {checked && <Check size={14} className="mt-1.5 text-primary" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* Feature Toggles */}
        <section className="bg-white rounded-xl border border-neutral-brown-200 p-6">
          <h2 className="flex items-center gap-2 font-bold text-lg mb-5" style={{ color: '#2C2416' }}>
            <ToggleLeft size={18} style={{ color: '#D97846' }} /> Features
          </h2>
          <div className="space-y-1">
            {([
              ['freeReadingEnabled', 'Free Reading', 'Visitors can read books in the protected online reader'],
              ['donationsEnabled', 'Donations / Support Author', 'Show the Support Author button on book pages'],
              ['hardCopyRequestsEnabled', 'Hard Copy Requests', 'Allow readers to request physical copies'],
              ['newRegistrationsEnabled', 'New Registrations', 'Allow new users to sign up and become authors'],
            ] as const).map(([key, label, desc]) => (
              <label key={key} className="flex items-center justify-between py-3 px-1 rounded-lg hover:bg-neutral-brown-50 cursor-pointer">
                <span className="pr-4">
                  <span className="block text-sm font-semibold text-neutral-brown-900">{label}</span>
                  <span className="block text-xs text-neutral-brown-500">{desc}</span>
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings[key]}
                  onClick={() => update(key, !settings[key] as never)}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${settings[key] ? 'bg-primary' : 'bg-neutral-brown-200'}`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[key] ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
                  />
                </button>
              </label>
            ))}
          </div>
        </section>

        {/* Footer Socials */}
        <section className="bg-white rounded-xl border border-neutral-brown-200 p-6">
          <h2 className="flex items-center gap-2 font-bold text-lg mb-5" style={{ color: '#2C2416' }}>
            <Share2 size={18} style={{ color: '#D97846' }} /> Footer Social Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Facebook</label>
              <input type="url" value={settings.footerFacebook} onChange={(e) => update('footerFacebook', e.target.value)} placeholder="https://facebook.com/..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Twitter</label>
              <input type="url" value={settings.footerTwitter} onChange={(e) => update('footerTwitter', e.target.value)} placeholder="https://twitter.com/..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Instagram</label>
              <input type="url" value={settings.footerInstagram} onChange={(e) => update('footerInstagram', e.target.value)} placeholder="https://instagram.com/..." className={inputCls} />
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end sticky bottom-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50"
            style={{ backgroundColor: saved ? '#7A9B76' : '#D97846' }}
          >
            {saving ? (
              <>
                <Loader2 size={17} className="animate-spin" /> Saving...
              </>
            ) : saved ? (
              <>
                <Check size={17} /> Saved
              </>
            ) : (
              <>
                <Save size={17} /> Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
