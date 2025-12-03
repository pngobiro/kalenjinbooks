'use client';

import { ArrowLeft, Package, MapPin, Phone, Mail, User, BookOpen, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function RequestHardCopyPage() {
    const searchParams = useSearchParams();
    const bookTitle = searchParams.get('book') || 'Selected Book';
    const bookId = searchParams.get('id') || '';

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        county: '',
        postalCode: '',
        quantity: 1,
        notes: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, this would send to an API
        console.log('Hard copy request:', { ...formData, bookTitle, bookId });
        setSubmitted(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-neutral-cream flex items-center justify-center px-6">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
                    <div className="w-20 h-20 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-accent-green" />
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-brown-900 font-heading mb-4">Request Submitted!</h1>
                    <p className="text-neutral-brown-700 mb-8 leading-relaxed">
                        Thank you for your interest in a hard copy of <span className="font-bold text-primary">{bookTitle}</span>.
                        We'll review your request and contact you within 2-3 business days with availability and pricing details.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link
                            href={bookId ? `/books/${bookId}` : '/books'}
                            className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-full transition-all"
                        >
                            Back to Book
                        </Link>
                        <Link
                            href="/"
                            className="text-neutral-brown-600 hover:text-primary transition-colors"
                        >
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-cream pt-8 pb-16">
            <div className="max-w-4xl mx-auto px-6 lg:px-12">
                {/* Navigation */}
                <div className="mb-8">
                    <Link
                        href={bookId ? `/books/${bookId}` : '/books'}
                        className="inline-flex items-center gap-2 text-neutral-brown-700 hover:text-primary transition-colors font-medium group"
                    >
                        <div className="w-10 h-10 rounded-full bg-white border border-neutral-brown-200 flex items-center justify-center group-hover:border-primary transition-colors shadow-sm">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <span>Back to Book</span>
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={32} className="text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-neutral-brown-900 font-heading mb-4">Request Hard Copy</h1>
                    <p className="text-xl text-neutral-brown-700 max-w-2xl mx-auto">
                        Interested in a physical copy of <span className="font-bold text-primary">{bookTitle}</span>? Fill out the form below and we'll get back to you.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg border border-neutral-brown-500/10 p-8 md:p-10">
                    {/* Personal Information */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-neutral-brown-900 font-heading mb-6 flex items-center gap-2">
                            <User size={24} className="text-primary" />
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="fullName" className="text-sm font-bold text-neutral-brown-700">Full Name *</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-bold text-neutral-brown-700">Email Address *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="phone" className="text-sm font-bold text-neutral-brown-700">Phone Number *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="+254 700 000 000"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="mb-8 border-t border-neutral-brown-100 pt-8">
                        <h2 className="text-2xl font-bold text-neutral-brown-900 font-heading mb-6 flex items-center gap-2">
                            <MapPin size={24} className="text-primary" />
                            Shipping Address
                        </h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="address" className="text-sm font-bold text-neutral-brown-700">Street Address *</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="123 Main Street"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="city" className="text-sm font-bold text-neutral-brown-700">City/Town *</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Eldoret"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="county" className="text-sm font-bold text-neutral-brown-700">County *</label>
                                    <input
                                        type="text"
                                        id="county"
                                        name="county"
                                        value={formData.county}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Uasin Gishu"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="postalCode" className="text-sm font-bold text-neutral-brown-700">Postal Code</label>
                                    <input
                                        type="text"
                                        id="postalCode"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="30100"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="mb-8 border-t border-neutral-brown-100 pt-8">
                        <h2 className="text-2xl font-bold text-neutral-brown-900 font-heading mb-6 flex items-center gap-2">
                            <BookOpen size={24} className="text-primary" />
                            Order Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="quantity" className="text-sm font-bold text-neutral-brown-700">Quantity *</label>
                                <select
                                    id="quantity"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                                >
                                    {[1, 2, 3, 4, 5, 10, 20, 50].map(num => (
                                        <option key={num} value={num}>{num} {num === 1 ? 'copy' : 'copies'}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-neutral-brown-700">Book Title</label>
                                <div className="w-full px-4 py-3 rounded-xl border border-neutral-brown-200 bg-neutral-cream text-neutral-brown-700">
                                    {bookTitle}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 mt-6">
                            <label htmlFor="notes" className="text-sm font-bold text-neutral-brown-700">Additional Notes (Optional)</label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                placeholder="Any special requests or delivery instructions..."
                            ></textarea>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-accent-green/5 border border-accent-green/20 rounded-xl p-6 mb-8">
                        <h3 className="font-bold text-neutral-brown-900 mb-2">What happens next?</h3>
                        <ul className="space-y-2 text-sm text-neutral-brown-700">
                            <li className="flex items-start gap-2">
                                <span className="text-accent-green mt-0.5">✓</span>
                                <span>We'll review your request and check availability</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-green mt-0.5">✓</span>
                                <span>You'll receive a quote including printing and shipping costs</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-green mt-0.5">✓</span>
                                <span>Once confirmed, we'll process your order and ship within 5-7 business days</span>
                            </li>
                        </ul>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                        <Package size={20} />
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
}
