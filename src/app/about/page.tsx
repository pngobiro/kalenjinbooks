'use client';

import { Users, BookOpen, Heart, Globe, Award, Sparkles, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-neutral-cream">
            {/* Navigation */}
            <div className="absolute top-8 left-6 z-20">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-neutral-brown-900 hover:text-primary transition-colors font-medium group bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white shadow-lg border border-neutral-brown-200"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Home</span>
                </Link>
            </div>

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-neutral-cream via-white to-neutral-cream py-24 px-6 overflow-hidden border-b-2 border-neutral-brown-200">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl opacity-10 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-green rounded-full blur-3xl opacity-10 -translate-x-1/2 translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold font-heading mb-6 text-neutral-brown-900">Our Story</h1>
                    <p className="text-xl md:text-2xl text-neutral-brown-700 max-w-3xl mx-auto font-body leading-relaxed">
                        Preserving culture, empowering authors, and connecting the world to the richness of Kalenjin literature.
                    </p>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-block px-4 py-2 bg-primary/10 text-primary font-bold rounded-full mb-4 text-sm uppercase tracking-wider">Our Mission</div>
                            <h2 className="text-4xl font-bold text-neutral-brown-900 font-heading mb-6">Bridging the Gap Between Tradition and Technology</h2>
                            <p className="text-lg text-neutral-brown-700 mb-6 leading-relaxed">
                                AfriReads was born from a simple yet powerful idea: that African stories, particularly those from the Kalenjin community, deserve a global stage. We are building a digital home for our heritage, ensuring that our folktales, history, and modern narratives are preserved for future generations.
                            </p>
                            <p className="text-lg text-neutral-brown-700 leading-relaxed">
                                We believe in the power of storytelling to educate, inspire, and unite. By providing a platform for local authors, we are not just selling books; we are nurturing a cultural renaissance.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/kalenjin-spirit.png"
                                    alt="Kalenjin storytelling tradition"
                                    width={600}
                                    height={600}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-accent-green rounded-full blur-3xl opacity-20"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values */}
            <div className="bg-white py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-neutral-brown-900 font-heading mb-4">Core Values</h2>
                        <p className="text-lg text-neutral-brown-600">The principles that guide everything we do.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Heart className="w-8 h-8 text-primary" />,
                                title: "Cultural Pride",
                                description: "We celebrate and honor the depth, beauty, and wisdom of Kalenjin traditions and language."
                            },
                            {
                                icon: <Users className="w-8 h-8 text-accent-green" />,
                                title: "Community First",
                                description: "We exist to serve our community, supporting authors and readers alike in a shared journey of discovery."
                            },
                            {
                                icon: <Sparkles className="w-8 h-8 text-accent-gold" />,
                                title: "Excellence",
                                description: "We are committed to high-quality publishing standards, ensuring our stories are presented beautifully."
                            }
                        ].map((value, index) => (
                            <div key={index} className="bg-neutral-cream p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 border border-neutral-brown-500/5">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-neutral-brown-900 font-heading mb-3">{value.title}</h3>
                                <p className="text-neutral-brown-700 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="py-20 px-6 bg-neutral-brown-900 text-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: "500+", label: "Books Published" },
                            { number: "10k+", label: "Happy Readers" },
                            { number: "150+", label: "Local Authors" },
                            { number: "50+", label: "Schools Partnered" }
                        ].map((stat, index) => (
                            <div key={index}>
                                <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-heading">{stat.number}</div>
                                <div className="text-neutral-brown-300 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
